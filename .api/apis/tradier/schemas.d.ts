declare const BrokerageApiAccountsGetAccountBalance: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_id: {
                    readonly type: "string";
                    readonly examples: readonly ["VA000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the account";
                };
            };
            readonly required: readonly ["account_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly balances: {
                    readonly type: "object";
                    readonly properties: {
                        readonly option_short_value: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The value of short option positions";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly total_equity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The total account value";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly account_number: {
                            readonly type: "string";
                            readonly description: "The account number";
                        };
                        readonly account_type: {
                            readonly type: "string";
                            readonly description: "The type of account (margin, cash)\n\n`margin` `cash`";
                            readonly enum: readonly ["margin", "cash"];
                        };
                        readonly close_pl: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The profit/loss from closed positions";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly current_requirement: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The current margin requirement";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly equity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The equity value";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly long_market_value: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The value of long positions";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly market_value: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The total market value";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly open_pl: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The profit/loss from open positions";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly option_long_value: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The value of long option positions";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly option_requirement: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The options margin requirement";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly pending_orders_count: {
                            readonly type: "integer";
                            readonly description: "The number of pending orders";
                        };
                        readonly short_market_value: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The value of short positions";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly stock_long_value: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The value of long stock positions";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly total_cash: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The total cash value";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly uncleared_funds: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The amount of uncleared funds";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly pending_cash: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The amount of pending cash";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly margin: {
                            readonly type: "object";
                            readonly properties: {
                                readonly fed_call: {
                                    readonly type: "number";
                                    readonly format: "float";
                                    readonly description: "Federal call amount";
                                    readonly minimum: -3.402823669209385e+38;
                                    readonly maximum: 3.402823669209385e+38;
                                };
                                readonly maintenance_call: {
                                    readonly type: "number";
                                    readonly format: "float";
                                    readonly description: "Maintenance call amount";
                                    readonly minimum: -3.402823669209385e+38;
                                    readonly maximum: 3.402823669209385e+38;
                                };
                                readonly option_buying_power: {
                                    readonly type: "number";
                                    readonly format: "float";
                                    readonly description: "The buying power for options";
                                    readonly minimum: -3.402823669209385e+38;
                                    readonly maximum: 3.402823669209385e+38;
                                };
                                readonly stock_buying_power: {
                                    readonly type: "number";
                                    readonly format: "float";
                                    readonly description: "The buying power for stocks";
                                    readonly minimum: -3.402823669209385e+38;
                                    readonly maximum: 3.402823669209385e+38;
                                };
                                readonly stock_short_value: {
                                    readonly type: "number";
                                    readonly format: "float";
                                    readonly description: "The value of short stock positions";
                                    readonly minimum: -3.402823669209385e+38;
                                    readonly maximum: 3.402823669209385e+38;
                                };
                                readonly sweep: {
                                    readonly type: "number";
                                    readonly format: "float";
                                    readonly description: "Sweep amount";
                                    readonly minimum: -3.402823669209385e+38;
                                    readonly maximum: 3.402823669209385e+38;
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiAccountsGetAccountGainloss: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_id: {
                    readonly type: "string";
                    readonly examples: readonly ["VA000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the account";
                };
            };
            readonly required: readonly ["account_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Page number for pagination";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly default: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Set a max number of number of positions to return";
                };
                readonly sortBy: {
                    readonly type: "string";
                    readonly enum: readonly ["closedate", "opendate", "symbol", "gainloss"];
                    readonly default: "closedate";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Sort the results by specified field";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly enum: readonly ["asc", "desc"];
                    readonly default: "desc";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Sort direction (ascending/descending)";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly gainloss: {
                    readonly type: "object";
                    readonly properties: {
                        readonly closed_position: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly close_date: {
                                        readonly type: "string";
                                        readonly format: "date-time";
                                        readonly description: "The date the position was closed";
                                    };
                                    readonly cost: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The cost basis of the position";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly gain_loss: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The gain or loss amount";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly gain_loss_percent: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The gain or loss percentage";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly open_date: {
                                        readonly type: "string";
                                        readonly format: "date-time";
                                        readonly description: "The date the position was opened";
                                    };
                                    readonly proceeds: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The proceeds from the closed position";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly quantity: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The quantity of the security";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The security symbol";
                                    };
                                    readonly term: {
                                        readonly type: "integer";
                                        readonly description: "The holding period in days";
                                    };
                                };
                            };
                            readonly description: "List of closed positions";
                        };
                        readonly page: {
                            readonly type: "integer";
                            readonly description: "Current page number";
                        };
                        readonly total_pages: {
                            readonly type: "integer";
                            readonly description: "Total number of pages";
                        };
                        readonly total_positions: {
                            readonly type: "integer";
                            readonly description: "Total number of positions";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiAccountsGetAccountHistoricalBalance: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_id: {
                    readonly type: "string";
                    readonly examples: readonly ["VA000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the account";
                };
            };
            readonly required: readonly ["account_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly period: {
                    readonly type: "string";
                    readonly enum: readonly ["WEEK", "MONTH", "YTD", "YEAR", "YEAR_3", "YEAR_5", "ALL"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Type of activities to return";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiAccountsGetAccountHistory: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_id: {
                    readonly type: "string";
                    readonly examples: readonly ["VA000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the account";
                };
            };
            readonly required: readonly ["account_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Page number for pagination";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly default: 25;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Number of events to return";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["trade", "option", "ach", "wire", "dividend", "fee", "tax", "journal", "check", "transfer", "adjustment"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Type of activities to return";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly history: {
                    readonly type: "object";
                    readonly properties: {
                        readonly event: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly date: {
                                        readonly type: "string";
                                        readonly format: "date-time";
                                        readonly description: "The date of the event";
                                    };
                                    readonly type: {
                                        readonly type: "string";
                                        readonly description: "The type of event\n\n`trade` `option` `ach` `wire` `dividend` `fee` `tax` `journal` `check` `transfer` `adjustment`";
                                        readonly enum: readonly ["trade", "option", "ach", "wire", "dividend", "fee", "tax", "journal", "check", "transfer", "adjustment"];
                                    };
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The security symbol (for applicable event types)";
                                    };
                                    readonly quantity: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The quantity involved in the event (for applicable event types)";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly price: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The price per share/contract (for applicable event types)";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly amount: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The total amount of the event";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                        readonly description: "Description of the event";
                                    };
                                    readonly commission: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "Commission charged for the event (for applicable event types)";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                };
                            };
                            readonly description: "List of historical events";
                        };
                        readonly page: {
                            readonly type: "integer";
                            readonly description: "Current page number";
                        };
                        readonly total_pages: {
                            readonly type: "integer";
                            readonly description: "Total number of pages";
                        };
                        readonly total_events: {
                            readonly type: "integer";
                            readonly description: "Total number of events";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiAccountsGetAccountOrders: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_id: {
                    readonly type: "string";
                    readonly examples: readonly ["VA000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the account";
                };
            };
            readonly required: readonly ["account_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Page number for pagination which is only useful for very large numbers of order broken into pages for faster retrieval";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly default: 25;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Number of orders to return, 15 is defualt but you can set a high number such as 500 to retrieve all your orders in one call";
                };
                readonly includeTags: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Include user-defined tags in response";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly orders: {
                    readonly type: "object";
                    readonly properties: {
                        readonly order: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "integer";
                                        readonly description: "The order ID";
                                    };
                                    readonly type: {
                                        readonly type: "string";
                                        readonly description: "The order type\n\n`market` `limit` `stop` `stop_limit` `debit` `credit` `even`";
                                        readonly enum: readonly ["market", "limit", "stop", "stop_limit", "debit", "credit", "even"];
                                    };
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The security symbol";
                                    };
                                    readonly side: {
                                        readonly type: "string";
                                        readonly description: "The side of the order\n\n`buy` `buy_to_cover` `sell` `sell_short` `buy_to_open` `buy_to_close` `sell_to_open` `sell_to_close`";
                                        readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                                    };
                                    readonly quantity: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The order quantity";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly status: {
                                        readonly type: "string";
                                        readonly description: "The order status\n\n`pending` `open` `partially_filled` `filled` `expired` `canceled` `rejected` `pending_cancel`";
                                        readonly enum: readonly ["pending", "open", "partially_filled", "filled", "expired", "canceled", "rejected", "pending_cancel"];
                                    };
                                    readonly duration: {
                                        readonly type: "string";
                                        readonly description: "The order duration\n\n`day` `gtc` `pre` `post`";
                                        readonly enum: readonly ["day", "gtc", "pre", "post"];
                                    };
                                    readonly avg_fill_price: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The average fill price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly exec_quantity: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The executed quantity";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly create_date: {
                                        readonly type: "string";
                                        readonly format: "date-time";
                                        readonly description: "The date the order was created";
                                    };
                                    readonly transaction_date: {
                                        readonly type: "string";
                                        readonly format: "date-time";
                                        readonly description: "The date of the last transaction";
                                    };
                                    readonly class: {
                                        readonly type: "string";
                                        readonly description: "The security class\n\n`equity` `option` `multileg` `combo`";
                                        readonly enum: readonly ["equity", "option", "multileg", "combo"];
                                    };
                                };
                            };
                            readonly description: "List of orders";
                        };
                        readonly page: {
                            readonly type: "integer";
                            readonly description: "Current page number";
                        };
                        readonly total_pages: {
                            readonly type: "integer";
                            readonly description: "Total number of pages";
                        };
                        readonly total_orders: {
                            readonly type: "integer";
                            readonly description: "Total number of orders";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiAccountsGetAccountPositions: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_id: {
                    readonly type: "string";
                    readonly examples: readonly ["VA000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the account";
                };
            };
            readonly required: readonly ["account_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly positions: {
                    readonly type: "object";
                    readonly properties: {
                        readonly position: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly cost_basis: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The cost basis of the position";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly date_acquired: {
                                        readonly type: "string";
                                        readonly format: "date-time";
                                        readonly description: "The date the position was acquired";
                                    };
                                    readonly id: {
                                        readonly type: "integer";
                                        readonly description: "The position ID";
                                    };
                                    readonly quantity: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The quantity of the security (negative for short positions)";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The security symbol";
                                    };
                                };
                            };
                            readonly description: "List of positions held in the account";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiGetAccountOrder: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_id: {
                    readonly type: "string";
                    readonly examples: readonly ["VA000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the account";
                };
                readonly order_id: {
                    readonly type: "integer";
                    readonly examples: readonly [123456];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the order";
                };
            };
            readonly required: readonly ["account_id", "order_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly includeTags: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Include user-defined tags in response";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly order: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "integer";
                            readonly description: "The order ID";
                        };
                        readonly type: {
                            readonly type: "string";
                            readonly description: "The order type\n\n`market` `limit` `stop` `stop_limit` `debit` `credit` `even`";
                            readonly enum: readonly ["market", "limit", "stop", "stop_limit", "debit", "credit", "even"];
                        };
                        readonly symbol: {
                            readonly type: "string";
                            readonly description: "The security symbol";
                        };
                        readonly side: {
                            readonly type: "string";
                            readonly description: "The side of the order\n\n`buy` `buy_to_cover` `sell` `sell_short` `buy_to_open` `buy_to_close` `sell_to_open` `sell_to_close`";
                            readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                        };
                        readonly quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The order quantity";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly description: "The order status\n\n`pending` `open` `partially_filled` `filled` `expired` `canceled` `rejected` `pending_cancel`";
                            readonly enum: readonly ["pending", "open", "partially_filled", "filled", "expired", "canceled", "rejected", "pending_cancel"];
                        };
                        readonly duration: {
                            readonly type: "string";
                            readonly description: "The order duration\n\n`day` `gtc` `pre` `post`";
                            readonly enum: readonly ["day", "gtc", "pre", "post"];
                        };
                        readonly avg_fill_price: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The average fill price";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly exec_quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The executed quantity";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly create_date: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "The date the order was created";
                        };
                        readonly transaction_date: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "The date of the last transaction";
                        };
                        readonly class: {
                            readonly type: "string";
                            readonly description: "The security class\n\n`equity` `option` `multileg` `combo`";
                            readonly enum: readonly ["equity", "option", "multileg", "combo"];
                        };
                        readonly last_fill_price: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The price of the last fill";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly last_fill_quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The quantity of the last fill";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly remaining_quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The quantity remaining to be filled";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetCalendar: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly month: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 12;
                    readonly examples: readonly [2];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The calendar month (1-12)";
                };
                readonly year: {
                    readonly type: "integer";
                    readonly minimum: 2000;
                    readonly maximum: 2050;
                    readonly examples: readonly [2021];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The calendar year";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly calendar: {
                    readonly type: "object";
                    readonly properties: {
                        readonly days: {
                            readonly type: "object";
                            readonly properties: {
                                readonly day: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly date: {
                                                readonly type: "string";
                                                readonly format: "date";
                                                readonly description: "The date";
                                            };
                                            readonly status: {
                                                readonly type: "string";
                                                readonly enum: readonly ["open", "closed"];
                                                readonly description: "The market status\n\n`open` `closed`";
                                            };
                                            readonly description: {
                                                readonly type: "string";
                                                readonly description: "Description of the market status";
                                            };
                                            readonly premarket: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly start: {
                                                        readonly type: "string";
                                                        readonly format: "time";
                                                        readonly description: "Start time of pre-market trading";
                                                    };
                                                    readonly end: {
                                                        readonly type: "string";
                                                        readonly format: "time";
                                                        readonly description: "End time of pre-market trading";
                                                    };
                                                };
                                            };
                                            readonly open: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly start: {
                                                        readonly type: "string";
                                                        readonly format: "time";
                                                        readonly description: "Start time of regular trading";
                                                    };
                                                    readonly end: {
                                                        readonly type: "string";
                                                        readonly format: "time";
                                                        readonly description: "End time of regular trading";
                                                    };
                                                };
                                            };
                                            readonly postmarket: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly start: {
                                                        readonly type: "string";
                                                        readonly format: "time";
                                                        readonly description: "Start time of post-market trading";
                                                    };
                                                    readonly end: {
                                                        readonly type: "string";
                                                        readonly format: "time";
                                                        readonly description: "End time of post-market trading";
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly month: {
                            readonly type: "integer";
                            readonly description: "The calendar month";
                        };
                        readonly year: {
                            readonly type: "integer";
                            readonly description: "The calendar year";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetClock: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly clock: {
                    readonly type: "object";
                    readonly properties: {
                        readonly date: {
                            readonly type: "string";
                            readonly format: "date";
                            readonly description: "The current date";
                        };
                        readonly description: {
                            readonly type: "string";
                            readonly description: "Description of the current market state";
                        };
                        readonly state: {
                            readonly type: "string";
                            readonly enum: readonly ["pre", "open", "post", "closed"];
                            readonly description: "The current market state\n\n`pre` `open` `post` `closed`";
                        };
                        readonly timestamp: {
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly description: "The current time (Unix timestamp)";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly next_state: {
                            readonly type: "string";
                            readonly enum: readonly ["pre", "open", "post", "closed"];
                            readonly description: "The next market state\n\n`pre` `open` `post` `closed`";
                        };
                        readonly next_change: {
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly description: "The time of the next state change (Unix timestamp)";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetEtb: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly securities: {
                    readonly type: "object";
                    readonly properties: {
                        readonly security: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The security symbol";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetHistory: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly symbol: {
                    readonly type: "string";
                    readonly examples: readonly ["AAPL"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The security symbol";
                };
                readonly interval: {
                    readonly type: "string";
                    readonly enum: readonly ["daily", "weekly", "monthly"];
                    readonly default: "daily";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The interval for the data";
                };
                readonly start: {
                    readonly type: "string";
                    readonly format: "date";
                    readonly examples: readonly ["2020-01-01"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The start date for the data (YYYY-MM-DD)";
                };
                readonly end: {
                    readonly type: "string";
                    readonly format: "date";
                    readonly examples: readonly ["2021-01-01"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The end date for the data (YYYY-MM-DD)";
                };
            };
            readonly required: readonly ["symbol"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly history: {
                    readonly type: "object";
                    readonly properties: {
                        readonly day: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly date: {
                                        readonly type: "string";
                                        readonly format: "date";
                                        readonly description: "The date";
                                    };
                                    readonly open: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The opening price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly high: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The high price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly low: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The low price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly close: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The closing price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly volume: {
                                        readonly type: "integer";
                                        readonly description: "The trading volume";
                                    };
                                };
                            };
                        };
                        readonly symbol: {
                            readonly type: "string";
                            readonly description: "The security symbol";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetLookup: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly q: {
                    readonly type: "string";
                    readonly examples: readonly ["apple"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The lookup query (symbol or name)";
                };
                readonly exchanges: {
                    readonly type: "string";
                    readonly enum: readonly ["Q", "N", "A", "B", "C", "P", "I", "M", "W", "Z"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter for specific exchanges";
                };
                readonly types: {
                    readonly type: "string";
                    readonly enum: readonly ["stock", "etf", "index"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter for specific security types";
                };
            };
            readonly required: readonly ["q"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly securities: {
                    readonly type: "object";
                    readonly properties: {
                        readonly security: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The security symbol";
                                    };
                                    readonly exchange: {
                                        readonly type: "string";
                                        readonly description: "The exchange code";
                                    };
                                    readonly type: {
                                        readonly type: "string";
                                        readonly enum: readonly ["stock", "etf", "index", "option", "mutual_fund"];
                                        readonly description: "The security type\n\n`stock` `etf` `index` `option` `mutual_fund`";
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                        readonly description: "The security description";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetLookupOptionsSymbols: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly underlying: {
                    readonly type: "string";
                    readonly examples: readonly ["AAPL"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The underlying security symbol";
                };
                readonly strike: {
                    readonly type: "number";
                    readonly format: "float";
                    readonly examples: readonly [125];
                    readonly minimum: -3.402823669209385e+38;
                    readonly maximum: 3.402823669209385e+38;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The option strike price";
                };
                readonly expiration: {
                    readonly type: "string";
                    readonly format: "date";
                    readonly examples: readonly ["2021-04-16"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The expiration date (YYYY-MM-DD)";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["call", "put"];
                    readonly examples: readonly ["call"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The option type";
                };
            };
            readonly required: readonly ["underlying"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly options: {
                    readonly type: "object";
                    readonly properties: {
                        readonly option: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The option symbol";
                                    };
                                    readonly rootsymbol: {
                                        readonly type: "string";
                                        readonly description: "The root symbol";
                                    };
                                    readonly strike: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The strike price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly date: {
                                        readonly type: "string";
                                        readonly format: "date";
                                        readonly description: "The expiration date";
                                    };
                                    readonly type: {
                                        readonly type: "string";
                                        readonly enum: readonly ["call", "put"];
                                        readonly description: "The option type\n\n`call` `put`";
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                        readonly description: "The option description";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetOptionsChains: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly symbol: {
                    readonly type: "string";
                    readonly examples: readonly ["AAPL"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The underlying security symbol";
                };
                readonly expiration: {
                    readonly type: "string";
                    readonly format: "date";
                    readonly examples: readonly ["2021-04-16"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The expiration date (YYYY-MM-DD)";
                };
                readonly greeks: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Include greek calculations";
                };
            };
            readonly required: readonly ["symbol", "expiration"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly options: {
                    readonly type: "object";
                    readonly properties: {
                        readonly option: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The security symbol";
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                        readonly description: "The security description";
                                    };
                                    readonly exch: {
                                        readonly type: "string";
                                        readonly description: "The exchange code";
                                    };
                                    readonly type: {
                                        readonly type: "string";
                                        readonly description: "The security type";
                                    };
                                    readonly last: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The last price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly change: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The change in price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly volume: {
                                        readonly type: "integer";
                                        readonly description: "The trading volume";
                                    };
                                    readonly open: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The opening price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly high: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The high price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly low: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The low price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly close: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The previous closing price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly bid: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The bid price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly ask: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The ask price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly change_percentage: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The percentage change in price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly average_volume: {
                                        readonly type: "integer";
                                        readonly description: "The average trading volume";
                                    };
                                    readonly last_volume: {
                                        readonly type: "integer";
                                        readonly description: "The volume of the last trade";
                                    };
                                    readonly trade_date: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly description: "The date of the last trade (Unix timestamp)";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly prevclose: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The previous day's closing price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly week_52_high: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The 52-week high price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly week_52_low: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The 52-week low price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly bidsize: {
                                        readonly type: "integer";
                                        readonly description: "The size of the bid";
                                    };
                                    readonly bidexch: {
                                        readonly type: "string";
                                        readonly description: "The exchange code for the bid";
                                    };
                                    readonly bid_date: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly description: "The date of the bid (Unix timestamp)";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly asksize: {
                                        readonly type: "integer";
                                        readonly description: "The size of the ask";
                                    };
                                    readonly askexch: {
                                        readonly type: "string";
                                        readonly description: "The exchange code for the ask";
                                    };
                                    readonly ask_date: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly description: "The date of the ask (Unix timestamp)";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly open_interest: {
                                        readonly type: "integer";
                                        readonly description: "The open interest (for options)";
                                    };
                                    readonly contract_size: {
                                        readonly type: "integer";
                                        readonly description: "The contract size (for options)";
                                    };
                                    readonly expiration_date: {
                                        readonly type: "string";
                                        readonly format: "date";
                                        readonly description: "The expiration date (for options)";
                                    };
                                    readonly expiration_type: {
                                        readonly type: "string";
                                        readonly description: "The expiration type (for options)";
                                    };
                                    readonly option_type: {
                                        readonly type: "string";
                                        readonly enum: readonly ["call", "put"];
                                        readonly description: "The option type (for options)\n\n`call` `put`";
                                    };
                                    readonly root_symbol: {
                                        readonly type: "string";
                                        readonly description: "The root symbol (for options)";
                                    };
                                    readonly underlying: {
                                        readonly type: "string";
                                        readonly description: "The underlying symbol (for options)";
                                    };
                                    readonly strike: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The strike price (for options)";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly lot_size: {
                                        readonly type: "integer";
                                        readonly description: "The lot size";
                                    };
                                    readonly greeks: {
                                        readonly type: "object";
                                        readonly description: "Option greeks (available when greeks=true)";
                                        readonly properties: {
                                            readonly delta: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly gamma: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly theta: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly vega: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly rho: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly phi: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly bid_iv: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly mid_iv: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly ask_iv: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly smv_vol: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly updated_at: {
                                                readonly type: "string";
                                                readonly format: "date-time";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetOptionsExpirations: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly symbol: {
                    readonly type: "string";
                    readonly examples: readonly ["AAPL"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The underlying security symbol";
                };
                readonly includeAllRoots: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Include all option roots";
                };
                readonly strikes: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Include strikes in response";
                };
                readonly contractSize: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Include contract size in response";
                };
                readonly expirationType: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Include expiration type in response";
                };
            };
            readonly required: readonly ["symbol", "includeAllRoots"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly expirations: {
                    readonly type: "object";
                    readonly properties: {
                        readonly date: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                                readonly format: "date";
                            };
                            readonly description: "List of available expiration dates";
                        };
                        readonly strikes: {
                            readonly type: "object";
                            readonly properties: {
                                readonly strike: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly date: {
                                                readonly type: "string";
                                                readonly format: "date";
                                            };
                                            readonly strike: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetOptionsStrikes: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly symbol: {
                    readonly type: "string";
                    readonly examples: readonly ["AAPL"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The underlying security symbol";
                };
                readonly expiration: {
                    readonly type: "string";
                    readonly format: "date";
                    readonly examples: readonly ["2021-04-16"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The expiration date (YYYY-MM-DD)";
                };
            };
            readonly required: readonly ["symbol", "expiration"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly strikes: {
                    readonly type: "object";
                    readonly properties: {
                        readonly strike: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "number";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly description: "List of available strike prices";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetQuotes: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly symbols: {
                    readonly type: "string";
                    readonly examples: readonly ["AAPL,SPY"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "A comma-separated list of symbols";
                };
                readonly greeks: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Include greek calculations for options";
                };
                readonly includeLotSize: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Include lot size information";
                };
            };
            readonly required: readonly ["symbols"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly quotes: {
                    readonly type: "object";
                    readonly properties: {
                        readonly quote: {
                            readonly oneOf: readonly [{
                                readonly type: "object";
                                readonly properties: {
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The security symbol";
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                        readonly description: "The security description";
                                    };
                                    readonly exch: {
                                        readonly type: "string";
                                        readonly description: "The exchange code";
                                    };
                                    readonly type: {
                                        readonly type: "string";
                                        readonly description: "The security type";
                                    };
                                    readonly last: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The last price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly change: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The change in price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly volume: {
                                        readonly type: "integer";
                                        readonly description: "The trading volume";
                                    };
                                    readonly open: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The opening price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly high: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The high price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly low: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The low price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly close: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The previous closing price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly bid: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The bid price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly ask: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The ask price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly change_percentage: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The percentage change in price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly average_volume: {
                                        readonly type: "integer";
                                        readonly description: "The average trading volume";
                                    };
                                    readonly last_volume: {
                                        readonly type: "integer";
                                        readonly description: "The volume of the last trade";
                                    };
                                    readonly trade_date: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly description: "The date of the last trade (Unix timestamp)";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly prevclose: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The previous day's closing price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly week_52_high: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The 52-week high price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly week_52_low: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The 52-week low price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly bidsize: {
                                        readonly type: "integer";
                                        readonly description: "The size of the bid";
                                    };
                                    readonly bidexch: {
                                        readonly type: "string";
                                        readonly description: "The exchange code for the bid";
                                    };
                                    readonly bid_date: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly description: "The date of the bid (Unix timestamp)";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly asksize: {
                                        readonly type: "integer";
                                        readonly description: "The size of the ask";
                                    };
                                    readonly askexch: {
                                        readonly type: "string";
                                        readonly description: "The exchange code for the ask";
                                    };
                                    readonly ask_date: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly description: "The date of the ask (Unix timestamp)";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly open_interest: {
                                        readonly type: "integer";
                                        readonly description: "The open interest (for options)";
                                    };
                                    readonly contract_size: {
                                        readonly type: "integer";
                                        readonly description: "The contract size (for options)";
                                    };
                                    readonly expiration_date: {
                                        readonly type: "string";
                                        readonly format: "date";
                                        readonly description: "The expiration date (for options)";
                                    };
                                    readonly expiration_type: {
                                        readonly type: "string";
                                        readonly description: "The expiration type (for options)";
                                    };
                                    readonly option_type: {
                                        readonly type: "string";
                                        readonly enum: readonly ["call", "put"];
                                        readonly description: "The option type (for options)\n\n`call` `put`";
                                    };
                                    readonly root_symbol: {
                                        readonly type: "string";
                                        readonly description: "The root symbol (for options)";
                                    };
                                    readonly underlying: {
                                        readonly type: "string";
                                        readonly description: "The underlying symbol (for options)";
                                    };
                                    readonly strike: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The strike price (for options)";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly lot_size: {
                                        readonly type: "integer";
                                        readonly description: "The lot size";
                                    };
                                    readonly greeks: {
                                        readonly type: "object";
                                        readonly description: "Option greeks (available when greeks=true)";
                                        readonly properties: {
                                            readonly delta: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly gamma: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly theta: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly vega: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly rho: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly phi: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly bid_iv: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly mid_iv: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly ask_iv: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly smv_vol: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly updated_at: {
                                                readonly type: "string";
                                                readonly format: "date-time";
                                            };
                                        };
                                    };
                                };
                            }, {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly symbol: {
                                            readonly type: "string";
                                            readonly description: "The security symbol";
                                        };
                                        readonly description: {
                                            readonly type: "string";
                                            readonly description: "The security description";
                                        };
                                        readonly exch: {
                                            readonly type: "string";
                                            readonly description: "The exchange code";
                                        };
                                        readonly type: {
                                            readonly type: "string";
                                            readonly description: "The security type";
                                        };
                                        readonly last: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The last price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly change: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The change in price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly volume: {
                                            readonly type: "integer";
                                            readonly description: "The trading volume";
                                        };
                                        readonly open: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The opening price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly high: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The high price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly low: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The low price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly close: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The previous closing price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly bid: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The bid price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly ask: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The ask price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly change_percentage: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The percentage change in price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly average_volume: {
                                            readonly type: "integer";
                                            readonly description: "The average trading volume";
                                        };
                                        readonly last_volume: {
                                            readonly type: "integer";
                                            readonly description: "The volume of the last trade";
                                        };
                                        readonly trade_date: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly description: "The date of the last trade (Unix timestamp)";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly prevclose: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The previous day's closing price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly week_52_high: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The 52-week high price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly week_52_low: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The 52-week low price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly bidsize: {
                                            readonly type: "integer";
                                            readonly description: "The size of the bid";
                                        };
                                        readonly bidexch: {
                                            readonly type: "string";
                                            readonly description: "The exchange code for the bid";
                                        };
                                        readonly bid_date: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly description: "The date of the bid (Unix timestamp)";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly asksize: {
                                            readonly type: "integer";
                                            readonly description: "The size of the ask";
                                        };
                                        readonly askexch: {
                                            readonly type: "string";
                                            readonly description: "The exchange code for the ask";
                                        };
                                        readonly ask_date: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly description: "The date of the ask (Unix timestamp)";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly open_interest: {
                                            readonly type: "integer";
                                            readonly description: "The open interest (for options)";
                                        };
                                        readonly contract_size: {
                                            readonly type: "integer";
                                            readonly description: "The contract size (for options)";
                                        };
                                        readonly expiration_date: {
                                            readonly type: "string";
                                            readonly format: "date";
                                            readonly description: "The expiration date (for options)";
                                        };
                                        readonly expiration_type: {
                                            readonly type: "string";
                                            readonly description: "The expiration type (for options)";
                                        };
                                        readonly option_type: {
                                            readonly type: "string";
                                            readonly enum: readonly ["call", "put"];
                                            readonly description: "The option type (for options)\n\n`call` `put`";
                                        };
                                        readonly root_symbol: {
                                            readonly type: "string";
                                            readonly description: "The root symbol (for options)";
                                        };
                                        readonly underlying: {
                                            readonly type: "string";
                                            readonly description: "The underlying symbol (for options)";
                                        };
                                        readonly strike: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The strike price (for options)";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly lot_size: {
                                            readonly type: "integer";
                                            readonly description: "The lot size";
                                        };
                                        readonly greeks: {
                                            readonly type: "object";
                                            readonly description: "Option greeks (available when greeks=true)";
                                            readonly properties: {
                                                readonly delta: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly gamma: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly theta: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly vega: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly rho: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly phi: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly bid_iv: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly mid_iv: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly ask_iv: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly smv_vol: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly updated_at: {
                                                    readonly type: "string";
                                                    readonly format: "date-time";
                                                };
                                            };
                                        };
                                    };
                                };
                            }];
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetRealtimeGreeks: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly symbol: {
                    readonly type: "string";
                    readonly examples: readonly ["VXX"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Underlying symbol of the chain";
                };
                readonly expiration: {
                    readonly type: "string";
                    readonly format: "date";
                    readonly examples: readonly ["2019-05-17"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Expiration for the chain (YYYY-MM-DD)";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["put", "call"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Option type";
                };
            };
            readonly required: readonly ["symbol", "expiration"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly greeks: {
                    readonly type: "object";
                    readonly properties: {
                        readonly greek: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The option symbol";
                                    };
                                    readonly delta: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The delta of the option";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly gamma: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The gamma of the option";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly theta: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The theta of the option";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly vega: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The vega of the option";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly rho: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The rho of the option";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly phi: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The phi of the option";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly bid_iv: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The bid implied volatility";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly mid_iv: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The mid implied volatility";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly ask_iv: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The ask implied volatility";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly smv_vol: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The smoothed market value volatility";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly updated_at: {
                                        readonly type: "string";
                                        readonly format: "date-time";
                                        readonly description: "The timestamp of when the greeks were last updated";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetSearch: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly q: {
                    readonly type: "string";
                    readonly examples: readonly ["app"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The search query (symbol or name)";
                };
                readonly indexes: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Include indices in the results";
                };
            };
            readonly required: readonly ["q"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly securities: {
                    readonly type: "object";
                    readonly properties: {
                        readonly security: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The security symbol";
                                    };
                                    readonly exchange: {
                                        readonly type: "string";
                                        readonly description: "The exchange code";
                                    };
                                    readonly type: {
                                        readonly type: "string";
                                        readonly enum: readonly ["stock", "etf", "index", "option", "mutual_fund"];
                                        readonly description: "The security type\n\n`stock` `etf` `index` `option` `mutual_fund`";
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                        readonly description: "The security description";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsGetTimesales: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly symbol: {
                    readonly type: "string";
                    readonly examples: readonly ["AAPL"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The security symbol";
                };
                readonly interval: {
                    readonly type: "string";
                    readonly enum: readonly ["tick", "1min", "5min", "15min"];
                    readonly default: "tick";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The interval for the data";
                };
                readonly start: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly examples: readonly ["2021-02-01 09:30"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The start date/time for the data (YYYY-MM-DD HH:MM)";
                };
                readonly end: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly examples: readonly ["2021-02-01 16:00"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The end date/time for the data (YYYY-MM-DD HH:MM)";
                };
                readonly session_filter: {
                    readonly type: "string";
                    readonly enum: readonly ["open", "all"];
                    readonly default: "all";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter pre/post market data";
                };
            };
            readonly required: readonly ["symbol"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly series: {
                    readonly type: "object";
                    readonly properties: {
                        readonly data: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly time: {
                                        readonly type: "string";
                                        readonly format: "date-time";
                                        readonly description: "The time";
                                    };
                                    readonly price: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly open: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The opening price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly high: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The high price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly low: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The low price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly close: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The closing price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly volume: {
                                        readonly type: "integer";
                                        readonly description: "The trading volume";
                                    };
                                };
                            };
                        };
                        readonly symbol: {
                            readonly type: "string";
                            readonly description: "The security symbol";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiMarketsPostQuotes: {
    readonly formData: {
        readonly type: "object";
        readonly required: readonly ["symbols"];
        readonly properties: {
            readonly symbols: {
                readonly type: "string";
                readonly description: "A comma-separated list of symbols";
                readonly examples: readonly ["AAPL,SPY,QQQ,MSFT,AMZN,FB,GOOG,TSLA,NFLX,BABA"];
            };
            readonly greeks: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Include greek calculations for options";
            };
            readonly includeLotSize: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Include lot size information";
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "Content-Type": {
                    readonly type: "string";
                    readonly enum: readonly ["application/x-www-form-urlencoded"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request content type";
                };
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Content-Type", "Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly quotes: {
                    readonly type: "object";
                    readonly properties: {
                        readonly quote: {
                            readonly oneOf: readonly [{
                                readonly type: "object";
                                readonly properties: {
                                    readonly symbol: {
                                        readonly type: "string";
                                        readonly description: "The security symbol";
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                        readonly description: "The security description";
                                    };
                                    readonly exch: {
                                        readonly type: "string";
                                        readonly description: "The exchange code";
                                    };
                                    readonly type: {
                                        readonly type: "string";
                                        readonly description: "The security type";
                                    };
                                    readonly last: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The last price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly change: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The change in price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly volume: {
                                        readonly type: "integer";
                                        readonly description: "The trading volume";
                                    };
                                    readonly open: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The opening price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly high: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The high price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly low: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The low price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly close: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The previous closing price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly bid: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The bid price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly ask: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The ask price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly change_percentage: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The percentage change in price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly average_volume: {
                                        readonly type: "integer";
                                        readonly description: "The average trading volume";
                                    };
                                    readonly last_volume: {
                                        readonly type: "integer";
                                        readonly description: "The volume of the last trade";
                                    };
                                    readonly trade_date: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly description: "The date of the last trade (Unix timestamp)";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly prevclose: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The previous day's closing price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly week_52_high: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The 52-week high price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly week_52_low: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The 52-week low price";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly bidsize: {
                                        readonly type: "integer";
                                        readonly description: "The size of the bid";
                                    };
                                    readonly bidexch: {
                                        readonly type: "string";
                                        readonly description: "The exchange code for the bid";
                                    };
                                    readonly bid_date: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly description: "The date of the bid (Unix timestamp)";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly asksize: {
                                        readonly type: "integer";
                                        readonly description: "The size of the ask";
                                    };
                                    readonly askexch: {
                                        readonly type: "string";
                                        readonly description: "The exchange code for the ask";
                                    };
                                    readonly ask_date: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly description: "The date of the ask (Unix timestamp)";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly open_interest: {
                                        readonly type: "integer";
                                        readonly description: "The open interest (for options)";
                                    };
                                    readonly contract_size: {
                                        readonly type: "integer";
                                        readonly description: "The contract size (for options)";
                                    };
                                    readonly expiration_date: {
                                        readonly type: "string";
                                        readonly format: "date";
                                        readonly description: "The expiration date (for options)";
                                    };
                                    readonly expiration_type: {
                                        readonly type: "string";
                                        readonly description: "The expiration type (for options)";
                                    };
                                    readonly option_type: {
                                        readonly type: "string";
                                        readonly enum: readonly ["call", "put"];
                                        readonly description: "The option type (for options)\n\n`call` `put`";
                                    };
                                    readonly root_symbol: {
                                        readonly type: "string";
                                        readonly description: "The root symbol (for options)";
                                    };
                                    readonly underlying: {
                                        readonly type: "string";
                                        readonly description: "The underlying symbol (for options)";
                                    };
                                    readonly strike: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "The strike price (for options)";
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly lot_size: {
                                        readonly type: "integer";
                                        readonly description: "The lot size";
                                    };
                                    readonly greeks: {
                                        readonly type: "object";
                                        readonly description: "Option greeks (available when greeks=true)";
                                        readonly properties: {
                                            readonly delta: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly gamma: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly theta: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly vega: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly rho: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly phi: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly bid_iv: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly mid_iv: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly ask_iv: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly smv_vol: {
                                                readonly type: "number";
                                                readonly format: "float";
                                                readonly minimum: -3.402823669209385e+38;
                                                readonly maximum: 3.402823669209385e+38;
                                            };
                                            readonly updated_at: {
                                                readonly type: "string";
                                                readonly format: "date-time";
                                            };
                                        };
                                    };
                                };
                            }, {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly symbol: {
                                            readonly type: "string";
                                            readonly description: "The security symbol";
                                        };
                                        readonly description: {
                                            readonly type: "string";
                                            readonly description: "The security description";
                                        };
                                        readonly exch: {
                                            readonly type: "string";
                                            readonly description: "The exchange code";
                                        };
                                        readonly type: {
                                            readonly type: "string";
                                            readonly description: "The security type";
                                        };
                                        readonly last: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The last price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly change: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The change in price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly volume: {
                                            readonly type: "integer";
                                            readonly description: "The trading volume";
                                        };
                                        readonly open: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The opening price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly high: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The high price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly low: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The low price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly close: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The previous closing price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly bid: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The bid price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly ask: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The ask price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly change_percentage: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The percentage change in price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly average_volume: {
                                            readonly type: "integer";
                                            readonly description: "The average trading volume";
                                        };
                                        readonly last_volume: {
                                            readonly type: "integer";
                                            readonly description: "The volume of the last trade";
                                        };
                                        readonly trade_date: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly description: "The date of the last trade (Unix timestamp)";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly prevclose: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The previous day's closing price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly week_52_high: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The 52-week high price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly week_52_low: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The 52-week low price";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly bidsize: {
                                            readonly type: "integer";
                                            readonly description: "The size of the bid";
                                        };
                                        readonly bidexch: {
                                            readonly type: "string";
                                            readonly description: "The exchange code for the bid";
                                        };
                                        readonly bid_date: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly description: "The date of the bid (Unix timestamp)";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly asksize: {
                                            readonly type: "integer";
                                            readonly description: "The size of the ask";
                                        };
                                        readonly askexch: {
                                            readonly type: "string";
                                            readonly description: "The exchange code for the ask";
                                        };
                                        readonly ask_date: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly description: "The date of the ask (Unix timestamp)";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly open_interest: {
                                            readonly type: "integer";
                                            readonly description: "The open interest (for options)";
                                        };
                                        readonly contract_size: {
                                            readonly type: "integer";
                                            readonly description: "The contract size (for options)";
                                        };
                                        readonly expiration_date: {
                                            readonly type: "string";
                                            readonly format: "date";
                                            readonly description: "The expiration date (for options)";
                                        };
                                        readonly expiration_type: {
                                            readonly type: "string";
                                            readonly description: "The expiration type (for options)";
                                        };
                                        readonly option_type: {
                                            readonly type: "string";
                                            readonly enum: readonly ["call", "put"];
                                            readonly description: "The option type (for options)\n\n`call` `put`";
                                        };
                                        readonly root_symbol: {
                                            readonly type: "string";
                                            readonly description: "The root symbol (for options)";
                                        };
                                        readonly underlying: {
                                            readonly type: "string";
                                            readonly description: "The underlying symbol (for options)";
                                        };
                                        readonly strike: {
                                            readonly type: "number";
                                            readonly format: "float";
                                            readonly description: "The strike price (for options)";
                                            readonly minimum: -3.402823669209385e+38;
                                            readonly maximum: 3.402823669209385e+38;
                                        };
                                        readonly lot_size: {
                                            readonly type: "integer";
                                            readonly description: "The lot size";
                                        };
                                        readonly greeks: {
                                            readonly type: "object";
                                            readonly description: "Option greeks (available when greeks=true)";
                                            readonly properties: {
                                                readonly delta: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly gamma: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly theta: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly vega: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly rho: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly phi: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly bid_iv: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly mid_iv: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly ask_iv: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly smv_vol: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                                readonly updated_at: {
                                                    readonly type: "string";
                                                    readonly format: "date-time";
                                                };
                                            };
                                        };
                                    };
                                };
                            }];
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiStreamingCreateAccountSession: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "Content-Type": {
                    readonly type: "string";
                    readonly enum: readonly ["application/x-www-form-urlencoded"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request content type";
                };
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Content-Type", "Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly stream: {
                    readonly type: "object";
                    readonly properties: {
                        readonly url: {
                            readonly type: "string";
                            readonly description: "The WebSocket URL for the streaming session";
                        };
                        readonly sessionid: {
                            readonly type: "string";
                            readonly description: "The session ID for the streaming session";
                        };
                        readonly expires: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "The expiration time of the session";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiStreamingCreateMarketSession: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "Content-Type": {
                    readonly type: "string";
                    readonly enum: readonly ["application/x-www-form-urlencoded"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request content type";
                };
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Content-Type", "Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly stream: {
                    readonly type: "object";
                    readonly properties: {
                        readonly url: {
                            readonly type: "string";
                            readonly description: "The WebSocket URL for the streaming session";
                        };
                        readonly sessionid: {
                            readonly type: "string";
                            readonly description: "The session ID for the streaming session";
                        };
                        readonly expires: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "The expiration time of the session";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiTradingCancelOrder: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_id: {
                    readonly type: "string";
                    readonly examples: readonly ["VA000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the account";
                };
                readonly order_id: {
                    readonly type: "integer";
                    readonly examples: readonly [123456];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the order to cancel";
                };
            };
            readonly required: readonly ["account_id", "order_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly order: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "integer";
                            readonly description: "The order ID";
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly enum: readonly ["ok", "pending_cancel"];
                            readonly description: "The status of the cancellation\n\n`ok` `pending_cancel`";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiTradingChangeOrder: {
    readonly formData: {
        readonly type: "object";
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly enum: readonly ["market", "limit", "stop", "stop_limit"];
                readonly description: "The new order type";
                readonly examples: readonly ["limit"];
            };
            readonly duration: {
                readonly type: "string";
                readonly enum: readonly ["day", "gtc", "pre", "post"];
                readonly description: "The new order duration";
                readonly examples: readonly ["day"];
            };
            readonly price: {
                readonly type: "number";
                readonly format: "float";
                readonly description: "The new limit price (required for limit and stop_limit orders)";
                readonly examples: readonly [129.5];
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly stop: {
                readonly type: "number";
                readonly format: "float";
                readonly description: "The new stop price (required for stop and stop_limit orders)";
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly tag: {
                readonly type: "string";
                readonly description: "User-defined tag for the order";
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_id: {
                    readonly type: "string";
                    readonly examples: readonly ["VA000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the account";
                };
                readonly order_id: {
                    readonly type: "integer";
                    readonly examples: readonly [123456];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the order to modify";
                };
            };
            readonly required: readonly ["account_id", "order_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "Content-Type": {
                    readonly type: "string";
                    readonly enum: readonly ["application/x-www-form-urlencoded"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request content type";
                };
            };
            readonly required: readonly ["Content-Type"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly order: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "integer";
                            readonly description: "The order ID";
                        };
                        readonly type: {
                            readonly type: "string";
                            readonly description: "The order type\n\n`market` `limit` `stop` `stop_limit` `debit` `credit` `even`";
                            readonly enum: readonly ["market", "limit", "stop", "stop_limit", "debit", "credit", "even"];
                        };
                        readonly symbol: {
                            readonly type: "string";
                            readonly description: "The security symbol";
                        };
                        readonly side: {
                            readonly type: "string";
                            readonly description: "The side of the order\n\n`buy` `buy_to_cover` `sell` `sell_short` `buy_to_open` `buy_to_close` `sell_to_open` `sell_to_close`";
                            readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                        };
                        readonly quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The order quantity";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly description: "The order status\n\n`pending` `open` `partially_filled` `filled` `expired` `canceled` `rejected` `pending_cancel`";
                            readonly enum: readonly ["pending", "open", "partially_filled", "filled", "expired", "canceled", "rejected", "pending_cancel"];
                        };
                        readonly duration: {
                            readonly type: "string";
                            readonly description: "The order duration\n\n`day` `gtc` `pre` `post`";
                            readonly enum: readonly ["day", "gtc", "pre", "post"];
                        };
                        readonly avg_fill_price: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The average fill price";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly exec_quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The executed quantity";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly create_date: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "The date the order was created";
                        };
                        readonly transaction_date: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "The date of the last transaction";
                        };
                        readonly class: {
                            readonly type: "string";
                            readonly description: "The security class\n\n`equity` `option` `multileg` `combo`";
                            readonly enum: readonly ["equity", "option", "multileg", "combo"];
                        };
                        readonly last_fill_price: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The price of the last fill";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly last_fill_quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The quantity of the last fill";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly remaining_quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The quantity remaining to be filled";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiTradingPlaceOrder: {
    readonly formData: {
        readonly oneOf: readonly [{
            readonly type: "object";
            readonly required: readonly ["class", "duration", "option_symbol", "quantity", "symbol", "type"];
            readonly properties: {
                readonly symbol: {
                    readonly type: "string";
                    readonly description: "The security symbol";
                    readonly examples: readonly ["AAPL"];
                };
                readonly quantity: {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The order quantity";
                    readonly examples: readonly [1];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["market", "limit", "stop", "stop_limit"];
                    readonly description: "The type of order to be placed. One of: market, limit, stop, stop_limit";
                };
                readonly duration: {
                    readonly type: "string";
                    readonly enum: readonly ["day", "gtc", "pre", "post"];
                    readonly description: "The order duration";
                };
                readonly price: {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The limit price (required for limit and stop_limit orders)";
                };
                readonly stop: {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The stop price (required for stop and stop_limit orders)";
                };
                readonly tag: {
                    readonly type: "string";
                    readonly description: "User-defined tag for the order";
                };
                readonly class: {
                    readonly type: "string";
                    readonly enum: readonly ["equity"];
                    readonly description: "Order class identifier";
                };
                readonly side: {
                    readonly type: "string";
                    readonly enum: readonly ["buy", "sell", "sell_short", "buy_to_cover"];
                    readonly description: "The side of the order. One of: buy, sell, sell_short, buy_to_cover";
                };
            };
        }, {
            readonly type: "object";
            readonly required: readonly ["class", "duration", "option_symbol", "quantity", "symbol", "type"];
            readonly properties: {
                readonly symbol: {
                    readonly type: "string";
                    readonly description: "The security symbol";
                };
                readonly quantity: {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The order quantity";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["market", "limit", "stop", "stop_limit"];
                    readonly description: "The type of order to be placed. One of: market, limit, stop, stop_limit";
                };
                readonly duration: {
                    readonly type: "string";
                    readonly enum: readonly ["day", "gtc", "pre", "post"];
                    readonly description: "The order duration";
                };
                readonly price: {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The limit price (required for limit and stop_limit orders)";
                };
                readonly stop: {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The stop price (required for stop and stop_limit orders)";
                };
                readonly tag: {
                    readonly type: "string";
                    readonly description: "User-defined tag for the order";
                };
                readonly class: {
                    readonly type: "string";
                    readonly enum: readonly ["option"];
                    readonly description: "Order class identifier";
                };
                readonly option_symbol: {
                    readonly type: "string";
                    readonly description: "The OCC option symbol";
                };
                readonly side: {
                    readonly type: "string";
                    readonly enum: readonly ["buy_to_open", "sell_to_open", "sell_to_close", "buy_to_close"];
                    readonly description: "The side of the order. One of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
            };
        }, {
            readonly type: "object";
            readonly required: readonly ["class", "symbol", "type", "duration"];
            readonly properties: {
                readonly class: {
                    readonly type: "string";
                    readonly enum: readonly ["multileg"];
                    readonly description: "Order class identifier";
                };
                readonly symbol: {
                    readonly type: "string";
                    readonly description: "The underlying security symbol of the options";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["market", "debit", "credit", "even"];
                    readonly description: "The type of order to be placed. One of: market, debit, credit, even";
                };
                readonly duration: {
                    readonly type: "string";
                    readonly enum: readonly ["day", "gtc", "pre", "post"];
                    readonly description: "The order duration";
                };
                readonly price: {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The limit price (required for debit and credit orders)";
                };
                readonly "option_symbol[0]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "side[0]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the option leg. One of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "quantity[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "option_symbol[1]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "side[1]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the option leg. One of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "quantity[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "option_symbol[2]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "side[2]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the option leg. One of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "quantity[2]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "option_symbol[3]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "side[3]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the option leg. One of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "quantity[3]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly tag: {
                    readonly type: "string";
                    readonly description: "User-defined tag for the order";
                };
            };
        }, {
            readonly type: "object";
            readonly required: readonly ["class", "symbol", "type", "duration", "side[0]", "quantity[0]", "option_symbol[1]", "side[1]", "quantity[1]"];
            readonly properties: {
                readonly class: {
                    readonly type: "string";
                    readonly enum: readonly ["combo"];
                    readonly description: "Order class identifier";
                };
                readonly symbol: {
                    readonly type: "string";
                    readonly description: "The underlying security symbol";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["market", "debit", "credit", "even"];
                    readonly description: "The order type";
                };
                readonly duration: {
                    readonly type: "string";
                    readonly enum: readonly ["day", "gtc", "pre", "post"];
                    readonly description: "The order duration";
                };
                readonly price: {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The limit price (required for debit and credit orders)";
                };
                readonly "side[0]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short"];
                    readonly description: "The side of the equity leg. One of: buy, buy_to_cover, sell, sell_short";
                };
                readonly "quantity[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The quantity of shares for the equity leg";
                };
                readonly "option_symbol[1]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "side[1]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the option leg. One of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "quantity[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "option_symbol[2]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "side[2]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the option leg. One of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "quantity[2]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly tag: {
                    readonly type: "string";
                    readonly description: "User-defined tag for the order";
                };
            };
        }, {
            readonly type: "object";
            readonly required: readonly ["class", "duration", "symbol[0]", "quantity[0]", "type[0]", "side[0]", "symbol[1]", "quantity[1]", "type[1]", "side[1]"];
            readonly properties: {
                readonly class: {
                    readonly type: "string";
                    readonly enum: readonly ["oto"];
                    readonly description: "Order class identifier";
                };
                readonly duration: {
                    readonly type: "string";
                    readonly enum: readonly ["day", "gtc", "pre", "post"];
                    readonly description: "Time the order will remain active. One of: day, gtc, pre, post. For different durations per leg, duration can be specified as 0 indexed positions, ie duration[0]=day&duration[1]=gtc";
                };
                readonly "symbol[0]": {
                    readonly type: "string";
                    readonly description: "The underlying security symbol";
                };
                readonly "quantity[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "type[0]": {
                    readonly type: "string";
                    readonly enum: readonly ["limit", "stop", "stop_limit"];
                    readonly description: "The type of order to be placed. First order, one of: limit, stop, stop_limit";
                };
                readonly "option_symbol[0]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "side[0]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the leg. Equity orders, one of: buy, buy_to_cover, sell, sell_short Option orders, one of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "price[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Limit price. Required only for limit, stop_limit, debit and credit orders.";
                };
                readonly "stop[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Stop price. Required only for stop and stop_limit orders.";
                };
                readonly "symbol[1]": {
                    readonly type: "string";
                    readonly description: "The underlying security symbol";
                };
                readonly "quantity[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "type[1]": {
                    readonly type: "string";
                    readonly enum: readonly ["market", "limit", "stop", "stop_limit"];
                    readonly description: "The type of order to be placed. Second order, one of: market,limit, stop, stop_limit";
                };
                readonly "option_symbol[1]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "side[1]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the leg. Equity orders, one of: buy, buy_to_cover, sell, sell_short Option orders, one of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "price[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Limit price. Required only for limit, stop_limit, debit and credit orders.";
                };
                readonly "stop[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Stop price. Required only for stop and stop_limit orders.";
                };
                readonly tag: {
                    readonly type: "string";
                    readonly description: "User-defined tag for the order";
                };
            };
        }, {
            readonly type: "object";
            readonly required: readonly ["class", "duration", "symbol[0]", "quantity[0]", "type[0]", "side[0]", "symbol[1]", "quantity[1]", "type[1]", "side[1]"];
            readonly properties: {
                readonly class: {
                    readonly type: "string";
                    readonly enum: readonly ["oco"];
                    readonly description: "Order class identifier";
                };
                readonly duration: {
                    readonly type: "string";
                    readonly enum: readonly ["day", "gtc", "pre", "post"];
                    readonly description: "Time the order will remain active. One of: day, gtc, pre, post.";
                };
                readonly "symbol[0]": {
                    readonly type: "string";
                    readonly description: "The underlying security symbol";
                };
                readonly "quantity[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "type[0]": {
                    readonly type: "string";
                    readonly enum: readonly ["limit", "stop", "stop_limit"];
                    readonly description: "The type of order to be placed. First order, one of: limit, stop, stop_limit";
                };
                readonly "option_symbol[0]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "side[0]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the leg. Equity orders, one of: buy, buy_to_cover, sell, sell_short Option orders, one of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "price[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Limit price. Required only for limit, stop_limit, debit and credit orders.";
                };
                readonly "stop[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Stop price. Required only for stop and stop_limit orders.";
                };
                readonly "symbol[1]": {
                    readonly type: "string";
                    readonly description: "The underlying security symbol";
                };
                readonly "quantity[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "type[1]": {
                    readonly type: "string";
                    readonly enum: readonly ["limit", "stop", "stop_limit"];
                    readonly description: "The type of order to be placed. Second order, one of: limit, stop, stop_limit";
                };
                readonly "option_symbol[1]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "side[1]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the leg. Equity orders, one of: buy, buy_to_cover, sell, sell_short Option orders, one of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "price[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Limit price. Required only for limit, stop_limit, debit and credit orders.";
                };
                readonly "stop[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Stop price. Required only for stop and stop_limit orders.";
                };
                readonly tag: {
                    readonly type: "string";
                    readonly description: "User-defined tag for the order";
                };
            };
        }, {
            readonly type: "object";
            readonly required: readonly ["class", "quantity[0]", "type[0]", "side[0]", "quantity[1]", "type[1]", "side[1]", "quantity[2]", "type[2]", "side[2]"];
            readonly properties: {
                readonly class: {
                    readonly type: "string";
                    readonly enum: readonly ["otoco"];
                    readonly description: "Order class identifier";
                };
                readonly duration: {
                    readonly type: "string";
                    readonly enum: readonly ["day", "gtc", "pre", "post"];
                    readonly description: "Time the order will remain active. One of: day, gtc, pre, post. Alternatively, it can also be sent per leg (duration[index]) as long as the main duration is omitted.";
                };
                readonly "symbol[0]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "The underlying security symbol, use for equities legs";
                };
                readonly "quantity[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "type[0]": {
                    readonly type: "string";
                    readonly enum: readonly ["limit", "stop", "stop_limit"];
                    readonly description: "The type of order to be placed. First order, one of: limit, stop, stop_limit";
                };
                readonly "option_symbol[0]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option, use for option legs";
                };
                readonly "side[0]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the leg. Equity orders, one of: buy, buy_to_cover, sell, sell_short Option orders, one of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "price[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Limit price. Required only for limit, stop_limit, debit and credit orders.";
                };
                readonly "stop[0]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Stop price. Required only for stop and stop_limit orders.";
                };
                readonly "symbol[1]": {
                    readonly type: "string";
                    readonly description: "The underlying security symbol, use for equities legs";
                };
                readonly "option_symbol[1]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option";
                };
                readonly "quantity[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "type[1]": {
                    readonly type: "string";
                    readonly enum: readonly ["limit", "stop", "stop_limit"];
                    readonly description: "The type of order to be placed. Second order, one of: limit, stop, stop_limit";
                };
                readonly "side[1]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the leg. Equity orders, one of: buy, buy_to_cover, sell, sell_short Option orders, one of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "price[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Limit price. Required only for limit, stop_limit, debit and credit orders.";
                };
                readonly "stop[1]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Stop price. Required only for stop and stop_limit orders.";
                };
                readonly "symbol[2]": {
                    readonly type: "string";
                    readonly description: "The underlying security symbol, use for equities legs";
                };
                readonly "option_symbol[2]": {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "OCC option symbol of the option, use for option legs";
                };
                readonly "quantity[2]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "The number of contracts for the option leg";
                };
                readonly "type[2]": {
                    readonly type: "string";
                    readonly enum: readonly ["limit", "stop", "stop_limit"];
                    readonly description: "The type of order to be placed. Second order, one of: limit, stop, stop_limit";
                };
                readonly "side[2]": {
                    readonly type: "string";
                    readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                    readonly description: "The side of the leg. Equity orders, one of: buy, buy_to_cover, sell, sell_short Option orders, one of: buy_to_open, buy_to_close, sell_to_open, sell_to_close";
                };
                readonly "price[2]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Limit price. Required only for limit, stop_limit, debit and credit orders.";
                };
                readonly "stop[2]": {
                    readonly type: "number";
                    readonly format: "string";
                    readonly description: "Stop price. Required only for stop and stop_limit orders.";
                };
                readonly tag: {
                    readonly type: "string";
                    readonly description: "User-defined tag for the order";
                };
            };
        }];
        readonly discriminator: {
            readonly propertyName: "class";
            readonly mapping: {
                readonly equity: "#/components/schemas/EquityOrderRequest";
                readonly option: "#/components/schemas/OptionOrderRequest";
                readonly multileg: "#/components/schemas/MultilegOrderRequest";
                readonly combo: "#/components/schemas/ComboOrderRequest";
                readonly oto: "#/components/schemas/OTOOrderRequest";
                readonly oco: "#/components/schemas/OCOOrderRequest";
                readonly otoco: "#/components/schemas/OTOCOOrderRequest";
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_id: {
                    readonly type: "string";
                    readonly examples: readonly ["VA000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the account";
                };
            };
            readonly required: readonly ["account_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "Content-Type": {
                    readonly type: "string";
                    readonly enum: readonly ["application/x-www-form-urlencoded"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request content type";
                };
            };
            readonly required: readonly ["Content-Type"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly order: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "integer";
                            readonly description: "The order ID";
                        };
                        readonly type: {
                            readonly type: "string";
                            readonly description: "The order type\n\n`market` `limit` `stop` `stop_limit` `debit` `credit` `even`";
                            readonly enum: readonly ["market", "limit", "stop", "stop_limit", "debit", "credit", "even"];
                        };
                        readonly symbol: {
                            readonly type: "string";
                            readonly description: "The security symbol";
                        };
                        readonly side: {
                            readonly type: "string";
                            readonly description: "The side of the order\n\n`buy` `buy_to_cover` `sell` `sell_short` `buy_to_open` `buy_to_close` `sell_to_open` `sell_to_close`";
                            readonly enum: readonly ["buy", "buy_to_cover", "sell", "sell_short", "buy_to_open", "buy_to_close", "sell_to_open", "sell_to_close"];
                        };
                        readonly quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The order quantity";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly description: "The order status\n\n`pending` `open` `partially_filled` `filled` `expired` `canceled` `rejected` `pending_cancel`";
                            readonly enum: readonly ["pending", "open", "partially_filled", "filled", "expired", "canceled", "rejected", "pending_cancel"];
                        };
                        readonly duration: {
                            readonly type: "string";
                            readonly description: "The order duration\n\n`day` `gtc` `pre` `post`";
                            readonly enum: readonly ["day", "gtc", "pre", "post"];
                        };
                        readonly avg_fill_price: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The average fill price";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly exec_quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The executed quantity";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly create_date: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "The date the order was created";
                        };
                        readonly transaction_date: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "The date of the last transaction";
                        };
                        readonly class: {
                            readonly type: "string";
                            readonly description: "The security class\n\n`equity` `option` `multileg` `combo`";
                            readonly enum: readonly ["equity", "option", "multileg", "combo"];
                        };
                        readonly last_fill_price: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The price of the last fill";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly last_fill_quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The quantity of the last fill";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly remaining_quantity: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The quantity remaining to be filled";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiUserGetProfile: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly profile: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "The unique ID assigned to the user";
                        };
                        readonly name: {
                            readonly type: "string";
                            readonly description: "The user's full name";
                        };
                        readonly account: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly account_number: {
                                        readonly type: "string";
                                        readonly description: "The account number";
                                    };
                                    readonly classification: {
                                        readonly type: "string";
                                        readonly description: "The account classification (individual, corporate, etc.)\n\n`individual` `corporate` `joint` `ira` `roth_ira` `entity`";
                                        readonly enum: readonly ["individual", "corporate", "joint", "ira", "roth_ira", "entity"];
                                    };
                                    readonly date_created: {
                                        readonly type: "string";
                                        readonly format: "date-time";
                                        readonly description: "The date the account was created";
                                    };
                                    readonly day_trader: {
                                        readonly type: "boolean";
                                        readonly description: "Whether the account is marked as a day trader";
                                    };
                                    readonly option_level: {
                                        readonly type: "integer";
                                        readonly description: "The option level approval for the account (1-4)";
                                    };
                                    readonly status: {
                                        readonly type: "string";
                                        readonly description: "The account status\n\n`active` `closed`";
                                        readonly enum: readonly ["active", "closed"];
                                    };
                                    readonly type: {
                                        readonly type: "string";
                                        readonly description: "The account type\n\n`cash` `margin`";
                                        readonly enum: readonly ["cash", "margin"];
                                    };
                                    readonly last_update_date: {
                                        readonly type: "string";
                                        readonly format: "date-time";
                                        readonly description: "The date the account was last updated";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiWatchlistsAddWatchlistSymbols: {
    readonly formData: {
        readonly type: "object";
        readonly required: readonly ["symbols"];
        readonly properties: {
            readonly symbols: {
                readonly type: "string";
                readonly description: "Comma-delimited list of symbols to add to watchlist";
                readonly examples: readonly ["AAPL,IBM,NFLX,SPY"];
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly watchlist_id: {
                    readonly type: "string";
                    readonly examples: readonly ["my_watchlist"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the watchlist";
                };
            };
            readonly required: readonly ["watchlist_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "Content-Type": {
                    readonly type: "string";
                    readonly enum: readonly ["application/x-www-form-urlencoded"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request content type";
                };
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Content-Type", "Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly watchlist: {
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly description: "The watchlist name";
                        };
                        readonly id: {
                            readonly type: "string";
                            readonly description: "The watchlist ID";
                        };
                        readonly public_id: {
                            readonly type: "string";
                            readonly description: "The public ID of the watchlist";
                        };
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly item: {
                                    readonly type: "array";
                                    readonly description: "List of symbols in the watchlist";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly symbol: {
                                                readonly type: "string";
                                                readonly description: "The security symbol";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                                readonly description: "The symbol ID (lowercase)";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiWatchlistsCreateWatchlist: {
    readonly formData: {
        readonly type: "object";
        readonly required: readonly ["name", "symbols"];
        readonly properties: {
            readonly name: {
                readonly type: "string";
                readonly description: "A watchlist name";
                readonly examples: readonly ["My Watchlist"];
            };
            readonly symbols: {
                readonly type: "string";
                readonly description: "Comma-delimited list of symbols to add to watchlist";
                readonly examples: readonly ["AAPL,IBM,NFLX"];
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "Content-Type": {
                    readonly type: "string";
                    readonly enum: readonly ["application/x-www-form-urlencoded"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request content type";
                };
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Content-Type", "Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly watchlist: {
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly description: "The watchlist name";
                        };
                        readonly id: {
                            readonly type: "string";
                            readonly description: "The watchlist ID";
                        };
                        readonly public_id: {
                            readonly type: "string";
                            readonly description: "The public ID of the watchlist";
                        };
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly item: {
                                    readonly type: "array";
                                    readonly description: "List of symbols in the watchlist";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly symbol: {
                                                readonly type: "string";
                                                readonly description: "The security symbol";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                                readonly description: "The symbol ID (lowercase)";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiWatchlistsDeleteWatchlist: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly watchlist_id: {
                    readonly type: "string";
                    readonly examples: readonly ["my_watchlist"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the watchlist";
                };
            };
            readonly required: readonly ["watchlist_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly watchlists: {
                    readonly type: "object";
                    readonly properties: {
                        readonly watchlist: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly name: {
                                        readonly type: "string";
                                        readonly description: "The watchlist name";
                                    };
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "The watchlist ID";
                                    };
                                    readonly public_id: {
                                        readonly type: "string";
                                        readonly description: "The public ID of the watchlist";
                                    };
                                };
                            };
                            readonly description: "List of watchlists";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiWatchlistsGetSpecificWatchlist: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly watchlist_id: {
                    readonly type: "string";
                    readonly examples: readonly ["my_watchlist"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the watchlist";
                };
            };
            readonly required: readonly ["watchlist_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly watchlist: {
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly description: "The watchlist name";
                        };
                        readonly id: {
                            readonly type: "string";
                            readonly description: "The watchlist ID";
                        };
                        readonly public_id: {
                            readonly type: "string";
                            readonly description: "The public ID of the watchlist";
                        };
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly item: {
                                    readonly type: "array";
                                    readonly description: "List of symbols in the watchlist";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly symbol: {
                                                readonly type: "string";
                                                readonly description: "The security symbol";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                                readonly description: "The symbol ID (lowercase)";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiWatchlistsGetWatchlists: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly watchlists: {
                    readonly type: "object";
                    readonly properties: {
                        readonly watchlist: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly name: {
                                        readonly type: "string";
                                        readonly description: "The watchlist name";
                                    };
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "The watchlist ID";
                                    };
                                    readonly public_id: {
                                        readonly type: "string";
                                        readonly description: "The public ID of the watchlist";
                                    };
                                };
                            };
                            readonly description: "List of watchlists";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiWatchlistsRemoveWatchlistSymbol: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly watchlist_id: {
                    readonly type: "string";
                    readonly examples: readonly ["my_watchlist"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the watchlist";
                };
                readonly symbol: {
                    readonly type: "string";
                    readonly examples: readonly ["SPY"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Symbol to remove from watchlist";
                };
            };
            readonly required: readonly ["watchlist_id", "symbol"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly watchlist: {
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly description: "The watchlist name";
                        };
                        readonly id: {
                            readonly type: "string";
                            readonly description: "The watchlist ID";
                        };
                        readonly public_id: {
                            readonly type: "string";
                            readonly description: "The public ID of the watchlist";
                        };
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly item: {
                                    readonly type: "array";
                                    readonly description: "List of symbols in the watchlist";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly symbol: {
                                                readonly type: "string";
                                                readonly description: "The security symbol";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                                readonly description: "The symbol ID (lowercase)";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BrokerageApiWatchlistsUpdateWatchlist: {
    readonly formData: {
        readonly type: "object";
        readonly required: readonly ["name"];
        readonly properties: {
            readonly name: {
                readonly type: "string";
                readonly description: "A watchlist name";
                readonly examples: readonly ["My Updated Watchlist"];
            };
            readonly symbols: {
                readonly type: "string";
                readonly description: "Comma-delimited list of symbols to add to watchlist";
                readonly examples: readonly ["AAPL,IBM,NFLX"];
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly watchlist_id: {
                    readonly type: "string";
                    readonly examples: readonly ["my_watchlist"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the watchlist";
                };
            };
            readonly required: readonly ["watchlist_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "Content-Type": {
                    readonly type: "string";
                    readonly enum: readonly ["application/x-www-form-urlencoded"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request content type";
                };
                readonly Accept: {
                    readonly type: "string";
                    readonly enum: readonly ["application/json"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Response format";
                };
            };
            readonly required: readonly ["Content-Type", "Accept"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly watchlist: {
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly description: "The watchlist name";
                        };
                        readonly id: {
                            readonly type: "string";
                            readonly description: "The watchlist ID";
                        };
                        readonly public_id: {
                            readonly type: "string";
                            readonly description: "The public ID of the watchlist";
                        };
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly item: {
                                    readonly type: "array";
                                    readonly description: "List of symbols in the watchlist";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly symbol: {
                                                readonly type: "string";
                                                readonly description: "The security symbol";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                                readonly description: "The symbol ID (lowercase)";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { BrokerageApiAccountsGetAccountBalance, BrokerageApiAccountsGetAccountGainloss, BrokerageApiAccountsGetAccountHistoricalBalance, BrokerageApiAccountsGetAccountHistory, BrokerageApiAccountsGetAccountOrders, BrokerageApiAccountsGetAccountPositions, BrokerageApiGetAccountOrder, BrokerageApiMarketsGetCalendar, BrokerageApiMarketsGetClock, BrokerageApiMarketsGetEtb, BrokerageApiMarketsGetHistory, BrokerageApiMarketsGetLookup, BrokerageApiMarketsGetLookupOptionsSymbols, BrokerageApiMarketsGetOptionsChains, BrokerageApiMarketsGetOptionsExpirations, BrokerageApiMarketsGetOptionsStrikes, BrokerageApiMarketsGetQuotes, BrokerageApiMarketsGetRealtimeGreeks, BrokerageApiMarketsGetSearch, BrokerageApiMarketsGetTimesales, BrokerageApiMarketsPostQuotes, BrokerageApiStreamingCreateAccountSession, BrokerageApiStreamingCreateMarketSession, BrokerageApiTradingCancelOrder, BrokerageApiTradingChangeOrder, BrokerageApiTradingPlaceOrder, BrokerageApiUserGetProfile, BrokerageApiWatchlistsAddWatchlistSymbols, BrokerageApiWatchlistsCreateWatchlist, BrokerageApiWatchlistsDeleteWatchlist, BrokerageApiWatchlistsGetSpecificWatchlist, BrokerageApiWatchlistsGetWatchlists, BrokerageApiWatchlistsRemoveWatchlistSymbol, BrokerageApiWatchlistsUpdateWatchlist };
