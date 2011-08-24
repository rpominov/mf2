from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp.util import run_wsgi_app

from django.utils import simplejson

    
class Vault(db.Model):
    name = db.StringProperty()
    
    def toDict(self):
        return {
            'id':    self.key().id(),
            'name':  self.name
        }

class VaultRESTfulHandler(webapp.RequestHandler):
    
    def get(self, id):
        vaults = []
        query = Vault.all()
        for vault in query:
            vaults.append(vault.toDict())
        vaults = simplejson.dumps(vaults)
        self.response.out.write(vaults)
    
    def post(self, id):
        vault = simplejson.loads(self.request.body)
        vault = Vault(name = vault['name'])
        vault.put()
        vault = simplejson.dumps(vault.toDict())
        self.response.out.write(vault)

    def put(self, id):
        vault = Vault.get_by_id(int(id))
        tmp = simplejson.loads(self.request.body)
        vault.name = tmp['name']
        vault.put()
        vault = simplejson.dumps(vault.toDict())
        self.response.out.write(vault)
        
    def delete(self, id):
        vault = Vault.get_by_id(int(id))
        vault.delete()
            
application = webapp.WSGIApplication([('/api/vault/?([0-9]*)', VaultRESTfulHandler)], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
