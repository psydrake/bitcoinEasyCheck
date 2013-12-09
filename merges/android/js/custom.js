// Android specific - open links using native browser
function openLink(link) {
	navigator.app.loadUrl(link, { openExternal: true });
}

function doCustomActions() {
	initializeUniversalAnalytics();
}

function initializeUniversalAnalytics() {
	analytics.startTrackerWithId('UA-46128370-2');
}

function trackPage(pageName) {
	analytics.trackView(pageName);
}
