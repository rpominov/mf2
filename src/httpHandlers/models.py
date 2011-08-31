from google.appengine.ext import db

class User(db.Model):
	name = db.StringProperty()
	
	@staticmethod
	def current():
		user = User.all().filter("name =", "Smith").get()
		if user == None:
			user = User(name="Smith")
			user.put()
		return user
	
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
	type     = db.IntegerProperty() # 0: -, 1: +, 2: t
	time     = db.IntegerProperty() # timestamp
	cr_time  = db.IntegerProperty()
	vault    = db.IntegerProperty() # id
	vault1   = db.IntegerProperty()
	
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
		self.type     = int(data['type'])
		self.time     = int(data['time'])
		self.cr_time  = int(data['cr_time'])
		self.vault    = int(data['vault'])
		
		if data['value1'] == None:
			self.value1 = None 
		else:
			self.value1 = float(data['value1'])
		
		if data['vault1'] == None:
			self.vault1 = None 
		else:
			self.vault1 = int(data['vault1'])

		
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