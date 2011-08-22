/*global window $ Backbone _ _t Tag Tags Payment Payments T2ps*/

$(function(){
	"use strict";

	window.Tag = Backbone.Model.extend({
		
		defaults: {
			name: ''
		},
		
		initialize: function() {
		},
		
		validate: function(attrs) {
		    if (typeof attrs.name !== 'undefined' && !_.isString(attrs.name)) {
				return "'name' must be an String";
			}
		}
	});
	
	Tag.Collection = Backbone.Collection.extend({
		model: Tag,
		url: '/tag',
		
		initialize: function() {
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
			
			return $.when.apply($, _(create).pluck('deferred')).done( function() {
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
			T2ps.bind('tag_' + this.model.cid, this.changePayments);
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
			var payments = T2ps.getByTag(this.model);
			
			payments = payments.length;
			
			$(this.el)[ payments === 0 ? 'hide' : 'show' ]();
			this.$('.payments').text(payments);
		},
		
		render: function() {
			var data = this.model.toJSON();
			$(this.el).html(this.tmpl(data));
			this.changePayments();
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
			
			T2ps.bind('tag_' + this.model.cid + ':remove', _(function(payment){
				if(payment === this.options.payment) {
					$(this.el).remove();
				}
			}).bind(this));
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
