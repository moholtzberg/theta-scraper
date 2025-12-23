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
				
				// Automatically find roll options for existing positions
				if (positions.length > 0) {
					await findRollOptionsForPositions();
				}
			}
		} catch (err) {
			error = err.message || 'Failed to load data';
			console.error('Error loading data:', err);
		} finally {
			loading = false;
		}
	}

	async function findSpread() {
		console.log('findSpread');
		status = 'finding';
		error = null;
		symbol = selectedSymbol; // Update symbol when finding
		try {
			const response = await fetch('/api/trading', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action: 'find_spread', 
					symbol: selectedSymbol,
					targetDelta: targetDelta,
					optionType: optionType
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
						spreadOptions: result.spreadOptions,
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

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">📈 {symbol} {(targetDelta * 100).toFixed(0)} Delta {optionType.charAt(0).toUpperCase() + optionType.slice(1)} Calendar Spread Trader</h1>
			<p class="text-gray-600">Automated calendar spread trading with 3/4 day expiration</p>
		</div>

		<!-- Error Display -->
		{#if error}
			<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
				<p class="font-semibold">Error:</p>
				<p>{error}</p>
			</div>
		{/if}

		<!-- Warning Display -->
		{#if warning}
			<div class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
				<p class="font-semibold">⚠️ Warning:</p>
				<p>{warning}</p>
				<p class="text-sm mt-2">You can still use the app to find and analyze spreads, but trading actions require a valid Tradier account.</p>
			</div>
		{/if}

		<!-- Account Info -->
		{#if account}
			<div class="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					<div>
						<p class="text-sm text-gray-600">Account Number</p>
						<p class="text-lg font-semibold">{account.account_number || 'N/A'}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600">Account Type</p>
						<p class="text-lg font-semibold">{account.type || 'N/A'}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600">Status</p>
						<p class="text-lg font-semibold">{account.status || 'N/A'}</p>
					</div>
				</div>
				
				{#if balances}
					<div class="border-t border-gray-200 pt-4 mt-4">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">Account Balances</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div>
								<p class="text-sm text-gray-600">Total Equity</p>
								<p class="text-xl font-bold text-gray-900">{formatCurrency(balances.total_equity || 0)}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Total Cash</p>
								<p class="text-xl font-bold text-gray-900">{formatCurrency(balances.total_cash || 0)}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Market Value</p>
								<p class="text-xl font-bold text-gray-900">{formatCurrency(balances.market_value || 0)}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Open P&L</p>
								<p class="text-xl font-bold {parseFloat(balances.open_pl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}">
									{formatCurrency(balances.open_pl || 0)}
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Long Market Value</p>
								<p class="text-lg font-semibold text-gray-900">{formatCurrency(balances.long_market_value || 0)}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Short Market Value</p>
								<p class="text-lg font-semibold text-gray-900">{formatCurrency(balances.short_market_value || 0)}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Option Long Value</p>
								<p class="text-lg font-semibold text-gray-900">{formatCurrency(balances.option_long_value || 0)}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Option Short Value</p>
								<p class="text-lg font-semibold text-gray-900">{formatCurrency(balances.option_short_value || 0)}</p>
							</div>
							{#if balances.account_type === 'margin'}
								<div>
									<p class="text-sm text-gray-600">Current Requirement</p>
									<p class="text-lg font-semibold text-gray-900">{formatCurrency(balances.current_requirement || 0)}</p>
								</div>
								<div>
									<p class="text-sm text-gray-600">Option Requirement</p>
									<p class="text-lg font-semibold text-gray-900">{formatCurrency(balances.option_requirement || 0)}</p>
								</div>
							{/if}
							<div>
								<p class="text-sm text-gray-600">Pending Orders</p>
								<p class="text-lg font-semibold text-gray-900">{balances.pending_orders_count || 0}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Uncleared Funds</p>
								<p class="text-lg font-semibold text-gray-900">{formatCurrency(balances.uncleared_funds || 0)}</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Current Positions -->
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<div class="flex justify-between items-center mb-4">
				<div class="flex items-center gap-3">
					<h2 class="text-xl font-semibold text-gray-900">Current Positions</h2>
					{#if streamingEnabled}
						<span class="flex items-center gap-2 text-sm text-green-600">
							<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
							<span>Live Streaming</span>
						</span>
					{/if}
				</div>
				<button
					onclick={loadData}
					disabled={loading}
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? 'Loading...' : 'Refresh'}
				</button>
			</div>

			{#if loading && positions.length === 0}
				<p class="text-gray-600">Loading positions...</p>
			{:else if positions.length === 0}
				<p class="text-gray-600">No positions found</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Basis</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Acquired</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Price</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Value</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">P&L</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiration</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each positions as position}
								<tr>
									<td class="px-4 py-3 text-sm font-medium text-gray-900">{position.symbol || 'N/A'}</td>
									<td class="px-4 py-3 text-sm {parseFloat(position.quantity || 0) < 0 ? 'text-red-600' : 'text-gray-600'} font-semibold">
										{position.quantity || 'N/A'}
										{#if parseFloat(position.quantity || 0) < 0}
											<span class="text-xs text-gray-500 ml-1">(SHORT)</span>
										{/if}
									</td>
									<td class="px-4 py-3 text-sm text-gray-600">{formatCurrency(position.cost_basis || 0)}</td>
									<td class="px-4 py-3 text-sm text-gray-600">{formatDate(position.date_acquired)}</td>
									<td class="px-4 py-3 text-sm">
										<div class="flex items-center gap-2">
											<span class="font-medium text-gray-900">
												{position.last_price ? formatCurrency(position.last_price) : (position.bid && position.ask ? `${formatCurrency(position.bid)} / ${formatCurrency(position.ask)}` : 'N/A')}
											</span>
											{#if position.last_price && streamingEnabled}
												<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
											{/if}
										</div>
									</td>
									<td class="px-4 py-3 text-sm font-semibold text-gray-900">
										{formatCurrency(position.market_value || 0)}
									</td>
									<td class="px-4 py-3 text-sm font-semibold {parseFloat(position.unrealized_pl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}">
										{formatCurrency(position.unrealized_pl || 0)}
									</td>
									<td class="px-4 py-3 text-sm text-gray-600">
										{position.expiration_date ? formatDate(position.expiration_date) : (position.symbol ? extractExpirationFromSymbol(position.symbol) : 'N/A')}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>

		<!-- Available Roll Options -->
		{#if Object.keys(rollOptions).length > 0}
			{#each Object.entries(rollOptions) as [underlying, rollData]}
				<div class="bg-white rounded-lg shadow-md p-6 mb-6">
					<div class="flex justify-between items-center mb-4">
						<div class="flex items-center gap-3">
							<h2 class="text-xl font-semibold text-gray-900">
								🔄 Available Roll Options for {underlying}
							</h2>
							{#if streamingEnabled && (rollOptionQuotes[rollData.spreadOptions?.shortOption?.symbol] || rollOptionQuotes[rollData.spreadOptions?.longOption?.symbol])}
								<span class="flex items-center gap-2 text-sm text-green-600">
									<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
									<span>Live Prices</span>
								</span>
							{/if}
						</div>
						<button
							onclick={() => rollSpreadForSymbol(underlying, rollData)}
							disabled={loading || status === 'rolling'}
							class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 font-semibold"
						>
							{status === 'rolling' ? 'Rolling...' : `🔄 Roll ${underlying} Spread`}
						</button>
					</div>

					{#if loadingRollOptions[underlying]}
						<p class="text-gray-600">Finding roll options...</p>
					{:else if rollData.spreadOptions}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<!-- Short Option -->
							<div class="border border-gray-200 rounded-lg p-4">
								<h3 class="text-lg font-semibold text-gray-900 mb-3">Short Leg (Sell)</h3>
								<div class="space-y-2">
									<div>
										<p class="text-sm text-gray-600">Symbol</p>
										<p class="font-medium">{rollData.spreadOptions.shortOption.symbol || 'N/A'}</p>
									</div>
									<div>
										<p class="text-sm text-gray-600">Strike</p>
										<p class="font-medium">{formatCurrency(rollData.spreadOptions.shortOption.strike || 0)}</p>
									</div>
									<div>
										<p class="text-sm text-gray-600">Delta</p>
										<p class="font-medium">{rollData.spreadOptions.shortOption.delta?.toFixed(3) || 'N/A'}</p>
									</div>
									<div>
										<p class="text-sm text-gray-600">Bid/Ask</p>
										<div class="flex items-center gap-2">
											<p class="font-medium">
												{formatCurrency(rollData.spreadOptions.shortOption.bid || 0)} / {formatCurrency(rollData.spreadOptions.shortOption.ask || 0)}
												{#if rollData.spreadOptions.shortOption.last}
													<span class="text-xs text-gray-500 ml-2">(Last: {formatCurrency(rollData.spreadOptions.shortOption.last)})</span>
												{/if}
											</p>
											{#if rollOptionQuotes[rollData.spreadOptions.shortOption.symbol] && streamingEnabled}
												<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
											{/if}
										</div>
									</div>
									<div>
										<p class="text-sm text-gray-600">Expiration</p>
										<p class="font-medium">{formatDate(rollData.spreadOptions.shortExpiration)} ({rollData.spreadOptions.shortOption.daysUntil} days)</p>
									</div>
								</div>
							</div>

							<!-- Long Option -->
							<div class="border border-gray-200 rounded-lg p-4">
								<h3 class="text-lg font-semibold text-gray-900 mb-3">Long Leg (Buy)</h3>
								<div class="space-y-2">
									<div>
										<p class="text-sm text-gray-600">Symbol</p>
										<p class="font-medium">{rollData.spreadOptions.longOption.symbol || 'N/A'}</p>
									</div>
									<div>
										<p class="text-sm text-gray-600">Strike</p>
										<p class="font-medium">{formatCurrency(rollData.spreadOptions.longOption.strike || 0)}</p>
									</div>
									<div>
										<p class="text-sm text-gray-600">Delta</p>
										<p class="font-medium">{rollData.spreadOptions.longOption.delta?.toFixed(3) || 'N/A'}</p>
									</div>
									<div>
										<p class="text-sm text-gray-600">Bid/Ask</p>
										<div class="flex items-center gap-2">
											<p class="font-medium">
												{formatCurrency(rollData.spreadOptions.longOption.bid || 0)} / {formatCurrency(rollData.spreadOptions.longOption.ask || 0)}
												{#if rollData.spreadOptions.longOption.last}
													<span class="text-xs text-gray-500 ml-2">(Last: {formatCurrency(rollData.spreadOptions.longOption.last)})</span>
												{/if}
											</p>
											{#if rollOptionQuotes[rollData.spreadOptions.longOption.symbol] && streamingEnabled}
												<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
											{/if}
										</div>
									</div>
									<div>
										<p class="text-sm text-gray-600">Expiration</p>
										<p class="font-medium">{formatDate(rollData.spreadOptions.longExpiration)} ({rollData.spreadOptions.longOption.daysUntil} days)</p>
									</div>
								</div>
							</div>
						</div>

						{#if rollData.spreadOptions.shortOption.ask && rollData.spreadOptions.longOption.bid}
							<div class="mt-4 p-4 bg-gray-50 rounded-lg">
								<p class="text-sm text-gray-600">Estimated Net Cost (per spread)</p>
								<p class="text-xl font-bold text-gray-900">
									{formatCurrency((rollData.spreadOptions.longOption.ask || 0) - (rollData.spreadOptions.shortOption.bid || 0))}
								</p>
								<p class="text-xs text-gray-500 mt-1">
									(Buy long at {formatCurrency(rollData.spreadOptions.longOption.ask || 0)} - Sell short at {formatCurrency(rollData.spreadOptions.shortOption.bid || 0)})
								</p>
							</div>
						{/if}
					{/if}
				</div>
			{/each}
		{/if}

		<!-- Account Orders -->
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>

			{#if loading && orders.length === 0}
				<p class="text-gray-600">Loading orders...</p>
			{:else if orders.length === 0}
				<p class="text-gray-600">No orders found</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Side</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Fill Price</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exec Qty</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each orders as order}
								<tr>
									<td class="px-4 py-3 text-sm font-medium text-gray-900">{order.id || 'N/A'}</td>
									<td class="px-4 py-3 text-sm font-medium text-gray-900">{order.symbol || 'N/A'}</td>
									<td class="px-4 py-3 text-sm text-gray-600">
										<span class="px-2 py-1 text-xs font-semibold rounded {
											order.side?.includes('buy') ? 'bg-green-100 text-green-800' : 
											order.side?.includes('sell') ? 'bg-red-100 text-red-800' : 
											'bg-gray-100 text-gray-800'
										}">
											{order.side || 'N/A'}
										</span>
									</td>
									<td class="px-4 py-3 text-sm text-gray-600">{order.quantity || 'N/A'}</td>
									<td class="px-4 py-3 text-sm text-gray-600">{order.type || 'N/A'}</td>
									<td class="px-4 py-3 text-sm">
										<span class="px-2 py-1 text-xs font-semibold rounded {
											order.status === 'filled' ? 'bg-green-100 text-green-800' :
											order.status === 'open' || order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
											order.status === 'canceled' || order.status === 'rejected' ? 'bg-red-100 text-red-800' :
											'bg-gray-100 text-gray-800'
										}">
											{order.status || 'N/A'}
										</span>
									</td>
									<td class="px-4 py-3 text-sm text-gray-600">{order.avg_fill_price ? formatCurrency(order.avg_fill_price) : 'N/A'}</td>
									<td class="px-4 py-3 text-sm text-gray-600">{order.exec_quantity || '0'}</td>
									<td class="px-4 py-3 text-sm text-gray-600">{formatDateTime(order.create_date)}</td>
									<td class="px-4 py-3 text-sm">
										{#if order.status === 'open' || order.status === 'pending' || order.status === 'partially_filled'}
											<button
												onclick={() => cancelOrder(order.id)}
												disabled={loading || status !== 'idle'}
												class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
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

		<!-- Trading Controls -->
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 class="text-xl font-semibold text-gray-900 mb-4">Trading Controls</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				<div>
					<label for="symbol" class="block text-sm font-medium text-gray-700 mb-2">
						Underlying Symbol
					</label>
					<select
						id="symbol"
						bind:value={selectedSymbol}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div class="flex flex-wrap gap-4">
				<button
					onclick={findSpread}
					disabled={loading || status === 'finding'}
					class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-semibold"
				>
					{status === 'finding' ? 'Finding...' : '🔍 Find Spread'}
				</button>

				<button
					onclick={previewSpread}
					disabled={loading || status === 'previewing' || !spreadOptions}
					class="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 font-semibold"
				>
					{status === 'previewing' ? 'Previewing...' : '👁️ Preview Order'}
				</button>

				<button
					onclick={buySpread}
					disabled={loading || status === 'buying' || !spreadOptions}
					class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-semibold"
				>
					{status === 'buying' ? 'Buying...' : '💰 Buy Spread'}
				</button>

				<button
					onclick={rollSpread}
					disabled={loading || status === 'rolling' || positions.length === 0}
					class="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 font-semibold"
				>
					{status === 'rolling' ? 'Rolling...' : '🔄 Roll Spread'}
				</button>
			</div>
		</div>

		<!-- Spread Options Display -->
		{#if spreadOptions}
			<div class="bg-white rounded-lg shadow-md p-6 mb-6">
				<div class="flex items-center gap-3 mb-4">
					<h2 class="text-xl font-semibold text-gray-900">Available Spread Options</h2>
					{#if streamingEnabled && (spreadOptionQuotes[spreadOptions.shortOption?.symbol] || spreadOptionQuotes[spreadOptions.longOption?.symbol])}
						<span class="flex items-center gap-2 text-sm text-green-600">
							<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
							<span>Live Prices</span>
						</span>
					{/if}
				</div>
				
				{#if currentPrice > 0}
					<div class="mb-4">
						<p class="text-sm text-gray-600">Current {symbol} Price</p>
						<p class="text-2xl font-bold text-gray-900">{formatCurrency(currentPrice)}</p>
					</div>
				{/if}

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Short Option -->
					<div class="border border-gray-200 rounded-lg p-4">
						<h3 class="text-lg font-semibold text-gray-900 mb-3">Short Leg (Sell)</h3>
						<div class="space-y-2">
							<div>
								<p class="text-sm text-gray-600">Symbol</p>
								<p class="font-medium">{spreadOptions.shortOption.symbol || 'N/A'}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Strike</p>
								<p class="font-medium">{formatCurrency(spreadOptions.shortOption.strike || 0)}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Delta</p>
								<p class="font-medium">{spreadOptions.shortOption.delta?.toFixed(3) || 'N/A'}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Bid/Ask</p>
								<div class="flex items-center gap-2">
									<p class="font-medium">
										{formatCurrency(spreadOptions.shortOption.bid || 0)} / {formatCurrency(spreadOptions.shortOption.ask || 0)}
										{#if spreadOptions.shortOption.last}
											<span class="text-xs text-gray-500 ml-2">(Last: {formatCurrency(spreadOptions.shortOption.last)})</span>
										{/if}
									</p>
									{#if spreadOptionQuotes[spreadOptions.shortOption.symbol] && streamingEnabled}
										<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
									{/if}
								</div>
							</div>
							<div>
								<p class="text-sm text-gray-600">Expiration</p>
								<p class="font-medium">{formatDate(spreadOptions.shortExpiration)} ({spreadOptions.shortOption.daysUntil} days)</p>
							</div>
						</div>
					</div>

					<!-- Long Option -->
					<div class="border border-gray-200 rounded-lg p-4">
						<h3 class="text-lg font-semibold text-gray-900 mb-3">Long Leg (Buy)</h3>
						<div class="space-y-2">
							<div>
								<p class="text-sm text-gray-600">Symbol</p>
								<p class="font-medium">{spreadOptions.longOption.symbol || 'N/A'}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Strike</p>
								<p class="font-medium">{formatCurrency(spreadOptions.longOption.strike || 0)}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Delta</p>
								<p class="font-medium">{spreadOptions.longOption.delta?.toFixed(3) || 'N/A'}</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Bid/Ask</p>
								<div class="flex items-center gap-2">
									<p class="font-medium">
										{formatCurrency(spreadOptions.longOption.bid || 0)} / {formatCurrency(spreadOptions.longOption.ask || 0)}
										{#if spreadOptions.longOption.last}
											<span class="text-xs text-gray-500 ml-2">(Last: {formatCurrency(spreadOptions.longOption.last)})</span>
										{/if}
									</p>
									{#if spreadOptionQuotes[spreadOptions.longOption.symbol] && streamingEnabled}
										<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
									{/if}
								</div>
							</div>
							<div>
								<p class="text-sm text-gray-600">Expiration</p>
								<p class="font-medium">{formatDate(spreadOptions.longExpiration)} ({spreadOptions.longOption.daysUntil} days)</p>
							</div>
						</div>
					</div>
				</div>

				{#if spreadOptions.shortOption.ask && spreadOptions.longOption.bid}
					<div class="mt-4 p-4 bg-gray-50 rounded-lg">
						<p class="text-sm text-gray-600">Estimated Net Cost (per spread)</p>
						<p class="text-xl font-bold text-gray-900">
							{formatCurrency((spreadOptions.longOption.ask || 0) - (spreadOptions.shortOption.bid || 0))}
						</p>
						<p class="text-xs text-gray-500 mt-1">
							(Buy long at {formatCurrency(spreadOptions.longOption.ask || 0)} - Sell short at {formatCurrency(spreadOptions.shortOption.bid || 0)})
						</p>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Info Section -->
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-blue-900 mb-2">ℹ️ How It Works</h3>
			<ul class="list-disc list-inside space-y-2 text-blue-800">
				<li>This app finds {(targetDelta * 100).toFixed(0)} delta {optionType} options on {symbol} with 3 and 4 day expirations</li>
				<li>A calendar spread is created by selling the short expiration and buying the long expiration</li>
				<li>Use "Roll Spread" to close existing positions and open new ones daily</li>
				<li>All trades are executed through the Tradier API</li>
				<li>Available underlyings: SPY, XSP, QQQ, DIA</li>
				<li>Delta is configurable (default: 35 delta / 0.35)</li>
				<li>You can trade both calls and puts</li>
			</ul>
		</div>
	</div>
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
								{previewData.greeks.netTheta.toFixed(2)} /day
							</p>
							<p class="text-xs text-gray-500 mt-1">
								Short: {previewData.greeks.shortTheta.toFixed(2)} | Long: {previewData.greeks.longTheta.toFixed(2)}
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
								<p class="font-semibold text-lg">{previewData.positionImpact.currentNetTheta.toFixed(2)} /day</p>
							</div>
							<div class="text-center">
								<p class="text-sm text-gray-600">Change</p>
								<p class="font-semibold text-lg {previewData.positionImpact.thetaChange >= 0 ? 'text-green-600' : 'text-red-600'}">
									{previewData.positionImpact.thetaChange >= 0 ? '+' : ''}{previewData.positionImpact.thetaChange.toFixed(2)} /day
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">New Net Theta</p>
								<p class="font-semibold text-lg">{previewData.positionImpact.newNetTheta.toFixed(2)} /day</p>
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

