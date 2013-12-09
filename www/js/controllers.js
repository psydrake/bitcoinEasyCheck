'use strict';

angular.module('app.controllers', []).
    controller('homeController', function($scope, $log, bitcoinchartsAPIService, utilService, settingsService) {
        $scope.symbol = settingsService.getPreferredMarket();
        $scope.currency = null;
        $scope.latest_trade = 0; // unix time of latest trade
        $scope.low = 0; // lowest trade during day
        $scope.high = 0; // highest trade during day
        $scope.volume = 0; // total trade volume of day in BTC
        $scope.currency_volume = 0; // total trade volume of day in currency
        $scope.close = 0; // latest trade
        $scope.previous_close = 0; // latest trade of previous day
        $scope.avg24h = 0;

        /*{"volume": 4.855583920000, "latest_trade": 1385510680, "bid": 5200.000000000000, "high": 5468.253968250000, "currency": "CNY",
            "currency_volume": 25837.585663292542, "ask": 5468.253970000000, "close": 5468.253968250000, "avg": 5321.210813980235357563339159,
            "symbol": "anxhkCNY", "low": 5156.985544060000}*/

        $scope.currencySymbol = function(currency) {
            return utilService.currencySymbol(currency);
        }

        $scope.loadData = function() {
            bitcoinchartsAPIService.getMarkets($scope.symbol).success(function (response) {
				if (response && response[0]) {
	                var market = response[0];
					$scope.currency = market.currency;
					$scope.latest_trade = Number(market.latest_trade) * 1000; // unix time of latest trade
					$scope.low = market.low; // lowest trade during day
					$scope.high = market.high; // highest trade during day
					$scope.volume = market.volume; // total trade volume of day in BTC
					$scope.currency_volume = market.currency_volume; // total trade volume of day in currency
					$scope.close = market.close; // latest trade
					// previous_close doesn't ever seem to get populated
					$scope.previous_close = market.previous_close; // latest trade of previous day

					bitcoinchartsAPIService.getWeightedPrices([$scope.currency]).success(function (response) {
						if (response && response[$scope.currency]) {
							$scope.avg24h = response[$scope.currency]['24h'];
						}
						else {
							$log.warn('Warning: No weighted prices data returned from bitcoinchartsAPIService.getWeightedPrices(' + $scope.currency + ')', response);	
						}

						// set css class for closing price
						if (!$scope.close || !$scope.avg24h) {
							$scope.closePriceClass = 'priceUnknown';
						}
						else if ($scope.close > $scope.avg24h) {
							$scope.closePriceClass = 'priceUp';
						}
						else if ($scope.close === $scope.avg24h) {
							$scope.closePriceClass = 'priceSame';
						}
						else if ($scope.close < $scope.avg24h) {
							$scope.closePriceClass = 'priceDown';
						}
					});
				}
				else {
					$log.warn('Warning: No market data returned from bitcoinchartsAPIService.getMarkets(' + $scope.symbol + ')', response);
				}
            });
        }

        $scope.$on('bitcoinchartsAPIService.refresh', function(event, path) {
            if (path === '/home') {
                $scope.loadData();
            }
        });

        $scope.loadData();
    }).
	controller('weightedController', function($scope, $log, bitcoinchartsAPIService, utilService) {
        $scope.weightedPrices = {};
        $scope.timestamp = 0;

        /*$scope.marketFilter = null;
        $scope.searchFilter = function(market) {
            console.log('market:', market);
            //console.log('prices:', prices);
            var keyword = new RegExp($scope.marketFilter, 'i');
            return !$scope.marketFilter || keyword.test(market);
        };*/

        $scope.currencySymbol = function(currency) {
            return utilService.currencySymbol(currency);
        }

        $scope.loadData = function() {
            bitcoinchartsAPIService.getWeightedPrices().success(function (response) {
				if (response && response.timestamp) {
	                $scope.timestamp = Number(response['timestamp']) * 1000;
	                $scope.weightedPrices = response;
					delete $scope.weightedPrices['timestamp'];
				}
				else {
					$log.warn('Warning: No weighted prices data returned from bitcoinchartsAPIService.getWeightedPrices()', response);
				}
            });
        }

        $scope.$on('bitcoinchartsAPIService.refresh', function(event, path) {
            if (path === '/weighted') {
                $scope.loadData();
            }
        });

        $scope.loadData();
    }).
    controller('marketsController', function($scope, $log, bitcoinchartsAPIService, utilService) {
        $scope.markets = [];

        $scope.currencySymbol = function(currency) {
            return utilService.currencySymbol(currency);
        }

		$scope.loadData = function() {
			bitcoinchartsAPIService.getMarkets().success(function (response) {
				if (response && response.length > 0) {
					//console.log('marketsController.markets:', response);
					$scope.markets = response;
					$scope.markets.forEach(function(entry) {
						entry.latest_trade = Number(entry.latest_trade) * 1000;
					});
				}
				else {
					$log.warn('Warning: No markets data returned from bitcoinchartsAPIService.getMarkets()', response);
				}
			});
		}

        $scope.$on('bitcoinchartsAPIService.refresh', function(event, path) {
            if (path === '/markets') {
                $scope.loadData();
            }
        });

        $scope.loadData();
    }).
    controller('tradesBySymbolController', function($scope, $routeParams, $log, bitcoinchartsAPIService) {
        $scope.symbol = $routeParams.id;
        $scope.tradesBySymbol = [[]];

		$scope.loadData = function() {
	        bitcoinchartsAPIService.getTradesBySymbol($scope.symbol).success(function (response) {
				if (response && response.length > 0) {
		            $scope.tradesBySymbol = response;
				}
				else {
					$log.warn('Warning: No trade data returned from bitcoinchartsAPIService.getTradesBySymbol(' + $scope.symbol + ')', response);					
				}
			});
		}

        $scope.$on('bitcoinchartsAPIService.refresh', function(event, path) {
            if (path && path.substring(0,7) === '/trades') {
                $scope.loadData();
            }
        });

        $scope.loadData();
    }).
    controller('settingsController', function($scope, $cookies, $log, bitcoinchartsAPIService, settingsService) {
		$scope.preferredMarket = settingsService.getPreferredMarket();

		$scope.$watch('preferredMarket', function() {
			// set cookie for preferredMarket any time user changes it in settings
			settingsService.setPreferredMarket($scope.preferredMarket);
			$log.info('Set preferred market to', settingsService.getPreferredMarket());
		});

		$scope.symbols = new Array(); // list of all available market symbols

		$scope.loadData = function() {
			bitcoinchartsAPIService.getMarkets().success(function (response) {
				if (response && response.length > 0) {
					response.forEach(function(entry) {
						$scope.symbols.push(entry.symbol);
					});

				}
				else {
					$log.warn('Warning: No markets data returned from bitcoinchartsAPIService.getMarkets()', response);
				}
			});
		}

        $scope.loadData();
    }).
    controller('aboutController', function($scope, utilService) {
		$scope.version = utilService.getAppVersion();
    });



