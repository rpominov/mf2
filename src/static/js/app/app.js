window.AppView = (function(Backbone, $, _, core, Tag, Payment, Vault, Filter){
	"use strict";
	
	var AppView = Backbone.View.extend({
		
		events: {
			'click #add-payment': 'onClickAddPayment',
			'click #add-filter': 'onClickAddFilter',
			'click #add-vault': 'onClickAddVault'
		},
		
		initialize: function() {
			_.bindAll(this, 'addOnePayment', 'addAllPayment', 'editPayment', 
				 'addOneVault', 'addAllVault', 'editVault',
				 'addOneFilter', 'addAllFilter', 'editFilter',
				 'hideDialog', 'openDialog'
			);
			
			core.coll(_(function(coll){
				coll.Vaults.bind('add',   this.addOneVault);
				coll.Vaults.bind('reset', this.addAllVault);
	
				coll.Filters.bind('add',   this.addOneFilter);
				coll.Filters.bind('reset', this.addAllFilter);
	
				coll.Payments.bind('add',   this.addOnePayment);
				coll.Payments.bind('reset', this.addAllPayment);
				
				var tagsView = new Tag.Views.List({collection: coll.Tags, el: this.$('#tags-block')});
				tagsView.bind('need_dialog', this.openDialog);
			}).bind(this));
		},
		
		addOnePayment: function(payment) {
			var view = new Payment.Views.InList({model: payment});
			this.$("#payments-list").prepend(view.render().el);
			
			view.bind('edit_clicked', this.editPayment);
			
			if(payment.isNew()){
				this.editPayment(payment);
			}
		},
		
		addAllPayment: function() {
			core._coll.Payments.each(this.addOnePayment);
		},
		
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
		
		editPayment: function(payment) {
			var view = new Payment.Views.Form({model: payment});
			view.bind('close', this.hideDialog);
			this.showDialog(view.render().el);
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
		
		onClickAddPayment: function() {
			core._coll.Payments.add({});
		},
		
		onClickAddFilter: function() {
			core._coll.Filters.add({});
		},
		
		onClickAddVault: function() {
			core._coll.Vaults.add({});
		},
		
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
