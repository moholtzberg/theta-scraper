import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';
class SDK {
    constructor() {
        this.spec = Oas.init(definition);
        this.core = new APICore(this.spec, 'tradier/1.0.0 (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config) {
        this.core.setConfig(config);
    }
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values) {
        this.core.setAuth(...values);
        return this;
    }
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url, variables = {}) {
        this.core.setServer(url, variables);
    }
    /**
     * Get the profile information for the current user
     *
     * @summary Get User Profile
     */
    brokerageApiUserGetProfile(metadata) {
        return this.core.fetch('/v1/user/profile', 'get', metadata);
    }
    /**
     * Get the current account balance and margin information.
     *
     * @summary Get Account Balance
     */
    brokerageApiAccountsGetAccountBalance(metadata) {
        return this.core.fetch('/v1/accounts/{account_id}/balances', 'get', metadata);
    }
    /**
     * Get the historical account balances to track value over time
     *
     * @summary Get Account's Balances Overtime
     */
    brokerageApiAccountsGetAccountHistoricalBalance(metadata) {
        return this.core.fetch('/v1/accounts/{account_id}/historical-balances', 'get', metadata);
    }
    /**
     * Get the current positions being held in an account
     *
     * @summary Get Account Positions
     */
    brokerageApiAccountsGetAccountPositions(metadata) {
        return this.core.fetch('/v1/accounts/{account_id}/positions', 'get', metadata);
    }
    /**
     * Get historical activity for an account
     *
     * @summary Get Account History
     */
    brokerageApiAccountsGetAccountHistory(metadata) {
        return this.core.fetch('/v1/accounts/{account_id}/history', 'get', metadata);
    }
    /**
     * Get cost basis and gain/loss information for an account. This includes information for
     * all closed positions. Cost basis information is updated through a nightly batch
     * reconciliation process with our clearing firm
     *
     * @summary Get Account Gain/Loss
     */
    brokerageApiAccountsGetAccountGainloss(metadata) {
        return this.core.fetch('/v1/accounts/{account_id}/gainloss', 'get', metadata);
    }
    /**
     * Get all orders for an account. A single order will be returned as an obj/dict whereas
     * multiple orders will be returned as an array/list.
     *
     * @summary Get Account Orders
     */
    brokerageApiAccountsGetAccountOrders(metadata) {
        return this.core.fetch('/v1/accounts/{account_id}/orders', 'get', metadata);
    }
    /**
     * Place a trading order. Supports equity, option, fractional, multileg, combo, OTO, OCO,
     * and OTOCO order types.
     *
     * @summary Place Order
     */
    brokerageApiTradingPlaceOrder(body, metadata) {
        return this.core.fetch('/v1/accounts/{account_id}/orders', 'post', body, metadata);
    }
    /**
     * Get a specific order by ID
     *
     * @summary Get Account Order
     */
    brokerageApiGetAccountOrder(metadata) {
        return this.core.fetch('/v1/accounts/{account_id}/orders/{order_id}', 'get', metadata);
    }
    /**
     * Modify an existing order
     *
     * @summary Change Order
     */
    brokerageApiTradingChangeOrder(body, metadata) {
        return this.core.fetch('/v1/accounts/{account_id}/orders/{order_id}', 'put', body, metadata);
    }
    /**
     * Cancel an existing order
     *
     * @summary Cancel Order
     */
    brokerageApiTradingCancelOrder(metadata) {
        return this.core.fetch('/v1/accounts/{account_id}/orders/{order_id}', 'delete', metadata);
    }
    /**
     * Get quotes for one or more symbols
     *
     * @summary Get Quotes
     */
    brokerageApiMarketsGetQuotes(metadata) {
        return this.core.fetch('/v1/markets/quotes', 'get', metadata);
    }
    /**
     * Get quotes for a larger list of symbols
     *
     * @summary Post Quotes
     */
    brokerageApiMarketsPostQuotes(body, metadata) {
        return this.core.fetch('/v1/markets/quotes', 'post', body, metadata);
    }
    /**
     * Get option chains for a specific underlying symbol and expiration date. Greek and IV
     * data is included courtesy of ORATS. Please check out their APIs for more in-depth
     * options data.
     *
     * @summary Get Options Chains
     */
    brokerageApiMarketsGetOptionsChains(metadata) {
        return this.core.fetch('/v1/markets/options/chains', 'get', metadata);
    }
    /**
     * Get available strike prices for a specific underlying symbol and expiration date
     *
     * @summary Get Options Strikes
     */
    brokerageApiMarketsGetOptionsStrikes(metadata) {
        return this.core.fetch('/v1/markets/options/strikes', 'get', metadata);
    }
    /**
     * Get available expiration dates for a specific underlying symbol
     *
     * @summary Get Options Expirations
     */
    brokerageApiMarketsGetOptionsExpirations(metadata) {
        return this.core.fetch('/v1/markets/options/expirations', 'get', metadata);
    }
    /**
     * Get all options symbols for the given underlying. This will include additional option
     * roots (ex. SPXW, RUTW) if applicable.
     *
     * @summary Get Lookup Options Symbols
     */
    brokerageApiMarketsGetLookupOptionsSymbols(metadata) {
        return this.core.fetch('/v1/markets/options/lookup', 'get', metadata);
    }
    /**
     * Get all greeks in an option chain
     *
     * @summary Get Option Greeks
     */
    brokerageApiMarketsGetRealtimeGreeks(metadata) {
        return this.core.fetch('/v1/markets/options/greeks', 'get', metadata);
    }
    /**
     * Get historical pricing for a specific security. This data will usually cover the entire
     * lifetime of the company if sending reasonable start/end times. You can fetch historical
     * pricing for options by passing the OCC option symbol (ex. AAPL220617C00270000) as the
     * symbol.
     *
     * @summary Get historical pricing for a security.
     */
    brokerageApiMarketsGetHistory(metadata) {
        return this.core.fetch('/v1/markets/history', 'get', metadata);
    }
    /**
     * Time and Sales (timesales) is typically used for charting purposes. It captures pricing
     * across a time slice at predefined intervals. Tick data is also available through this
     * endpoint. This results in a very large data set for high-volume symbols, so the time
     * slice needs to be much smaller to keep downloads time reasonable.
     *
     * @summary Get Time & Sales
     */
    brokerageApiMarketsGetTimesales(metadata) {
        return this.core.fetch('/v1/markets/timesales', 'get', metadata);
    }
    /**
     * The ETB list contains securities that are able to be sold short with a Tradier Brokerage
     * account. The list is quite comprehensive and can result in a long download response
     * time.
     *
     * @summary Get ETB Securities
     */
    brokerageApiMarketsGetEtb(metadata) {
        return this.core.fetch('/v1/markets/etb', 'get', metadata);
    }
    /**
     * Get the intraday market status. This call will change and return information pertaining
     * to the current day. If programming logic on whether the market is open/closed – this API
     * call should be used to determine the current state.
     *
     * @summary Get Market Clock
     */
    brokerageApiMarketsGetClock(metadata) {
        return this.core.fetch('/v1/markets/clock', 'get', metadata);
    }
    /**
     * Get the market calendar for current or a specific month
     *
     * @summary Get Market Calendar
     */
    brokerageApiMarketsGetCalendar(metadata) {
        return this.core.fetch('/v1/markets/calendar', 'get', metadata);
    }
    /**
     * Search for securities by partial match on symbol or company name. Results are in
     * descending order by average volume of the security. This can be used for simple search
     * functions
     *
     * @summary Get Market Search
     */
    brokerageApiMarketsGetSearch(metadata) {
        return this.core.fetch('/v1/markets/search', 'get', metadata);
    }
    /**
     * Search for a symbol using the ticker symbol or partial symbol. Results are in descending
     * order by average volume of the security. This can be used for simple search functions.
     *
     * @summary Get Market Lookup
     */
    brokerageApiMarketsGetLookup(metadata) {
        return this.core.fetch('/v1/markets/lookup', 'get', metadata);
    }
    /**
     * Create a session for streaming market data
     *
     * @summary Create Market Session
     */
    brokerageApiStreamingCreateMarketSession(metadata) {
        return this.core.fetch('/v1/markets/events/session', 'post', metadata);
    }
    /**
     * Create a session for streaming account-specific events
     *
     * @summary Create Account Session
     */
    brokerageApiStreamingCreateAccountSession(metadata) {
        return this.core.fetch('/v1/accounts/events/session', 'post', metadata);
    }
    /**
     * Retrieve all of a user's watchlists
     *
     * @summary Get All Watchlists
     */
    brokerageApiWatchlistsGetWatchlists(metadata) {
        return this.core.fetch('/v1/watchlists', 'get', metadata);
    }
    /**
     * Create a new watchlist. The new watchlist created will use the specified name and
     * optional symbols upon creation.
     *
     * @summary Create Watchlist
     */
    brokerageApiWatchlistsCreateWatchlist(body, metadata) {
        return this.core.fetch('/v1/watchlists', 'post', body, metadata);
    }
    /**
     * Retrieve a specific watchlist by id
     *
     * @summary Get Specific Watchlist
     */
    brokerageApiWatchlistsGetSpecificWatchlist(metadata) {
        return this.core.fetch('/v1/watchlists/{watchlist_id}', 'get', metadata);
    }
    /**
     * Update an existing watchlist. This request will override the existing watchlist
     * information with the parameters sent in the body.
     *
     * @summary Update Watchlist
     */
    brokerageApiWatchlistsUpdateWatchlist(body, metadata) {
        return this.core.fetch('/v1/watchlists/{watchlist_id}', 'put', body, metadata);
    }
    /**
     * Delete a specific watchlist
     *
     * @summary Delete Watchlist
     */
    brokerageApiWatchlistsDeleteWatchlist(metadata) {
        return this.core.fetch('/v1/watchlists/{watchlist_id}', 'delete', metadata);
    }
    /**
     * Add symbols to an existing watchlist. If the symbol exists, it will be over-written.
     *
     * @summary Add Symbols to Watchlist
     */
    brokerageApiWatchlistsAddWatchlistSymbols(body, metadata) {
        return this.core.fetch('/v1/watchlists/{watchlist_id}/symbols', 'post', body, metadata);
    }
    /**
     * Remove a symbol from a specific watchlist
     *
     * @summary Remove Symbol from Watchlist
     */
    brokerageApiWatchlistsRemoveWatchlistSymbol(metadata) {
        return this.core.fetch('/v1/watchlists/{watchlist_id}/symbols/{symbol}', 'delete', metadata);
    }
}
const createSDK = (() => { return new SDK(); })();
export default createSDK;
