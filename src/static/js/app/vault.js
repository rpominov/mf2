window.Vault = (function(_, Backbone, Rib, _t){
	"use strict";

	var Vault = Backbone.Model.extend({
		
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
	
	Vault.Collection = Backbone.Collection.extend({
		model: Vault,
		url: '/api/vault',
		
		initialize: function() {
		}
	});
	
	Vault.Views = {};
	
	Vault.Views.InList = Rib.Views.DefaultModel.extend({
		
		tagName: "li",
		className: "vault",
		tmpl: _t('vault.in-list'),
		
		events: {
			'click .text': 'onClickText',
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete'
		},
		
		initialize: function (args) {
			Rib.Views.DefaultModel.prototype.initialize.call(this);
			
			_.bindAll(this, 'changeName');
			this.model.bind('change:name', this.changeName);
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
		}
	});
	
	
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
	
	return Vault;
})(window._, window.Backbone, window.Rib, window._t);
