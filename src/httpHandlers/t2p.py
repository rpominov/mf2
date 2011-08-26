from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp.util import run_wsgi_app

from django.utils import simplejson

from httpHandlers.all import T2p

class T2pRESTfulHandler(webapp.RequestHandler):
    
    def get(self, id):
        t2ps = []
        query = T2p.all()
        for t2p in query:
            t2ps.append(t2p.toDict())
        t2ps = simplejson.dumps(t2ps)
        self.response.out.write(t2ps)
    
    def post(self, id):
        t2p = simplejson.loads(self.request.body)
        t2p = T2p(tag = t2p['tag'], payment = t2p['payment'])
        t2p.put()
        t2p = simplejson.dumps(t2p.toDict())
        self.response.out.write(t2p)

    def put(self, id):
        t2p = T2p.get_by_id(int(id))
        tmp = simplejson.loads(self.request.body)
        t2p.tag = tmp['tag']
        t2p.payment = tmp['payment']
        t2p.put()
        t2p = simplejson.dumps(t2p.toDict())
        self.response.out.write(t2p)
        
    def delete(self, id):
        t2p = T2p.get_by_id(int(id))
        t2p.delete()
            
application = webapp.WSGIApplication([('/api/t2p/?([0-9]*)', T2pRESTfulHandler)], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
