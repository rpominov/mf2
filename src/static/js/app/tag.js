/*global window $ Backbone _ _t Tag Tags Payment Payments*/

$(function(){
	"use strict";

	window.Tag = Backbone.Model.extend({
		
		defaults: {
			name: '',
			payments: null
		},
		
		initialize: function() {
			this.set({payments: new Backbone.Collection()});
			this.get('payments')
				.bind('all', _(this.trigger).bind(this, 'change:payments'));
		},
		
		validate: function(attrs) {
		    if (typeof attrs.name !== 'undefined' && !_.isString(attrs.name)) {
				return "'name' must be an String";
			}
		},
		
		toJSON: function(count_payments) {
			var result = Backbone.Model.prototype.toJSON.call(this);
			
			if (count_payments) {
				result.payments = result.payments.length;
			} else {
				delete result.payments;
			}
			
			return result;
		}
	});
	
	Tag.Collection = Backbone.Collection.extend({
		model: Tag,
		url: '/tag',
		
		initialize: function() {
			// don't shure it works
			
			function add(model, tag) {
				tag.get('payments').add(model);
			}
			
			function remove(model, tag) {
				tag.get('payments').remove(model);
			}
			
			function callback(action, model) {
				_(model.get('tags').models).each(_(action).bind(null, model));
			}
			
			var add_callback    = _(callback).bind(null, add);
			var remove_callback = _(callback).bind(null, remove);
			
			Payments.bind('add', add_callback);
			Payments.bind('remove', remove_callback);
			
			Payments.bind('reset', function(collection){
				collection.each(add_callback);
			});
			
			Payments.bind('change:tags', function(model, tags){ 
				tags = tags.models;
				var previous_tags = model.previous('tags').models,
					added = _(tags).difference(previous_tags),
					removed = _(previous_tags).difference(tags);
					
				_(added).each(_(add).bind(null, model));
				_(removed).each(_(remove).bind(null, model));
			});
		},
		
		getUsed: function() {
			// todo
		},
		
		/**
		 * Returns tags by their names,
		 * in case of tag not exist creates it.
		 * Puts result to callback.
		 */ 
		getByNames: function(names, callback) {
			var existed = this.filter(function (tag) { return _(names).contains(tag.get('name')); });
			var create = _(names).difference(_(existed).map(function(tag){ return tag.get('name'); }));
			
			create = _(create).map(_(function(name) {
				var tag = new Tag({name: name});
				this.add(tag);
				return {
					model: tag,
					deferred: tag.save()
				};
			}).bind(this));
			
			$.when.apply($, _(create).pluck('deferred')).done( function() {
				callback( _.union(existed, _(create).pluck('model')) );
			});
		}
	});
	
	Tag.views = {};
	
	Tag.views.bigList = Backbone.View.extend({
		
		tagName: "li",
		className: "tag",
		tmpl: _t('tag.big-list'),
		
		events: {
			'click .text': 'onClickText'
		},
		
		initialize: function (args) {
			/*var remove = _.bind(function(){ $(this.el).remove(); }, this);
			this.model.bind('destroy', remove);
			this.bind('close', remove)*/
		},
		
		onClickText: function() {
			// todo
		},
		
		render: function() {
			$(this.el).html(this.tmpl(this.model.toJSON()));
			return this;
		}
	});
});
