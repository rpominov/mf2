/*global window $ Backbone _ _t Tag Tags Payment Payments*/

$(function(){
	"use strict";

	window.Tag = Backbone.Model.extend({
		
		defaults: {
			name: '',
			payments: null // Backbone.Collection
		},
		
		initialize: function() {
			
			if (this.get('payments') === null) {
				this.set({payments: new Backbone.Collection()});
			}
			
			this.get('payments')
				.bind('all', _(function(){
					this.trigger('change:payments', this, this.get('payments'));
				}).bind(this));
				
			this.bind('destroy', function(tag) {
				tag.get('payments').each(function(payment){
					payment.get('tags').remove(tag);
					payment.save();
				});
			});
				
			
		},
		
		validate: function(attrs) {
		    if (typeof attrs.name !== 'undefined' && !_.isString(attrs.name)) {
				return "'name' must be an String";
			}
		},
		
		// redefine toJSON to don't send to server collection of payments
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
			
			// lazy removing not used tags
			window.setInterval(function(){
				var not_used = Tags.getNotUsed();
				if (not_used.length > 0) {
					not_used[0].destroy();
				}
			}, 5000);
		},
		
		getUsed: function() {
			return this.filter(function(tag) { return tag.get('payments').length > 0; });
		},
		
		getNotUsed: function() {
			return this.filter(function(tag) { return tag.get('payments').length === 0; });
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
	
	Tag.views.InList = Backbone.View.extend({
		
		tagName: "li",
		className: "tag",
		tmpl: _t('tag.big-list'),
		
		events: {
			'click .text': 'onClickText',
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete'
		},
		
		initialize: function (args) {
			_.bindAll(this, 'changeName', 'changePayments');
			
			this.model.bind('destroy', _.bind(function(){ $(this.el).remove(); }, this));
			this.model.bind('change:name', this.changeName);
			this.model.bind('change:payments', this.changePayments);
		},
		
		onClickEdit: function() {
			this.trigger('edit_clicked', this.model);
		},
		
		onClickDelete: function() {
			this.model.destroy();
		},
		
		onClickText: function() {
			// todo
		},
		
		changeName: function() {
			this.$('.name').text(this.model.get('name'));
		},
		
		changePayments: function() {
			var data = this.model.toJSON(true);
			
			$(this.el)[ data.payments === 0 ? 'hide' : 'show' ]();
			 
			this.$('.payments').text(data.payments);
		},
		
		render: function() {
			var data = this.model.toJSON(true);
			$(this.el).html(this.tmpl(data));
			if (data.payments === 0) {
				$(this.el).hide();
			}
			return this;
		}
	});
	
	
	Tag.views.InSmallList = Backbone.View.extend({
		
		tagName: "li",
		className: "tag",
		tmpl: _t('tag.small-list'),
		
		events: {
		},
		
		initialize: function (args) {
			_.bindAll(this, 'changeName');
			
			this.model.bind('destroy', _.bind(function(){ $(this.el).remove(); }, this));
			this.model.bind('change:name', this.changeName);
		},
		
		changeName: function() {
			$(this.el).text(this.model.get('name'));
		},
		
		render: function() {
			var data = this.model.toJSON();
			$(this.el).html(this.tmpl(data));
			return this;
		}
	});
});
