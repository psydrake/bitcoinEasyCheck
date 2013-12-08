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
            when("/trades/:id", {templateUrl: "partials/tradesBySymbol.html", controller: "tradesBySymbolController"}).
            when("/about", {templateUrl: "partials/about.html", controller: "aboutController"}).
			otherwise({redirectTo: "/home"});
}]);

app.run(function($rootScope, $location, $timeout, utilService) {
	$rootScope.loadingClass = '';

    $rootScope.getClass = function(path) {
        utilService.log('path: '+ path + ', $location.path(): ' + $location.path());
        if ($location.path().substr(0, path.length) === path) {
            return "active";
        }
        else {
            return "";
        }
    }

    $rootScope.loadData = function() {
		$rootScope.loadingClass = 'fa-spin';
        utilService.log('loadData! ' + $location.path());
        $rootScope.$broadcast('bitcoinchartsAPIService.refresh', $location.path());
		$timeout(function() {
				$rootScope.loadingClass = ''; // stop spinner
			}, 1000);
    }

	// run on load
	$timeout(function() {
		trackPage(); // track in google analytics
		doCustomActions(); // perform platform-specific javascript
	}, 1000);

});
