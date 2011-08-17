/*global window Payment PaymentsCollection _t $ Backbone _*/

$(function(){
	"use strict";

	window.Payment = Backbone.Model.extend({
		
		defaults: {
           name: '',
           value: 0
		}
	});
	
	Payment.Collection = Backbone.Collection.extend({
	    model: Payment,
	    url: '/payment'
	});
	
	Payment.views = {};
	
	Payment.views.Form = Backbone.View.extend({
		
		tagName: "form",
		className: "payment",
		tmpl: _t('payment.form'),
		
		events: {
			'submit'       : 'onSubmit',
			'click .cancel': 'onClickCancel'
		},
		
		initialize: function (args) {
			this.model.bind('destroy', _.bind(function(){ $(this.el).remove(); }, this));
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
				this.model.destroy();
			}
			$(this.el).remove();
		},
		
		render: function() {
			var data = this.model.toJSON();
			data.cid = this.model.cid; // need cid for labels in form
			$(this.el).html(this.tmpl(data));
			return this;
		}
	});
	
	Payment.views.InList = Backbone.View.extend({
		
		tagName: "li",
		className: "payment",
		tmpl: _t('payment.in_list'),
		
		events: {
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete'
		},
		
		initialize: function (args) {
			_.bindAll(this, 'changeName', 'changeValue');
			this.model.bind('change:name', this.changeName);
			this.model.bind('change:value', this.changeValue);
			this.model.bind('destroy', _.bind(function(){ $(this.el).remove(); }, this));
		},
		
		onClickEdit: function() {
			this.trigger('edit_clicked', this.model);
		},
		
		onClickDelete: function() {
			this.model.destroy();
		},
		
		changeName: function() {
			this.$('.name').text(this.model.get('name'));
		},
		
		changeValue: function() {
			this.$('.value').text(this.model.get('value'));
		},
		
		render: function() {
			$(this.el).html(this.tmpl(this.model.toJSON()));
			return this;
		}
	});
});
