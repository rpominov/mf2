/*global $ _ Backbone Rib _t __ core Tag Payment Vault Filter*/

window.Filter = (function(){
	"use strict";

	/**
	 * Model
	 */
	var Filter = Backbone.Model.extend({
		
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
	Filter.Collection = Backbone.Collection.extend({
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
			'click .text': 'onClickText',
			'click .add': 'addClicked'
		},
		
		initialize: function (args) {
			Rib.Views.EditableCollection.prototype.initialize.call(this);
			
			_.bindAll(this, 'changeName');
			
			this.collection.bind('change:name', this.changeName);
		},
		
		addOne: function(model) {
			Rib.Views.EditableCollection.prototype.addOne.call(this, model);
			
			if(model.isNew()){
				this.edit(model);
			}
		},
		
		onClickText: Rib.U.el2ModelProxy(function(model){
			// todo
		}),
		
		changeName: Rib.U.model2ElProxy(function(el, model) {
			$('.name', el).text(model.get('name'));
		}),
		
		addClicked: function(){
			this.collection.add({});
		}
	});
	
	return Filter;
})();
