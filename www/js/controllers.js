'use strict';

angular.module('app.controllers', []).
    controller('homeController', function($scope, $rootScope, $log, bitcoinchartsAPIService, utilService, settingsService, customService) {
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
						else if ($scope.close < $scope.avg24h) {
							$scope.closePriceClass = 'priceDown';
						}
						else {
							$scope.closePriceClass = 'priceSame';
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

        $rootScope.loadData();

		customService.trackPage('/home');
    }).
	controller('weightedController', function($scope, $rootScope, $log, bitcoinchartsAPIService, settingsService, utilService, customService) {
        $scope.weightedPrices = {};
        $scope.timestamp = 0;
		$scope.preferredCurrencyAbbrev = utilService.getCurrencyAbbrev(settingsService.getPreferredMarket());

        $scope.currencySymbol = function(currency) {
            return utilService.currencySymbol(currency);
        }

		$scope.get24hClass = function(val24h, val7d) {
			if (!val24h || !val7d) {
				return 'priceUnknown';
			}
			else if (val24h > val7d) {
				return 'priceUp';
			}
			else if (val24h < val7d) {
				return 'priceDown';
			}
			else {
				return 'priceSame';
			}
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

        $rootScope.loadData();

		customService.trackPage('/weighted');
    }).
    controller('marketsController', function($scope, $rootScope, $log, bitcoinchartsAPIService, utilService, customService) {
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

        $rootScope.loadData();

		customService.trackPage('/markets');
    }).
    controller('tradesBySymbolController', function($scope, $rootScope, $routeParams, $log, bitcoinchartsAPIService, customService) {
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

        $rootScope.loadData();

		customService.trackPage('/trades');
    }).
    controller('settingsController', function($scope, $rootScope, $log, bitcoinchartsAPIService, settingsService, customService) {
		$scope.preferredMarket = settingsService.getPreferredMarket();

		$scope.$watch('preferredMarket', function() {
			// save preferredMarket any time user changes it in settings
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
					$scope.symbols.sort();
				}
				else {
					$log.warn('Warning: No markets data returned from bitcoinchartsAPIService.getMarkets()', response);
				}
			});
		}

        $scope.$on('bitcoinchartsAPIService.refresh', function(event, path) {
            if (path && path.substring(0,9) === '/settings') {
                $scope.loadData();
            }
        });

        $rootScope.loadData();

		customService.trackPage('/settings');
    }).
    controller('aboutController', function($scope, utilService, customService) {
		$scope.version = utilService.getAppVersion();

		customService.trackPage('/about');
    });



