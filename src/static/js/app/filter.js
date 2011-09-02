/*global $ _ Rib _t __ core Tag Payment Vault Filter*/

window.Filter = (function(){
	"use strict";

	/**
	 * Model
	 */
	var Filter = Rib.Model.extend({
		
		defaults: {
			name: ''
		},
		
		initialize: function() {
		},
		
		validate: function(attrs) {
		    if (typeof attrs.name !== 'undefined' && !_.isString(attrs.name)) {
				return "'name' must be an String";
			}
			// todo
		}
	});
	
	/**
	 * Collection
	 */
	Filter.Collection = Rib.Collection.extend({
		model: Filter,
		url: '/api/filter',
		
		initialize: function() {
		}
	});
	
	Filter.Views = {};
	
	/**
	 * Form view
	 */
	Filter.Views.Form = Rib.Views.Form.extend({
		className: "filter",
		tmpl: _t('filter.form'),
		
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
	Filter.Views.List = Rib.Views.EditableCollection.extend({
		
		tmpl: _t('filter.in-list'),
		
		list_selector: '.list',
		FormView: Filter.Views.Form,
		
		events: {
		},
		
		initialize: function (args) {
			Rib.Views.EditableCollection.prototype.initialize.call(this);
			
			_.bindAll(this, 'changeName', 'chageId', 'changeCurrent');
			
			this.collection.bind('change:name', this.changeName);
			this.collection.bind('change:id', this.chageId);
			
			core.router(_(function(router){
				router.bind('route:by', this.changeCurrent);
				router.bind('route:index', this.changeCurrent);
			}).bind(this));
		},
		
		changeName: Rib.U.model2ElProxy(function(el, model) {
			$('.name', el).text(model.get('name'));
		}),
		
		chageId: Rib.U.model2ElProxy(function(el, model) {
			$('.text', el).attr('href', '#!by/filter/' + model.get('id'));
		}),
		
		changeCurrent: function(what, id) {
			
			this.$('.current').removeClass('current');
			
			if (what === 'filter') {
				var model = this.collection.get(id) || this.collection.getByCid(id);
				if (model) {
					this.$('#cid_' + model.cid).addClass('current');
				}
			}
		}
	});
	
	return Filter;
})();
