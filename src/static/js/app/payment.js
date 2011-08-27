window.Payment = (function($, _, __, Backbone, Rib, _t, core){
	"use strict";
	
	/*global Tag*/

	/**
	 * Model
	 */
	var Payment = Backbone.Model.extend({
		
		defaults: {
           name: '',
           value: 0
		},
		
		validate: function(attrs) {
			// todo
		}
	});
	
	/**
	 * Collection
	 */
	Payment.Collection = Backbone.Collection.extend({
		model: Payment,
		url: '/api/payment'
	});
	
	Payment.Views = {};
	
	/**
	 * Form view
	 */
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
				core._coll.T2ps.setForPayment(this.model, tags);
			}).bind(this));
		},
		
		prepareDataForRender: function(data) {
			data = Rib.Views.Form.prototype.prepareDataForRender.call(this, data);
			data.tags = core._coll.T2ps.getByPayment(this.model);
			data.tags = __(data.tags).pluck('name').join(', ');
			return data;
		}
	});
	
	/**
	 * List view
	 */
	Payment.Views.List = Rib.Views.EditableCollection.extend({
		
		tmpl: _t('payment.in_list'),
		
		FormView: Payment.Views.Form,
		
		events: {
		},
		
		initialize: function (args) {
			Rib.Views.EditableCollection.prototype.initialize.call(this);
			
			$('#add-payment').click(_(function(){
				this.collection.add({});
			}).bind(this));
			
			_.bindAll(this, 'changeName', 'changeValue', 'changeTags', 'changeTagName');
			
			this.collection.bind('change:name', this.changeName);
			this.collection.bind('change:value', this.changeValue);
			
			core._coll.T2ps.bind('payment', this.changeTags);
			core._coll.Tags.bind('change:name', this.changeTagName);
		},
		
		addOne: function(model) {
			Rib.Views.EditableCollection.prototype.addOne.call(this, model);
			
			if(model.isNew()){
				this.edit(model);
			}
			
			this.changeTags(model);
		},
		
		changeName: Rib.U.model2ElProxy(function(el, model) {
			$('.name', el).text(model.get('name'));
		}),
		
		changeValue: Rib.U.model2ElProxy(function(el, model) {
			$('.value', el).text(model.get('value'));
		}),
		
		changeTags: Rib.U.model2ElProxy(function(el, model) {
			
			$('.tag-list .tag', el).remove();
			
			var tags = core._coll.T2ps.getByPayment(model),
				list = $('.tag-list', el);
			
			_(tags).each(function(tag){
				var data = tag.toJSON();
				data.cid = tag.cid;
				list.append(_t('tag.small-list', data));
			});
		}),
		
		changeTagName: function(tag) {
			this.$('.cid_' + tag.cid).text(tag.get('name'));
		}
	});
	
	return Payment;
})(window.jQuery, window._, window.__, window.Backbone, window.Rib, window._t, window.core);
