from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

from django.utils import simplejson

from httpHandlers.all import Filter

class FilterRESTfulHandler(webapp.RequestHandler):
    
    def get(self, id):
        filters = []
        query = Filter.all()
        for filter in query:
            filters.append(filter.toDict())
        filters = simplejson.dumps(filters)
        self.response.out.write(filters)
    
    def post(self, id):
        filter = simplejson.loads(self.request.body)
        filter = Filter(name = filter['name'])
        filter.put()
        filter = simplejson.dumps(filter.toDict())
        self.response.out.write(filter)

    def put(self, id):
        filter = Filter.get_by_id(int(id))
        tmp = simplejson.loads(self.request.body)
        filter.name = tmp['name']
        filter.put()
        filter = simplejson.dumps(filter.toDict())
        self.response.out.write(filter)
        
    def delete(self, id):
        filter = Filter.get_by_id(int(id))
        filter.delete()
            
application = webapp.WSGIApplication([('/api/filter/?([0-9]*)', FilterRESTfulHandler)], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
