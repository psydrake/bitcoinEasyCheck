# Bitcoin Easy Check

## About
Web / mobile app for easily checking bitcoin prices. Includes Python back end running in Google App Engine that caches data from api.bitcoincharts.com.

## Technical
Bitcoin Easy Check consists of two parts:
* A pure HTML / CSS / JavaScript front end built with the [AngularJS](http://angularjs.org/) JavaScript framework.
* A [Google App Engine](https://developers.google.com/appengine/) back end, written in [Python](http://www.python.org/), that caches data from the [bitcoincharts.com](http://bitcoincharts.com/) API.

The front end communicates with the back end via [JSONP](http://en.wikipedia.org/wiki/JSONP) calls. The backend polls api.bitcoincharts.com every 15 minutes, and it stores this data in [memcache](https://developers.google.com/appengine/docs/python/memcache/) for all subsequent client requests, in order to reduce load on the bitcoincharts server.

## Use As A Web App
* [Bitcoin Easy Check in the Chrome Web Store](https://chrome.google.com/webstore/detail/bitcoin-easy-check/dimfclahciiblaklehjikenimaafpaef)
* [Bitcoin Easy Check as a Web Site](http://d26tzgk0gx1hwh.cloudfront.net/main.html)

## Author
Drake Emko - drakee (a) gmail.com
* [@DrakeEmko](https://twitter.com/DrakeEmko)
* [Wolfgirl Band](http://wolfgirl.bandcamp.com/)
