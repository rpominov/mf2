/*global $ _ Rib _t __ core Tag Payment Vault Filter*/

window.Tag = (function(){
	"use strict";

	/**
	 * Model
	 */
	var Tag = Rib.Model.extend({
		
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
	
	
	/**
	 * Collection
	 */
	Tag.Collection = Rib.Collection.extend({
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
	
	
	/**
	 * Form view
	 */
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
	
	
	/**
	 * List view
	 */
	Tag.Views.List = Rib.Views.EditableCollection.extend({
		
		tmpl: _t('tag.big-list'),
		
		list_selector: '.list',
		FormView: Tag.Views.Form,
		
		editOnNew: false,
		
		events: {
		},
		
		initialize: function (args) {
			Rib.Views.EditableCollection.prototype.initialize.call(this);
			
			_.bindAll(this, 'changeName', 'changePayments', 'chageId', 'changeCurrent');
			
			this.collection.bind('change:name', this.changeName);
			this.collection.bind('change:id', this.chageId);
			core._coll.T2ps.bind('tag', this.changePayments);
			
			core.router(_(function(router){
				router.bind('route:by', this.changeCurrent);
				router.bind('route:index', this.changeCurrent);
			}).bind(this));
		},
		
		addOne: function(model) {
			Rib.Views.EditableCollection.prototype.addOne.call(this, model);
			this.changePayments(model);
		},
		
		changeName: Rib.U.model2ElProxy(function(el, model) {
			$('.name', el).text(model.get('name'));
		}),
		
		chageId: Rib.U.model2ElProxy(function(el, model) {
			$('.text', el).attr('href', '#!by/tag/' + model.get('id'));
		}),
		
		changePayments: Rib.U.model2ElProxy(function(el, model) {
			var payments = core._coll.T2ps.getByTag(model);
			
			payments = payments.length;
			
			//$(el)[ payments === 0 ? 'hide' : 'show' ]();
			
			$('.payments', el).text(payments);
		}),
		
		changeCurrent: function(what, id) {
			
			this.$('.current').removeClass('current');
			
			if (what === 'tag') {
				var model = this.collection.get(id) || this.collection.getByCid(id);
				if (model) {
					this.$('#cid_' + model.cid).addClass('current');
				}
			}
		}
	});

	return Tag;
})();
