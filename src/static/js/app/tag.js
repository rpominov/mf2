window.Tag = (function($, _, Backbone, Rib, _t, core){
	"use strict";

	var Tag = Backbone.Model.extend({
		
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
	
	Tag.Views.List = Rib.Views.EditableCollection.extend({
		
		tmpl: _t('tag.big-list'),
		
		list_selector: '.list',
		FormView: Tag.Views.Form,
		
		events: {
			'click .text': 'onClickText'
		},
		
		initialize: function (args) {
			Rib.Views.EditableCollection.prototype.initialize.call(this);
			
			_.bindAll(this, 'changeName', 'changePayments');
			
			this.collection.bind('change:name', this.changeName);
			core._coll.T2ps.bind('tag', this.changePayments);
		},
		
		addOne: function(model) {
			Rib.Views.EditableCollection.prototype.addOne.call(this, model);
			this.changePayments(model);
		},
		
		onClickText: Rib.U.el2ModelProxy(function(model){
			// todo
			alert(1);
		}),
		
		changeName: Rib.U.model2ElProxy(function(el, model) {
			$('.name', el).text(model.get('name'));
		}),
		
		changePayments: Rib.U.model2ElProxy(function(el, model) {
			var payments = core._coll.T2ps.getByTag(model);
			
			payments = payments.length;
			
			$(el)[ payments === 0 ? 'hide' : 'show' ]();
			$('.payments', el).text(payments);
		})
	});

	return Tag;
})(window.$, window._, window.Backbone, window.Rib, window._t, window.core);
