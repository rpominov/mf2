/*global window $ Backbone _ __ _t Tag Tags Payment Payments T2p*/

$(function(){
	"use strict";
	
	function id2model(obj) {
		obj.tag = Tags.get(obj.tag);
		obj.payment = Payments.get(obj.payment);
	}
	
	window.T2p = Backbone.Model.extend({
		
		defaults: {
			tag: null,
			payment: null
		},
		
		initialize: function() {
		},
		
		validate: function(attrs) {
			if (!(attrs.payment instanceof Backbone.Model) || !(attrs.tag instanceof Backbone.Model)) {
				return 'payment and tag attributes should both be an instances of Backbone.Model';
			}
		},
		
		toJSON: function() {
			var result = Backbone.Model.prototype.toJSON.call(this);
			
			result.tag = result.tag.get('id');
			result.payment = result.payment.get('id');
			return result;
		},
		
		parse: function (resp, xhr) {
			var result = Backbone.Model.prototype.parse(resp, xhr);

			id2model(result);
			return result;
		}
	});
	
	T2p.Collection = Backbone.Collection.extend({
		model: T2p,
		url: '/t2p',
		
		initialize: function() {
			
			var coll = this;
			
			// sorry for this
			function trigger(type, t2p) {
				if (type !== 'reset') {
					_([{p1: 'payment', p2: 'tag'}, {p1: 'tag', p2: 'payment'}]).each(function(p){
						var cid = t2p.get(p.p1);
						var param = t2p.get(p.p2);
						if (!cid || !param) {
							return;
						}
						cid = cid.cid;
						var event_name = p.p1 + '_' + cid;
						coll.trigger(event_name);
						coll.trigger(event_name + ':' + type, param);
					});
				} else {
					t2p.each(function(t2p) {
						trigger('add', t2p);
					});
				}
			}
			
			_(['add', 'reset', 'remove']).each(function(type){
				coll.bind(type, _(trigger).bind(null, type));
			});
			
			Tags.bind('destroy', function(tag){
				coll.removeAllForTag(tag);
			});
			
			Payments.bind('destroy', function(payment){
				coll.removeAllForPayment(payment);
			});
		},
		
		parse: function (resp, xhr) {
			var result = Backbone.Collection.prototype.parse(resp, xhr);

			_(result).map(id2model);
			return result;
		},
		
		getByPayment: function(payment) {
			return __(this.find({payment: payment}).tags);
		},
		
		getByTag: function(tag) {
			return __(this.find({tag: tag}).payments);
		},
		
		setForPayment: function(payment, tags) {
			
			var current = this.getByPayment(payment).pluck('name'),
				add =     _(tags).difference(current),
				remove =  _(current).difference(tags),
				me = this;
				
			Tags.getByNames(add, function(tags){
				_(tags).each(function(tag){
					me.create({payment: payment, tag: tag});
				});
			});
			
			Tags.getByNames(remove, function(tags){
				_(tags).each(function(tag){
					me.find({payment: payment, tag: tag}).destroy();
				});
			});
		},
		
		removeAllForTag: function(tag) {
			this.find({tag: tag}).destroy();
		},
		
		removeAllForPayment: function(payment) {
			this.find({payment: payment}).destroy();
		},
		
		find: function(options) {
			var found = this.filter(function(t2p) {
				return (!options.payment || t2p.get('payment') === options.payment) 
					&& (!options.tag     || t2p.get('tag')     === options.tag);
			});
			
			found.destroy = function() {
				for (var i=0, l=this.length; i<l; i++) {
					this[i].destroy();
				}
			};
			
			found.tags = __(found).pluck('tag');
			found.payments = __(found).pluck('payment');
			
			return found;
		}
	});
});