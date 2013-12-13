// platform-specific service
angular.module('app.customService', []).
    factory('customService', function($timeout) {
        return {
			openLink: function(link) {
				window.open(encodeURI(link)); 
			},

			trackPage: function(page) {
				$timeout(function() {
				  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
				  ga('create', 'UA-46128370-1', 'd26tzgk0gx1hwh.cloudfront.net');
				  ga('send', 'pageview');
				}, 1500);
			},

			doCustomActions: function() {
				// no custom actions needed in hosted webapp
			}
		}
	});



