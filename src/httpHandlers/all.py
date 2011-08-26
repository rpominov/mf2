from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp.util import run_wsgi_app

from django.utils import simplejson

	
class Vault(db.Model):
	name = db.StringProperty()
	
	def toDict(self):
		return {
			'id':	self.key().id(),
			'name':  self.name
		}
		
class Filter(db.Model):
	name = db.StringProperty()
	
	def toDict(self):
		return {
			'id':	self.key().id(),
			'name':  self.name
		}
		
class Payment(db.Model):
	name = db.StringProperty()
	value = db.IntegerProperty()
	
	def toDict(self):
		return {
			'id':	self.key().id(),
			'name':  self.name,
			'value': self.value
		}
		
class T2p(db.Model):
	tag = db.IntegerProperty()
	payment = db.IntegerProperty()
	
	def toDict(self):
		return {
			'id': self.key().id(),
			'tag': self.tag,
			'payment': self.payment
		}
		
class Tag(db.Model):
	name = db.StringProperty()
	
	def toDict(self):
		return {
			'id':	self.key().id(),
			'name':  self.name
		}		

class VaultRESTfulHandler(webapp.RequestHandler):
	
	def get(self):
		result = {
			'Vaults': Vault,
			'Filters': Filter,
			'Payments': Payment,
			'T2ps': T2p,
			'Tags': Tag
		}
		
		for i in result.keys():
			query = result[i].all()
			result[i] = []
			for entry in query:
				result[i].append(entry.toDict())
			
		result = simplejson.dumps(result)
		self.response.out.write(result)
			
application = webapp.WSGIApplication([('/api/all', VaultRESTfulHandler)], debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()
