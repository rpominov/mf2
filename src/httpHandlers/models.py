from google.appengine.ext import db
from google.appengine.api import users

#
# User
#
class User(db.Model):
	gae_user = db.UserProperty()
	
	@staticmethod
	def current():
		gae_user = users.get_current_user()
		
		if not gae_user:
			return None
		
		user = User.all().filter("gae_user =", gae_user).get()
		if user == None:
			user = User(gae_user=gae_user)
			user.put()
		return user


#
# Settings
#
class Settings(db.Model):
	show_tags = db.BooleanProperty()
	
	@staticmethod
	def current():
		user = User.current()
		
		if not user:
			return None
		
		settings = Settings.all().ancestor(user).get()
		if settings == None:
			settings = Settings(
				parent    = User.current(),
				show_tags = True
			)
			settings.put()
		return settings
	
	def toDict(self):
		return {
			'id':	     self.key().id(),
			'show_tags': self.show_tags
		}
		
	def fromDict(self, data):
		self.show_tags = data['show_tags']
			
			
#
# Currency
#
class Currency(db.Model):
	name       = db.StringProperty()
	short_name = db.StringProperty()
	
	def toDict(self):
		return {
			'id':	      self.key().id(),
			'name':       self.name,
			'short_name': self.short_name,
		}
		
	def fromDict(self, data):
		self.name       = data['name']
		self.short_name = data['short_name']


#
# C2c
#
class C2c(db.Model):
	currency1 = db.IntegerProperty() # key
	currency2 = db.IntegerProperty() # key
	divide    = db.FloatProperty()
	
	def toDict(self):
		return {
			'id':	     self.key().id(),
			'currency1': self.currency1,
			'currency2': self.currency2,
			'divide':    self.divide,
		}
		
	def fromDict(self, data):
		self.currency1 = int(data['currency1'])
		self.currency2 = int(data['currency2'])
		self.divide    = float(data['divide'])
					
					
#
# Vault
#
class Vault(db.Model):
	name = db.StringProperty()
	
	def toDict(self):
		return {
			'id':	self.key().id(),
			'name':  self.name
		}
		
	def fromDict(self, data):
		self.name = data['name']
		
		

#
# Filter
#		
class Filter(db.Model):
	name = db.StringProperty()
	
	def toDict(self):
		return {
			'id':	self.key().id(),
			'name':  self.name
		}
	
	def fromDict(self, data):
		self.name = data['name']

#
# Payment
#
class Payment(db.Model):
	name     = db.StringProperty()
	value    = db.FloatProperty()
	value1   = db.FloatProperty()
	type     = db.IntegerProperty() # 0: -, 1: +, 2: t
	time     = db.IntegerProperty() # timestamp
	cr_time  = db.IntegerProperty()
	vault    = db.IntegerProperty() # key
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

#
# T2p
#		
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

		
#
# Tag
#
class Tag(db.Model):
	name = db.StringProperty()
	
	def toDict(self):
		return {
			'id':	self.key().id(),
			'name':  self.name
		}
		
	def fromDict(self, data):
		self.name = data['name']