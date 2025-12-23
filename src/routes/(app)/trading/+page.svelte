<script>
	import { createTradierWebSocketClient } from '$lib/tradier.js';
	
	let loading = $state(false);
	let error = $state(null);
	let warning = $state(null);
	let account = $state(null);
	let balances = $state(null);
	let positions = $state([]);
	let orders = $state([]);
	let spreadOptions = $state(null);
	let rollOptions = $state({}); // Map of position symbols to available roll spreads
	let loadingRollOptions = $state({});
	let currentPrice = $state(0);
	let quantity = $state(1);
	let symbol = $state('SPY');
	let selectedSymbol = $state('SPY');
	let targetDelta = $state(0.35);
	let optionType = $state('call');
	let status = $state('idle'); // idle, finding, buying, rolling
	
	// Streaming state
	let streamingSessionId = $state(null);
	let positionWsClient = $state(null);
	let rollOptionsWsClient = $state(null);
	let spreadOptionsWsClient = $state(null);
	let streamingEnabled = $state(false);
	let positionQuotes = $state({}); // Map of position symbol -> latest quote
	let rollOptionQuotes = $state({}); // Map of roll option symbol -> latest quote
	let spreadOptionQuotes = $state({}); // Map of spread option symbol -> latest quote
	
	// Preview modal state
	let showPreviewModal = $state(false);
	let previewData = $state(null);
	
	// Portfolio greeks state
	let portfolioGreeks = $state({ netDelta: 0, netTheta: 0, loading: false });
	let quotaViolation = $state(null); // Quota violation info { message, resetTime }
	
	// Rate limiting state
	let lastGreeksCallTime = $state(0); // Timestamp of last greeks API call
	let greeksCallInProgress = $state(false); // Flag to prevent concurrent calls
	let greeksCallTimeout = null; // Debounce timeout
	
	// Strike and expiration navigation state
	let strikeOffset = $state(0); // Strike offset in $5 increments (or $1 for some symbols)
	let expirationOffset = $state(0); // Expiration offset (0 = current, -1 = previous, +1 = next)
	let availableExpirations = $state([]); // Available expiration dates
	let currentStrike = $state(null); // Current strike being viewed
	
	// Rate limiting constants
	const MIN_GREEKS_CALL_INTERVAL = 5000; // Minimum 5 seconds between greeks API calls
	const GREEKS_DEBOUNCE_DELAY = 2000; // 2 second debounce delay
	const QUOTA_COOLDOWN = 60000; // 60 second cooldown after quota violation

	const availableSymbols = [
		{ value: 'SPY', label: 'SPY - S&P 500 ETF' },
		{ value: 'XSP', label: 'XSP - Mini S&P 500 Index' },
		{ value: 'QQQ', label: 'QQQ - Nasdaq 100 ETF' },
		{ value: 'DIA', label: 'DIA - Dow Jones ETF' }
	];

	// Initialize on mount and cleanup on destroy using $effect
	$effect(() => {
		// Initialize
		(async () => {
			await loadData();
			await initializeStreaming();
		})();
		
		window.addEventListener('keydown', handleKeydown);
		
		// Cleanup function
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			// Clean up WebSocket connections
			if (positionWsClient) {
				positionWsClient.disconnect();
			}
			if (rollOptionsWsClient) {
				rollOptionsWsClient.disconnect();
			}
			if (spreadOptionsWsClient) {
				spreadOptionsWsClient.disconnect();
			}
		};
	});

	// Recalculate portfolio greeks when positions change (with debouncing)
	$effect(() => {
		if (positions.length > 0) {
			// Clear any existing timeout
			if (greeksCallTimeout) {
				clearTimeout(greeksCallTimeout);
			}
			
			// Debounce the call
			greeksCallTimeout = setTimeout(() => {
				calculatePortfolioGreeks();
			}, GREEKS_DEBOUNCE_DELAY);
		} else {
			portfolioGreeks = { netDelta: 0, netTheta: 0, loading: false };
		}
		
		// Cleanup timeout on unmount
		return () => {
			if (greeksCallTimeout) {
				clearTimeout(greeksCallTimeout);
			}
		};
	});


	async function initializeStreaming() {
		try {
			// Create streaming session
			const response = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'create_streaming_session' })
			});
			const data = await response.json();
			
			if (data.error) {
				console.warn('Failed to create streaming session:', data.error);
				return;
			}
			
			streamingSessionId = data.sessionId;
			streamingEnabled = true;
			
			// Set up streaming for positions
			setupPositionStreaming();
			
			// Set up streaming for roll options (will be called when roll options are found)
			setupRollOptionsStreaming();
		} catch (err) {
			console.warn('Failed to initialize streaming:', err);
		}
	}

	function setupPositionStreaming() {
		if (!streamingSessionId || positions.length === 0) return;
		
		// Get all position symbols
		const positionSymbols = positions
			.map(p => p.symbol)
			.filter(s => s); // Filter out null/undefined
		
		if (positionSymbols.length === 0) return;
		
		// Disconnect existing client if any
		if (positionWsClient) {
			positionWsClient.disconnect();
		}
		
		// Create new WebSocket client for positions
		positionWsClient = createTradierWebSocketClient(streamingSessionId, {
			symbols: positionSymbols,
			filter: ['quote', 'trade'], // Get quotes and trades
			validOnly: true
		}, {
			onData: (data) => {
				// Update position quotes
				if (data.quote) {
					const quote = data.quote;
					const symbol = quote.symbol;
					if (symbol) {
						positionQuotes[symbol] = quote;
						// Update position market value and P&L
						updatePositionFromQuote(symbol, quote);
					}
				}
				if (data.trade) {
					const trade = data.trade;
					const symbol = trade.symbol;
					if (symbol && positionQuotes[symbol]) {
						// Update last price from trade
						positionQuotes[symbol].last = trade.price;
						updatePositionFromQuote(symbol, positionQuotes[symbol]);
					}
				}
			},
			onError: (err) => {
				console.error('Position streaming error:', err);
			},
			onClose: () => {
				console.log('Position streaming closed');
				// Try to reconnect after a delay - renew session if needed
				setTimeout(async () => {
					if (streamingEnabled && positions.length > 0) {
						// Try to renew session if expired
						try {
							const response = await fetch('/api/trading', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ action: 'create_streaming_session' })
							});
							const data = await response.json();
							if (data.sessionId) {
								streamingSessionId = data.sessionId;
								if (positionWsClient) {
									positionWsClient.updateSession(streamingSessionId);
								}
							}
						} catch (err) {
							console.warn('Failed to renew streaming session:', err);
						}
						setupPositionStreaming();
					}
				}, 5000);
			},
			onOpen: () => {
				console.log('Position streaming connected');
			}
		});
		
		positionWsClient.connect();
	}

	function setupRollOptionsStreaming() {
		if (!streamingSessionId || Object.keys(rollOptions).length === 0) return;
		
		// Get all roll option symbols
		const rollOptionSymbols = [];
		for (const [underlying, rollData] of Object.entries(rollOptions)) {
			if (rollData.spreadOptions) {
				if (rollData.spreadOptions.shortOption?.symbol) {
					rollOptionSymbols.push(rollData.spreadOptions.shortOption.symbol);
				}
				if (rollData.spreadOptions.longOption?.symbol) {
					rollOptionSymbols.push(rollData.spreadOptions.longOption.symbol);
				}
			}
		}
		
		if (rollOptionSymbols.length === 0) return;
		
		// Disconnect existing client if any
		if (rollOptionsWsClient) {
			rollOptionsWsClient.disconnect();
		}
		
		// Create new WebSocket client for roll options
		rollOptionsWsClient = createTradierWebSocketClient(streamingSessionId, {
			symbols: rollOptionSymbols,
			filter: ['quote', 'trade'],
			validOnly: true
		}, {
			onData: (data) => {
				// Update roll option quotes
				if (data.quote) {
					const quote = data.quote;
					const symbol = quote.symbol;
					if (symbol) {
						rollOptionQuotes[symbol] = quote;
						updateRollOptionsFromQuote(symbol, quote);
					}
				}
				if (data.trade) {
					const trade = data.trade;
					const symbol = trade.symbol;
					if (symbol && rollOptionQuotes[symbol]) {
						rollOptionQuotes[symbol].last = trade.price;
						updateRollOptionsFromQuote(symbol, rollOptionQuotes[symbol]);
					}
				}
			},
			onError: (err) => {
				console.error('Roll options streaming error:', err);
			},
			onClose: () => {
				console.log('Roll options streaming closed');
				setTimeout(async () => {
					if (streamingEnabled && Object.keys(rollOptions).length > 0) {
						// Try to renew session if expired
						try {
							const response = await fetch('/api/trading', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ action: 'create_streaming_session' })
							});
							const data = await response.json();
							if (data.sessionId) {
								streamingSessionId = data.sessionId;
								if (rollOptionsWsClient) {
									rollOptionsWsClient.updateSession(streamingSessionId);
								}
							}
						} catch (err) {
							console.warn('Failed to renew streaming session:', err);
						}
						setupRollOptionsStreaming();
					}
				}, 5000);
			},
			onOpen: () => {
				console.log('Roll options streaming connected');
			}
		});
		
		rollOptionsWsClient.connect();
	}

	function setupSpreadOptionsStreaming() {
		if (!streamingSessionId || !spreadOptions) return;
		
		// Get spread option symbols
		const spreadOptionSymbols = [];
		if (spreadOptions.shortOption?.symbol) {
			spreadOptionSymbols.push(spreadOptions.shortOption.symbol);
		}
		if (spreadOptions.longOption?.symbol) {
			spreadOptionSymbols.push(spreadOptions.longOption.symbol);
		}
		
		if (spreadOptionSymbols.length === 0) return;
		
		// Disconnect existing client if any
		if (spreadOptionsWsClient) {
			spreadOptionsWsClient.disconnect();
		}
		
		// Create new WebSocket client for spread options
		spreadOptionsWsClient = createTradierWebSocketClient(streamingSessionId, {
			symbols: spreadOptionSymbols,
			filter: ['quote', 'trade'],
			validOnly: true
		}, {
			onData: (data) => {
				// Update spread option quotes
				if (data.quote) {
					const quote = data.quote;
					const symbol = quote.symbol;
					if (symbol) {
						spreadOptionQuotes[symbol] = quote;
						updateSpreadOptionsFromQuote(symbol, quote);
					}
				}
				if (data.trade) {
					const trade = data.trade;
					const symbol = trade.symbol;
					if (symbol && spreadOptionQuotes[symbol]) {
						spreadOptionQuotes[symbol].last = trade.price;
						updateSpreadOptionsFromQuote(symbol, spreadOptionQuotes[symbol]);
					}
				}
			},
			onError: (err) => {
				console.error('Spread options streaming error:', err);
			},
			onClose: () => {
				console.log('Spread options streaming closed');
				setTimeout(async () => {
					if (streamingEnabled && spreadOptions) {
						// Try to renew session if expired
						try {
							const response = await fetch('/api/trading', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ action: 'create_streaming_session' })
							});
							const data = await response.json();
							if (data.sessionId) {
								streamingSessionId = data.sessionId;
								if (spreadOptionsWsClient) {
									spreadOptionsWsClient.updateSession(streamingSessionId);
								}
							}
						} catch (err) {
							console.warn('Failed to renew streaming session:', err);
						}
						setupSpreadOptionsStreaming();
					}
				}, 5000);
			},
			onOpen: () => {
				console.log('Spread options streaming connected');
			}
		});
		
		spreadOptionsWsClient.connect();
	}

	function updateSpreadOptionsFromQuote(symbol, quote) {
		// Update spread options with new quote data
		if (spreadOptions) {
			if (spreadOptions.shortOption?.symbol === symbol) {
				spreadOptions.shortOption.bid = quote.bid;
				spreadOptions.shortOption.ask = quote.ask;
				spreadOptions.shortOption.last = quote.last;
				// Trigger reactivity
				spreadOptions = { ...spreadOptions };
			}
			if (spreadOptions.longOption?.symbol === symbol) {
				spreadOptions.longOption.bid = quote.bid;
				spreadOptions.longOption.ask = quote.ask;
				spreadOptions.longOption.last = quote.last;
				// Trigger reactivity
				spreadOptions = { ...spreadOptions };
			}
		}
	}

	function updatePositionFromQuote(symbol, quote) {
		// Find position and update its market value and P&L
		const positionIndex = positions.findIndex(p => p.symbol === symbol);
		if (positionIndex === -1) return;
		
		const position = positions[positionIndex];
		const quantity = parseFloat(position.quantity || 0);
		const costBasis = parseFloat(position.cost_basis || 0);
		const lastPrice = parseFloat(quote.last || quote.bid || quote.ask || 0);
		
		// Calculate new market value and P&L
		const marketValue = Math.abs(quantity) * lastPrice;
		const unrealizedPl = (quantity > 0 ? marketValue - costBasis : costBasis - marketValue);
		
		// Update position (create new object - $state tracks mutations automatically)
		positions[positionIndex] = {
			...position,
			market_value: marketValue,
			unrealized_pl: unrealizedPl,
			last_price: lastPrice,
			bid: quote.bid,
			ask: quote.ask
		};
	}

	function updateRollOptionsFromQuote(symbol, quote) {
		// Update roll options with new quote data
		for (const [underlying, rollData] of Object.entries(rollOptions)) {
			if (rollData.spreadOptions) {
				if (rollData.spreadOptions.shortOption?.symbol === symbol) {
					rollData.spreadOptions.shortOption.bid = quote.bid;
					rollData.spreadOptions.shortOption.ask = quote.ask;
					rollData.spreadOptions.shortOption.last = quote.last;
				}
				if (rollData.spreadOptions.longOption?.symbol === symbol) {
					rollData.spreadOptions.longOption.bid = quote.bid;
					rollData.spreadOptions.longOption.ask = quote.ask;
					rollData.spreadOptions.longOption.last = quote.last;
				}
				// Trigger reactivity
				rollOptions = { ...rollOptions };
			}
		}
	}

	async function loadData() {
		loading = true;
		error = null;
		warning = null;
		try {
			const response = await fetch('/api/trading');
			const data = await response.json();
			
			if (data.error) {
				error = data.error;
			} else {
				account = data.account;
				balances = data.balances;
				positions = Array.isArray(data.positions) ? data.positions : (data.positions ? [data.positions] : []);
				orders = Array.isArray(data.orders) ? data.orders : (data.orders ? [data.orders] : []);
				if (data.warning) {
					warning = data.warning;
				}
				
				// Restart position streaming if we have a session
				if (streamingEnabled && streamingSessionId) {
					setupPositionStreaming();
				}
				
				// Fetch initial quotes for positions to populate market values
				if (positions.length > 0) {
					await fetchInitialPositionQuotes();
					await findRollOptionsForPositions();
					await calculatePortfolioGreeks();
				} else {
					portfolioGreeks = { netDelta: 0, netTheta: 0, loading: false };
				}
			}
		} catch (err) {
			error = err.message || 'Failed to load data';
			console.error('Error loading data:', err);
		} finally {
			loading = false;
		}
	}

	async function fetchInitialPositionQuotes() {
		if (positions.length === 0) return;

		// Rate limiting: check minimum interval since last call
		const now = Date.now();
		const timeSinceLastCall = now - lastGreeksCallTime;
		
		if (timeSinceLastCall < MIN_GREEKS_CALL_INTERVAL) {
			const waitTime = MIN_GREEKS_CALL_INTERVAL - timeSinceLastCall;
			console.log(`Rate limiting initial quotes: waiting ${waitTime}ms`);
			await new Promise(resolve => setTimeout(resolve, waitTime));
		}

		try {
			// Get all position symbols
			const positionSymbols = positions
				.map(p => p.symbol)
				.filter(s => s);

			if (positionSymbols.length === 0) return;

			// Fetch quotes with greeks for all positions
			const response = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'get_position_greeks',
					symbols: positionSymbols
				})
			});

			const data = await response.json();
			
			lastGreeksCallTime = Date.now();
			
			if (data.error || !data.greeks) {
				// Handle quota violations
				if (data.quotaViolation) {
					quotaViolation = {
						message: data.error,
						resetTime: data.quotaResetTime ? new Date(data.quotaResetTime) : null
					};
					// Don't retry immediately after quota violation
					lastGreeksCallTime = Date.now() + QUOTA_COOLDOWN;
				}
				console.warn('Error fetching initial position quotes:', data.error);
				return;
			}
			
			// Clear quota violation if request succeeded
			if (quotaViolation) {
				quotaViolation = null;
			}

			// Update positions with initial quotes and market values
			for (const [symbol, greekData] of Object.entries(data.greeks)) {
				const positionIndex = positions.findIndex(p => p.symbol === symbol);
				if (positionIndex === -1) continue;

				const position = positions[positionIndex];
				const quantity = parseFloat(position.quantity || 0);
				const costBasis = parseFloat(position.cost_basis || 0);
				
				// Get price from quote data (we need to fetch full quotes for bid/ask/last)
				// For now, use mid price if available, or estimate from greeks
				// We'll update this with streaming quotes
				
				// Store the quote data for later use
				positionQuotes[symbol] = {
					bid: greekData.bid,
					ask: greekData.ask,
					last: greekData.last,
					delta: greekData.delta,
					theta: greekData.theta
				};
			}

			// Also fetch full quotes to get bid/ask/last prices
			const quotesResponse = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'get_position_quotes',
					symbols: positionSymbols
				})
			});

			const quotesData = await quotesResponse.json();
			if (quotesData.quotes) {
				const quoteList = Array.isArray(quotesData.quotes) ? quotesData.quotes : [quotesData.quotes];
				for (const quote of quoteList) {
					if (quote.symbol) {
						updatePositionFromQuote(quote.symbol, quote);
					}
				}
			}
		} catch (err) {
			console.error('Error fetching initial position quotes:', err);
		}
	}

	async function calculatePortfolioGreeks() {
		if (positions.length === 0) {
			portfolioGreeks = { netDelta: 0, netTheta: 0, loading: false };
			return;
		}

		// Rate limiting: prevent concurrent calls
		if (greeksCallInProgress) {
			console.log('Greeks call already in progress, skipping...');
			return;
		}

		// Rate limiting: check minimum interval since last call
		const now = Date.now();
		const timeSinceLastCall = now - lastGreeksCallTime;
		
		if (timeSinceLastCall < MIN_GREEKS_CALL_INTERVAL) {
			const waitTime = MIN_GREEKS_CALL_INTERVAL - timeSinceLastCall;
			console.log(`Rate limiting: waiting ${waitTime}ms before next greeks call`);
			setTimeout(() => calculatePortfolioGreeks(), waitTime);
			return;
		}

		// Cooldown after quota violation
		if (quotaViolation && quotaViolation.resetTime) {
			const resetTime = quotaViolation.resetTime.getTime();
			if (resetTime > now) {
				const waitTime = Math.min(resetTime - now, QUOTA_COOLDOWN);
				console.log(`Quota violation cooldown: waiting ${waitTime}ms`);
				setTimeout(() => calculatePortfolioGreeks(), waitTime);
				return;
			}
		}

		greeksCallInProgress = true;
		lastGreeksCallTime = now;
		portfolioGreeks.loading = true;
		
		try {
			// Get all position symbols
			const positionSymbols = positions
				.map(p => p.symbol)
				.filter(s => s);

			if (positionSymbols.length === 0) {
				portfolioGreeks = { netDelta: 0, netTheta: 0, loading: false };
				return;
			}

			// Fetch quotes with greeks for all positions
			const response = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'get_position_greeks',
					symbols: positionSymbols
				})
			});

			const data = await response.json();
			
			if (data.error) {
				// Handle quota violations
				if (data.quotaViolation) {
					quotaViolation = {
						message: data.error,
						resetTime: data.quotaResetTime ? new Date(data.quotaResetTime) : null
					};
					console.warn('Quota violation:', data.error);
					// Don't retry immediately after quota violation
					lastGreeksCallTime = Date.now() + QUOTA_COOLDOWN;
				} else {
					console.warn('Error fetching position greeks:', data.error);
				}
				portfolioGreeks = { netDelta: 0, netTheta: 0, loading: false };
				return;
			}
			
			// Clear quota violation if request succeeded
			if (quotaViolation) {
				quotaViolation = null;
			}

			// Calculate total net delta and theta
			// Theta from Tradier API is per share, so multiply by 100 (shares per contract) and then by quantity (number of contracts)
			// Delta is already per share, so multiply by 100 and then by quantity
			let totalDelta = 0;
			let totalTheta = 0;

			if (data.greeks) {
				for (const [symbol, greekData] of Object.entries(data.greeks)) {
					const position = positions.find(p => p.symbol === symbol);
					if (position && greekData) {
						const quantity = parseFloat(position.quantity || 0);
						const delta = parseFloat(greekData.delta || 0);
						const theta = parseFloat(greekData.theta || 0);
						
						// Delta and theta are per share, so multiply by 100 (shares per contract) and then by quantity
						totalDelta += delta * 100 * quantity;
						totalTheta += theta * 100 * quantity; // Theta in dollars per day
					}
				}
			}

			portfolioGreeks = {
				netDelta: totalDelta,
				netTheta: totalTheta, // This is now in dollars per day
				loading: false
			};
		} catch (err) {
			console.error('Error calculating portfolio greeks:', err);
			portfolioGreeks = { netDelta: 0, netTheta: 0, loading: false };
		} finally {
			greeksCallInProgress = false;
		}
	}

	async function findSpread(strikeOffsetParam = null, expirationOffsetParam = null, resetNav = false) {
		console.log('findSpread', { strikeOffsetParam, expirationOffsetParam, resetNav });
		status = 'finding';
		error = null;
		symbol = selectedSymbol; // Update symbol when finding
		
		// Reset navigation if requested (when finding initial spread)
		if (resetNav) {
			strikeOffset = 0;
			expirationOffset = 0;
		}
		
		// Use provided offsets or current state
		const strikeOffsetToUse = strikeOffsetParam !== null ? strikeOffsetParam : strikeOffset;
		const expirationOffsetToUse = expirationOffsetParam !== null ? expirationOffsetParam : expirationOffset;
		
		try {
			const response = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action: 'find_spread', 
					symbol: selectedSymbol,
					targetDelta: targetDelta,
					optionType: optionType,
					strikeOffset: strikeOffsetToUse,
					expirationOffset: expirationOffsetToUse
				})
			});
			const data = await response.json();
			
			if (data.error) {
				error = data.error;
			} else {
				spreadOptions = data.spreadOptions;
				currentPrice = data.currentPrice;
				symbol = data.symbol || selectedSymbol;
				targetDelta = data.targetDelta || targetDelta;
				optionType = data.optionType || optionType;
				
				// Store navigation state
				if (data.availableExpirations) {
					availableExpirations = data.availableExpirations;
				}
				if (data.currentStrike) {
					currentStrike = data.currentStrike;
				}
				
				// Store next day spread data for estimation
				spreadOptions.nextDaySpread = data.nextDaySpread;
				spreadOptions.currentSpreadCost = data.currentSpreadCost;
				spreadOptions.nextDaySpreadCost = data.nextDaySpreadCost;
				spreadOptions.estimatedTomorrowValue = data.estimatedTomorrowValue;
				spreadOptions.estimatedOvernightGain = data.estimatedOvernightGain;
				
				// Set up streaming for spread options
				if (streamingEnabled && streamingSessionId && spreadOptions) {
					setupSpreadOptionsStreaming();
				}
			}
		} catch (err) {
			error = err.message || 'Failed to find spread';
			console.error('Error finding spread:', err);
		} finally {
			status = 'idle';
		}
	}

	async function navigateStrike(direction) {
		if (!spreadOptions) return;
		
		// Determine strike increment (typically $5 for SPY, $1 for some others)
		const strikeIncrement = selectedSymbol === 'SPY' || selectedSymbol === 'QQQ' || selectedSymbol === 'DIA' ? 5 : 1;
		const newOffset = strikeOffset + (direction === 'up' ? 1 : -1);
		
		strikeOffset = newOffset;
		await findSpread(newOffset, expirationOffset);
	}

	async function navigateExpiration(direction) {
		if (!spreadOptions || availableExpirations.length === 0) return;
		
		const newOffset = expirationOffset + (direction === 'next' ? 1 : -1);
		
		// Check bounds (we'll let the API handle validation)
		expirationOffset = newOffset;
		await findSpread(strikeOffset, newOffset);
	}

	function resetNavigation() {
		strikeOffset = 0;
		expirationOffset = 0;
	}

	async function previewSpread() {
		if (!spreadOptions) {
			error = 'Please find a spread first';
			return;
		}

		status = 'previewing';
		error = null;
		try {
			const response = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action: 'preview_spread', 
					quantity, 
					symbol: selectedSymbol,
					targetDelta: targetDelta,
					optionType: optionType
				})
			});
			const data = await response.json();
			
			if (data.error) {
				error = data.error;
			} else {
				previewData = data;
				showPreviewModal = true;
			}
		} catch (err) {
			error = err.message || 'Failed to preview spread';
			console.error('Error previewing spread:', err);
		} finally {
			status = 'idle';
		}
	}

	function closePreviewModal() {
		showPreviewModal = false;
		previewData = null;
	}

	// Handle Escape key to close modal
	function handleKeydown(event) {
		if (event.key === 'Escape' && showPreviewModal) {
			closePreviewModal();
		}
	}

	async function buySpread() {
		const deltaPercent = (targetDelta * 100).toFixed(0);
		if (!confirm(`Are you sure you want to buy ${quantity} ${deltaPercent} delta ${optionType} calendar spread(s) on ${selectedSymbol}?`)) {
			return;
		}

		status = 'buying';
		error = null;
		symbol = selectedSymbol;
		try {
			const response = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action: 'buy_spread', 
					quantity, 
					symbol: selectedSymbol,
					targetDelta: targetDelta,
					optionType: optionType,
					preview: false
				})
			});
			const data = await response.json();
			
			if (data.error) {
				error = data.error;
			} else {
				const orderInfo = data.order?.order || data.order;
				let message = `Order ${data.preview ? 'Preview' : 'Placed'}:\n\n`;
				if (orderInfo?.id) message += `Order ID: ${orderInfo.id}\n`;
				if (orderInfo?.status) message += `Status: ${orderInfo.status}\n`;
				if (data.order?.commission) message += `Commission: ${formatCurrency(data.order.commission)}\n`;
				if (data.order?.cost) message += `Cost: ${formatCurrency(data.order.cost)}\n`;
				alert(message);
				spreadOptions = data.spreadOptions;
				symbol = data.symbol || selectedSymbol;
				targetDelta = data.targetDelta || targetDelta;
				optionType = data.optionType || optionType;
				await loadData(); // Reload positions
			}
		} catch (err) {
			error = err.message || 'Failed to buy spread';
			console.error('Error buying spread:', err);
		} finally {
			status = 'idle';
		}
	}

	async function rollSpread() {
		if (positions.length === 0) {
			error = 'No positions to roll';
			return;
		}

		const deltaPercent = (targetDelta * 100).toFixed(0);
		if (!confirm(`Are you sure you want to roll ${quantity} ${deltaPercent} delta ${optionType} calendar spread(s) on ${selectedSymbol}?`)) {
			return;
		}

		status = 'rolling';
		error = null;
		symbol = selectedSymbol;
		try {
			const response = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action: 'roll_spread', 
					quantity, 
					symbol: selectedSymbol,
					targetDelta: targetDelta,
					optionType: optionType
				})
			});
			const data = await response.json();
			
			if (data.error) {
				error = data.error;
			} else {
				alert(`Spread rolled successfully!`);
				symbol = data.symbol || selectedSymbol;
				targetDelta = data.targetDelta || targetDelta;
				optionType = data.optionType || optionType;
				await loadData(); // Reload positions
			}
		} catch (err) {
			error = err.message || 'Failed to roll spread';
			console.error('Error rolling spread:', err);
		} finally {
			status = 'idle';
		}
	}

	async function rollSpreadForSymbol(underlying, rollData) {
		const deltaPercent = (targetDelta * 100).toFixed(0);
		if (!confirm(`Are you sure you want to roll ${quantity} ${deltaPercent} delta ${rollData.optionType} calendar spread(s) on ${underlying}?`)) {
			return;
		}

		status = 'rolling';
		error = null;
		symbol = underlying;
		selectedSymbol = underlying;
		optionType = rollData.optionType;
		
		try {
			const response = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action: 'roll_spread', 
					quantity, 
					symbol: underlying,
					targetDelta: targetDelta,
					optionType: rollData.optionType
				})
			});
			const data = await response.json();
			
			if (data.error) {
				error = data.error;
			} else {
				alert(`Spread rolled successfully!`);
				symbol = data.symbol || underlying;
				targetDelta = data.targetDelta || targetDelta;
				optionType = data.optionType || rollData.optionType;
				await loadData(); // Reload positions and roll options
			}
		} catch (err) {
			error = err.message || 'Failed to roll spread';
			console.error('Error rolling spread:', err);
		} finally {
			status = 'idle';
		}
	}

	async function cancelOrder(orderId) {
		if (!confirm(`Are you sure you want to cancel order ${orderId}?`)) {
			return;
		}

		error = null;
		try {
			const response = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action: 'cancel_order', 
					orderId: orderId
				})
			});
			const data = await response.json();
			
			if (data.error) {
				error = data.error;
			} else {
				const orderStatus = data.order?.status || 'unknown';
				let message = `Order ${orderId} cancellation `;
				if (orderStatus === 'ok') {
					message += 'completed successfully';
				} else if (orderStatus === 'pending_cancel') {
					message += 'is pending (will be canceled when market conditions allow)';
				} else {
					message += `status: ${orderStatus}`;
				}
				alert(message);
				await loadData(); // Reload orders
			}
		} catch (err) {
			error = err.message || 'Failed to cancel order';
			console.error('Error canceling order:', err);
		}
	}

	function extractUnderlyingFromSymbol(optionSymbol) {
		// Extract underlying symbol from option symbol (e.g., SPY240119C00450000 -> SPY)
		if (!optionSymbol) return null;
		const match = optionSymbol.match(/^([A-Z]+)/);
		return match ? match[1] : null;
	}

	function extractStrikeFromSymbol(optionSymbol) {
		// Extract strike from option symbol (e.g., SPY240119C00450000 -> 450.00)
		if (!optionSymbol) return null;
		const match = optionSymbol.match(/[CP](\d{8})$/);
		if (match) {
			return parseFloat(match[1]) / 1000; // Strike is in format 00450000 = 450.00
		}
		return null;
	}

	function extractOptionTypeFromSymbol(optionSymbol) {
		// Extract option type from symbol (C = call, P = put)
		if (!optionSymbol) return null;
		return optionSymbol.includes('C') ? 'call' : optionSymbol.includes('P') ? 'put' : null;
	}

	async function findRollOptionsForPositions() {
		// Group positions by underlying symbol and find roll options for each
		const positionsBySymbol = {};
		
		positions.forEach(pos => {
			if (!pos.symbol) return;
			const underlying = extractUnderlyingFromSymbol(pos.symbol);
			if (!underlying) return;
			
			if (!positionsBySymbol[underlying]) {
				positionsBySymbol[underlying] = {
					underlying,
					optionType: extractOptionTypeFromSymbol(pos.symbol) || 'call',
					positions: []
				};
			}
			positionsBySymbol[underlying].positions.push(pos);
		});

		// Find roll options for each underlying symbol
		for (const [underlying, data] of Object.entries(positionsBySymbol)) {
			loadingRollOptions[underlying] = true;
			try {
				const response = await fetch('/api/trading', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						action: 'find_spread', 
						symbol: underlying,
						targetDelta: targetDelta,
						optionType: data.optionType
					})
				});
				const result = await response.json();
				
				if (!result.error && result.spreadOptions) {
					rollOptions[underlying] = {
						spreadOptions: {
							...result.spreadOptions,
							nextDaySpread: result.nextDaySpread,
							currentSpreadCost: result.currentSpreadCost,
							nextDaySpreadCost: result.nextDaySpreadCost,
							estimatedTomorrowValue: result.estimatedTomorrowValue,
							estimatedOvernightGain: result.estimatedOvernightGain
						},
						currentPrice: result.currentPrice,
						optionType: data.optionType
					};
				}
			} catch (err) {
				console.error(`Error finding roll options for ${underlying}:`, err);
			} finally {
				loadingRollOptions[underlying] = false;
			}
		}
		
		// Restart roll options streaming if we have a session
		if (streamingEnabled && streamingSessionId) {
			setupRollOptionsStreaming();
		}
	}

	function formatCurrency(value) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	}

	function formatDate(dateString) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString();
	}

	function formatDateTime(dateString) {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleString('en-US', { 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function extractExpirationFromSymbol(symbol) {
		// Option symbols format: SYMBOL + YYMMDD + C/P + StrikePrice
		// Example: SPY240119C00450000 -> expiration: 2024-01-19
		const match = symbol.match(/(\d{6})[CP]/);
		if (match) {
			const dateStr = match[1]; // YYMMDD
			const year = 2000 + parseInt(dateStr.substring(0, 2));
			const month = parseInt(dateStr.substring(2, 4)) - 1; // Month is 0-indexed
			const day = parseInt(dateStr.substring(4, 6));
			const date = new Date(year, month, day);
			return date.toLocaleDateString();
		}
		return 'N/A';
	}
</script>

<svelte:head>
	<title>{symbol} Calendar Spread Trading</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col">
	<!-- Sticky Header -->
	<header class="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
		<div class="px-4 sm:px-6 lg:px-8 py-4">

			<!-- Error/Warning Display -->
			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg mb-2 text-sm">
					<p class="font-semibold">Error:</p>
					<p>{error}</p>
				</div>
			{/if}

			{#if warning}
				<div class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-lg mb-2 text-sm">
					<p class="font-semibold">⚠️ Warning:</p>
					<p>{warning}</p>
				</div>
			{/if}

			{#if quotaViolation}
				<div class="bg-orange-50 border border-orange-200 text-orange-800 px-3 py-2 rounded-lg mb-2 text-sm">
					<p class="font-semibold">⚠️ API Quota Exceeded:</p>
					<p>{quotaViolation.message}</p>
					{#if quotaViolation.resetTime}
						<p class="text-xs mt-1 text-orange-700">
							Quota resets at {quotaViolation.resetTime.toLocaleTimeString()}
						</p>
					{/if}
				</div>
			{/if}

			<!-- Account Summary & Portfolio Greeks -->
			<div class="flex flex-row gap-3">
				{#if balances}
					<div class="bg-gray-50 rounded-lg p-2 flex-1">
						<p class="text-xs text-gray-600">Total Equity</p>
						<p class="text-lg font-bold text-gray-900">{formatCurrency(balances.total_equity || 0)}</p>
					</div>
					<div class="bg-gray-50 rounded-lg p-2 flex-1">
						<p class="text-xs text-gray-600">Cash</p>
						<p class="text-lg font-bold text-gray-900">{formatCurrency(balances.total_cash || 0)}</p>
					</div>
					<div class="bg-gray-50 rounded-lg p-2 flex-1">
						<p class="text-xs text-gray-600">Market Value</p>
						<p class="text-lg font-bold text-gray-900">{formatCurrency(balances.market_value || 0)}</p>
					</div>
					<div class="bg-gray-50 rounded-lg p-2 flex-1">
						<p class="text-xs text-gray-600">Open P&L</p>
						<p class="text-lg font-bold {parseFloat(balances.open_pl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}">
							{formatCurrency(balances.open_pl || 0)}
						</p>
					</div>
				{/if}
				{#if positions.length > 0 && !portfolioGreeks.loading}
					<div class="bg-purple-50 rounded-lg p-2 border border-purple-200 flex-1">
						<p class="text-xs text-gray-600">Net Delta</p>
						<p class="text-lg font-bold {portfolioGreeks.netDelta >= 0 ? 'text-green-600' : 'text-red-600'}">
							{portfolioGreeks.netDelta.toFixed(2)}
						</p>
					</div>
					<div class="bg-purple-50 rounded-lg p-2 border border-purple-200 flex-1">
						<p class="text-xs text-gray-600">Net Theta</p>
						<p class="text-lg font-bold {portfolioGreeks.netTheta >= 0 ? 'text-green-600' : 'text-red-600'}">
							{formatCurrency(portfolioGreeks.netTheta)}/day
						</p>
					</div>
				{/if}
				<button
					onclick={loadData}
					disabled={loading}
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-semibold flex-1"
				>
					{loading ? 'Loading...' : 'Refresh'}
				</button>
			</div>
		</div>
	</header>

	<!-- Main Layout: Sidebars + Center -->
	<div class="flex-1 flex overflow-hidden">
		<!-- Left Sidebar: Trading Controls -->
		<aside class="w-80 bg-white border-r border-gray-200 overflow-y-auto">
			<div class="p-4">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Trading Controls</h2>
				
				<div class="space-y-4">
					<div>
						<label for="symbol" class="block text-sm font-medium text-gray-700 mb-2">
							Underlying Symbol
						</label>
						<select
							id="symbol"
							bind:value={selectedSymbol}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
						>
							{#each availableSymbols as sym}
								<option value={sym.value}>{sym.label}</option>
							{/each}
						</select>
					</div>
					<div>
						<label for="targetDelta" class="block text-sm font-medium text-gray-700 mb-2">
							Target Delta ({(targetDelta * 100).toFixed(0)}%)
						</label>
						<input
							id="targetDelta"
							type="number"
							min="0.01"
							max="0.99"
							step="0.01"
							bind:value={targetDelta}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
						/>
						<p class="text-xs text-gray-500 mt-1">Enter as decimal (0.35 = 35 delta)</p>
					</div>
					<div>
						<label for="optionType" class="block text-sm font-medium text-gray-700 mb-2">
							Option Type
						</label>
						<select
							id="optionType"
							bind:value={optionType}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
						>
							<option value="call">Call</option>
							<option value="put">Put</option>
						</select>
					</div>
					<div>
						<label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
							Quantity
						</label>
						<input
							id="quantity"
							type="number"
							min="1"
							bind:value={quantity}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
						/>
					</div>
				</div>

				<div class="mt-6 space-y-2">
					<button
						onclick={() => findSpread(null, null, true)}
						disabled={loading || status === 'finding'}
						class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-semibold text-sm"
					>
						{status === 'finding' ? 'Finding...' : '🔍 Find Spread'}
					</button>

					<button
						onclick={previewSpread}
						disabled={loading || status === 'previewing' || !spreadOptions}
						class="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 font-semibold text-sm"
					>
						{status === 'previewing' ? 'Previewing...' : '👁️ Preview Order'}
					</button>

					<button
						onclick={buySpread}
						disabled={loading || status === 'buying' || !spreadOptions}
						class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-semibold text-sm"
					>
						{status === 'buying' ? 'Buying...' : '💰 Buy Spread'}
					</button>

					<button
						onclick={rollSpread}
						disabled={loading || status === 'rolling' || positions.length === 0}
						class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 font-semibold text-sm"
					>
						{status === 'rolling' ? 'Rolling...' : '🔄 Roll Spread'}
					</button>
				</div>

				<!-- Info Section -->
				<div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs">
					<h3 class="text-sm font-semibold text-blue-900 mb-2">ℹ️ How It Works</h3>
					<ul class="list-disc list-inside space-y-1 text-blue-800">
						<li>Finds {(targetDelta * 100).toFixed(0)} delta {optionType} options</li>
						<li>3 and 4 day expirations</li>
						<li>Roll daily to maintain positions</li>
						<li>Available: SPY, XSP, QQQ, DIA</li>
					</ul>
				</div>
			</div>
		</aside>

		<!-- Main Center Area: Spread Options -->
		<main class="flex-1 overflow-y-auto">
			<div class="p-4">

				<!-- Spread Options Display -->
				{#if spreadOptions}
					{@const shortDelta = spreadOptions.shortOption.delta ?? spreadOptions.shortOption.greeks?.delta ?? 0}
					{@const longDelta = spreadOptions.longOption.delta ?? spreadOptions.longOption.greeks?.delta ?? 0}
					{@const shortTheta = (spreadOptions.shortOption.greeks?.theta ?? 0) * 100} // Convert per-share to per-contract (dollars)
					{@const longTheta = (spreadOptions.longOption.greeks?.theta ?? 0) * 100} // Convert per-share to per-contract (dollars)
					{@const netDelta = (longDelta - shortDelta) * quantity}
					{@const netTheta = (longTheta - shortTheta) * quantity} // Dollars per day
					{@const netCost = (spreadOptions.longOption.ask || 0) - (spreadOptions.shortOption.bid || 0)}
					
					<div class="bg-white rounded-lg shadow-md p-4 mb-4">
						<!-- Header -->
						<div class="flex items-center justify-between mb-3">
							<div class="flex items-center gap-3">
								<h2 class="text-lg font-semibold text-gray-900">Calendar Spread</h2>
								{#if streamingEnabled && (spreadOptionQuotes[spreadOptions.shortOption?.symbol] || spreadOptionQuotes[spreadOptions.longOption?.symbol])}
									<span class="flex items-center gap-1 text-xs text-green-600">
										<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
										<span>Live</span>
									</span>
								{/if}
							</div>
							{#if currentPrice > 0}
								<div class="text-right">
									<p class="text-xs text-gray-500">{symbol}</p>
									<p class="text-lg font-bold text-gray-900">{formatCurrency(currentPrice)}</p>
								</div>
							{/if}
						</div>

						<!-- Navigation Controls -->
						<div class="flex items-center gap-4 mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
							<!-- Strike Navigation -->
							<div class="flex items-center gap-2">
								<span class="text-xs font-medium text-gray-700">Strike:</span>
								<button
									onclick={() => navigateStrike('down')}
									disabled={status === 'finding'}
									class="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-xs font-semibold"
									title="Lower strike"
								>
									◄
								</button>
								<span class="text-xs font-semibold text-gray-900 min-w-[60px] text-center">
									{currentStrike ? formatCurrency(currentStrike) : formatCurrency(spreadOptions.shortOption.strike || 0)}
									{#if strikeOffset !== 0}
										<span class="text-gray-500 ml-1">({strikeOffset > 0 ? '+' : ''}{strikeOffset * (selectedSymbol === 'SPY' || selectedSymbol === 'QQQ' || selectedSymbol === 'DIA' ? 5 : 1)})</span>
									{/if}
								</span>
								<button
									onclick={() => navigateStrike('up')}
									disabled={status === 'finding'}
									class="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-xs font-semibold"
									title="Higher strike"
								>
									►
								</button>
							</div>

							<div class="w-px h-6 bg-gray-300"></div>

							<!-- Expiration Navigation -->
							<div class="flex items-center gap-2">
								<span class="text-xs font-medium text-gray-700">Expiration:</span>
								<button
									onclick={() => navigateExpiration('prev')}
									disabled={status === 'finding'}
									class="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-xs font-semibold"
									title="Previous expiration"
								>
									◄
								</button>
								<span class="text-xs font-semibold text-gray-900 min-w-[80px] text-center">
									{spreadOptions.shortOption.daysUntil}/{spreadOptions.longOption.daysUntil} days
									{#if expirationOffset !== 0}
										<span class="text-gray-500 ml-1">({expirationOffset > 0 ? '+' : ''}{expirationOffset})</span>
									{/if}
								</span>
								<button
									onclick={() => navigateExpiration('next')}
									disabled={status === 'finding'}
									class="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-xs font-semibold"
									title="Next expiration"
								>
									►
								</button>
							</div>

							<div class="flex-1"></div>

							<!-- Reset Button -->
							{#if strikeOffset !== 0 || expirationOffset !== 0}
								<button
									onclick={() => { resetNavigation(); findSpread(0, 0); }}
									disabled={status === 'finding'}
									class="px-2 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded hover:bg-blue-200 disabled:opacity-50 text-xs font-semibold"
									title="Reset to original spread"
								>
									Reset
								</button>
							{/if}
						</div>

						<!-- Visual Trade Structure -->
						<div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-3 border border-blue-200">
							<div class="flex items-center justify-between mb-2">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-1">
										<div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-300">
											<span class="text-red-600 font-bold text-sm">↓</span>
										</div>
										<div class="flex-1">
											<div class="flex items-center gap-2">
												<span class="text-xs font-semibold text-red-700">SELL</span>
												<span class="text-sm font-bold text-gray-900">{spreadOptions.shortOption.symbol || 'N/A'}</span>
											</div>
											<div class="flex items-center gap-3 text-xs text-gray-600 mt-0.5">
												<span>Strike: <span class="font-semibold text-gray-900">{formatCurrency(spreadOptions.shortOption.strike || 0)}</span></span>
												<span>•</span>
												<span>{spreadOptions.shortOption.daysUntil} days</span>
												<span>•</span>
												<span>Δ {shortDelta.toFixed(2)}</span>
											</div>
										</div>
										<div class="text-right">
											<p class="text-xs text-gray-500">Credit</p>
											<p class="text-sm font-bold text-green-600">+{formatCurrency(spreadOptions.shortOption.bid || 0)}</p>
										</div>
									</div>
									
									<!-- Arrow -->
									<div class="flex justify-center my-1">
										<div class="w-px h-4 bg-gray-300"></div>
									</div>
									
									<div class="flex items-center gap-2">
										<div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-300">
											<span class="text-green-600 font-bold text-sm">↑</span>
										</div>
										<div class="flex-1">
											<div class="flex items-center gap-2">
												<span class="text-xs font-semibold text-green-700">BUY</span>
												<span class="text-sm font-bold text-gray-900">{spreadOptions.longOption.symbol || 'N/A'}</span>
											</div>
											<div class="flex items-center gap-3 text-xs text-gray-600 mt-0.5">
												<span>Strike: <span class="font-semibold text-gray-900">{formatCurrency(spreadOptions.longOption.strike || 0)}</span></span>
												<span>•</span>
												<span>{spreadOptions.longOption.daysUntil} days</span>
												<span>•</span>
												<span>Δ {longDelta.toFixed(2)}</span>
											</div>
										</div>
										<div class="text-right">
											<p class="text-xs text-gray-500">Debit</p>
											<p class="text-sm font-bold text-red-600">-{formatCurrency(spreadOptions.longOption.ask || 0)}</p>
										</div>
									</div>
								</div>
							</div>
							
							<!-- Net Cost Highlight -->
							<div class="mt-3 pt-3 border-t border-gray-300 flex items-center justify-between">
								<div>
									<p class="text-xs text-gray-600">Net Cost ({quantity} spread{quantity > 1 ? 's' : ''})</p>
									<p class="text-xl font-bold {netCost >= 0 ? 'text-red-600' : 'text-green-600'}">
										{netCost >= 0 ? '-' : '+'}{formatCurrency(Math.abs(netCost * quantity))}
									</p>
								</div>
								<div class="text-right">
									<p class="text-xs text-gray-600">Per Spread</p>
									<p class="text-lg font-semibold text-gray-900">{formatCurrency(netCost)}</p>
								</div>
							</div>
						</div>

						<!-- Key Metrics Grid -->
						<div class="grid grid-cols-4 gap-3 mb-3">
							<div class="bg-blue-50 rounded-lg p-2 border border-blue-200">
								<p class="text-xs text-gray-600 mb-1">Net Delta</p>
								<p class="text-lg font-bold {netDelta >= 0 ? 'text-green-600' : 'text-red-600'}">
									{netDelta >= 0 ? '+' : ''}{netDelta.toFixed(2)}
								</p>
							</div>
							<div class="bg-purple-50 rounded-lg p-2 border border-purple-200">
								<p class="text-xs text-gray-600 mb-1">Net Theta</p>
								<p class="text-lg font-bold {netTheta >= 0 ? 'text-green-600' : 'text-red-600'}">
									{netTheta >= 0 ? '+' : ''}{formatCurrency(netTheta)}/day
								</p>
							</div>
							<div class="bg-gray-50 rounded-lg p-2 border border-gray-200">
								<p class="text-xs text-gray-600 mb-1">Short Exp</p>
								<p class="text-sm font-semibold text-gray-900">{spreadOptions.shortOption.daysUntil}d</p>
							</div>
							<div class="bg-gray-50 rounded-lg p-2 border border-gray-200">
								<p class="text-xs text-gray-600 mb-1">Long Exp</p>
								<p class="text-sm font-semibold text-gray-900">{spreadOptions.longOption.daysUntil}d</p>
							</div>
						</div>

						<!-- Tomorrow's Value Estimate (Compact) -->
						{#if spreadOptions.nextDaySpread && spreadOptions.estimatedOvernightGain !== null && spreadOptions.estimatedOvernightGain !== undefined}
							<div class="bg-green-50 rounded-lg p-3 border border-green-200">
								<div class="flex items-center justify-between mb-2">
									<h3 class="text-sm font-semibold text-gray-900">🔮 Tomorrow's Estimate</h3>
									<p class="text-xs text-gray-600">
										Based on {(spreadOptions.nextDaySpread.shortOption.daysUntil || 'N/A')}/{spreadOptions.nextDaySpread.longOption.daysUntil || 'N/A'} spread today
									</p>
								</div>
								<div class="grid grid-cols-3 gap-3">
									<div>
										<p class="text-xs text-gray-600">Today</p>
										<p class="text-sm font-semibold text-gray-900">
											{spreadOptions.currentSpreadCost !== null ? formatCurrency(spreadOptions.currentSpreadCost) : 'N/A'}
										</p>
									</div>
									<div>
										<p class="text-xs text-gray-600">Tomorrow</p>
										<p class="text-sm font-semibold text-gray-900">
											{spreadOptions.estimatedTomorrowValue !== null ? formatCurrency(spreadOptions.estimatedTomorrowValue) : 'N/A'}
										</p>
									</div>
									<div>
										<p class="text-xs text-gray-600">Gain</p>
										<p class="text-base font-bold {spreadOptions.estimatedOvernightGain >= 0 ? 'text-green-600' : 'text-red-600'}">
											{spreadOptions.estimatedOvernightGain >= 0 ? '+' : ''}{formatCurrency(spreadOptions.estimatedOvernightGain * quantity)}
										</p>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</main>

		<!-- Right Sidebar: Positions & Roll Options -->
		<aside class="w-96 bg-white border-l border-gray-200 overflow-y-auto">
			<div class="p-4">
				<!-- Current Positions -->
				<div class="mb-6">
					<div class="flex items-center gap-2 mb-3">
						<h2 class="text-lg font-semibold text-gray-900">Positions</h2>
						{#if streamingEnabled}
							<span class="flex items-center gap-1 text-xs text-green-600">
								<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
								<span>Live</span>
							</span>
						{/if}
					</div>

					{#if loading && positions.length === 0}
						<p class="text-sm text-gray-600">Loading...</p>
					{:else if positions.length === 0}
						<p class="text-sm text-gray-600">No positions</p>
					{:else}
						<div class="space-y-3">
							{#each positions as position}
								<div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
									<div class="flex justify-between items-start mb-2">
										<div>
											<p class="text-sm font-semibold text-gray-900">{position.symbol || 'N/A'}</p>
											<p class="text-xs text-gray-600">
												Qty: <span class="font-semibold {parseFloat(position.quantity || 0) < 0 ? 'text-red-600' : 'text-gray-900'}">{position.quantity || 'N/A'}</span>
											</p>
										</div>
										<div class="text-right">
											<p class="text-xs text-gray-600">P&L</p>
											<p class="text-sm font-bold {parseFloat(position.unrealized_pl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}">
												{formatCurrency(position.unrealized_pl || 0)}
											</p>
										</div>
									</div>
									<div class="grid grid-cols-2 gap-2 text-xs">
										<div>
											<p class="text-gray-600">Price</p>
											<div class="flex items-center gap-1">
												<p class="font-medium text-gray-900">
													{position.last_price ? formatCurrency(position.last_price) : (position.bid && position.ask ? `${formatCurrency(position.bid)}/${formatCurrency(position.ask)}` : 'N/A')}
												</p>
												{#if position.last_price && streamingEnabled}
													<span class="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
												{/if}
											</div>
										</div>
										<div>
											<p class="text-gray-600">Value</p>
											<p class="font-medium text-gray-900">{formatCurrency(position.market_value || 0)}</p>
										</div>
										<div>
											<p class="text-gray-600">Cost</p>
											<p class="font-medium text-gray-900">{formatCurrency(position.cost_basis || 0)}</p>
										</div>
										<div>
											<p class="text-gray-600">Exp</p>
											<p class="font-medium text-gray-900 text-xs">
												{position.expiration_date ? formatDate(position.expiration_date) : (position.symbol ? extractExpirationFromSymbol(position.symbol) : 'N/A')}
											</p>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Available Roll Options -->
				{#if Object.keys(rollOptions).length > 0}
					<div class="border-t border-gray-200 pt-6">
						<h2 class="text-lg font-semibold text-gray-900 mb-3">Roll Options</h2>
						<div class="space-y-4">
							{#each Object.entries(rollOptions) as [underlying, rollData]}
								<div class="bg-purple-50 rounded-lg p-3 border border-purple-200">
									<div class="flex items-center justify-between mb-2">
										<h3 class="text-sm font-semibold text-gray-900">{underlying}</h3>
										{#if streamingEnabled && (rollOptionQuotes[rollData.spreadOptions?.shortOption?.symbol] || rollOptionQuotes[rollData.spreadOptions?.longOption?.symbol])}
											<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
										{/if}
									</div>
									{#if loadingRollOptions[underlying]}
										<p class="text-xs text-gray-600">Loading...</p>
									{:else if rollData.spreadOptions}
										<div class="space-y-2 text-xs mb-3">
											<div class="grid grid-cols-2 gap-2">
												<div>
													<p class="text-gray-600">Short Strike</p>
													<p class="font-medium">{formatCurrency(rollData.spreadOptions.shortOption.strike || 0)}</p>
												</div>
												<div>
													<p class="text-gray-600">Long Strike</p>
													<p class="font-medium">{formatCurrency(rollData.spreadOptions.longOption.strike || 0)}</p>
												</div>
											</div>
											<div>
												<p class="text-gray-600">Net Cost</p>
												<p class="font-semibold text-gray-900">
													{formatCurrency((rollData.spreadOptions.longOption.ask || 0) - (rollData.spreadOptions.shortOption.bid || 0))}
												</p>
											</div>
										</div>
										<button
											onclick={() => rollSpreadForSymbol(underlying, rollData)}
											disabled={loading || status === 'rolling'}
											class="w-full px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-xs font-semibold"
										>
											{status === 'rolling' ? 'Rolling...' : `Roll ${underlying}`}
										</button>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</aside>
	</div>

	<!-- Sticky Footer: Orders -->
	<footer class="sticky bottom-0 z-40 bg-white border-t border-gray-200 shadow-lg">
		<div class="px-4 sm:px-6 lg:px-8 py-3">
			<div class="flex items-center justify-between mb-2">
				<h2 class="text-sm font-semibold text-gray-900">Recent Orders</h2>
				{#if balances?.pending_orders_count}
					<span class="text-xs text-gray-600">Pending: {balances.pending_orders_count}</span>
				{/if}
			</div>
			{#if loading && orders.length === 0}
				<p class="text-xs text-gray-600">Loading orders...</p>
			{:else if orders.length === 0}
				<p class="text-xs text-gray-600">No orders found</p>
			{:else}
				<div class="overflow-x-auto max-h-32">
					<table class="min-w-full divide-y divide-gray-200 text-xs">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
								<th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
								<th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Side</th>
								<th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
								<th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
								<th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
								<th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
								<th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each orders.slice(0, 3) as order}
								<tr>
									<td class="px-2 py-1 text-xs font-medium text-gray-900">{order.id || 'N/A'}</td>
									<td class="px-2 py-1 text-xs text-gray-900">{order.symbol || 'N/A'}</td>
									<td class="px-2 py-1 text-xs">
										<span class="px-1 py-0.5 text-xs font-semibold rounded {
											order.side?.includes('buy') ? 'bg-green-100 text-green-800' : 
											order.side?.includes('sell') ? 'bg-red-100 text-red-800' : 
											'bg-gray-100 text-gray-800'
										}">
											{order.side || 'N/A'}
										</span>
									</td>
									<td class="px-2 py-1 text-xs text-gray-600">{order.quantity || 'N/A'}</td>
									<td class="px-2 py-1 text-xs">
										<span class="px-1 py-0.5 text-xs font-semibold rounded {
											order.status === 'filled' ? 'bg-green-100 text-green-800' :
											order.status === 'open' || order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
											order.status === 'canceled' || order.status === 'rejected' ? 'bg-red-100 text-red-800' :
											'bg-gray-100 text-gray-800'
										}">
											{order.status || 'N/A'}
										</span>
									</td>
									<td class="px-2 py-1 text-xs text-gray-600">{order.avg_fill_price ? formatCurrency(order.avg_fill_price) : 'N/A'}</td>
									<td class="px-2 py-1 text-xs text-gray-600">{formatDateTime(order.create_date)}</td>
									<td class="px-2 py-1 text-xs">
										{#if order.status === 'open' || order.status === 'pending' || order.status === 'partially_filled'}
											<button
												onclick={() => cancelOrder(order.id)}
												disabled={loading || status !== 'idle'}
												class="px-2 py-0.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
											>
												Cancel
											</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</footer>
</div>

<!-- Preview Modal -->
{#if showPreviewModal && previewData}
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
		role="dialog"
		aria-modal="true"
		aria-labelledby="preview-modal-title"
	>
		<button
			class="absolute inset-0 w-full h-full"
			onclick={closePreviewModal}
			aria-label="Close modal"
		></button>
		<div 
			class="bg-white rounded-lg shadow-xl w-11/12 max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
		>
			<!-- Close Button -->
			<button
				class="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none text-2xl"
				onclick={closePreviewModal}
				aria-label="Close modal"
			>
				×
			</button>

			<!-- Modal Title -->
			<h2 id="preview-modal-title" class="text-2xl font-bold mb-6 text-gray-900">Order Preview - {previewData.symbol} Calendar Spread</h2>

			<!-- Order Details -->
			{#if previewData.preview?.order}
				<div class="mb-6 p-4 bg-gray-50 rounded-lg">
					<h3 class="text-lg font-semibold mb-3 text-gray-900">Order Details</h3>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<p class="text-sm text-gray-600">Order ID</p>
							<p class="font-medium">{previewData.preview.order.id || 'N/A'}</p>
						</div>
						<div>
							<p class="text-sm text-gray-600">Status</p>
							<p class="font-medium">{previewData.preview.order.status || 'N/A'}</p>
						</div>
						{#if previewData.preview.commission}
							<div>
								<p class="text-sm text-gray-600">Commission</p>
								<p class="font-medium">{formatCurrency(previewData.preview.commission)}</p>
							</div>
						{/if}
						{#if previewData.preview.cost}
							<div>
								<p class="text-sm text-gray-600">Estimated Cost</p>
								<p class="font-medium text-lg">{formatCurrency(previewData.preview.cost)}</p>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Spread Greeks -->
			{#if previewData.greeks}
				<div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
					<h3 class="text-lg font-semibold mb-3 text-gray-900">📊 Spread Greeks (per {quantity} spread{quantity > 1 ? 's' : ''})</h3>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<p class="text-sm text-gray-600">Net Delta</p>
							<p class="text-xl font-bold {previewData.greeks.netDelta >= 0 ? 'text-green-600' : 'text-red-600'}">
								{previewData.greeks.netDelta.toFixed(3)}
							</p>
							<p class="text-xs text-gray-500 mt-1">
								Short: {previewData.greeks.shortDelta.toFixed(3)} | Long: {previewData.greeks.longDelta.toFixed(3)}
							</p>
						</div>
						<div>
							<p class="text-sm text-gray-600">Net Theta</p>
							<p class="text-xl font-bold {previewData.greeks.netTheta >= 0 ? 'text-green-600' : 'text-red-600'}">
								{formatCurrency(previewData.greeks.netTheta)} /day
							</p>
							<p class="text-xs text-gray-500 mt-1">
								Short: {formatCurrency(previewData.greeks.shortTheta)} | Long: {formatCurrency(previewData.greeks.longTheta)}
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Position Impact -->
			{#if previewData.positionImpact}
				<div class="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
					<h3 class="text-lg font-semibold mb-3 text-gray-900">🎯 Position Impact ({previewData.symbol})</h3>
					<div class="space-y-3">
						<div class="grid grid-cols-3 gap-4">
							<div>
								<p class="text-sm text-gray-600">Current Net Delta</p>
								<p class="font-semibold text-lg">{previewData.positionImpact.currentNetDelta.toFixed(3)}</p>
							</div>
							<div class="text-center">
								<p class="text-sm text-gray-600">Change</p>
								<p class="font-semibold text-lg {previewData.positionImpact.deltaChange >= 0 ? 'text-green-600' : 'text-red-600'}">
									{previewData.positionImpact.deltaChange >= 0 ? '+' : ''}{previewData.positionImpact.deltaChange.toFixed(3)}
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">New Net Delta</p>
								<p class="font-semibold text-lg">{previewData.positionImpact.newNetDelta.toFixed(3)}</p>
							</div>
						</div>
						<div class="grid grid-cols-3 gap-4">
							<div>
								<p class="text-sm text-gray-600">Current Net Theta</p>
								<p class="font-semibold text-lg">{formatCurrency(previewData.positionImpact.currentNetTheta)} /day</p>
							</div>
							<div class="text-center">
								<p class="text-sm text-gray-600">Change</p>
								<p class="font-semibold text-lg {previewData.positionImpact.thetaChange >= 0 ? 'text-green-600' : 'text-red-600'}">
									{previewData.positionImpact.thetaChange >= 0 ? '+' : ''}{formatCurrency(previewData.positionImpact.thetaChange)} /day
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">New Net Theta</p>
								<p class="font-semibold text-lg">{formatCurrency(previewData.positionImpact.newNetTheta)} /day</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Risk & Capital Metrics -->
			<div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Buying Power Effect -->
				{#if previewData.buyingPower}
					<div class="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
						<h3 class="text-lg font-semibold mb-3 text-gray-900">💳 Buying Power Effect</h3>
						<div class="space-y-2">
							{#if previewData.buyingPower.current !== null}
								<div>
									<p class="text-sm text-gray-600">Current Buying Power</p>
									<p class="text-lg font-semibold">{formatCurrency(previewData.buyingPower.current)}</p>
								</div>
							{/if}
							<div>
								<p class="text-sm text-gray-600">Effect</p>
								<p class="text-xl font-bold {previewData.buyingPower.effect >= 0 ? 'text-green-600' : 'text-red-600'}">
									{previewData.buyingPower.effect >= 0 ? '+' : ''}{formatCurrency(previewData.buyingPower.effect)}
								</p>
							</div>
							{#if previewData.buyingPower.new !== null}
								<div class="pt-2 border-t border-indigo-300">
									<p class="text-sm text-gray-600">New Buying Power</p>
									<p class="text-lg font-bold">{formatCurrency(previewData.buyingPower.new)}</p>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Max Loss -->
				{#if previewData.maxLoss !== undefined}
					<div class="p-4 bg-red-50 rounded-lg border border-red-200">
						<h3 class="text-lg font-semibold mb-3 text-gray-900">⚠️ Maximum Loss</h3>
						<div class="space-y-2">
							<div>
								<p class="text-sm text-gray-600">Net Debit</p>
								<p class="text-xl font-bold text-red-600">
									{formatCurrency(previewData.netDebit || previewData.maxLoss)}
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Max Loss</p>
								<p class="text-2xl font-bold text-red-700">
									{formatCurrency(previewData.maxLoss)}
								</p>
							</div>
							<p class="text-xs text-gray-500 mt-1">
								If both options expire worthless
							</p>
						</div>
					</div>
				{/if}
			</div>

			<!-- Theta Revenue Estimate -->
			{#if previewData.estimatedThetaRevenue !== undefined}
				<div class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
					<h3 class="text-lg font-semibold mb-3 text-gray-900">💰 Estimated Theta Revenue</h3>
					<div class="space-y-2">
						<div>
							<p class="text-sm text-gray-600">Net Theta per Day</p>
							<p class="text-xl font-bold text-green-600">
								{formatCurrency(previewData.greeks?.netTheta || 0)} /day
							</p>
							<p class="text-xs text-gray-500">For {quantity} spread{quantity > 1 ? 's' : ''}</p>
						</div>
						<div>
							<p class="text-sm text-gray-600">Days Until Short Expiration</p>
							<p class="text-lg font-semibold">{previewData.shortDaysUntil || 3} days</p>
						</div>
						<div class="pt-2 border-t border-green-300">
							<p class="text-sm text-gray-600">Estimated Total Theta Revenue</p>
							<p class="text-2xl font-bold text-green-700">
								{formatCurrency(previewData.estimatedThetaRevenue)}
							</p>
							<p class="text-xs text-gray-500 mt-1">
								Based on {previewData.shortDaysUntil || 3} days × {formatCurrency(previewData.greeks?.netTheta || 0)}/day
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Overall Net Delta Summary -->
			{#if previewData.positionImpact}
				<div class="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
					<h3 class="text-lg font-semibold mb-3 text-gray-900">📈 Overall Net Delta Summary</h3>
					<div class="grid grid-cols-3 gap-4">
						<div>
							<p class="text-sm text-gray-600">Current Overall Net Delta</p>
							<p class="text-xl font-bold {previewData.positionImpact.currentNetDelta >= 0 ? 'text-green-600' : 'text-red-600'}">
								{previewData.positionImpact.currentNetDelta.toFixed(3)}
							</p>
						</div>
						<div class="text-center">
							<p class="text-sm text-gray-600">Spread Net Delta</p>
							<p class="text-xl font-bold {previewData.greeks?.netDelta >= 0 ? 'text-green-600' : 'text-red-600'}">
								{previewData.greeks?.netDelta >= 0 ? '+' : ''}{previewData.greeks?.netDelta?.toFixed(3) || 0}
							</p>
						</div>
						<div>
							<p class="text-sm text-gray-600">New Overall Net Delta</p>
							<p class="text-xl font-bold {previewData.positionImpact.newNetDelta >= 0 ? 'text-green-600' : 'text-red-600'}">
								{previewData.positionImpact.newNetDelta.toFixed(3)}
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Warnings/Errors -->
			{#if previewData.preview?.warnings && previewData.preview.warnings.length > 0}
				<div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
					<h4 class="font-semibold text-yellow-900 mb-2">⚠️ Warnings</h4>
					<ul class="list-disc list-inside text-yellow-800 text-sm">
						{#each previewData.preview.warnings as warning}
							<li>{warning}</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if previewData.preview?.errors && previewData.preview.errors.length > 0}
				<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
					<h4 class="font-semibold text-red-900 mb-2">❌ Errors</h4>
					<ul class="list-disc list-inside text-red-800 text-sm">
						{#each previewData.preview.errors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Close Button -->
			<div class="flex justify-end mt-6">
				<button
					onclick={closePreviewModal}
					class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}


