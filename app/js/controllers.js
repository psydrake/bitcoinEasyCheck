'use strict';

angular.module('app.controllers', []).
    controller('homeController', function($scope, bitcoinchartsAPIService, utilService) {
        $scope.symbol = 'mtgoxUSD';
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

        $scope.loadData = function() {
            bitcoinchartsAPIService.getMarkets([$scope.symbol]).success(function (response) {
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
            });

            bitcoinchartsAPIService.getWeightedPrices([$scope.currency]).success(function (response) {
                //console.log('24h avg. timestamp:', Number(response['timestamp']) * 1000);
				console.log('response:', response);
                $scope.avg24h = response[$scope.currency]['24h'];
                console.log('avg24h:', $scope.avg24h);
            });
        }

        $scope.$on('bitcoinchartsAPIService.refresh', function(event, path) {
            if (path === '/home') {
                $scope.loadData();
            }
        });

        $scope.loadData();
    }).
	controller('weightedController', function($scope, bitcoinchartsAPIService, utilService) {
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
            //console.log('weightedController.currencySymbol(' + currency + ')');
            return utilService.currencySymbol(currency);
        }

        $scope.loadData = function() {
            bitcoinchartsAPIService.getWeightedPrices().success(function (response) {
                $scope.timestamp = Number(response['timestamp']) * 1000;
                $scope.weightedPrices = response;
            });
        }

        $scope.$on('bitcoinchartsAPIService.refresh', function(event, path) {
            if (path === '/weighted') {
                $scope.loadData();
            }
        });

        $scope.loadData();

    }).
    controller('marketsController', function($scope, bitcoinchartsAPIService) {
        $scope.markets = [];

        bitcoinchartsAPIService.getMarkets().success(function (response) {
            $scope.markets = response;
        });
    }).
    controller('tradesByMarketController', function($scope, $routeParams, bitcoinchartsAPIService) {
        $scope.market = $routeParams.id;
        $scope.tradesByMarket = [[]];

        console.log('$scope.market:', $scope.market);
        bitcoinchartsAPIService.getTradesByMarket($scope.market).success(function (response) {
            $scope.tradesByMarket = response;
            //console.log('$scope.tradesByMarket:', $scope.tradesByMarket);
    });
});


