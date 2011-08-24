/*global window $ Backbone Rib _ _t Tag Tags Payment Payments T2ps*/

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
		url: '/api/tag',
		
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
	
	Tag.Views = {};
	
	Tag.Views.List = Backbone.View.extend({
		tmpl: _t('tag.big-list'),
		
		events: {
			'click .text': 'onClickText',
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete'
		},
		
		initialize: function (args) {
			_.bindAll(this, 'addOne', 'addAll', 'removeOne', 'changeName', 'changePayments');
			
			this.collection.bind('add', this.addOne);
			this.collection.bind('remove', this.removeOne);
			this.collection.bind('reset', this.addAll);
			
			this.collection.bind('change:name', this.changeName);
			T2ps.bind('tag', this.changePayments);
		},
		
		removeOne: Rib.U.model2ElProxy(function(el, model) {
			$(el).remove();
		}),
		
		addOne: function(tag) {
			var data = tag.toJSON();
			data.cid = tag.cid;
			this.$('.list').append(this.tmpl(data));
			
			this.changePayments(tag);
		},
		
		addAll: function() {
			this.collection.each(this.addOne);
		},
		
		onClickEdit: Rib.U.el2ModelProxy(function(tag){
			var view = new Tag.Views.Form({model: tag});
			this.trigger('need_dialog', view);
		}),
		
		onClickDelete: Rib.U.el2ModelProxy(function(model){
			model.destroy();
		}),
		
		onClickText: Rib.U.el2ModelProxy(function(model){
			// todo
		}),
		
		changeName: Rib.U.model2ElProxy(function(el, model) {
			$('.name', el).text(model.get('name'));
		}),
		
		changePayments: Rib.U.model2ElProxy(function(el, model) {
			var payments = T2ps.getByTag(model);
			
			payments = payments.length;
			
			$(el)[ payments === 0 ? 'hide' : 'show' ]();
			$('.payments', el).text(payments);
		})
	});
	
	
	Tag.Views.InSmallList = Backbone.View.extend({
		
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
	
	Tag.Views.Form = Rib.Views.Form.extend({
		className: "tag",
		tmpl: _t('tag.form'),
		
		save: function(){
			this.model.set({
				'name': this.$('.name').val()
			});
			
			this.model.save();
		}
	});
});
