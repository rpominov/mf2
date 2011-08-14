$(function(){
	window.AppView = Backbone.View.extend({
	
		el: $('body'),
		
		events: {
			'click #add-payment': 'onClickAdd'
		},
		
		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll', 'edit');
			
			Payments.bind('add',   this.addOne);
			Payments.bind('reset', this.addAll);
			
			Payments.fetch();
		},
		
		addOne: function(payment) {
			var view = new PaymentInListView({model: payment});
			this.$("#payments-list").append(view.render().el);
			
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
				var view = new PaymentFormView({model: payment});
				this.$("#form-wrap").append(view.render().el);
			}
		},
		
		onClickAdd: function(e) {
			Payments.add({});
		}
	})
	
	window.App = new AppView;
})
