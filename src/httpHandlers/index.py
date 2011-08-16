import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template

t_dir = '../templates/'

def p(path):
    return os.path.join(os.path.dirname(__file__), path)

def name2content(fname):
    fname = p(t_dir + '/js/' + fname)
    f = file(fname)
    s = f.read()
    return s

class MainPage(webapp.RequestHandler):
    def get(self):
        
        js_templates = os.listdir(p(t_dir + '/js'))
        js_templates = map(name2content, js_templates)
        
        self.response.out.write(
            template.render(
                p(t_dir + 'index.html'), 
                {'js_templates': ''.join(js_templates)}
            )
        )

application = webapp.WSGIApplication([('/', MainPage)], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
