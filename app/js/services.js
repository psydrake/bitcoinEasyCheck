'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('app.services', []).
    factory('utilService', function() {
        return {
            // This will parse a delimited string into an array of
            // arrays. The default delimiter is the comma, but this
            // can be overriden in the second argument.
            csvToArray: function(strData, strDelimiter) {
                // Check to see if the delimiter is defined. If not,
                // then default to comma.
                strDelimiter = (strDelimiter || ",");
                // Create a regular expression to parse the CSV values.
                var objPattern = new RegExp(
                    (
                        // Delimiters.
                        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                            // Quoted fields.
                            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                            // Standard fields.
                            "([^\"\\" + strDelimiter + "\\r\\n]*))"
                        ),
                    "gi"
                );
                // Create an array to hold our data. Give the array
                // a default empty first row.
                var arrData = [[]];
                // Create an array to hold our individual pattern
                // matching groups.
                var arrMatches = null;
                // Keep looping over the regular expression matches
                // until we can no longer find a match.
                while (arrMatches = objPattern.exec( strData )){
                    // Get the delimiter that was found.
                    var strMatchedDelimiter = arrMatches[ 1 ];
                    // Check to see if the given delimiter has a length
                    // (is not the start of string) and if it matches
                    // field delimiter. If id does not, then we know
                    // that this delimiter is a row delimiter.
                    if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)){
                        // Since we have reached a new row of data,
                        // add an empty row to our data array.
                        arrData.push( [] );
                    }
                    // Now that we have our delimiter out of the way,
                    // let's check to see which kind of value we
                    // captured (quoted or unquoted).
                    if (arrMatches[ 2 ]){
                        // We found a quoted value. When we capture
                        // this value, unescape any double quotes.
                        var strMatchedValue = arrMatches[ 2 ].replace(
                            new RegExp( "\"\"", "g" ),
                            "\""
                        );
                    } else {
                        // We found a non-quoted value.
                        var strMatchedValue = arrMatches[ 3 ];
                    }
                    // Now that we have our value string, let's add
                    // it to the data array.
                    arrData[ arrData.length - 1 ].push( strMatchedValue );
                }
                // Return the parsed data.
                return( arrData );
            },

            // from: http://www.xe.com/symbols.php
            currencyMap: {
                "USD": "$",
                "ILS": "₪",
                "GBP": "£",
                "DKK": "kr",
                "CAD": "$",
                "MXN": "$",
                //"XRP": "$",
                "SEK": "kr",
                "SGD": "$",
                "HKD": "$",
                "AUD": "$",
                "CHF": "CHF",
                "CNY": "¥",
                //"LTC": "$",
                "NZD": "$",
                "THB": "฿",
                "EUR": "€",
                //"SLL": "$",
                "ARS": "$",
                "NOK": "kr",
                "RUB": "руб",
                //"INR": "$",
                "JPY": "¥",
                "CZK": "Kč",
                "BRL": "R$",
                "PLN": "zł",
                "ZAR": "R"
            },

            currencySymbol: function(code) {
                var symbol = this.currencyMap[code];
                //console.log('code:', code, 'symbol:', symbol);
                return symbol ? symbol : '';
            }
        }
    }).
    factory('bitcoinchartsAPIService', function($http, utilService) {
        var bccAPI = {};

        // see: http://bitcoincharts.com/about/markets-api/

        // Bitcoincharts offers weighted prices for several currencies.
        // You can use this to price goods and services in Bitcoins.
        // This will yield much lower fluctuations than using a single market's latest price.
        // http://api.bitcoincharts.com/v1/weighted_prices.json

        // You can access general market data. This will return an array with elements for each market.
        // http://api.bitcoincharts.com/v1/markets.json
        /*var markets = [{"volume": 4.855583920000, "latest_trade": 1385510680, "bid": 5200.000000000000, "high": 5468.253968250000, "currency": "CNY",
            "currency_volume": 25837.585663292542, "ask": 5468.253970000000, "close": 5468.253968250000, "avg": 5321.210813980235357563339159,
            "symbol": "anxhkCNY", "low": 5156.985544060000},
            {"volume": 68.053228390000, "latest_trade": 1385511483, "bid": 6553.000000000000, "high": 7045.000000000000, "currency": "HKD", "currency_volume": 458612.676115478723, "ask": 6890.000000000000, "close": 6501.000000000000, "avg": 6739.028947859129229475192573, "symbol": "anxhkHKD", "low": 6452.000000000000},
            {"volume": 9.597594480000, "latest_trade": 1385510860, "bid": 840.128210000000, "high": 881.168831160000, "currency": "USD", "currency_volume": 8184.719658225408, "ask": 894.805190000000,
		*/
        // Trade data is available as CSV, delayed by approx. 15 minutes. It will return the 2000 most recent trades.
        // http://api.bitcoincharts.com/v1/trades.csv?symbol=mtgoxUSD
        //var mtgoxTrades = "1385076902,771.461540000000,0.011109990000\n1385076903,771.461540000000,0.011109990000\n1385076903,771.463190000000,0.299999990000\n.."

        bccAPI.getWeightedPrices = function(currency) {
			var url = 'https://bitcoineasycheck.appspot.com/api/weighted-prices/';

            if (currency) {
		        url = url + currency;
            }

            return {
                success: function(fn) {
					$http.jsonp(url + '?callback=JSON_CALLBACK').success(function(data, status, headers, config) {
						console.log('services.getWeightedPrices:', data);
						fn(data);
					});
                }
            };
        }

        bccAPI.getMarkets = function(symbol) {
			var url = 'https://bitcoineasycheck.appspot.com/api/markets/';

			if (symbol) {
				url = url + symbol;
			}

            return {
                success: function(fn) {
					$http.jsonp(url + '?callback=JSON_CALLBACK').success(function(data, status, headers, config) {
						console.log('services.getMarkets:', data);
						fn(data);
					});
                }
            };

			/*
            var m = [];
            if (symbols) {
                for (var i = 0; i < symbols.length; i++) {
                    for (var j = 0; j < markets.length; j++) {
                        if (symbols[i] === markets[j].symbol) {
                            m.push(markets[j]);
                            break;
                        }
                    }
                }
            }
            else { // no symbols passed in, default to all markets
                m = markets;
            }
            console.log('getMarkets(). markets:', m);

            return {
                success: function(fn) {
                    fn(m);
                }
            }*/
        }

        bccAPI.getTradesBySymbol = function(symbol) {
			var url = 'https://bitcoineasycheck.appspot.com/api/trades/' + symbol;

            return {
                success: function(fn) {
					$http.jsonp(url + '?callback=JSON_CALLBACK').success(function(data, status, headers, config) {
						console.log('services.getTradesBySymbol:', data);
						var theData = [];
						data.forEach(function(entry) {
							//console.log(entry);
							theData.push([ Number(entry[0]) * 1000, entry[1], entry[2] ]);
						});
						//console.log(theData);
						fn(theData);
					});
                }
            };

			/*
            var tradeArr = [];
            if (market === 'mtgoxUSD') {
                tradeArr = utilService.csvToArray(mtgoxTrades);
                tradeArr.splice(1000, 19000); // remove most of the rows
                console.log('trade rows:', tradeArr.length);
                for (var i = 0; i < tradeArr.length; i++) {
                    tradeArr[i][0] =  Number(tradeArr[i][0]) * 1000;
                }
            }

            return {
                success: function(fn) {
                    fn(tradeArr);
                }

            }*/
        }

        return bccAPI;
  });
