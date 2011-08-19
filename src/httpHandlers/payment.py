from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp.util import run_wsgi_app

from django.utils import simplejson

    
class Payment(db.Model):
    name = db.StringProperty()
    value = db.IntegerProperty()
    tags = db.ListProperty(int)
    
    def toDict(self):
        return {
            'id':    self.key().id(),
            'name':  self.name,
            'value': self.value,
            'tags':  self.tags
        }

class PaymentRESTfulHandler(webapp.RequestHandler):
    
    def get(self, id):
        payments = []
        query = Payment.all()
        for payment in query:
            payments.append(payment.toDict())
        payments = simplejson.dumps(payments)
        self.response.out.write(payments)
    
    def post(self, id):
        payment = simplejson.loads(self.request.body)
        payment = Payment(
            name  = payment['name'],
            value = int(payment['value']),
            tags = map(int, payment['tags'])
        )
        payment.put()
        payment = simplejson.dumps(payment.toDict())
        self.response.out.write(payment)

    def put(self, id):
        payment = Payment.get_by_id(int(id))
        tmp = simplejson.loads(self.request.body)
        payment.name  = tmp['name']
        payment.value = int(tmp['value'])
        payment.tags = map(int, tmp['tags'])
        payment.put()
        payment = simplejson.dumps(payment.toDict())
        self.response.out.write(payment)
        
    def delete(self, id):
        payment = Payment.get_by_id(int(id))
        payment.delete()
            
application = webapp.WSGIApplication([('/payment/?([0-9]*)', PaymentRESTfulHandler)], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
