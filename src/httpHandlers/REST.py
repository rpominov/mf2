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
		
	def fromDict(self, data):
		self.name = data['name']

		
class Filter(db.Model):
	name = db.StringProperty()
	
	def toDict(self):
		return {
			'id':	self.key().id(),
			'name':  self.name
		}
	
	def fromDict(self, data):
		self.name = data['name']

		
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
		
	def fromDict(self, data):
		self.name     = data['name']
		self.value    = float(data['value'])
		self.value1   = float(data['value1'])
		self.type     = int(data['type'])
		self.time     = int(data['time'])
		self.cr_time  = int(data['cr_time'])
		self.vault    = int(data['vault'])
		self.vault1   = int(data['vault1'])

		
class T2p(db.Model):
	tag = db.IntegerProperty()
	payment = db.IntegerProperty()
	
	def toDict(self):
		return {
			'id': self.key().id(),
			'tag': self.tag,
			'payment': self.payment
		}
		
	def fromDict(self, data):
		self.tag     = data['tag']
		self.payment = data['payment']

		
class Tag(db.Model):
	name = db.StringProperty()
	
	def toDict(self):
		return {
			'id':	self.key().id(),
			'name':  self.name
		}
		
	def fromDict(self, data):
		self.name = data['name']	


kind2model = {
	'payment': Payment,
	'tag': Tag,
	'vault': Vault,
	't2p': T2p,
	'filter': Filter,
}

class RESTfulHandler(webapp.RequestHandler):
	
	def get(self, kind, id):
		
		if kind == 'all':
			result = self.getAllData()
			self.response.out.write(result)
		else:
			
			if not kind in kind2model:
				self.error(500)
				return
		
			result = []
			query = kind2model[kind].all()
			for item in query:
				result.append(item.toDict())
			result = simplejson.dumps(result)
			self.response.out.write(result)

	def post(self, kind, id):
		
		if not kind in kind2model:
			self.error(500)
			return
		
		data = simplejson.loads(self.request.body)
		model = kind2model[kind]()
		model.fromDict(data)
		model.put()
		data = simplejson.dumps(model.toDict())
		self.response.out.write(data)

	def put(self, kind, id):

		if not kind in kind2model:
			self.error(500)
			return
		
		data = simplejson.loads(self.request.body)
		model = kind2model[kind].get_by_id(int(id))
		model.fromDict(data)
		model.put()
		data = simplejson.dumps(model.toDict())
		self.response.out.write(data)

	def delete(self, kind, id):

		if not kind in kind2model:
			self.error(500)
			return
		
		model = kind2model[kind].get_by_id(int(id))
		model.delete()
		
	def getAllData(self):
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

			
application = webapp.WSGIApplication([('/api/(all|payment|tag|vault|t2p|filter)/?([0-9]*)', RESTfulHandler)], debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()
