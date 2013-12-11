'use strict';

// platform-specific service
angular.module('app.customService', []).
    factory('customService', function() {
        return {
			trackPage: function() {
				// place platform-specific google analytics tracking code here
			},

			doCustomActions: function() {
				// place platform-specific custom actions here
			}
		}
	});
