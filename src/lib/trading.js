/**
 * Trading Logic for Calendar Spreads
 * Handles finding, creating, and rolling calendar spreads
 */

import { findOptionsByDelta, getTradingDaysUntilExpiration } from './tradier.js';

const SHORT_EXPIRATION_DAYS = 3;
const LONG_EXPIRATION_DAYS = 4;

/**
 * Find options for calendar spread by delta
 */
export async function findCalendarSpreadOptions(tradierClient, symbol, currentPrice, targetDelta = 0.35, optionType = 'call') {
	try {
		// Get available expirations
		const expirationsResponse = await tradierClient.getOptionExpirations(symbol);
		const expirations = expirationsResponse?.expirations?.date || [];
		
		if (expirations.length < 2) {
			throw new Error('Not enough expirations available');
		}

		// Find expirations that are approximately 3 and 4 days out
		const today = new Date();
		const targetShortDate = new Date(today);
		targetShortDate.setDate(today.getDate() + SHORT_EXPIRATION_DAYS);
		
		const targetLongDate = new Date(today);
		targetLongDate.setDate(today.getDate() + LONG_EXPIRATION_DAYS);

		// Find closest expirations
		let shortExpiration = null;
		let longExpiration = null;
		let shortDaysDiff = Infinity;
		let longDaysDiff = Infinity;

		for (const expDate of expirations) {
			const exp = new Date(expDate);
			const daysUntil = getTradingDaysUntilExpiration(expDate);
			
			// Find short expiration (3 days)
			if (daysUntil >= 2 && daysUntil <= 4) {
				const diff = Math.abs(daysUntil - SHORT_EXPIRATION_DAYS);
				if (diff < shortDaysDiff) {
					shortDaysDiff = diff;
					shortExpiration = expDate;
				}
			}
			
			// Find long expiration (4 days)
			if (daysUntil >= 3 && daysUntil <= 5) {
				const diff = Math.abs(daysUntil - LONG_EXPIRATION_DAYS);
				if (diff < longDaysDiff) {
					longDaysDiff = diff;
					longExpiration = expDate;
				}
			}
		}

		if (!shortExpiration || !longExpiration) {
			throw new Error('Could not find suitable expirations for calendar spread');
		}

		// Get options chains for both expirations (with greeks)
		const [shortChainResponse, longChainResponse] = await Promise.all([
			tradierClient.getOptionsChain(symbol, shortExpiration, { greeks: true }),
			tradierClient.getOptionsChain(symbol, longExpiration, { greeks: true })
		]);

		// Find options by target delta and type for short expiration first
		const shortOption = findOptionsByDelta(shortChainResponse, targetDelta, optionType);
		
		if (!shortOption) {
			throw new Error(`Could not find ${(targetDelta * 100).toFixed(0)} delta ${optionType} options for short expiration`);
		}

		// Use the same strike price for the long expiration
		const shortStrike = parseFloat(shortOption.strike || 0);
		
		// Find option with same strike in long expiration
		const longOptionList = longChainResponse?.options?.option;
		const longOptions = Array.isArray(longOptionList) ? longOptionList : (longOptionList ? [longOptionList] : []);
		
		const longOptionRaw = longOptions.find(opt => 
			opt.option_type === optionType && 
			Math.abs(parseFloat(opt.strike || 0) - shortStrike) < 0.01 // Allow small floating point differences
		);

		if (!longOptionRaw) {
			throw new Error(`Could not find ${optionType} option with strike ${shortStrike} for long expiration`);
		}

		// Extract delta from greeks (same as findOptionsByDelta does)
		const longDelta = parseFloat(longOptionRaw.greeks?.delta || 0);
		const longOption = {
			...longOptionRaw,
			delta: longDelta, // Add delta property for consistency with shortOption
			expiration: longExpiration,
			daysUntil: getTradingDaysUntilExpiration(longExpiration)
		};

		return {
			shortOption: {
				...shortOption,
				expiration: shortExpiration,
				daysUntil: getTradingDaysUntilExpiration(shortExpiration)
			},
			longOption: longOption,
			shortExpiration,
			longExpiration
		};
	} catch (error) {
		console.error('Error finding calendar spread options:', error);
		throw error;
	}
}

/**
 * Find the "next day" calendar spread (one day closer to expiration)
 * Used to estimate tomorrow's spread value by looking at what the next day spread trades for today
 * @param {Object} tradierClient - Tradier API client
 * @param {string} symbol - Underlying symbol
 * @param {number} currentPrice - Current underlying price
 * @param {string} strike - Strike price to use
 * @param {string} optionType - 'call' or 'put'
 * @param {string} currentShortExpiration - Current short expiration date
 * @param {string} currentLongExpiration - Current long expiration date
 * @returns {Promise<Object|null>} Next day spread options or null if not found
 */
export async function findNextDaySpreadOptions(tradierClient, symbol, currentPrice, strike, optionType, currentShortExpiration, currentLongExpiration) {
	try {
		// Get available expirations
		const expirationsResponse = await tradierClient.getOptionExpirations(symbol);
		const expirations = expirationsResponse?.expirations?.date || [];
		
		if (expirations.length < 2) {
			return null;
		}

		// Calculate target days for next day spread (one day closer)
		const currentShortDays = getTradingDaysUntilExpiration(currentShortExpiration);
		const currentLongDays = getTradingDaysUntilExpiration(currentLongExpiration);
		
		const targetShortDays = Math.max(1, currentShortDays - 1); // At least 1 day
		const targetLongDays = Math.max(2, currentLongDays - 1); // At least 2 days

		// Find expirations closest to target days
		let nextShortExpiration = null;
		let nextLongExpiration = null;
		let shortDaysDiff = Infinity;
		let longDaysDiff = Infinity;

		for (const expDate of expirations) {
			const daysUntil = getTradingDaysUntilExpiration(expDate);
			
			// Find short expiration (one day closer)
			if (daysUntil >= targetShortDays - 1 && daysUntil <= targetShortDays + 1) {
				const diff = Math.abs(daysUntil - targetShortDays);
				if (diff < shortDaysDiff) {
					shortDaysDiff = diff;
					nextShortExpiration = expDate;
				}
			}
			
			// Find long expiration (one day closer)
			if (daysUntil >= targetLongDays - 1 && daysUntil <= targetLongDays + 1) {
				const diff = Math.abs(daysUntil - targetLongDays);
				if (diff < longDaysDiff) {
					longDaysDiff = diff;
					nextLongExpiration = expDate;
				}
			}
		}

		if (!nextShortExpiration || !nextLongExpiration) {
			return null;
		}

		// Get options chains for both expirations
		const [shortChainResponse, longChainResponse] = await Promise.all([
			tradierClient.getOptionsChain(symbol, nextShortExpiration, { greeks: true }),
			tradierClient.getOptionsChain(symbol, nextLongExpiration, { greeks: true })
		]);

		// Find options with the same strike
		const shortOptionList = shortChainResponse?.options?.option;
		const shortOptions = Array.isArray(shortOptionList) ? shortOptionList : (shortOptionList ? [shortOptionList] : []);
		
		const longOptionList = longChainResponse?.options?.option;
		const longOptions = Array.isArray(longOptionList) ? longOptionList : (longOptionList ? [longOptionList] : []);

		const nextShortOption = shortOptions.find(opt => 
			opt.option_type === optionType && 
			Math.abs(parseFloat(opt.strike || 0) - strike) < 0.01
		);

		const nextLongOption = longOptions.find(opt => 
			opt.option_type === optionType && 
			Math.abs(parseFloat(opt.strike || 0) - strike) < 0.01
		);

		if (!nextShortOption || !nextLongOption) {
			return null;
		}

		// Extract delta from greeks
		const nextLongDelta = parseFloat(nextLongOption.greeks?.delta || 0);
		const nextShortDelta = parseFloat(nextShortOption.greeks?.delta || 0);

		return {
			shortOption: {
				...nextShortOption,
				delta: nextShortDelta,
				expiration: nextShortExpiration,
				daysUntil: getTradingDaysUntilExpiration(nextShortExpiration)
			},
			longOption: {
				...nextLongOption,
				delta: nextLongDelta,
				expiration: nextLongExpiration,
				daysUntil: getTradingDaysUntilExpiration(nextLongExpiration)
			},
			shortExpiration: nextShortExpiration,
			longExpiration: nextLongExpiration
		};
	} catch (error) {
		console.error('Error finding next day spread options:', error);
		return null;
	}
}

/**
 * Create a calendar spread order
 * Calendar spread: Sell short expiration, Buy long expiration (both same strike, target delta)
 * @param {boolean} preview - Whether to preview the order instead of placing it
 */
export async function createCalendarSpreadOrder(tradierClient, accountId, symbol, spreadOptions, quantity = 1, targetDelta = 0.35, optionType = 'call', preview = false) {
	const { shortOption, longOption } = spreadOptions;
	const deltaPercent = (targetDelta * 100).toFixed(0);

	// Calendar spread: Sell short expiration, Buy long expiration
	const spreadOrder = {
		symbol: symbol,
		type: 'market', // or 'limit' with price
		duration: 'day', // 'day' or 'gtc'
		legs: [
			{
				option_symbol: shortOption.symbol,
				side: 'sell_to_open',
				quantity: quantity
			},
			{
				option_symbol: longOption.symbol,
				side: 'buy_to_open',
				quantity: quantity
			}
		],
		tag: `${symbol}_${deltaPercent}D_${optionType.toUpperCase()}_CAL_${new Date().toISOString().split('T')[0]}`
	};

	const response = await tradierClient.placeSpreadOrder(accountId, spreadOrder, preview);
	return response;
}

/**
 * Get current positions that are calendar spreads
 * Handles both single position (object) and multiple positions (array) responses
 */
export async function getCurrentCalendarSpreads(tradierClient, accountId, symbol = null) {
	const positionsResponse = await tradierClient.getPositions(accountId);
	
	// Handle API response: single position is an object, multiple positions is an array
	let positions = positionsResponse?.positions?.position;
	
	// Normalize to array
	if (!positions) {
		return [];
	}
	if (!Array.isArray(positions)) {
		positions = [positions];
	}

	// Filter for options positions (optionally filter by symbol)
	// Options positions typically have option_type field or symbol contains option format
	const optionsPositions = positions.filter(pos => {
		// Check if it's an option by looking for option_type or option symbol format (e.g., SPY240119C00450000)
		const hasOptionType = pos.option_type;
		const isOptionSymbol = pos.symbol && /^\w+\d{6}[CP]\d{8}$/.test(pos.symbol);
		
		if (symbol) {
			// Check if symbol starts with the underlying symbol
			const matchesSymbol = pos.symbol?.startsWith(symbol) || pos.symbol?.includes(symbol);
			return matchesSymbol && (hasOptionType || isOptionSymbol);
		}
		return hasOptionType || isOptionSymbol;
	});

	return optionsPositions;
}

/**
 * Close a calendar spread position
 * Uses regular orders (not OCO) - both orders are placed independently
 */
export async function closeCalendarSpread(tradierClient, accountId, symbol, shortPosition, longPosition, quantity = 1) {
	const orders = [];

	// Close short position (buy to close)
	if (shortPosition) {
		const closeShort = await tradierClient.placeOrder(accountId, {
			class: 'option',
			symbol: symbol,
			option_symbol: shortPosition.symbol,
			side: 'buy_to_close',
			quantity: Math.min(quantity, parseFloat(shortPosition.quantity)),
			type: 'market',
			duration: 'day',
			tag: `CLOSE_SHORT_${new Date().toISOString().split('T')[0]}`
		});
		orders.push(closeShort);
	}

	// Close long position (sell to close)
	if (longPosition) {
		const closeLong = await tradierClient.placeOrder(accountId, {
			class: 'option',
			symbol: symbol,
			option_symbol: longPosition.symbol,
			side: 'sell_to_close',
			quantity: Math.min(quantity, parseFloat(longPosition.quantity)),
			type: 'market',
			duration: 'day',
			tag: `CLOSE_LONG_${new Date().toISOString().split('T')[0]}`
		});
		orders.push(closeLong);
	}

	return orders;
}

/**
 * Close a calendar spread using OCO (One-Cancels-Other) order
 * NOTE: According to Tradier API validation rules, OCO orders for options require
 * both orders to have the same option_symbol. Since calendar spreads have different
 * option symbols for each leg, OCO cannot be used for closing calendar spreads.
 * This function is provided for other use cases where OCO might be applicable.
 * 
 * For closing calendar spreads, use closeCalendarSpread() instead.
 * @param {boolean} preview - Whether to preview the order instead of placing it
 */
export async function closeCalendarSpreadOCO(tradierClient, accountId, symbol, shortPosition, longPosition, quantity = 1, preview = false) {
	if (!shortPosition || !longPosition) {
		throw new Error('Both short and long positions are required for OCO order');
	}

	// Note: This will fail API validation because option_symbol must be the same for OCO option orders
	// This function is kept for reference/other use cases, but won't work for calendar spreads
	const shortQty = Math.min(quantity, parseFloat(shortPosition.quantity));
	const longQty = Math.min(quantity, parseFloat(longPosition.quantity));

	const ocoOrder = {
		class: 'option',
		type: 'oco',
		orders: [
			{
				symbol: symbol,
				option_symbol: shortPosition.symbol,
				side: 'buy_to_close',
				quantity: shortQty,
				type: 'limit', // Must be different from second order
				duration: 'day',
				price: 0.01,
				tag: `CLOSE_SHORT_${new Date().toISOString().split('T')[0]}`
			},
			{
				symbol: symbol,
				option_symbol: longPosition.symbol,
				side: 'sell_to_close',
				quantity: longQty,
				type: 'market', // Different type from first order (required for OCO)
				duration: 'day',
				tag: `CLOSE_LONG_${new Date().toISOString().split('T')[0]}`
			}
		]
	};

	return await tradierClient.placeAdvancedOrder(accountId, ocoOrder, preview);
}

/**
 * Roll a calendar spread: close old positions and open new ones
 */
export async function rollCalendarSpread(tradierClient, accountId, symbol, oldPositions, quantity = 1, targetDelta = 0.35, optionType = 'call') {
	try {
		// Close old positions
		const shortPos = oldPositions.find(p => p.side === 'short' || parseFloat(p.quantity) < 0);
		const longPos = oldPositions.find(p => p.side === 'long' || parseFloat(p.quantity) > 0);
		
		await closeCalendarSpread(tradierClient, accountId, symbol, shortPos, longPos, quantity);

		// Find new spread options
		const quotesResponse = await tradierClient.getQuotes([symbol]);
		const currentPrice = parseFloat(quotesResponse?.quotes?.quote?.last || 0);
		
		const newSpreadOptions = await findCalendarSpreadOptions(tradierClient, symbol, currentPrice, targetDelta, optionType);

		// Open new spread
		const newSpreadOrder = await createCalendarSpreadOrder(
			tradierClient, 
			accountId, 
			symbol,
			newSpreadOptions, 
			quantity,
			targetDelta,
			optionType
		);

		return {
			closed: { shortPos, longPos },
			newSpread: newSpreadOrder,
			newSpreadOptions
		};
	} catch (error) {
		console.error('Error rolling calendar spread:', error);
		throw error;
	}
}

