// platform-specific service
angular.module('app.customService', []).
    factory('customService', function($timeout) {
        return {
			openLink: function(link) {
				// Android specific - open links using native browser
				navigator.app.loadUrl(link, { openExternal: true });
			},

			trackPage: function(page) {
				$timeout(function() {
					if (typeof analytics !== "undefined") {
						alert('tracking page!');
						analytics.trackView(page);
					}
				}, 1500);
			},

			doCustomActions: function() {
				$timeout(function() {
					if (typeof analytics !== "undefined") {
						alert('starting tracker!');
						analytics.startTrackerWithId('UA-46128370-2');
					}
				}, 1000);
			}
		}
	});


