function trackPage() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-46128370-1', 'd26tzgk0gx1hwh.cloudfront.net');
  ga('send', 'pageview');
}

function doCustomActions() {
	// refresh the page every 5 minutes
	window.setTimeout(function(){ document.location.reload(true); console.log('refresh!'); }, 300000);
}
