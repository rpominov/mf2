/*global window $ Backbone _ _t Tag Tags Payment Payments AppView T2p T2ps Vault Vaults*/

$(function(){
	"use strict";
	
	window.AppView = Backbone.View.extend({
	
		el: $('body'),
		
		events: {
			'click #add-payment': 'onClickAdd'
		},
		
		initialize: function() {
			_.bindAll(this
				, 'addOnePayment'
				, 'addAllPayment'
				, 'editPayment'
				, 'hideDialog'
				, 'addOneTag'
				, 'addAllTag'
			);
			
			// shortcut for Backbone.Collection
			window.__ = function(models) { return new Backbone.Collection(models); };
	
			window.Vaults = new Vault.Collection();
	
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
			 */
			
			var payments_def, vaults_def, tags_def, when_all_data_loaded;
			
			vaults_def = Vaults.fetch();
			tags_def = Tags.fetch();
			
			vaults_def.done(function(){
				payments_def = Payments.fetch();
			});
			
			$.when(tags_def, vaults_def).done(function(){
				payments_def.done(function(){
					T2ps.fetch().done(when_all_data_loaded);
				});
			});
			
			when_all_data_loaded = function() {
				// set lazy removing not used tags
				window.setInterval(function(){
					var not_used = Tags.filter(function(tag){
						return T2ps.getByTag(tag).length === 0; 
					});
					if (not_used.length > 0) {
						not_used[0].destroy();
					}
				}, 5000);
			};
		},
		
		addOneTag: function(tag) {
			var view = new Tag.views.InList({model: tag});
			this.$("#main-tags-list").prepend(view.render().el);
		},
		
		addAllTag: function() {
			Tags.each(this.addOneTag);
		},
		
		addOnePayment: function(payment) {
			var view = new Payment.views.InList({model: payment});
			this.$("#payments-list").prepend(view.render().el);
			
			view.bind('edit_clicked', this.editPayment);
			
			if(payment.isNew()){
				this.editPayment(payment);
			}
		},
		
		addAllPayment: function() {
			Payments.each(this.addOnePayment);
		},
		
		editPayment: function(payment) {
			if(!payment.view_form) {
				var view = new Payment.views.Form({model: payment});
				view.render();
				
				view.bind('close', this.hideDialog);
				
				this.showDialog(view.el);
			}
		},
		
		onClickAdd: function() {
			Payments.add({});
		},
		
		showDialog: function(content) {
			this.$("#modal-dialog").empty().append(content).show();
		},
		
		hideDialog: function() {
			this.$("#modal-dialog").hide();
		}
	});
	
	window.App = new AppView();
});
