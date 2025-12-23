import { json, error } from '@sveltejs/kit';
import { createTradierClient } from '$lib/tradier.js';
import { 
	findCalendarSpreadOptions, 
	createCalendarSpreadOrder,
	getCurrentCalendarSpreads,
	rollCalendarSpread,
	findNextDaySpreadOptions
} from '$lib/trading.js';
import { TRADIER_ACCESS_TOKEN, TRADIER_USE_SANDBOX } from '$env/static/private';

/**
 * GET - Get current positions and account info
 */
export async function GET({ url }) {
	try {
		const accessToken = TRADIER_ACCESS_TOKEN || '';
		const useSandbox = TRADIER_USE_SANDBOX === 'true'; // Default to false if not set
		
		if (!accessToken) {
			return json({ 
				error: 'Tradier API token not configured. Please set TRADIER_ACCESS_TOKEN in your .env file',
				account: null,
				positions: []
			});
		}

		const tradierClient = createTradierClient(accessToken, useSandbox);
		console.log('Using Tradier', useSandbox ? 'Sandbox' : 'Production', 'environment');
		
		// Get accounts - try user profile first, then fall back to accounts endpoint
		let accounts = null;
		let accountInfo = null;
		let accountId = null;
		
		try {
			// Try user profile endpoint first (more reliable)
			try {
				const profileResponse = await tradierClient.getUserProfile();
				console.log('Profile response:', JSON.stringify(profileResponse, null, 2));
				accounts = profileResponse?.profile?.account;
				
				if (accounts) {
					accountInfo = Array.isArray(accounts) ? accounts[0] : accounts;
					accountId = Array.isArray(accounts) ? accounts[0].account_number : accounts.account_number;
					console.log('Found account via profile:', accountId);
				} else {
					console.warn('No accounts found in profile response:', profileResponse);
				}
			} catch (profileErr) {
				console.warn('Could not fetch user profile, trying accounts endpoint:', profileErr.message);
				// Fall back to accounts endpoint
				const accountsResponse = await tradierClient.getAccounts();
				console.log('Accounts response:', JSON.stringify(accountsResponse, null, 2));
				accounts = accountsResponse?.accounts?.account;
				
				if (accounts) {
					accountInfo = Array.isArray(accounts) ? accounts[0] : accounts;
					accountId = Array.isArray(accounts) ? accounts[0].account_number : accounts.account_number;
					console.log('Found account via accounts endpoint:', accountId);
				} else {
					console.warn('No accounts found in accounts response:', accountsResponse);
				}
			}
		} catch (err) {
			// If both endpoints fail, continue with null account
			console.warn('Could not fetch accounts from any endpoint:', err.message);
			console.warn('Error details:', err);
		}
		
		// Get positions - handle gracefully if account doesn't exist or positions fail
		let positions = [];
		if (accountId) {
			try {
				positions = await getCurrentCalendarSpreads(tradierClient, accountId);
			} catch (err) {
				// If positions fail, just return empty array
				console.warn('Could not fetch positions:', err.message);
				positions = [];
			}
		}

		// Get account balances - handle gracefully if it fails
		let balances = null;
		if (accountId) {
			try {
				const balancesResponse = await tradierClient.getAccountBalances(accountId);
				balances = balancesResponse?.balances;
			} catch (err) {
				// If balances fail, just continue without balance info
				console.warn('Could not fetch account balances:', err.message);
			}
		}

		// Get account orders - handle gracefully if it fails
		let orders = [];
		if (accountId) {
			try {
				const ordersResponse = await tradierClient.getOrders(accountId, { limit: 100 });
				let ordersData = ordersResponse?.orders?.order;
				// Handle single order (object) vs multiple orders (array)
				if (!ordersData) {
					orders = [];
				} else if (Array.isArray(ordersData)) {
					orders = ordersData;
				} else {
					orders = [ordersData];
				}
			} catch (err) {
				// If orders fail, just continue without orders
				console.warn('Could not fetch account orders:', err.message);
			}
		}

		return json({
			account: accountInfo,
			balances: balances,
			positions: Array.isArray(positions) ? positions : (positions ? [positions] : []),
			orders: orders,
			...(accountInfo ? {} : { 
				warning: 'No accounts found. Please check your Tradier API credentials and account setup.' 
			})
		});
	} catch (err) {
		console.error('Error fetching trading data:', err);
		return json({
			error: err.message || 'Failed to fetch trading data',
			account: null,
			positions: []
		});
	}
}

/**
 * POST - Execute trading actions
 */
export async function POST({ request }) {
	try {
		const accessToken = TRADIER_ACCESS_TOKEN || '';
		const useSandbox = TRADIER_USE_SANDBOX === 'true'; // Default to false if not set
		
		if (!accessToken) {
			return error(500, 'Tradier API token not configured. Please set TRADIER_ACCESS_TOKEN in your .env file');
		}

		const body = await request.json();
		const { action, quantity = 1, symbol = 'SPY', targetDelta = 0.35, optionType = 'call', preview = false } = body;

		// Validate symbol
		const validSymbols = ['SPY', 'XSP', 'QQQ', 'DIA'];
		if (!validSymbols.includes(symbol)) {
			return error(400, `Invalid symbol. Must be one of: ${validSymbols.join(', ')}`);
		}

		// Validate targetDelta (should be between 0 and 1)
		const delta = parseFloat(targetDelta);
		if (isNaN(delta) || delta <= 0 || delta >= 1) {
			return error(400, 'Invalid targetDelta. Must be a number between 0 and 1 (e.g., 0.35 for 35 delta)');
		}

		// Validate optionType
		const validOptionTypes = ['call', 'put'];
		if (!validOptionTypes.includes(optionType.toLowerCase())) {
			return error(400, `Invalid optionType. Must be one of: ${validOptionTypes.join(', ')}`);
		}

		const normalizedOptionType = optionType.toLowerCase();

		const tradierClient = createTradierClient(accessToken, useSandbox);
		
		// Get account - try user profile first, then fall back to accounts endpoint
		let accountId = null;
		try {
			// Try user profile endpoint first (more reliable)
			let accounts = null;
			try {
				const profileResponse = await tradierClient.getUserProfile();
				accounts = profileResponse?.profile?.account;
			} catch (profileErr) {
				// Fall back to accounts endpoint
				const accountsResponse = await tradierClient.getAccounts();
				accounts = accountsResponse?.accounts?.account;
			}
			
			if (accounts) {
				accountId = Array.isArray(accounts) ? accounts[0].account_number : accounts.account_number;
			} else {
				return error(500, 'No accounts found. Please check your Tradier API credentials and account setup.');
			}
		} catch (err) {
			return error(500, `Failed to fetch accounts: ${err.message}`);
		}

		switch (action) {
			case 'create_streaming_session': {
				// Create a streaming session for WebSocket connections
				const sessionResponse = await tradierClient.createStreamingSession();
				return json({ 
					sessionId: sessionResponse.stream?.sessionid,
					url: sessionResponse.stream?.url,
					expires: sessionResponse.stream?.expires
				});
			}

			case 'get_position_greeks': {
				// Get greeks for multiple position symbols
				const { symbols } = body;
				if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
					return json({ greeks: {} });
				}

				try {
					// Fetch quotes with greeks for all symbols
					const quotesResponse = await tradierClient.getQuotes(symbols, { greeks: true });
					const quotes = quotesResponse?.quotes?.quote;
					
					if (!quotes) {
						return json({ greeks: {} });
					}

					// Build greeks map
					const greeksMap = {};
					const quoteList = Array.isArray(quotes) ? quotes : [quotes];
					
					for (const quote of quoteList) {
						if (quote.symbol && quote.greeks) {
							greeksMap[quote.symbol] = {
								delta: parseFloat(quote.greeks.delta || 0),
								theta: parseFloat(quote.greeks.theta || 0),
								gamma: parseFloat(quote.greeks.gamma || 0),
								vega: parseFloat(quote.greeks.vega || 0),
								bid: parseFloat(quote.bid || 0),
								ask: parseFloat(quote.ask || 0),
								last: parseFloat(quote.last || 0)
							};
						}
					}

					return json({ greeks: greeksMap });
				} catch (err) {
					console.error('Error fetching position greeks:', err);
					return json({ error: err.message, greeks: {} });
				}
			}

			case 'get_position_quotes': {
				// Get quotes for multiple position symbols (without greeks, faster)
				const { symbols } = body;
				if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
					return json({ quotes: [] });
				}

				try {
					// Fetch quotes for all symbols
					const quotesResponse = await tradierClient.getQuotes(symbols);
					const quotes = quotesResponse?.quotes?.quote;
					
					if (!quotes) {
						return json({ quotes: [] });
					}

					const quoteList = Array.isArray(quotes) ? quotes : [quotes];
					return json({ quotes: quoteList });
				} catch (err) {
					console.error('Error fetching position quotes:', err);
					return json({ error: err.message, quotes: [] });
				}
			}

			case 'find_spread': {
				// Find available calendar spread options
				const quotesResponse = await tradierClient.getQuotes([symbol]);
				const currentPrice = parseFloat(quotesResponse?.quotes?.quote?.last || 0);
				
				const spreadOptions = await findCalendarSpreadOptions(tradierClient, symbol, currentPrice, delta, normalizedOptionType);
				
				// Find next day spread to estimate tomorrow's value
				const strike = parseFloat(spreadOptions.shortOption.strike || 0);
				const nextDaySpread = await findNextDaySpreadOptions(
					tradierClient, 
					symbol, 
					currentPrice, 
					strike, 
					normalizedOptionType,
					spreadOptions.shortExpiration,
					spreadOptions.longExpiration
				);
				
				// Calculate current spread value and next day spread value
				// For opening: Net debit = Long ask - Short bid (what you pay to open)
				// For closing: Net credit = Short ask - Long bid (what you receive to close)
				// Tomorrow's value estimate: What a 2/4 spread trades for today (as a proxy)
				let currentSpreadCost = null;
				let nextDaySpreadCost = null;
				let estimatedTomorrowValue = null;
				let estimatedOvernightGain = null;
				
				if (spreadOptions.shortOption.bid && spreadOptions.longOption.ask) {
					// Current spread cost to open: Buy long at ask, Sell short at bid
					currentSpreadCost = (spreadOptions.longOption.ask - spreadOptions.shortOption.bid) * 100;
					// Current spread value if closing: Sell long at bid, Buy short at ask
					// But we'll use the next day spread cost as proxy for tomorrow's value
				}
				
				if (nextDaySpread && nextDaySpread.shortOption.bid && nextDaySpread.longOption.ask) {
					// Next day spread cost (what a 2/4 trades for today): Buy long at ask, Sell short at bid
					nextDaySpreadCost = (nextDaySpread.longOption.ask - nextDaySpread.shortOption.bid) * 100;
					// This represents what your spread might be worth tomorrow (as a 2/4 spread)
					// To close tomorrow: Sell long at bid, Buy short at ask
					// Estimated closing value = Short ask - Long bid
					// But we'll use the spread cost as a proxy (market makers' view)
					estimatedTomorrowValue = nextDaySpreadCost;
					
					if (currentSpreadCost !== null) {
						// Gain = Tomorrow's value - Today's cost
						estimatedOvernightGain = nextDaySpreadCost - currentSpreadCost;
					}
				}
				
				return json({ 
					spreadOptions, 
					currentPrice, 
					symbol, 
					targetDelta: delta, 
					optionType: normalizedOptionType,
					nextDaySpread,
					currentSpreadCost,
					nextDaySpreadCost,
					estimatedTomorrowValue,
					estimatedOvernightGain
				});
			}

			case 'buy_spread': {
				// Find and buy a calendar spread
				const quotesResponse = await tradierClient.getQuotes([symbol]);
				const currentPrice = parseFloat(quotesResponse?.quotes?.quote?.last || 0);
				
				const spreadOptions = await findCalendarSpreadOptions(tradierClient, symbol, currentPrice, delta, normalizedOptionType);
				const order = await createCalendarSpreadOrder(tradierClient, accountId, symbol, spreadOptions, quantity, delta, normalizedOptionType, preview);
				
				return json({ 
					order, 
					spreadOptions,
					symbol,
					targetDelta: delta,
					optionType: normalizedOptionType,
					preview: preview,
					message: preview ? 'Order preview generated' : 'Calendar spread order placed'
				});
			}

			case 'preview_spread': {
				// Preview a calendar spread order
				const quotesResponse = await tradierClient.getQuotes([symbol]);
				const currentPrice = parseFloat(quotesResponse?.quotes?.quote?.last || 0);
				
				const spreadOptions = await findCalendarSpreadOptions(tradierClient, symbol, currentPrice, delta, normalizedOptionType);
				const preview = await createCalendarSpreadOrder(tradierClient, accountId, symbol, spreadOptions, quantity, delta, normalizedOptionType, true);
				
				// Get account balances for buying power calculation
				let balances = null;
				try {
					const balancesResponse = await tradierClient.getAccountBalances(accountId);
					balances = balancesResponse?.balances;
				} catch (err) {
					console.warn('Could not fetch account balances for preview:', err.message);
				}
				
				// Calculate net greeks and position impact
				const shortDelta = parseFloat(spreadOptions.shortOption.greeks?.delta || 0);
				const longDelta = parseFloat(spreadOptions.longOption.greeks?.delta || 0);
				const shortTheta = parseFloat(spreadOptions.shortOption.greeks?.theta || 0);
				const longTheta = parseFloat(spreadOptions.longOption.greeks?.theta || 0);
				
				// For calendar spread: SELL short (negative quantity), BUY long (positive quantity)
				// Tradier reports theta as negative for long positions (time decay)
				// When we SELL short: theta contribution = -shortTheta (positive, we collect decay)
				// When we BUY long: theta contribution = longTheta (negative, we pay decay)
				// Net delta = (long delta * quantity) - (short delta * quantity)
				// Net theta = (-shortTheta + longTheta) * quantity = (longTheta - shortTheta) * quantity
				const netDelta = (longDelta - shortDelta) * quantity;
				const netTheta = (longTheta - shortTheta) * quantity;
				
				// Get current positions for the same underlying
				let currentPositions = [];
				try {
					currentPositions = await getCurrentCalendarSpreads(tradierClient, accountId, symbol);
				} catch (err) {
					console.warn('Could not fetch current positions for preview:', err.message);
				}
				
				// Calculate current position greeks
				let currentNetDelta = 0;
				let currentNetTheta = 0;
				for (const pos of currentPositions) {
					const posQuantity = parseFloat(pos.quantity || 0);
					// Try to get greeks from position data or fetch quotes with greeks
					try {
						const posQuotes = await tradierClient.getQuotes([pos.symbol], { greeks: true });
						const quote = Array.isArray(posQuotes?.quotes?.quote) 
							? posQuotes.quotes.quote[0] 
							: posQuotes?.quotes?.quote;
						if (quote?.greeks) {
							const posDelta = parseFloat(quote.greeks.delta || 0);
							const posTheta = parseFloat(quote.greeks.theta || 0);
							currentNetDelta += posDelta * posQuantity;
							currentNetTheta += posTheta * posQuantity;
						}
					} catch (err) {
						console.warn(`Could not get greeks for position ${pos.symbol}:`, err.message);
					}
				}
				
				// Calculate new position greeks after adding this spread
				const newNetDelta = currentNetDelta + netDelta;
				const newNetTheta = currentNetTheta + netTheta;
				
				// Estimate net proceeds based on theta
				// Theta from Tradier is per contract per day (in dollars)
				// netTheta already includes quantity multiplier
				const shortDaysUntil = spreadOptions.shortOption.daysUntil || 3;
				
				// Calculate buying power effect and max loss
				// For calendar spreads: net debit = cost of long option - premium from short option
				const shortBid = parseFloat(spreadOptions.shortOption.bid || 0);
				const longAsk = parseFloat(spreadOptions.longOption.ask || 0);
				const netDebit = (longAsk - shortBid) * quantity * 100; // Options are per 100 shares
				
				// Buying power effect: net debit reduces buying power
				const buyingPowerEffect = -netDebit;
				
				// Max loss for calendar spread: net debit paid (if both expire worthless)
				// This is the maximum loss scenario
				const maxLoss = netDebit;
				
				// Get current buying power from balances
				let currentBuyingPower = null;
				let newBuyingPower = null;
				if (balances?.margin?.option_buying_power !== undefined) {
					currentBuyingPower = parseFloat(balances.margin.option_buying_power || 0);
					newBuyingPower = currentBuyingPower + buyingPowerEffect;
				}
				
				// Calculate estimated theta revenue
				// netTheta is already multiplied by quantity, and Tradier theta is per contract per day in dollars
				// So: netTheta (total $/day) * days = total theta revenue
				const estimatedThetaRevenue = netTheta * shortDaysUntil;
				
				return json({ 
					preview, 
					spreadOptions,
					symbol,
					targetDelta: delta,
					optionType: normalizedOptionType,
					greeks: {
						netDelta,
						netTheta,
						shortDelta,
						longDelta,
						shortTheta,
						longTheta
					},
					positionImpact: {
						currentNetDelta,
						currentNetTheta,
						newNetDelta,
						newNetTheta,
						deltaChange: netDelta,
						thetaChange: netTheta
					},
					estimatedThetaProceeds,
					estimatedThetaRevenue,
					shortDaysUntil,
					buyingPower: {
						current: currentBuyingPower,
						effect: buyingPowerEffect,
						new: newBuyingPower
					},
					maxLoss,
					netDebit,
					message: 'Order preview generated'
				});
			}

			case 'roll_spread': {
				// Roll existing spread
				const positions = await getCurrentCalendarSpreads(tradierClient, accountId, symbol);
				const result = await rollCalendarSpread(tradierClient, accountId, symbol, positions, quantity, delta, normalizedOptionType);
				
				return json({ 
					result,
					symbol,
					targetDelta: delta,
					optionType: normalizedOptionType,
					message: 'Spread rolled successfully'
				});
			}

			case 'change_order': {
				// Change/modify an existing order
				const { orderId, changes } = body;
				if (!orderId) {
					return error(400, 'Order ID is required');
				}
				if (!changes || Object.keys(changes).length === 0) {
					return error(400, 'At least one change parameter is required');
				}
				
				const result = await tradierClient.changeOrder(accountId, orderId, changes);
				return json({ 
					order: result.order,
					message: 'Order modified successfully'
				});
			}

			case 'cancel_order': {
				// Cancel an existing order
				const { orderId } = body;
				if (!orderId) {
					return error(400, 'Order ID is required');
				}
				
				const result = await tradierClient.cancelOrder(accountId, orderId);
				return json({ 
					order: result.order,
					message: 'Order canceled successfully'
				});
			}

			default:
				return error(400, `Unknown action: ${action}`);
		}
	} catch (err) {
		console.error('Error executing trading action:', err);
		return error(500, err.message || 'Failed to execute trading action');
	}
}

