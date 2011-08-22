/*global window $ Backbone _ _t Payment Payments Tags Tag T2ps*/

$(function(){
	"use strict";

	window.Payment = Backbone.Model.extend({
		
		defaults: {
           name: '',
           value: 0
		},
		
		initialize: function() {
		},
		
		validate: function(attrs) {
			// todo
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
		
		initialize: function () {
			var remove = _.bind(function(){ $(this.el).remove(); }, this);
			this.model.bind('destroy', remove);
			this.bind('close', remove);
		},
		
		onSubmit: function() {
			
			this.model.set({
				'name': this.$('.name').val(),
				'value': this.$('.value').val()
			});
			
			var tags = this.$('.tags').val().split(',');
				tags = _(tags)
					.chain()
					.map(function(tag) { return _(tag).trim(); })
					.filter(function(tag) { return tag.length > 0; })
					.uniq()
					.value();
			
			$.when(this.model.save()).done(_(function(){
				T2ps.setForPayment(this.model, tags);
			}).bind(this));
			
			this.trigger('close');
			
			return false; // prevent submit
		},
		
		onClickCancel: function() {
			if(this.model.isNew()) {
				this.model.destroy();
			}
			this.trigger('close');
		},
		
		render: function() {
			var data = this.model.toJSON();
			data.cid = this.model.cid; // need cid for labels in form
			data.tags = T2ps.getByPayment(this.model).pluck('name').join(', ');
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
			_.bindAll(this, 'changeName', 'changeValue', 'resetTags', 'addTag');
			this.model.bind('change:name', this.changeName);
			this.model.bind('change:value', this.changeValue);
			T2ps.bind('payment_' + this.model.cid + ':add', this.addTag);
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
		
		addTag: function(tag) {
			var view = new Tag.views.InSmallList({model: tag, payment: this.model});
			this.$('.tag-list').append(view.render().el);
		},
		
		resetTags: function() {
			var tags = T2ps.getByPayment(this.model);
			tags.each(this.addTag);
		},
		
		render: function() {
			var data = this.model.toJSON();
			$(this.el).html(this.tmpl(data));
			this.resetTags();
			return this;
		}
	});
});
