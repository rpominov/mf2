$(function(){

	window.Payment = Backbone.Model.extend({
		
		defaults: {
           name: '',
           value: 0,
		},
		
		clear: function() {
			this.destroy();
			this.view_in_list.remove();
			this.view_form && this.view_form.remove();
		}
	});
	
	window.PaymentsCollection = Backbone.Collection.extend({
	    model : Payment,
	    url: '/payment'
	});
	
	window.Payments = new PaymentsCollection;
	
	window.PaymentFormView = Backbone.View.extend({
		
		tagName: "form",
		className: "payment",
		tmpl: _.template($('#payment-form-tmpl').html()),
		
		initialize: function (args) {
			_.bindAll(this, 'changeName', 'changeValue');
			this.model.bind('change:name', this.changeName);
			this.model.bind('change:value', this.changeValue);
			this.model.view_form = this; // todo убрать связность, события
		},
		
		events: {
			'submit'       : 'onSubmit',
			'click .cancel': 'onClickCancel'
		},
		
		onSubmit: function() {
			
			this.model.set({
				'name': this.$('.name').val(),
				'value': this.$('.value').val()
			});
			
			this.model.save();
			
			this.remove();
			
			return false; // prevent submit
		},
		
		onClickCancel: function() {
			if(this.model.isNew()) {
				this.model.clear();
			}
			this.remove();
		},
		
		changeName: function() {
			$('.name', this.el).val(this.model.get('name'));
		},
		
		changeValue: function() {
			$('.value', this.el).val(this.model.get('value'));
		},
		
		render: function() {
			$(this.el).html(this.tmpl(this.model.toJSON()));
			return this;
		},
		
		remove: function() {
			$(this.el).remove();
			this.model.view_form = null;
		}
	});
	
	window.PaymentInListView = Backbone.View.extend({
		
		tagName: "li",
		className: "payment",
		tmpl: _.template($('#payment-in-list-tmpl').html()),
		
		initialize: function (args) {
			_.bindAll(this, 'changeName', 'changeValue');
			this.model.bind('change:name', this.changeName);
			this.model.bind('change:value', this.changeValue);
			this.model.view_in_list = this; // todo убрать связность, события
		},
		
		events: {
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete',
		},
		
		onClickEdit: function() {
			this.trigger('edit_clicked', this.model)
		},
		
		onClickDelete: function() {
			this.model.clear();
		},
		
		changeName: function() {
			$('.name', this.el).text(this.model.get('name'));
		},
		
		changeValue: function() {
			$('.value', this.el).text(this.model.get('value'));
		},
		
		render: function() {
			$(this.el).html(this.tmpl(this.model.toJSON()));
			return this;
		},
		
		remove: function() {
			$(this.el).remove();
			this.model.view_in_list = null;
		}
	});
})