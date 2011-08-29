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
	name     = db.StringProperty()
	value    = db.FloatProperty()
	value1   = db.FloatProperty()
	type     = db.IntegerProperty() # 0: 1, 1: +, 2: t
	time     = db.IntegerProperty() # timestamp
	cr_time  = db.IntegerProperty()
	vault  = db.IntegerProperty() # id
	vault1 = db.IntegerProperty()
	
	def toDict(self):
		return {
			'id':	    self.key().id(),
			'name':     self.name,
			'value':    self.value,
			'value1':   self.value1,
			'type':     self.type,
			'time':     self.time,
			'cr_time':  self.cr_time,
			'vault':    self.vault,
			'vault1':   self.vault1,
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

class AllRESTfulHandler(webapp.RequestHandler):
	
	def get(self):
		result = self.getJSON()
		self.response.out.write(result)
		
	def getJSON(self):
		result = {
			'Vaults': Vault,
			'Filters': Filter,
			'Payments': Payment,
			'T2ps': T2p,
			'Tags': Tag
		}
		
		for i in result.keys():
			query = result[i].all().fetch(10000)
			result[i] = []
			for entry in query:
				result[i].append(entry.toDict())
			
		return simplejson.dumps(result)
			
application = webapp.WSGIApplication([('/api/all', AllRESTfulHandler)], debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()
