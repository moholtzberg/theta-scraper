import { json, error } from '@sveltejs/kit';
import { createTradierClient } from '$lib/tradier.js';
import { 
	findCalendarSpreadOptions, 
	createCalendarSpreadOrder,
	getCurrentCalendarSpreads,
	rollCalendarSpread
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

			case 'find_spread': {
				// Find available calendar spread options
				const quotesResponse = await tradierClient.getQuotes([symbol]);
				const currentPrice = parseFloat(quotesResponse?.quotes?.quote?.last || 0);
				
				const spreadOptions = await findCalendarSpreadOptions(tradierClient, symbol, currentPrice, delta, normalizedOptionType);
				return json({ spreadOptions, currentPrice, symbol, targetDelta: delta, optionType: normalizedOptionType });
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
				// Theta is typically per day, so estimate for the short expiration period
				const shortDaysUntil = spreadOptions.shortOption.daysUntil || 3;
				const estimatedThetaProceeds = netTheta * shortDaysUntil;
				
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
					shortDaysUntil,
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

