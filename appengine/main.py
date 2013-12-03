"""Main.py is the top level script.

Loads the Bottle framework and mounts controllers.  Also adds a custom error
handler.
"""

from google.appengine.api import memcache
# import the Bottle framework
from server.lib.bottle import Bottle, request, response, template
import csv, json, logging, StringIO, urllib2

# TODO: name and list your controllers here so their routes become accessible.
from server.controllers import RESOURCE_NAME_controller

WEIGHTED_PRICES_URL = 'http://api.bitcoincharts.com/v1/weighted_prices.json'
MARKETS_URL = 'http://api.bitcoincharts.com/v1/markets.json'
TRADES_BY_SYMBOL_URL = 'http://api.bitcoincharts.com/v1/trades.csv?symbol='

# Run the Bottle wsgi application. We don't need to call run() since our
# application is embedded within an App Engine WSGI application server.
bottle = Bottle()

# Mount a new instance of bottle for each controller and URL prefix.
# TODO: Change 'RESOURCE_NAME' and add new controller references
bottle.mount("/RESOURCE_NAME", RESOURCE_NAME_controller.bottle)

@bottle.route('/')
def home():
  """Return project name at application root URL"""
  return "Bitcoin Easy Check"

@bottle.route('/api/weighted-prices')
@bottle.route('/api/weighted-prices/')
@bottle.route('/api/weighted-prices/<currency:re:[A-Z][A-Z][A-Z]>')
def weightedPrices(currency=''):
    response.content_type = 'application/json; charset=utf-8'

    wpReturn = memcache.get('wp_' + currency)
    if (not wpReturn):
        logging.warn("No data found in memcache for wp_" + currency)
        wpReturn = '{}'

    query = request.query.decode()
    if (len(query) > 0):
        wpReturn = query['callback'] + '(' + wpReturn + ')'

    return wpReturn

def pullWeightedPrices():
    data = urllib2.urlopen(WEIGHTED_PRICES_URL)

    dataDict = json.load(data)
    for key in dataDict.keys():
        tmpDict = {}
        tmpDict[key] = dataDict[key]
        entry = json.dumps(tmpDict)
        memcache.set('wp_' + key, entry)
        logging.info("Stored in memcache for key wp_" + key + ", starting with: " + entry[0:20])

    allWeightedPrices = json.dumps(dataDict)

    memcache.set("wp_", allWeightedPrices)
    logging.info("Pulled weighted prices and stored in memcache for key wp_, starting with: " + allWeightedPrices[0:100])

@bottle.route('/api/markets')
@bottle.route('/api/markets/')
@bottle.route('/api/markets/<symbol:re:[a-z]+[A-Z][A-Z][A-Z]>')
def markets(symbol=''):
    response.content_type = 'application/json; charset=utf-8'

    mReturn = memcache.get('markets_' + symbol)
    if (not mReturn):
        logging.warn("No data found in memcache for markets_" + symbol)
        mReturn = '{}'

    query = request.query.decode()
    if (len(query) > 0):
        mReturn = query['callback'] + '(' + mReturn + ')'

    logging.info("Returning markets from web request for markets_" + symbol + ", starting with: " + mReturn[0:100])
    return mReturn

def pullMarkets():
    data = urllib2.urlopen(MARKETS_URL)

    dataDict = json.load(data)

    for x in dataDict:
        entry = json.dumps([ x ])
        memcache.set('markets_' + x['symbol'], entry)
        logging.info("Stored in memcache for key markets_" + x['symbol'] + ", starting with: " + entry[0:20])

    allMarkets = json.dumps(dataDict)
    memcache.set("markets_", allMarkets)
    logging.info("Pulled markets and stored in memcache for key markets_, starting with: " + allMarkets[0:100])

@bottle.route('/api/trades/<symbol:re:[a-z]+[A-Z][A-Z][A-Z]>')
def trades(symbol=''):
    response.content_type = 'application/json; charset=utf-8'

    tReturn = memcache.get('trades_' + symbol)
    if (not tReturn):
        logging.warn("No data found in memcache for trades_" + symbol)
        tReturn = '[]'

    query = request.query.decode()
    if (len(query) > 0):
        tReturn = query['callback'] + '(' + tReturn + ')'

    logging.info("Returning trades from web request for trades_" + symbol + ", starting with: " + tReturn[0:100])
    return tReturn

def pullTrades(symbol=''):
    data = urllib2.urlopen(TRADES_BY_SYMBOL_URL + symbol).read()
    output = StringIO.StringIO(data)
    cr = csv.reader(output)

    csvList = []
    i = 0
    for row in reversed(list(cr)):
        i = i + 1
        if (i > 100):
            break
        csvList.append([ int(row[0]), float(row[1]), float(row[2]) ])

    tReturn = str(csvList)

    memcache.set("trades_" + symbol, tReturn)
    logging.info("Pulled trades and stored in memcache for trades_" + symbol + ", starting with: " + tReturn[0:100])
    
@bottle.route('/tasks/pull-bitcoincharts-data')
def pullBitcoinchartsData():
    pullMarkets()
    pullWeightedPrices()
    #pullTrades('mtgoxUSD')
    return "Done"

@bottle.route('/tasks/mail-bitcoincharts-stats')
def mailBitcoinchartsStats():
    # TODO: implement this
    return "Done"

@bottle.error(404)
def error_404(error):
  """Return a custom 404 error."""
  return 'Sorry, Nothing at this URL.'
