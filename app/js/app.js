'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', [
        'app.controllers',
        'app.services',
        'ngRoute',
        'ui.bootstrap'
    ]).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
            when("/home", {templateUrl: "partials/home.html", controller: "homeController"}).
            when("/weighted", {templateUrl: "partials/weighted.html", controller: "weightedController"}).
            when("/markets", {templateUrl: "partials/markets.html", controller: "marketsController"}).
            when("/trades/:id", {templateUrl: "partials/tradesByMarket.html", controller: "tradesByMarketController"}).
			otherwise({redirectTo: "/home"});
}]);

app.run(function($rootScope, $location) {
    $rootScope.loadData = function() {
        console.log('loadData!', $location.path());
        $rootScope.$broadcast('bitcoinchartsAPIService.refresh', $location.path());
    }
});
