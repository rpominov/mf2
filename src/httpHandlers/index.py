import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
from google.appengine.api import users

from httpHandlers.REST import RESTfulHandler

t_dir = '../templates/'

def p(path):
	return os.path.join(os.path.dirname(__file__), path)

def add_js(n):
	return 'js/' + n;

class MainPage(webapp.RequestHandler):
	def get(self):
		
		user = users.get_current_user()
		
		if user:
			js_templates = os.listdir(p(t_dir + '/js'))
			js_templates = map(add_js, js_templates)
			
			initial_data = RESTfulHandler.getAllData()
			
			self.response.out.write(template.render(p(t_dir + 'index.html'), {
				'js_templates': js_templates,
				'initial_data': initial_data,
				'user':         user,
				'logout_url':   users.create_logout_url('/'),
			}))
		else:
			self.response.out.write(template.render('../templates/welcome.html', {
				'login_url': users.create_login_url('/')
			}))
			
		
		

application = webapp.WSGIApplication([('/', MainPage)], debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()
