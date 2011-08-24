/*global window $ Backbone _ _t Tag Tags Payment Payments AppView T2p T2ps Vault Vaults Filter Filters*/

$(function(){
	"use strict";
	
	// shortcut for Backbone.Collection
	window.__ = function(models) { return new Backbone.Collection(models); };
	
	window.AppView = Backbone.View.extend({
	
		el: $('body'),
		
		events: {
			'click #add-payment': 'onClickAddPayment',
			'click #add-filter': 'onClickAddFilter',
			'click #add-vault': 'onClickAddVault'
		},
		
		initialize: function() {
			_.bindAll(this
				, 'addOnePayment'
				, 'addAllPayment'
				, 'editPayment'
				
				, 'addOneTag'
				, 'addAllTag'
				, 'editTag'
				
				, 'addOneVault'
				, 'addAllVault'
				, 'editVault'
				
				, 'addOneFilter'
				, 'addAllFilter'
				, 'editFilter'
				
				, 'hideDialog'
			);
			
			window.Vaults = new Vault.Collection();
			Vaults.bind('add',   this.addOneVault);
			Vaults.bind('reset', this.addAllVault);
			
			window.Filters = new Filter.Collection();
			Filters.bind('add',   this.addOneFilter);
			Filters.bind('reset', this.addAllFilter);
	
			window.Payments = new Payment.Collection();
			Payments.bind('add',   this.addOnePayment);
			Payments.bind('reset', this.addAllPayment);
			
			window.Tags = new Tag.Collection();
			Tags.bind('add',   this.addOneTag);
			Tags.bind('reset', this.addAllTag);
			
			window.T2ps = new T2p.Collection();			
			
			/**
			 * Fetch dependences:
			 * T2ps → Payments, Tags
			 * Payments → Vaults
			 * Filters → Payments, T2ps
			 */
			
			var payments_def, vaults_def, tags_def, when_all_data_loaded;
			
			vaults_def = Vaults.fetch();
			tags_def = Tags.fetch();
			
			vaults_def.done(function(){
				payments_def = Payments.fetch();
			});
			
			$.when(tags_def, vaults_def).done(function(){
				payments_def.done(function(){
					T2ps.fetch().done(function(){
						Filters.fetch().done(when_all_data_loaded);
					});
				});
			});
			
			when_all_data_loaded = function() {
				
				// set lazy removing not used tags
				/* causes memory leak 
				 * dangerous thing in any way */
				window.setInterval(function(){
					var not_used = Tags.filter(function(tag){
						return !tag.isNew() && T2ps.getByTag(tag).length === 0; 
					});
					if (not_used.length > 0) {
						not_used[0].destroy();
					}
				}, 5000);
				
			};
		},
		
		addOneTag: function(tag) {
			var view = new Tag.Views.InList({model: tag});
			this.$("#main-tags-list").prepend(view.render().el);
			view.bind('edit_clicked', this.editTag);
		},
		
		addAllTag: function() {
			Tags.each(this.addOneTag);
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
			Payments.each(this.addOnePayment);
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
			Vaults.each(this.addOneVault);
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
			Filters.each(this.addOneFilter);
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
		
		editTag: function(tag) {
			var view = new Tag.Views.Form({model: tag});
			view.bind('close', this.hideDialog);
			this.showDialog(view.render().el);
		},
		
		onClickAddPayment: function() {
			Payments.add({});
		},
		
		onClickAddFilter: function() {
			Filters.add({});
		},
		
		onClickAddVault: function() {
			Vaults.add({});
		},
		
		showDialog: function(content) {
			this.$("#modal-dialog")/*.empty()*/.append(content).show();
		},
		
		hideDialog: function() {
			this.$("#modal-dialog").hide();
		}
	});
	
	window.App = new AppView();
});
