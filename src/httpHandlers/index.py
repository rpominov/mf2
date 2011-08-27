import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template

from httpHandlers.all import AllRESTfulHandler

t_dir = '../templates/'

def p(path):
    return os.path.join(os.path.dirname(__file__), path)

def add_js(n):
    return 'js/' + n;

class MainPage(webapp.RequestHandler):
    def get(self):
        
        js_templates = os.listdir(p(t_dir + '/js'))
        js_templates = map(add_js, js_templates)
        
        initial_data = AllRESTfulHandler()
        initial_data = initial_data.getJSON()
        
        self.response.out.write(
            template.render(
                p(t_dir + 'index.html'), 
                {'js_templates': js_templates,
				 'initial_data': initial_data}
            )
        )

application = webapp.WSGIApplication([('/', MainPage)], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
