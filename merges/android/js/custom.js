// Android specific - open links using native browser
function openLink(link) {
	navigator.app.loadUrl(link, { openExternal: true });
}

function doCustomActions() {
	// Nothing for android... analytics and admob plugins installed for the sake of iOS, but unused in Android
	//   Google Analytics handled by com.google.analytics.tracking.android.EasyTracker in bitcoinEasyCheck.java
	//   AdMob handled by com.google.ads.* in AdviceOwl.java
}

function trackPage(pageName) {
	// NOOP
}
