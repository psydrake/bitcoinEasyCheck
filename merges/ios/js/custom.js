// Use in-app browser for iOS
function openLink(link) {
	if (link && link.match(/^mailto:/)) {
		window.open(encodeURI(link)); 
	}
	else {
		window.open(encodeURI(link), '_blank', 'location=yes'); 
	}
}

// initialize admob banner and google analytics
function doCustomActions() {
	createBannerView();
	initializeUniversalAnalytics();
}

// custom functions for iOS
function createBannerView() {
	var am = window.plugins.AdMob;
    am.createBannerView( 
		{
			'publisherId': 'ca-app-pub-8928397865273246/5218817813',
			'adSize': am.AD_SIZE.BANNER,
			'bannerAtTop': false
		}, function() {
			requestAd();
		}, function(){
			// fail quietly
		});
}

function requestAd() {
	window.plugins.AdMob.requestAd(
	     {
			'isTesting': false,
			'extras': {
				'color_bg': 'FFFFFF',
				'color_bg_top': 'FFFFFF',
				'color_border': 'FFFFFF',
				'color_link': '000080',
				'color_text': '808080',
				'color_url': '008000'
			},
	     },
		function() {
			showAd();
		},
   		function () { 
			// fail quietly
		}
	 );
}

function showAd() {
	window.plugins.AdMob.showAd( 
		true, // or false
		function() {
			// yay
		},
	    function() {
			// fail quietly
		}
	 );
}

function initializeUniversalAnalytics() {
	analytics.startTrackerWithId('UA-46128370-2');
}

function trackPage(pageName) {
	analytics.trackView(pageName);
}
