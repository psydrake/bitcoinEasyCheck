// platform-specific service
angular.module('app.customService', []).
    factory('customService', function() {
        return {
			trackPage: function() {
				// Google Analytics handled by com.google.analytics.tracking.android.EasyTracker in bitcoinEasyCheck.java
			},

			doCustomActions: function() {
				// Nothing for android... analytics and admob plugins installed for the sake of iOS, but unused in Android
				//   AdMob handled by com.google.ads.* in AdviceOwl.java
			}
		}
	});


