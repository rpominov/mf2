window.AppView = (function(Backbone, $, _, core, Tag, Payment, Vault, Filter){
	"use strict";
	
	var AppView = Backbone.View.extend({
		
		events: {
			'click #add-filter': 'onClickAddFilter',
			'click #add-vault': 'onClickAddVault'
		},
		
		initialize: function() {
			_.bindAll(this,
				 'addOneVault', 'addAllVault', 'editVault',
				 'addOneFilter', 'addAllFilter', 'editFilter',
				 'hideDialog', 'openDialog'
			);
			
			core.coll(_(function(coll){
				coll.Vaults.bind('add',   this.addOneVault);
				coll.Vaults.bind('reset', this.addAllVault);
	
				coll.Filters.bind('add',   this.addOneFilter);
				coll.Filters.bind('reset', this.addAllFilter);
				
				var paymentsView = new Payment.Views.List({collection: coll.Payments, el: this.$('#payments-list')});
				paymentsView.bind('need_dialog', this.openDialog);
				
				var tagsView = new Tag.Views.List({collection: coll.Tags, el: this.$('#tags-block')});
				tagsView.bind('need_dialog', this.openDialog);
			}).bind(this));
		},
		
		
		//--------------------------
		addOneVault: function(vault) {
			var view = new Vault.Views.InList({model: vault});
			this.$("#main-vaults-list").prepend(view.render().el);
			
			view.bind('edit_clicked', this.editVault);
			
			if(vault.isNew()){
				this.editVault(vault);
			}
		},
		
		addAllVault: function() {
			core._coll.Vaults.each(this.addOneVault);
		},
		
		addOneFilter: function(filter) {
			var view = new Filter.Views.InList({model: filter});
			this.$("#main-filters-list").prepend(view.render().el);
			
			view.bind('edit_clicked', this.editFilter);
			
			if(filter.isNew()){
				this.editFilter(filter);
			}
		},
		
		addAllFilter: function() {
			core._coll.Filters.each(this.addOneFilter);
		},
		
		editVault: function(vault) {
			var view = new Vault.Views.Form({model: vault});
			view.bind('close', this.hideDialog);
			this.showDialog(view.render().el);
		},
		
		editFilter: function(filter) {
			var view = new Filter.Views.Form({model: filter});
			view.bind('close', this.hideDialog);
			this.showDialog(view.render().el);
		},
		
		onClickAddFilter: function() {
			core._coll.Filters.add({});
		},
		
		onClickAddVault: function() {
			core._coll.Vaults.add({});
		},
		//--------------------------
		
		showDialog: function(content) {
			this.$("#modal-dialog").empty().append(content).show();
		},
		
		hideDialog: function() {
			this.$("#modal-dialog").hide();
		},
		
		openDialog: function(view) {
			view.bind('close', this.hideDialog);
			this.showDialog(view.render().el);
		}
	});
	
	return AppView;
	
})(window.Backbone, window.jQuery, window._, 
   window.core,
   window.Tag, window.Payment, window.Vault, window.Filter);
