/*global window $ Backbone Rib _ __ _t Payment Payments Tags Tag T2ps*/

$(function(){
	"use strict";

	window.Payment = Backbone.Model.extend({
		
		defaults: {
           name: '',
           value: 0
		},
		
		validate: function(attrs) {
			// todo
		}
	});
	
	Payment.Collection = Backbone.Collection.extend({
		model: Payment,
		url: '/api/payment'
	});
	
	Payment.Views = {};
	
	Payment.Views.Form = Rib.Views.Form.extend({
		className: "payment",
		tmpl: _t('payment.form'),
		
		save: function() {
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
			
			this.model.save().done(_(function(){
				T2ps.setForPayment(this.model, tags);
			}).bind(this));
		},
		
		prepareDataForRender: function(data) {
			data = Rib.Views.Form.prototype.prepareDataForRender.call(this, data);
			data.tags = T2ps.getByPayment(this.model);
			data.tags = __(data.tags).pluck('name').join(', ');
			return data;
		}
	});
	
	Payment.Views.InList = Rib.Views.DefaultModel.extend({
		
		tagName: "li",
		className: "payment",
		tmpl: _t('payment.in_list'),
		
		events: {
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete'
		},
		
		initialize: function (args) {
			Rib.Views.DefaultModel.prototype.initialize.call(this);
			
			_.bindAll(this, 'changeName', 'changeValue', 'resetTags', 'addTag');
			this.model.bind('change:name', this.changeName);
			this.model.bind('change:value', this.changeValue);
			T2ps.bind('payment_' + this.model.cid + ':add', this.addTag);
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
			var view = new Tag.Views.InSmallList({model: tag, payment: this.model});
			this.$('.tag-list').append(view.render().el);
		},
		
		resetTags: function() {
			var tags = T2ps.getByPayment(this.model);
			_(tags).each(this.addTag);
		},
		
		render: function() {
			var result = Rib.Views.DefaultModel.prototype.render.call(this);
			this.resetTags();
			return result;
		}
	});
});
