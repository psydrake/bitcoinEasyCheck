# Bitcoin Easy Check

## About
Web / mobile app for easily checking bitcoin prices. Includes Python back end running in Google App Engine that caches data from api.bitcoincharts.com.

## Technical
Bitcoin Easy Check consists of two parts:
* A pure HTML / CSS / JavaScript front end built with the [AngularJS](http://angularjs.org/) JavaScript framework.
* A [Google App Engine](https://developers.google.com/appengine/) back end, written in [Python](http://www.python.org/), that caches data from the [bitcoincharts.com](http://bitcoincharts.com/) API.

The front end communicates with the back end via [JSONP](http://en.wikipedia.org/wiki/JSONP) calls. The backend polls api.bitcoincharts.com every 15 minutes, and it stores this data in [memcache](https://developers.google.com/appengine/docs/python/memcache/) for all subsequent client requests, in order to reduce load on the bitcoincharts server.

## Install On Your Phone / Tablet
* [Bitcoin Easy Check for Android](https://play.google.com/store/apps/details?id=net.edrake.bitcoineasycheck)
* [Bitcoin Easy Check for Kindle Fire](http://www.amazon.com/Drake-Emko-Bitcoin-Easy-Check/dp/B00H8KQZU4/ref=sr_1_1?s=mobile-apps&ie=UTF8&qid=1386772951&sr=1-1&keywords=bitcoin+easy+check)
* [Bitcoin Easy Check for iOS](https://itunes.apple.com/us/app/bitcoin-easy-check/id780336876?ls=1&mt=8)
* [Bitcoin Easy Check for Windows Phone](http://www.windowsphone.com/en-us/store/app/bitcoin-easy-check/c8c6bf89-1660-4025-9b92-799591f4e491)
* [Bitcoin Easy Check for Firefox OS](https://marketplace.firefox.com/app/bitcoin-easy-check)

## Use As A Web App
* [Bitcoin Easy Check in the Chrome Web Store](https://chrome.google.com/webstore/detail/bitcoin-easy-check/dimfclahciiblaklehjikenimaafpaef)
* [Bitcoin Easy Check as a Web Site](http://d26tzgk0gx1hwh.cloudfront.net/main.html)

## Author
Drake Emko - drakee (a) gmail.com
* [@DrakeEmko](https://twitter.com/DrakeEmko)
* [Wolfgirl Band](http://wolfgirl.bandcamp.com/)
