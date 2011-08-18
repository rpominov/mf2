/*global window $ Backbone _ _t Tag Tags Payment Payments*/

$(function(){
	"use strict";
	
	window.AppView = Backbone.View.extend({
	
		el: $('body'),
		
		events: {
			'click #add-payment': 'onClickAdd'
		},
		
		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll', 'edit', 'hideDialog');
			
			window.Payments = new Payment.Collection();
			
			Payments.bind('add',   this.addOne);
			Payments.bind('reset', this.addAll);
			
			Payments.fetch();
			
			window.Tags = new Tag.Collection();
			
			Tags.fetch();
		},
		
		addOne: function(payment) {
			var view = new Payment.views.InList({model: payment});
			this.$("#payments-list").prepend(view.render().el);
			
			view.bind('edit_clicked', this.edit);
			
			if(payment.isNew()){
				this.edit(payment);
			}
		},
		
		addAll: function() {
			Payments.each(this.addOne);
		},
		
		edit: function(payment) {
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
