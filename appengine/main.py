"""Main.py is the top level script.

Loads the Bottle framework and mounts controllers.  Also adds a custom error
handler.
"""

# import the Bottle framework
from server.lib.bottle import Bottle, template
# TODO: name and list your controllers here so their routes become accessible.
from server.controllers import RESOURCE_NAME_controller

# Run the Bottle wsgi application. We don't need to call run() since our
# application is embedded within an App Engine WSGI application server.
bottle = Bottle()

# Mount a new instance of bottle for each controller and URL prefix.
# TODO: Change 'RESOURCE_NAME' and add new controller references
bottle.mount("/RESOURCE_NAME", RESOURCE_NAME_controller.bottle)

@bottle.route('/')
def home():
  """ Return project name at application root URL"""
  return "Bitcoin Easy Check"

@bottle.route('/weighted-prices')
@bottle.route('/weighted-prices/')
@bottle.route('/weighted-prices/<currency:re:[A-Z][A-Z][A-Z]>')
def weightedPrices(currency='USD'):
    return template('currency: {{currency}}', currency=currency)
    
@bottle.route('/tasks/pull-bitcoincharts-data')
def pullBitcoinchartsData():
    return "data"

@bottle.route('/mail/bitcoincharts-stats')
def mailBitcoinchartsStats():
    return "stats"

@bottle.error(404)
def error_404(error):
  """Return a custom 404 error."""
  return 'Sorry, Nothing at this URL.'
