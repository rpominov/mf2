from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

from django.utils import simplejson

from httpHandlers.all import Tag

class TagRESTfulHandler(webapp.RequestHandler):
    
    def get(self, id):
        tags = []
        query = Tag.all()
        for tag in query:
            tags.append(tag.toDict())
        tags = simplejson.dumps(tags)
        self.response.out.write(tags)
    
    def post(self, id):
        tag = simplejson.loads(self.request.body)
        tag = Tag(name = tag['name'])
        tag.put()
        tag = simplejson.dumps(tag.toDict())
        self.response.out.write(tag)

    def put(self, id):
        tag = Tag.get_by_id(int(id))
        tmp = simplejson.loads(self.request.body)
        tag.name = tmp['name']
        tag.put()
        tag = simplejson.dumps(tag.toDict())
        self.response.out.write(tag)
        
    def delete(self, id):
        tag = Tag.get_by_id(int(id))
        tag.delete()
            
application = webapp.WSGIApplication([('/api/tag/?([0-9]*)', TagRESTfulHandler)], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
