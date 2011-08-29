/*global $ _ Rib _t __ core Tag Payment Vault Filter*/

window.Payment = (function(){
	"use strict";
	
	/*global Tag*/

	/**
	 * Model
	 */	
	var Payment = Rib.Model.extend({
		
		defaults: {
           name: '',
           value: 0,
           value1: 0,
           type: 0,
           time: new Date(),
           cr_time: new Date(),
           vault: null,
           vault1: 0
		},
		
		validate: function(attrs) {
			// todo
		},
		
		toJSON: function() {
			var result = Rib.Model.prototype.toJSON.call(this);
			
			result.vault = result.vault.get('id');
			
			result.time = result.time.getTime() / 1000;
			result.cr_time = result.cr_time.getTime() / 1000;
			
			return result;
		},
		
		parse: function (resp, xhr) {
			resp.vault = core._coll.Vaults.get(resp.vault);
			//resp.vault1 = core._coll.Vaults.get(resp.vault1);
			resp.time = new Date(resp.time * 1000);
			
			if (!_.isUndefined(resp.cr_time)) {
				resp.cr_time = new Date(resp.cr_time * 1000);
			}
			
			return resp;
		}
		
	});
	
	/**
	 * Collection
	 */
	Payment.Collection = Rib.Collection.extend({
		model: Payment,
		url: '/api/payment',
		
		parse: function (resp, xhr) {
			_(resp).map(this.model.prototype.parse);
			return resp;
		},
		
		getByVault: function(vault){
			return this.filter(function(payment){return payment.get('vault') === vault;});
		}
	});
	
	Payment.Views = {};
	
	/**
	 * Form view
	 */
	Payment.Views.Form = Rib.Views.Form.extend({
		className: "payment",
		tmpl: _t('payment.form'),
		
		save: function() {
			this.model.set(Payment.prototype.parse({
				'name': this.$('.name').val(),
				'value': this.$('.value').val(),
				'type': this.$('.type:checked').val(),
				'time': this.$('.time').val(),
				'vault': this.$('.vault').val()
			}));
			
			var tags = this.$('.tags').val().split(',');
				tags = _(tags)
					.chain()
					.map(function(tag) { return _(tag).trim(); })
					.filter(function(tag) { return tag.length > 0; })
					.uniq()
					.value();
			
			var set_tags = _(function(){
				core._coll.T2ps.setForPayment(this.model, tags);
			}).bind(this);
			
			if (this.model.isNew()) {
				this.model.save().done(set_tags);
			} else {
				this.model.save();
				set_tags();
			}
		},
		
		forTmpl: function(options) {
			var data = Rib.Views.Form.prototype.forTmpl.call(this);
			
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
			
			_.bindAll(this, 'changeName', 'changeValue', 'changeTags', 'changeTagName', 'create');
			
			$('#add-payment').click(this.create);
			
			this.collection.bind('change:name', this.changeName);
			this.collection.bind('change:value', this.changeValue);
			
			core._coll.T2ps.bind('payment', this.changeTags);
			core._coll.Tags.bind('change:name', this.changeTagName);
		},
		
		create: function() {
			if (core._coll.Vaults.length === 0) {
				Rib.U.alert(_t('messages.no-vaults', null));
				return;
			}
			
			this.collection.add({
				time: new Date(),
		        cr_time: new Date(),
		        vault: core._coll.Vaults.getDefault()
           });
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
})();
