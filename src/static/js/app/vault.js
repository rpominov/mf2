/*global $ _ Rib _t __ core Tag Payment Vault Filter*/

window.Vault = (function(){
	"use strict";

	/**
	 * Model
	 */
	var Vault = Rib.Model.extend({
		
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
	Vault.Collection = Rib.Collection.extend({
		model: Vault,
		url: '/api/vault',
		
		initialize: function() {
		},
		
		getDefault: function() {
			// todo
			return this.at(0);
		}
	});
	
	Vault.Views = {};
	
	/**
	 * Form view
	 */
	Vault.Views.Form = Rib.Views.Form.extend({
		
		className: "vault",
		tmpl: _t('vault.form'),
		
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
	Vault.Views.List = Rib.Views.EditableCollection.extend({
		
		tmpl: _t('vault.in-list'),
		
		list_selector: '.list',
		FormView: Vault.Views.Form,
		
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
			$('.text', el).attr('href', '#!by/vault/' + model.get('id'));
		}),
		
		beforeDelete: function(model){
			if (core._coll.Payments.getByVault(model).length > 0) {
				Rib.U.alert(_t('messages.cant-remove-using-vault', null));
				return false;
			}
			return true;
		},
		
		changeCurrent: function(what, id) {
			
			this.$('.current').removeClass('current');
			
			if (what === 'vault') {
				var model = this.collection.get(id) || this.collection.getByCid(id);
				if (model) {
					this.$('#cid_' + model.cid).addClass('current');
				}
			}
		}
	});
	
	return Vault;
})();
