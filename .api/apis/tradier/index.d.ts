import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
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
    auth(...values: string[] | number[]): this;
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
    server(url: string, variables?: {}): void;
    /**
     * Get the profile information for the current user
     *
     * @summary Get User Profile
     */
    brokerageApiUserGetProfile(metadata: types.BrokerageApiUserGetProfileMetadataParam): Promise<FetchResponse<200, types.BrokerageApiUserGetProfileResponse200>>;
    /**
     * Get the current account balance and margin information.
     *
     * @summary Get Account Balance
     */
    brokerageApiAccountsGetAccountBalance(metadata: types.BrokerageApiAccountsGetAccountBalanceMetadataParam): Promise<FetchResponse<200, types.BrokerageApiAccountsGetAccountBalanceResponse200>>;
    /**
     * Get the historical account balances to track value over time
     *
     * @summary Get Account's Balances Overtime
     */
    brokerageApiAccountsGetAccountHistoricalBalance(metadata: types.BrokerageApiAccountsGetAccountHistoricalBalanceMetadataParam): Promise<FetchResponse<200, types.BrokerageApiAccountsGetAccountHistoricalBalanceResponse200>>;
    /**
     * Get the current positions being held in an account
     *
     * @summary Get Account Positions
     */
    brokerageApiAccountsGetAccountPositions(metadata: types.BrokerageApiAccountsGetAccountPositionsMetadataParam): Promise<FetchResponse<200, types.BrokerageApiAccountsGetAccountPositionsResponse200>>;
    /**
     * Get historical activity for an account
     *
     * @summary Get Account History
     */
    brokerageApiAccountsGetAccountHistory(metadata: types.BrokerageApiAccountsGetAccountHistoryMetadataParam): Promise<FetchResponse<200, types.BrokerageApiAccountsGetAccountHistoryResponse200>>;
    /**
     * Get cost basis and gain/loss information for an account. This includes information for
     * all closed positions. Cost basis information is updated through a nightly batch
     * reconciliation process with our clearing firm
     *
     * @summary Get Account Gain/Loss
     */
    brokerageApiAccountsGetAccountGainloss(metadata: types.BrokerageApiAccountsGetAccountGainlossMetadataParam): Promise<FetchResponse<200, types.BrokerageApiAccountsGetAccountGainlossResponse200>>;
    /**
     * Get all orders for an account. A single order will be returned as an obj/dict whereas
     * multiple orders will be returned as an array/list.
     *
     * @summary Get Account Orders
     */
    brokerageApiAccountsGetAccountOrders(metadata: types.BrokerageApiAccountsGetAccountOrdersMetadataParam): Promise<FetchResponse<200, types.BrokerageApiAccountsGetAccountOrdersResponse200>>;
    /**
     * Place a trading order. Supports equity, option, fractional, multileg, combo, OTO, OCO,
     * and OTOCO order types.
     *
     * @summary Place Order
     */
    brokerageApiTradingPlaceOrder(body: types.BrokerageApiTradingPlaceOrderFormDataParam, metadata: types.BrokerageApiTradingPlaceOrderMetadataParam): Promise<FetchResponse<200, types.BrokerageApiTradingPlaceOrderResponse200>>;
    /**
     * Get a specific order by ID
     *
     * @summary Get Account Order
     */
    brokerageApiGetAccountOrder(metadata: types.BrokerageApiGetAccountOrderMetadataParam): Promise<FetchResponse<200, types.BrokerageApiGetAccountOrderResponse200>>;
    /**
     * Modify an existing order
     *
     * @summary Change Order
     */
    brokerageApiTradingChangeOrder(body: types.BrokerageApiTradingChangeOrderFormDataParam, metadata: types.BrokerageApiTradingChangeOrderMetadataParam): Promise<FetchResponse<200, types.BrokerageApiTradingChangeOrderResponse200>>;
    /**
     * Cancel an existing order
     *
     * @summary Cancel Order
     */
    brokerageApiTradingCancelOrder(metadata: types.BrokerageApiTradingCancelOrderMetadataParam): Promise<FetchResponse<200, types.BrokerageApiTradingCancelOrderResponse200>>;
    /**
     * Get quotes for one or more symbols
     *
     * @summary Get Quotes
     */
    brokerageApiMarketsGetQuotes(metadata: types.BrokerageApiMarketsGetQuotesMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetQuotesResponse200>>;
    /**
     * Get quotes for a larger list of symbols
     *
     * @summary Post Quotes
     */
    brokerageApiMarketsPostQuotes(body: types.BrokerageApiMarketsPostQuotesFormDataParam, metadata: types.BrokerageApiMarketsPostQuotesMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsPostQuotesResponse200>>;
    /**
     * Get option chains for a specific underlying symbol and expiration date. Greek and IV
     * data is included courtesy of ORATS. Please check out their APIs for more in-depth
     * options data.
     *
     * @summary Get Options Chains
     */
    brokerageApiMarketsGetOptionsChains(metadata: types.BrokerageApiMarketsGetOptionsChainsMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetOptionsChainsResponse200>>;
    /**
     * Get available strike prices for a specific underlying symbol and expiration date
     *
     * @summary Get Options Strikes
     */
    brokerageApiMarketsGetOptionsStrikes(metadata: types.BrokerageApiMarketsGetOptionsStrikesMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetOptionsStrikesResponse200>>;
    /**
     * Get available expiration dates for a specific underlying symbol
     *
     * @summary Get Options Expirations
     */
    brokerageApiMarketsGetOptionsExpirations(metadata: types.BrokerageApiMarketsGetOptionsExpirationsMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetOptionsExpirationsResponse200>>;
    /**
     * Get all options symbols for the given underlying. This will include additional option
     * roots (ex. SPXW, RUTW) if applicable.
     *
     * @summary Get Lookup Options Symbols
     */
    brokerageApiMarketsGetLookupOptionsSymbols(metadata: types.BrokerageApiMarketsGetLookupOptionsSymbolsMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetLookupOptionsSymbolsResponse200>>;
    /**
     * Get all greeks in an option chain
     *
     * @summary Get Option Greeks
     */
    brokerageApiMarketsGetRealtimeGreeks(metadata: types.BrokerageApiMarketsGetRealtimeGreeksMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetRealtimeGreeksResponse200>>;
    /**
     * Get historical pricing for a specific security. This data will usually cover the entire
     * lifetime of the company if sending reasonable start/end times. You can fetch historical
     * pricing for options by passing the OCC option symbol (ex. AAPL220617C00270000) as the
     * symbol.
     *
     * @summary Get historical pricing for a security.
     */
    brokerageApiMarketsGetHistory(metadata: types.BrokerageApiMarketsGetHistoryMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetHistoryResponse200>>;
    /**
     * Time and Sales (timesales) is typically used for charting purposes. It captures pricing
     * across a time slice at predefined intervals. Tick data is also available through this
     * endpoint. This results in a very large data set for high-volume symbols, so the time
     * slice needs to be much smaller to keep downloads time reasonable.
     *
     * @summary Get Time & Sales
     */
    brokerageApiMarketsGetTimesales(metadata: types.BrokerageApiMarketsGetTimesalesMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetTimesalesResponse200>>;
    /**
     * The ETB list contains securities that are able to be sold short with a Tradier Brokerage
     * account. The list is quite comprehensive and can result in a long download response
     * time.
     *
     * @summary Get ETB Securities
     */
    brokerageApiMarketsGetEtb(metadata: types.BrokerageApiMarketsGetEtbMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetEtbResponse200>>;
    /**
     * Get the intraday market status. This call will change and return information pertaining
     * to the current day. If programming logic on whether the market is open/closed – this API
     * call should be used to determine the current state.
     *
     * @summary Get Market Clock
     */
    brokerageApiMarketsGetClock(metadata: types.BrokerageApiMarketsGetClockMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetClockResponse200>>;
    /**
     * Get the market calendar for current or a specific month
     *
     * @summary Get Market Calendar
     */
    brokerageApiMarketsGetCalendar(metadata: types.BrokerageApiMarketsGetCalendarMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetCalendarResponse200>>;
    /**
     * Search for securities by partial match on symbol or company name. Results are in
     * descending order by average volume of the security. This can be used for simple search
     * functions
     *
     * @summary Get Market Search
     */
    brokerageApiMarketsGetSearch(metadata: types.BrokerageApiMarketsGetSearchMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetSearchResponse200>>;
    /**
     * Search for a symbol using the ticker symbol or partial symbol. Results are in descending
     * order by average volume of the security. This can be used for simple search functions.
     *
     * @summary Get Market Lookup
     */
    brokerageApiMarketsGetLookup(metadata: types.BrokerageApiMarketsGetLookupMetadataParam): Promise<FetchResponse<200, types.BrokerageApiMarketsGetLookupResponse200>>;
    /**
     * Create a session for streaming market data
     *
     * @summary Create Market Session
     */
    brokerageApiStreamingCreateMarketSession(metadata: types.BrokerageApiStreamingCreateMarketSessionMetadataParam): Promise<FetchResponse<200, types.BrokerageApiStreamingCreateMarketSessionResponse200>>;
    /**
     * Create a session for streaming account-specific events
     *
     * @summary Create Account Session
     */
    brokerageApiStreamingCreateAccountSession(metadata: types.BrokerageApiStreamingCreateAccountSessionMetadataParam): Promise<FetchResponse<200, types.BrokerageApiStreamingCreateAccountSessionResponse200>>;
    /**
     * Retrieve all of a user's watchlists
     *
     * @summary Get All Watchlists
     */
    brokerageApiWatchlistsGetWatchlists(metadata: types.BrokerageApiWatchlistsGetWatchlistsMetadataParam): Promise<FetchResponse<200, types.BrokerageApiWatchlistsGetWatchlistsResponse200>>;
    /**
     * Create a new watchlist. The new watchlist created will use the specified name and
     * optional symbols upon creation.
     *
     * @summary Create Watchlist
     */
    brokerageApiWatchlistsCreateWatchlist(body: types.BrokerageApiWatchlistsCreateWatchlistFormDataParam, metadata: types.BrokerageApiWatchlistsCreateWatchlistMetadataParam): Promise<FetchResponse<200, types.BrokerageApiWatchlistsCreateWatchlistResponse200>>;
    /**
     * Retrieve a specific watchlist by id
     *
     * @summary Get Specific Watchlist
     */
    brokerageApiWatchlistsGetSpecificWatchlist(metadata: types.BrokerageApiWatchlistsGetSpecificWatchlistMetadataParam): Promise<FetchResponse<200, types.BrokerageApiWatchlistsGetSpecificWatchlistResponse200>>;
    /**
     * Update an existing watchlist. This request will override the existing watchlist
     * information with the parameters sent in the body.
     *
     * @summary Update Watchlist
     */
    brokerageApiWatchlistsUpdateWatchlist(body: types.BrokerageApiWatchlistsUpdateWatchlistFormDataParam, metadata: types.BrokerageApiWatchlistsUpdateWatchlistMetadataParam): Promise<FetchResponse<200, types.BrokerageApiWatchlistsUpdateWatchlistResponse200>>;
    /**
     * Delete a specific watchlist
     *
     * @summary Delete Watchlist
     */
    brokerageApiWatchlistsDeleteWatchlist(metadata: types.BrokerageApiWatchlistsDeleteWatchlistMetadataParam): Promise<FetchResponse<200, types.BrokerageApiWatchlistsDeleteWatchlistResponse200>>;
    /**
     * Add symbols to an existing watchlist. If the symbol exists, it will be over-written.
     *
     * @summary Add Symbols to Watchlist
     */
    brokerageApiWatchlistsAddWatchlistSymbols(body: types.BrokerageApiWatchlistsAddWatchlistSymbolsFormDataParam, metadata: types.BrokerageApiWatchlistsAddWatchlistSymbolsMetadataParam): Promise<FetchResponse<200, types.BrokerageApiWatchlistsAddWatchlistSymbolsResponse200>>;
    /**
     * Remove a symbol from a specific watchlist
     *
     * @summary Remove Symbol from Watchlist
     */
    brokerageApiWatchlistsRemoveWatchlistSymbol(metadata: types.BrokerageApiWatchlistsRemoveWatchlistSymbolMetadataParam): Promise<FetchResponse<200, types.BrokerageApiWatchlistsRemoveWatchlistSymbolResponse200>>;
}
declare const createSDK: SDK;
export default createSDK;
