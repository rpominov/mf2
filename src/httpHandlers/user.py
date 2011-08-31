from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

from httpHandlers.models import User

class Registration(webapp.RequestHandler):
	pass	
	
application = webapp.WSGIApplication([('/register', Registration)], debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()