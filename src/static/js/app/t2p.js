window.T2p = (function(_, __, Backbone, core){
	"use strict";
	
	var SearchResult = function(t2ps) {
		this.t2ps = t2ps;
	};
	_.extend(SearchResult.prototype, {
		tags: function(){
			return __(this.t2ps).pluck('tag');
		},
		payments: function(){
			return __(this.t2ps).pluck('payment');
		},
		destroy: function(){
			_(this.t2ps).each(function(t2p){
				t2p.destroy();
			});
		}
	});
	
	function id2model(obj) {
		obj.tag = core._coll.Tags.get(obj.tag);
		obj.payment = core._coll.Payments.get(obj.payment);
	}
	
	var T2p = Backbone.Model.extend({
		
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
		url: '/api/t2p',
		
		initialize: function() {
			
			var me = this;
			
			// sorry for this
			function trigger(type, t2p) {
				if (type !== 'reset') {
					_([{p1: 'payment', p2: 'tag'}, {p1: 'tag', p2: 'payment'}]).each(function(p){
						var model = t2p.get(p.p1);
						var param = t2p.get(p.p2);
						if (!model || !param) {
							return;
						}
						var cid = model.cid;
						var event_name = p.p1 + '_' + cid;
						me.trigger(event_name);
						me.trigger(event_name + ':' + type, param);
						
						// collection style events
						me.trigger(p.p1 + ':' + type, model, param);
						me.trigger(p.p1, model, param);
					});
				} else {
					t2p.each(function(t2p) {
						trigger('add', t2p);
					});
				}
			}
			
			_(['add', 'reset', 'remove']).each(function(type){
				me.bind(type, _(trigger).bind(null, type));
			});
			
			core.coll(function(cc){
				
				cc.Tags.bind('destroy', function(tag){
					me.removeAllForTag(tag);
				});
				
				cc.Payments.bind('destroy', function(payment){
					me.removeAllForPayment(payment);
				});
				
			});
			
		},
		
		parse: function (resp, xhr) {
			var result = Backbone.Collection.prototype.parse(resp, xhr);

			_(result).map(id2model);
			return result;
		},
		
		getByPayment: function(payment) {
			return this.find({payment: payment}).tags();
		},
		
		getByTag: function(tag) {
			return this.find({tag: tag}).payments();
		},
		
		setForPayment: function(payment, tags) {
			
			var current = __(this.getByPayment(payment)).pluck('name'),
				add =     _(tags).difference(current),
				remove =  _(current).difference(tags),
				me = this;
				
			core._coll.Tags.getByNames(add, function(tags){
				_(tags).each(function(tag){
					me.create({payment: payment, tag: tag});
				});
			});
			
			core._coll.Tags.getByNames(remove, function(tags){
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
				return (!options.payment || t2p.get('payment') === options.payment) && (!options.tag || t2p.get('tag') === options.tag);
			});
			return new SearchResult(found);
		}
	});

	return T2p;
})(window._, window.__, window.Backbone, window.core);
