/*global window $ Backbone _ _t Tag Tags Payment Payments AppView*/

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
			
			window.Payments = new Payment.Collection();
			Payments.bind('add',   this.addOnePayment);
			Payments.bind('reset', this.addAllPayment);
			
			window.Tags = new Tag.Collection();
			Tags.bind('add',   this.addOneTag);
			Tags.bind('reset', this.addAllTag);
			
			Tags.fetch({success: function() {
				Payments.fetch();
			}});
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
