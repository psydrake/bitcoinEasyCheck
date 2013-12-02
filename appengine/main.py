"""Main.py is the top level script.

Loads the Bottle framework and mounts controllers.  Also adds a custom error
handler.
"""

# import the Bottle framework
from server.lib.bottle import Bottle, request, response, template
import json
import urllib2

# TODO: name and list your controllers here so their routes become accessible.
from server.controllers import RESOURCE_NAME_controller

WEIGHTED_PRICES_URL = 'http://api.bitcoincharts.com/v1/weighted_prices.json'
#WEIGHTED_PRICES_URL = 'http://api.icndb.com/jokes/random?firstName=John&lastName=Doe'
MARKETS_URL = 'http://api.bitcoincharts.com/v1/markets.json'

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
    data = urllib2.urlopen(WEIGHTED_PRICES_URL)
    #data = {"USD": {"7d": "965.06", "30d": "569.00", "24h": "957.63"}, "ILS": {"7d": "3759.96", "30d": "1566.04"}, "GBP": {"7d": "660.07", "30d": "375.13", "24h": "639.97"}, "DKK": {"7d": "6167.04", "30d": "3682.47", "24h": "5414.17"}, "CAD": {"7d": "961.43", "30d": "541.09", "24h": "932.77"}, "MXN": {"7d": "14609.87", "30d": "6442.17"}, "XRP": {"7d": "32010.22", "30d": "39020.96", "24h": "17274.03"}, "SEK": {"7d": "6325.94", "30d": "3563.01", "24h": "6615.68"}, "SGD": {"7d": "1265.61", "30d": "811.55", "24h": "1262.58"}, "HKD": {"7d": "7916.17", "30d": "3923.22", "24h": "7990.00"}, "AUD": {"7d": "1114.93", "30d": "603.85", "24h": "1128.28"}, "CHF": {"7d": "896.30", "30d": "529.55", "24h": "883.96"}, "timestamp": 1385947296, "CNY": {"7d": "6348.69", "30d": "4022.49", "24h": "6574.53"}, "LTC": {"7d": "30.62", "30d": "47.96", "24h": "27.50"}, "NZD": {"7d": "1200.65", "30d": "699.72", "24h": "1175.93"}, "THB": {"7d": "30222.27", "30d": "20903.88", "24h": "29925.36"}, "EUR": {"7d": "737.73", "30d": "420.17", "24h": "731.69"}, "SLL": {"7d": "237712.93", "30d": "120191.13", "24h": "237113.94"}, "ARS": {"7d": "9357.66", "30d": "5211.04", "24h": "10549.53"}, "NOK": {"7d": "5920.94", "30d": "3737.00", "24h": "5850.94"}, "RUB": {"7d": "30669.45", "30d": "17895.62", "24h": "30394.07"}, "INR": {"7d": "64734.48", "30d": "38777.66", "24h": "80268.54"}, "JPY": {"7d": "102230.94", "30d": "58794.72", "24h": "109837.86"}, "CZK": {"7d": "21419.43", "30d": "6739.01", "24h": "20973.31"}, "BRL": {"7d": "2745.57", "30d": "1771.81", "24h": "2737.60"}, "PLN": {"7d": "3038.16", "30d": "1651.49", "24h": "3046.34"}, "ZAR": {"7d": "11269.59", "30d": "7162.01", "24h": "11623.17"}}
    #wpList = []
    #for x in data:
    #    wpList.append({x: data[x]})
    #wpReturn = json.dumps(wpList, ensure_ascii=False)

    dataDict = json.load(data)
    tmpDict = {}
    if (currency):
        tmpDict[currency] = dataDict[currency]
        print 'tmpDict: ' + str(tmpDict)
        dataDict = tmpDict

    wpReturn = json.dumps(dataDict)
    print 'wpReturn: ' + str(wpReturn)

    query = request.query.decode()
    if (len(query) > 0):
        wpReturn = query['callback'] + '(' + wpReturn + ')'

    return wpReturn

@bottle.route('/api/markets')
@bottle.route('/api/markets/')
@bottle.route('/api/markets/<symbol:re:[a-z]+[A-Z][A-Z][A-Z]>')
def markets(symbol=''):
    response.content_type = 'application/json; charset=utf-8'
    data = urllib2.urlopen(MARKETS_URL)

    dataDict = json.load(data)
    tmpList = []
    if (symbol):
        for x in dataDict:
            #print 'x: ' + str(x['symbol'])
            if (x['symbol'] == symbol):
                tmpList.append(x)
        dataDict = tmpList

    mReturn = json.dumps(dataDict)
    #mReturn = '[{"volume": 35286.194070110000, "latest_trade": 1385523699, "bid": 969.600000000000, "high": 983.990000000000, "currency": "USD", "currency_volume": 31977540.064671998726, "ask": 969.680000000000, "close": 970.000000000000, "avg": 906.2337525304075111102412858, "symbol": "mtgoxUSD", "low": 825.123010000000}, {"volume": 0, "latest_trade": 1382284470, "bid": 71.999999990000, "high": null, "currency": "EUR", "currency_volume": 0, "ask": null, "close": 119.000000000000, "avg": null, "symbol": "rippleEUR", "low": null}, {"volume": 0.010000000000, "latest_trade": 1385463228, "bid": 395.000000000000, "high": 395.000000000000, "currency": "USD", "currency_volume": 3.950000000000, "ask": null, "close": 395.000000000000, "avg": 395, "symbol": "weexUSD", "low": 395.000000000000}]'

    query = request.query.decode()
    if (len(query) > 0):
        mReturn = query['callback'] + '(' + mReturn + ')'

    return mReturn
    
@bottle.route('/tasks/pull-bitcoincharts-data')
def pullBitcoinchartsData():
    return "data"

@bottle.route('/tasks/mail-bitcoincharts-stats')
def mailBitcoinchartsStats():
    return "stats"

@bottle.error(404)
def error_404(error):
  """Return a custom 404 error."""
  return 'Sorry, Nothing at this URL.'
