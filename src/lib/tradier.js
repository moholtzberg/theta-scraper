/**
 * Tradier API Service
 * Handles all interactions with the Tradier API
 */

const TRADIER_BASE_URL = 'https://api.tradier.com';
const TRADIER_SANDBOX_URL = 'https://sandbox.tradier.com';
const TRADIER_STREAM_URL = 'https://stream.tradier.com';
const TRADIER_WS_URL = 'wss://ws.tradier.com/v1/markets/events';
const TRADIER_WS_ACCOUNTS_URL = 'wss://ws.tradier.com/v1/accounts/events';
const TRADIER_WS_SANDBOX_URL = 'wss://sandbox-ws.tradier.com/v1/accounts/events';

/**
 * Get Tradier API client
 * @param {string} accessToken - Tradier API access token
 * @param {boolean} useSandbox - Whether to use sandbox environment
 * @returns {Object} API client with methods
 */
export function createTradierClient(accessToken, useSandbox = false) {
	const baseUrl = useSandbox ? TRADIER_SANDBOX_URL : TRADIER_BASE_URL;
	
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Accept': 'application/json'
	};

	/**
	 * Helper function to handle API responses with proper error handling
	 */
	async function handleResponse(response) {
		if (!response.ok) {
			const text = await response.text();
			let errorMessage = `API Error: ${response.status} ${response.statusText}`;
			try {
				const json = JSON.parse(text);
				errorMessage = json.error || json.message || json.fault?.faultstring || errorMessage;
				// Add more context for 404 errors
				if (response.status === 404) {
					errorMessage = `Resource not found (404). ${errorMessage}. This may indicate: missing account, invalid endpoint, or insufficient API permissions.`;
				}
			} catch {
				// If not JSON, use the text as error message
				errorMessage = text || errorMessage;
			}
			const error = new Error(errorMessage);
			error.status = response.status;
			throw error;
		}
		
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			return response.json();
		} else {
			const text = await response.text();
			throw new Error(`Expected JSON response but got: ${contentType || 'unknown'}`);
		}
	}

	return {
		/**
		 * Create a streaming session for market data
		 * Session is valid for 5 minutes (expires field in response)
		 * @returns {Promise<object>} Response containing:
		 *   - stream.url: WebSocket URL for streaming
		 *   - stream.sessionid: Session ID (required for streaming)
		 *   - stream.expires: Expiration time of the session
		 */
		async createStreamingSession() {
			const response = await fetch(`${baseUrl}/v1/markets/events/session`, {
				method: 'POST',
				headers: {
					...headers,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			return handleResponse(response);
		},

		/**
		 * Create a streaming session for account events (Beta)
		 * Session is valid for 5 minutes (expires field in response)
		 * Note: This API is in Beta and only available to Tradier Brokerage account holders
		 * @returns {Promise<object>} Response containing:
		 *   - stream.url: WebSocket URL for account events streaming
		 *   - stream.sessionid: Session ID (required for account events streaming)
		 *   - stream.expires: Expiration time of the session
		 */
		async createAccountStreamingSession() {
			const response = await fetch(`${baseUrl}/v1/accounts/events/session`, {
				method: 'POST',
				headers: {
					...headers,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			return handleResponse(response);
		},

		/**
		 * Get user profile information (includes accounts)
		 */
		async getUserProfile() {
			const response = await fetch(`${baseUrl}/v1/user/profile`, {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Get account information
		 */
		async getAccounts() {
			const response = await fetch(`${baseUrl}/v1/accounts`, {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Get account positions
		 */
		async getPositions(accountId) {
			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/positions`, {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Get account balances
		 */
		async getAccountBalances(accountId) {
			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/balances`, {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Get account orders
		 * @param {string} accountId - Account ID
		 * @param {object} options - Optional parameters
		 * @param {number} options.page - Page number (default: 1)
		 * @param {number} options.limit - Number of orders to return (default: 25)
		 * @param {boolean} options.includeTags - Include user-defined tags (default: false)
		 */
		async getOrders(accountId, options = {}) {
			const { page = 1, limit = 25, includeTags = false } = options;
			const url = new URL(`${baseUrl}/v1/accounts/${accountId}/orders`);
			url.searchParams.set('page', page.toString());
			url.searchParams.set('limit', limit.toString());
			if (includeTags) {
				url.searchParams.set('includeTags', 'true');
			}
			
			const response = await fetch(url.toString(), {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Get options chain for a symbol and expiration date
		 * Greek and IV data is included courtesy of ORATS when greeks=true
		 * @param {string} symbol - The underlying security symbol
		 * @param {string} expiration - The expiration date (YYYY-MM-DD format)
		 * @param {object} options - Optional parameters
		 * @param {boolean} options.greeks - Include greek calculations (default: false)
		 */
		async getOptionsChain(symbol, expiration, options = {}) {
			const { greeks = false } = options;
			const url = new URL(`${baseUrl}/v1/markets/options/chains`);
			url.searchParams.set('symbol', symbol);
			url.searchParams.set('expiration', expiration);
			
			if (greeks) {
				url.searchParams.set('greeks', 'true');
			}
			
			const response = await fetch(url.toString(), {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Get option expirations for a symbol
		 * @param {string} symbol - The underlying security symbol
		 * @param {object} options - Optional parameters
		 * @param {boolean|string} options.includeAllRoots - Include all roots (default: false)
		 */
		async getOptionExpirations(symbol, options = {}) {
			const { includeAllRoots = false } = options;
			const url = new URL(`${baseUrl}/v1/markets/options/expirations`);
			url.searchParams.set('symbol', symbol);
			
			// Handle includeAllRoots parameter (can be boolean or string 'true'/'false')
			if (includeAllRoots !== false && includeAllRoots !== 'false') {
				url.searchParams.set('includeAllRoots', includeAllRoots === true || includeAllRoots === 'true' ? 'true' : 'false');
			}
			
			const response = await fetch(url.toString(), {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Get available strike prices for a symbol and expiration date
		 * @param {string} symbol - The underlying security symbol
		 * @param {string} expiration - The expiration date (YYYY-MM-DD format)
		 * @returns {Promise<object>} Response containing strikes.strike array of floats
		 */
		async getOptionStrikes(symbol, expiration) {
			const url = new URL(`${baseUrl}/v1/markets/options/strikes`);
			url.searchParams.set('symbol', symbol);
			url.searchParams.set('expiration', expiration);
			
			const response = await fetch(url.toString(), {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Lookup option symbols
		 * Converts option parameters (underlying, expiration, strike, type) to OCC option symbol
		 * @param {object} params - Lookup parameters
		 * @param {string} params.underlying - The underlying security symbol
		 * @param {string} params.expiration - The expiration date (YYYY-MM-DD format)
		 * @param {number} params.strike - The strike price
		 * @param {string} params.optionType - Option type: 'call' or 'put'
		 * @returns {Promise<object>} Response containing option symbol information
		 */
		async lookupOptionSymbol(params) {
			const { underlying, expiration, strike, optionType } = params;
			const url = new URL(`${baseUrl}/v1/markets/options/lookup`);
			
			if (underlying) url.searchParams.set('underlying', underlying);
			if (expiration) url.searchParams.set('expiration', expiration);
			if (strike !== undefined) url.searchParams.set('strike', strike.toString());
			if (optionType) url.searchParams.set('option_type', optionType.toLowerCase());
			
			const response = await fetch(url.toString(), {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Get quotes for symbols (GET request - for smaller lists)
		 * @param {string|Array} symbols - Single symbol string or array of symbols (comma-separated)
		 * @param {object} options - Optional parameters
		 * @param {boolean} options.greeks - Include greek calculations for options (default: false)
		 * @param {boolean} options.includeLotSize - Include lot size information (default: false)
		 */
		async getQuotes(symbols, options = {}) {
			const { greeks = false, includeLotSize = false } = options;
			const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
			const url = new URL(`${baseUrl}/v1/markets/quotes`);
			url.searchParams.set('symbols', symbolsParam);
			
			if (greeks) {
				url.searchParams.set('greeks', 'true');
			}
			if (includeLotSize) {
				url.searchParams.set('includeLotSize', 'true');
			}
			
			const response = await fetch(url.toString(), {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Post quotes for symbols (POST request - for larger lists)
		 * Use this method when you have a large number of symbols that might exceed URL length limits
		 * @param {string|Array} symbols - Single symbol string or array of symbols (comma-separated)
		 * @param {object} options - Optional parameters
		 * @param {boolean} options.greeks - Include greek calculations for options (default: false)
		 * @param {boolean} options.includeLotSize - Include lot size information (default: false)
		 */
		async postQuotes(symbols, options = {}) {
			const { greeks = false, includeLotSize = false } = options;
			const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
			
			const formData = new URLSearchParams();
			formData.append('symbols', symbolsParam);
			
			if (greeks) {
				formData.append('greeks', 'true');
			}
			if (includeLotSize) {
				formData.append('includeLotSize', 'true');
			}
			
			const response = await fetch(`${baseUrl}/v1/markets/quotes`, {
				method: 'POST',
				headers: {
					...headers,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData.toString()
			});
			return handleResponse(response);
		},

		/**
		 * Place an order (equity, option, or fractional)
		 * @param {string} accountId - Account ID
		 * @param {object} orderData - Order data
		 * @param {string} orderData.class - Order class: 'equity', 'option', or 'fractional'
		 * @param {string} orderData.symbol - Security symbol
		 * @param {string} orderData.option_symbol - Option symbol (required for option orders)
		 * @param {string} orderData.side - Order side
		 * @param {number} orderData.quantity - Order quantity
		 * @param {string} orderData.type - Order type: 'market', 'limit', 'stop', 'stop_limit'
		 * @param {string} orderData.duration - Order duration: 'day', 'gtc', 'pre', 'post'
		 * @param {number} orderData.price - Limit price (for limit/stop_limit orders)
		 * @param {number} orderData.stop - Stop price (for stop/stop_limit orders)
		 * @param {string} orderData.tag - User-defined tag
		 * @param {boolean} preview - Whether to preview the order (default: false)
		 */
		async placeOrder(accountId, orderData, preview = false) {
			const formData = new URLSearchParams();
			const orderClass = orderData.class || 'option';
			formData.append('class', orderClass);
			formData.append('symbol', orderData.symbol);
			
			// Only include option_symbol for option orders
			if (orderClass === 'option' && orderData.option_symbol) {
				formData.append('option_symbol', orderData.option_symbol);
			}
			
			formData.append('side', orderData.side);
			formData.append('quantity', orderData.quantity.toString());
			formData.append('type', orderData.type || 'market');
			formData.append('duration', orderData.duration || 'day');
			
			if (orderData.price !== undefined) formData.append('price', orderData.price.toString());
			if (orderData.stop !== undefined) formData.append('stop', orderData.stop.toString());
			if (orderData.tag) formData.append('tag', orderData.tag);
			if (preview) formData.append('preview', 'true');

			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/orders`, {
				method: 'POST',
				headers: {
					...headers,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData.toString()
			});
			return handleResponse(response);
		},

		/**
		 * Place a multi-leg option order (spread)
		 * @param {string} accountId - Account ID
		 * @param {object} spreadData - Spread order data
		 * @param {boolean} preview - Whether to preview the order (default: false)
		 */
		async placeSpreadOrder(accountId, spreadData, preview = false) {
			const formData = new URLSearchParams();
			formData.append('class', 'multileg');
			formData.append('symbol', spreadData.symbol);
			formData.append('type', spreadData.type || 'market');
			formData.append('duration', spreadData.duration || 'day'); // 'day' or 'gtc'
			if (spreadData.price) formData.append('price', spreadData.price.toString());
			
			// Add legs
			spreadData.legs.forEach((leg, index) => {
				formData.append(`option_symbol[${index}]`, leg.option_symbol);
				formData.append(`side[${index}]`, leg.side);
				formData.append(`quantity[${index}]`, leg.quantity.toString());
			});

			if (spreadData.tag) formData.append('tag', spreadData.tag);
			if (preview) formData.append('preview', 'true');

			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/orders`, {
				method: 'POST',
				headers: {
					...headers,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData.toString()
			});
			return handleResponse(response);
		},

		/**
		 * Place a combo order (equity + option, optionally with second option leg)
		 * Combo orders consist of one equity leg and one option leg, with optional second option leg
		 * @param {string} accountId - Account ID
		 * @param {object} comboData - Combo order data
		 * @param {string} comboData.symbol - Underlying symbol
		 * @param {Array} comboData.legs - Array of leg objects (1 equity + 1-2 options)
		 * @param {object} comboData.legs[].side - Order side
		 * @param {number} comboData.legs[].quantity - Quantity
		 * @param {string} comboData.legs[].option_symbol - Option symbol (null for equity leg)
		 * @param {boolean} preview - Whether to preview the order (default: false)
		 */
		async placeComboOrder(accountId, comboData, preview = false) {
			const formData = new URLSearchParams();
			formData.append('class', 'combo');
			formData.append('symbol', comboData.symbol);
			formData.append('type', comboData.type || 'market');
			formData.append('duration', comboData.duration || 'day');
			if (comboData.price) formData.append('price', comboData.price.toString());
			
			// Add legs - equity leg should have option_symbol set to null
			comboData.legs.forEach((leg, index) => {
				formData.append(`side[${index}]`, leg.side);
				formData.append(`quantity[${index}]`, leg.quantity.toString());
				// For equity legs, option_symbol should be null or empty
				// For option legs, provide the option_symbol
				if (leg.option_symbol) {
					formData.append(`option_symbol[${index}]`, leg.option_symbol);
				} else {
					// Equity leg - set option_symbol to null/empty
					formData.append(`option_symbol[${index}]`, '');
				}
			});

			if (comboData.tag) formData.append('tag', comboData.tag);
			if (preview) formData.append('preview', 'true');

			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/orders`, {
				method: 'POST',
				headers: {
					...headers,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData.toString()
			});
			return handleResponse(response);
		},

		/**
		 * Place an advanced order (OTO, OCO, or OTOCO)
		 * @param {string} accountId - Account ID
		 * @param {object} advancedOrderData - Advanced order data
		 * @param {string} advancedOrderData.type - 'oto', 'oco', or 'otoco'
		 * @param {Array} advancedOrderData.orders - Array of order objects (2 for OTO/OCO, 3 for OTOCO)
		 * @param {boolean} preview - Whether to preview the order (default: false)
		 */
		async placeAdvancedOrder(accountId, advancedOrderData, preview = false) {
			const { type, orders } = advancedOrderData;
			
			if (!['oto', 'oco', 'otoco'].includes(type.toLowerCase())) {
				throw new Error('Invalid advanced order type. Must be: oto, oco, or otoco');
			}

			// Validate order count
			if ((type.toLowerCase() === 'otoco' && orders.length !== 3) ||
				(type.toLowerCase() !== 'otoco' && orders.length !== 2)) {
				throw new Error(`Invalid number of orders for ${type.toUpperCase()}. Expected ${type.toLowerCase() === 'otoco' ? 3 : 2} orders.`);
			}

			const formData = new URLSearchParams();
			formData.append('class', advancedOrderData.class || 'equity');
			formData.append('type', type.toLowerCase());
			
			// Add each order with indexed parameters
			orders.forEach((order, index) => {
				formData.append(`symbol[${index}]`, order.symbol);
				formData.append(`side[${index}]`, order.side);
				formData.append(`quantity[${index}]`, order.quantity.toString());
				formData.append(`type[${index}]`, order.type || 'market');
				formData.append(`duration[${index}]`, order.duration || 'day');
				
				if (order.option_symbol) {
					formData.append(`option_symbol[${index}]`, order.option_symbol);
				}
				if (order.price) {
					formData.append(`price[${index}]`, order.price.toString());
				}
				if (order.stop) {
					formData.append(`stop[${index}]`, order.stop.toString());
				}
				if (order.tag) {
					formData.append(`tag[${index}]`, order.tag);
				}
			});

			if (preview) formData.append('preview', 'true');

			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/orders`, {
				method: 'POST',
				headers: {
					...headers,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData.toString()
			});
			return handleResponse(response);
		},

		/**
		 * Get order status
		 */
		async getOrderStatus(accountId, orderId) {
			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/orders/${orderId}`, {
				headers
			});
			return handleResponse(response);
		},

		/**
		 * Change/modify an existing order
		 * @param {string} accountId - Account ID
		 * @param {number} orderId - Order ID to modify
		 * @param {object} changes - Order changes
		 * @param {string} changes.type - New order type (market, limit, stop, stop_limit)
		 * @param {string} changes.duration - New duration (day, gtc, pre, post)
		 * @param {number} changes.price - New limit price (required for limit/stop_limit)
		 * @param {number} changes.stop - New stop price (required for stop/stop_limit)
		 * @param {string} changes.tag - User-defined tag
		 */
		async changeOrder(accountId, orderId, changes) {
			const formData = new URLSearchParams();
			
			if (changes.type) {
				const validTypes = ['market', 'limit', 'stop', 'stop_limit'];
				if (!validTypes.includes(changes.type.toLowerCase())) {
					throw new Error(`Invalid order type. Must be one of: ${validTypes.join(', ')}`);
				}
				formData.append('type', changes.type.toLowerCase());
			}
			
			if (changes.duration) {
				const validDurations = ['day', 'gtc', 'pre', 'post'];
				if (!validDurations.includes(changes.duration.toLowerCase())) {
					throw new Error(`Invalid duration. Must be one of: ${validDurations.join(', ')}`);
				}
				formData.append('duration', changes.duration.toLowerCase());
			}
			
			if (changes.price !== undefined) {
				formData.append('price', changes.price.toString());
			}
			
			if (changes.stop !== undefined) {
				formData.append('stop', changes.stop.toString());
			}
			
			if (changes.tag) {
				formData.append('tag', changes.tag);
			}

			// Validate required fields based on order type
			if (changes.type) {
				const type = changes.type.toLowerCase();
				if ((type === 'limit' || type === 'stop_limit') && changes.price === undefined) {
					throw new Error('Price is required for limit and stop_limit orders');
				}
				if ((type === 'stop' || type === 'stop_limit') && changes.stop === undefined) {
					throw new Error('Stop price is required for stop and stop_limit orders');
				}
			}

			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/orders/${orderId}`, {
				method: 'PUT',
				headers: {
					...headers,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData.toString()
			});
			return handleResponse(response);
		},

		/**
		 * Cancel an order
		 */
		async cancelOrder(accountId, orderId) {
			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/orders/${orderId}`, {
				method: 'DELETE',
				headers
			});
			return handleResponse(response);
		}
	};
}

/**
 * Calculate option delta approximation using Black-Scholes
 * This is a simplified version - in production, use a proper options pricing library
 */
export function calculateDelta(S, K, T, r, sigma, optionType = 'call') {
	const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
	
	if (optionType === 'call') {
		// Normal CDF approximation
		return normalCDF(d1);
	} else {
		// Put delta
		return normalCDF(d1) - 1;
	}
}

/**
 * Normal CDF approximation
 */
function normalCDF(x) {
	return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

/**
 * Error function approximation
 */
function erf(x) {
	const a1 =  0.254829592;
	const a2 = -0.284496736;
	const a3 =  1.421413741;
	const a4 = -1.453152027;
	const a5 =  1.061405429;
	const p  =  0.3275911;

	const sign = x < 0 ? -1 : 1;
	x = Math.abs(x);

	const t = 1.0 / (1.0 + p * x);
	const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

	return sign * y;
}

/**
 * Find options closest to target delta
 * For calls: targetDelta is positive (e.g., 0.35)
 * For puts: targetDelta is positive but we look for negative delta (e.g., -0.35)
 */
export function findOptionsByDelta(options, targetDelta, optionType = 'call') {
	if (!options || !options.options || !options.options.option) {
		return null;
	}

	const optionList = Array.isArray(options.options.option) 
		? options.options.option 
		: [options.options.option];

	// For puts, we're looking for negative delta
	// For calls, we're looking for positive delta
	const targetDeltaForType = optionType === 'put' ? -targetDelta : targetDelta;

	// Filter by option type and find closest to target delta
	const filtered = optionList
		.filter(opt => opt.option_type === optionType)
		.map(opt => {
			const delta = parseFloat(opt.greeks?.delta || 0);
			return {
				...opt,
				delta: delta,
				deltaDiff: Math.abs(delta - targetDeltaForType)
			};
		})
		.filter(opt => {
			// For calls: delta should be positive
			// For puts: delta should be negative
			if (optionType === 'call') {
				return opt.delta > 0;
			} else {
				return opt.delta < 0;
			}
		})
		.sort((a, b) => a.deltaDiff - b.deltaDiff);

	return filtered.length > 0 ? filtered[0] : null;
}

/**
 * Get trading days until expiration
 */
export function getTradingDaysUntilExpiration(expirationDate) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const exp = new Date(expirationDate);
	exp.setHours(0, 0, 0, 0);
	
	let days = 0;
	const current = new Date(today);
	
	while (current < exp) {
		const dayOfWeek = current.getDay();
		// Skip weekends
		if (dayOfWeek !== 0 && dayOfWeek !== 6) {
			days++;
		}
		current.setDate(current.getDate() + 1);
	}
	
	return days;
}

/**
 * Create a Tradier WebSocket streaming client for market data
 * @param {string} sessionId - Session ID from createStreamingSession() (required)
 * @param {object} options - Streaming options
 * @param {Array<string>} options.symbols - Array of symbols to stream (required)
 * @param {Array<string>} options.filter - Event types: 'trade', 'quote', 'summary', 'timesale', 'tradex'
 * @param {boolean} options.linebreak - Insert line break after payload (default: false)
 * @param {boolean} options.validOnly - Include only valid ticks (default: true)
 * @param {boolean} options.advancedDetails - Include advanced details in timesale (default: false)
 * @param {object} callbacks - Event callbacks
 * @param {Function} callbacks.onData - Called when data is received
 * @param {Function} callbacks.onError - Called on errors
 * @param {Function} callbacks.onClose - Called when connection closes
 * @param {Function} callbacks.onOpen - Called when connection opens
 * @returns {Object} WebSocket client with methods
 */
export function createTradierWebSocketClient(sessionId, options = {}, callbacks = {}) {
	const {
		symbols = [],
		filter = null,
		linebreak = false,
		validOnly = true,
		advancedDetails = false
	} = options;

	const { onData, onError, onClose, onOpen } = callbacks;
	const wsUrl = TRADIER_WS_URL;
	let ws = null;
	let reconnectAttempts = 0;
	const maxReconnectAttempts = 10;
	let reconnectTimeout = null;
	let isManualClose = false;
	let currentOptions = { ...options };

	/**
	 * Build payload according to API spec
	 */
	function buildPayload(symbolsToUse = symbols) {
		const payload = {
			symbols: Array.isArray(symbolsToUse) ? symbolsToUse : [symbolsToUse],
			sessionid: sessionId
		};

		if (filter) {
			payload.filter = Array.isArray(filter) ? filter : [filter];
		}
		if (linebreak) {
			payload.linebreak = true;
		}
		if (validOnly !== undefined) {
			payload.validOnly = validOnly;
		}
		if (advancedDetails) {
			payload.advancedDetails = true;
		}

		return payload;
	}

	/**
	 * Send payload to WebSocket
	 */
	function sendPayload(symbolsToUse = symbols) {
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			throw new Error('WebSocket not connected. Call connect() first.');
		}

		const payload = buildPayload(symbolsToUse);
		ws.send(JSON.stringify(payload));
	}

	/**
	 * Connect to WebSocket
	 */
	function connect() {
		if (ws && ws.readyState === WebSocket.OPEN) {
			return;
		}

		if (!sessionId) {
			if (onError) onError(new Error('Session ID is required. Create a session first.'));
			return;
		}

		if (!symbols || symbols.length === 0) {
			if (onError) onError(new Error('At least one symbol is required'));
			return;
		}

		try {
			ws = new WebSocket(wsUrl);

			ws.onopen = () => {
				reconnectAttempts = 0;
				if (onOpen) onOpen();
				
				// Send initial payload immediately
				sendPayload();
			};

			ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					
					// Check for errors
					if (data.error) {
						if (onError) onError(new Error(data.error));
						return;
					}
					
					if (onData) onData(data);
				} catch (err) {
					if (onError) onError(err);
				}
			};

			ws.onerror = (error) => {
				if (onError) onError(error);
			};

			ws.onclose = () => {
				if (onClose) onClose();
				
				// Auto-reconnect unless manually closed
				if (!isManualClose && reconnectAttempts < maxReconnectAttempts) {
					reconnectAttempts++;
					const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff, max 30s
					reconnectTimeout = setTimeout(() => {
						console.log(`Reconnecting WebSocket... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
						connect();
					}, delay);
				}
			};
		} catch (err) {
			if (onError) onError(err);
		}
	}

	/**
	 * Subscribe/update symbols (resend payload with new symbols)
	 * You can modify the stream by resending the payload with different parameters
	 * @param {Array<string>} newSymbols - Array of symbols to subscribe to
	 * @param {object} updateOptions - Optional updates to filter, linebreak, etc.
	 */
	function subscribe(newSymbols, updateOptions = {}) {
		if (newSymbols) {
			currentOptions.symbols = Array.isArray(newSymbols) ? newSymbols : [newSymbols];
		}
		if (updateOptions.filter !== undefined) currentOptions.filter = updateOptions.filter;
		if (updateOptions.linebreak !== undefined) currentOptions.linebreak = updateOptions.linebreak;
		if (updateOptions.validOnly !== undefined) currentOptions.validOnly = updateOptions.validOnly;
		if (updateOptions.advancedDetails !== undefined) currentOptions.advancedDetails = updateOptions.advancedDetails;

		// Update local options
		Object.assign(options, currentOptions);

		sendPayload(currentOptions.symbols);
	}

	/**
	 * Unsubscribe from all symbols (send empty symbols array)
	 */
	function unsubscribe() {
		sendPayload([]);
	}

	/**
	 * Update session ID (if expired, get new one and resend payload)
	 * @param {string} newSessionId - New session ID
	 */
	function updateSession(newSessionId) {
		sessionId = newSessionId;
		if (ws && ws.readyState === WebSocket.OPEN) {
			sendPayload();
		}
	}

	/**
	 * Close the WebSocket connection
	 */
	function disconnect() {
		isManualClose = true;
		if (reconnectTimeout) {
			clearTimeout(reconnectTimeout);
			reconnectTimeout = null;
		}
		if (ws) {
			ws.close();
			ws = null;
		}
	}

	/**
	 * Get connection state
	 */
	function getState() {
		if (!ws) return 'CLOSED';
		switch (ws.readyState) {
			case WebSocket.CONNECTING: return 'CONNECTING';
			case WebSocket.OPEN: return 'OPEN';
			case WebSocket.CLOSING: return 'CLOSING';
			case WebSocket.CLOSED: return 'CLOSED';
			default: return 'UNKNOWN';
		}
	}

	return {
		connect,
		subscribe,
		unsubscribe,
		updateSession,
		disconnect,
		getState,
		get ws() { return ws; }
	};
}

/**
 * Create a Tradier WebSocket client for account events streaming (Beta)
 * Streams account updates like order status changes, fills, etc.
 * Note: This API is in Beta and only available to Tradier Brokerage account holders
 * @param {string} sessionId - Session ID from createStreamingSession() (required)
 * @param {boolean} useSandbox - Whether to use sandbox environment (default: false)
 * @param {object} options - Streaming options
 * @param {Array<string>} options.events - Event types to stream: ['order'] (required)
 * @param {Array<string>} options.excludeAccounts - Account IDs to exclude from streaming
 * @param {object} callbacks - Event callbacks
 * @param {Function} callbacks.onData - Called when account event data is received
 * @param {Function} callbacks.onError - Called on errors
 * @param {Function} callbacks.onClose - Called when connection closes
 * @param {Function} callbacks.onOpen - Called when connection opens
 * @returns {Object} WebSocket client with methods
 */
export function createTradierAccountWebSocketClient(sessionId, useSandbox = false, options = {}, callbacks = {}) {
	const {
		events = ['order'],
		excludeAccounts = []
	} = options;

	const { onData, onError, onClose, onOpen } = callbacks;
	const wsUrl = useSandbox ? TRADIER_WS_SANDBOX_URL : TRADIER_WS_ACCOUNTS_URL;
	let ws = null;
	let reconnectAttempts = 0;
	const maxReconnectAttempts = 10;
	let reconnectTimeout = null;
	let isManualClose = false;
	let currentOptions = { ...options };

	/**
	 * Build payload according to API spec
	 */
	function buildPayload(eventsToUse = events) {
		const payload = {
			events: Array.isArray(eventsToUse) ? eventsToUse : [eventsToUse],
			sessionid: sessionId
		};

		if (excludeAccounts && excludeAccounts.length > 0) {
			payload.excludeAccounts = Array.isArray(excludeAccounts) ? excludeAccounts : [excludeAccounts];
		}

		return payload;
	}

	/**
	 * Send payload to WebSocket
	 */
	function sendPayload(eventsToUse = events) {
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			throw new Error('WebSocket not connected. Call connect() first.');
		}

		const payload = buildPayload(eventsToUse);
		ws.send(JSON.stringify(payload));
	}

	/**
	 * Connect to WebSocket
	 */
	function connect() {
		if (ws && ws.readyState === WebSocket.OPEN) {
			return;
		}

		if (!sessionId) {
			if (onError) onError(new Error('Session ID is required. Create a session first.'));
			return;
		}

		if (!events || events.length === 0) {
			if (onError) onError(new Error('At least one event type is required'));
			return;
		}

		try {
			ws = new WebSocket(wsUrl);

			ws.onopen = () => {
				reconnectAttempts = 0;
				if (onOpen) onOpen();
				
				// Send initial payload immediately
				sendPayload();
			};

			ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					
					// Check for errors
					if (data.error) {
						if (onError) onError(new Error(data.error));
						return;
					}
					
					if (onData) onData(data);
				} catch (err) {
					if (onError) onError(err);
				}
			};

			ws.onerror = (error) => {
				if (onError) onError(error);
			};

			ws.onclose = () => {
				if (onClose) onClose();
				
				// Auto-reconnect unless manually closed
				if (!isManualClose && reconnectAttempts < maxReconnectAttempts) {
					reconnectAttempts++;
					const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff, max 30s
					reconnectTimeout = setTimeout(() => {
						console.log(`Reconnecting Account WebSocket... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
						connect();
					}, delay);
				}
			};
		} catch (err) {
			if (onError) onError(err);
		}
	}

	/**
	 * Update events or excludeAccounts (resend payload with new parameters)
	 * @param {Array<string>} newEvents - New event types to stream
	 * @param {Array<string>} newExcludeAccounts - New accounts to exclude
	 */
	function update(newEvents = null, newExcludeAccounts = null) {
		if (newEvents) {
			currentOptions.events = Array.isArray(newEvents) ? newEvents : [newEvents];
		}
		if (newExcludeAccounts !== null) {
			currentOptions.excludeAccounts = Array.isArray(newExcludeAccounts) ? newExcludeAccounts : [newExcludeAccounts];
		}

		// Update local options
		Object.assign(options, currentOptions);

		sendPayload(currentOptions.events);
	}

	/**
	 * Update session ID (if expired, get new one and resend payload)
	 * @param {string} newSessionId - New session ID
	 */
	function updateSession(newSessionId) {
		sessionId = newSessionId;
		if (ws && ws.readyState === WebSocket.OPEN) {
			sendPayload();
		}
	}

	/**
	 * Close the WebSocket connection
	 */
	function disconnect() {
		isManualClose = true;
		if (reconnectTimeout) {
			clearTimeout(reconnectTimeout);
			reconnectTimeout = null;
		}
		if (ws) {
			ws.close();
			ws = null;
		}
	}

	/**
	 * Get connection state
	 */
	function getState() {
		if (!ws) return 'CLOSED';
		switch (ws.readyState) {
			case WebSocket.CONNECTING: return 'CONNECTING';
			case WebSocket.OPEN: return 'OPEN';
			case WebSocket.CLOSING: return 'CLOSING';
			case WebSocket.CLOSED: return 'CLOSED';
			default: return 'UNKNOWN';
		}
	}

	return {
		connect,
		update,
		updateSession,
		disconnect,
		getState,
		get ws() { return ws; }
	};
}

/**
 * Create a Tradier HTTP Streaming client
 * Uses HTTP streaming (Server-Sent Events style) for real-time market data
 * @param {string} accessToken - Tradier API access token
 * @param {string} sessionId - Session ID from createStreamingSession()
 * @param {object} options - Streaming options
 * @param {Array<string>} options.symbols - Symbols to stream
 * @param {Array<string>} options.filter - Event types to filter: 'trade', 'quote', 'summary', 'timesale', 'tradex'
 * @param {boolean} options.linebreak - Add line breaks between events (default: false)
 * @param {boolean} options.validOnly - Only valid quotes (default: true)
 * @param {boolean} options.advancedDetails - Include advanced details (default: false)
 * @param {boolean} options.usePost - Use POST instead of GET (default: false, use POST for long symbol lists)
 * @param {object} callbacks - Event callbacks
 * @param {Function} callbacks.onData - Called when data is received
 * @param {Function} callbacks.onError - Called on errors
 * @param {Function} callbacks.onClose - Called when stream closes
 * @returns {Object} HTTP streaming client with methods
 */
export function createTradierHTTPStreamClient(accessToken, sessionId, options = {}, callbacks = {}) {
	const {
		symbols = [],
		filter = null,
		linebreak = false,
		validOnly = true,
		advancedDetails = false,
		usePost = false
	} = options;

	const { onData, onError, onClose } = callbacks;
	let abortController = null;
	let isStreaming = false;
	let reconnectTimeout = null;
	let reconnectAttempts = 0;
	const maxReconnectAttempts = 10;
	let isManualStop = false;

	/**
	 * Start streaming
	 */
	async function start() {
		if (isStreaming) {
			return;
		}

		if (!sessionId) {
			if (onError) onError(new Error('Session ID is required. Create a session first.'));
			return;
		}

		if (!symbols || symbols.length === 0) {
			if (onError) onError(new Error('At least one symbol is required'));
			return;
		}

		isStreaming = true;
		isManualStop = false;
		reconnectAttempts = 0;
		await connect();
	}

	/**
	 * Connect to streaming endpoint
	 */
	async function connect() {
		try {
			abortController = new AbortController();
			const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
			
			const streamHeaders = {
				'Authorization': `Bearer ${accessToken}`,
				'Accept': 'application/json'
			};

			let url, fetchOptions;

			if (usePost) {
				// POST method for longer symbol lists
				url = `${TRADIER_STREAM_URL}/v1/markets/events`;
				const formData = new URLSearchParams();
				formData.append('sessionid', sessionId);
				formData.append('symbols', symbolsParam);
				if (filter) formData.append('filter', Array.isArray(filter) ? filter.join(',') : filter);
				if (linebreak) formData.append('linebreak', 'true');
				if (validOnly) formData.append('validOnly', 'true');
				if (advancedDetails) formData.append('advancedDetails', 'true');

				fetchOptions = {
					method: 'POST',
					headers: {
						...streamHeaders,
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: formData.toString(),
					signal: abortController.signal
				};
			} else {
				// GET method
				const urlObj = new URL(`${TRADIER_STREAM_URL}/v1/markets/events`);
				urlObj.searchParams.set('sessionid', sessionId);
				urlObj.searchParams.set('symbols', symbolsParam);
				if (filter) urlObj.searchParams.set('filter', Array.isArray(filter) ? filter.join(',') : filter);
				if (linebreak) urlObj.searchParams.set('linebreak', 'true');
				if (validOnly) urlObj.searchParams.set('validOnly', 'true');
				if (advancedDetails) urlObj.searchParams.set('advancedDetails', 'true');

				url = urlObj.toString();
				fetchOptions = {
					method: 'GET',
					headers: streamHeaders,
					signal: abortController.signal
				};
			}

			const response = await fetch(url, fetchOptions);

			if (!response.ok) {
				throw new Error(`Streaming failed: ${response.status} ${response.statusText}`);
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			while (isStreaming) {
				const { done, value } = await reader.read();

				if (done) {
					break;
				}

				buffer += decoder.decode(value, { stream: true });
				
				// Process complete lines (JSON objects separated by newlines)
				const lines = buffer.split('\n');
				buffer = lines.pop() || ''; // Keep incomplete line in buffer

				for (const line of lines) {
					const trimmedLine = line.trim();
					if (!trimmedLine) continue;

					try {
						const data = JSON.parse(trimmedLine);
						
						// Check for errors
						if (data.error) {
							if (onError) onError(new Error(data.error));
							continue;
						}

						if (onData) onData(data);
					} catch (err) {
						// Skip invalid JSON lines
						console.warn('Failed to parse streaming data:', trimmedLine, err);
					}
				}
			}

			// Stream ended
			isStreaming = false;
			if (onClose) onClose();

			// Auto-reconnect unless manually stopped
			if (!isManualStop && reconnectAttempts < maxReconnectAttempts) {
				reconnectAttempts++;
				const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
				reconnectTimeout = setTimeout(() => {
					console.log(`Reconnecting HTTP stream... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
					connect();
				}, delay);
			}
		} catch (err) {
			isStreaming = false;
			if (err.name === 'AbortError') {
				// Manual stop
				return;
			}
			if (onError) onError(err);

			// Auto-reconnect on error
			if (!isManualStop && reconnectAttempts < maxReconnectAttempts) {
				reconnectAttempts++;
				const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
				reconnectTimeout = setTimeout(() => {
					console.log(`Reconnecting HTTP stream after error... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
					connect();
				}, delay);
			}
		}
	}

	/**
	 * Stop streaming
	 */
	function stop() {
		isManualStop = true;
		isStreaming = false;
		if (reconnectTimeout) {
			clearTimeout(reconnectTimeout);
			reconnectTimeout = null;
		}
		if (abortController) {
			abortController.abort();
			abortController = null;
		}
	}

	/**
	 * Update symbols (requires new session if session expired)
	 */
	function updateSymbols(newSymbols) {
		if (isStreaming) {
			stop();
		}
		options.symbols = Array.isArray(newSymbols) ? newSymbols : [newSymbols];
		start();
	}

	return {
		start,
		stop,
		updateSymbols,
		get isStreaming() { return isStreaming; }
	};
}

