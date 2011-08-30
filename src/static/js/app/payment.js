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
           vault1: null
		},
		
		validate: function(attrs) {
			// todo
		},
		
		toJSON: function() {
			var result = Rib.Model.prototype.toJSON.call(this);
			
			result.vault = result.vault.get('id');
			
			if (result.vault1) {
				result.vault1 = result.vault1.get('id');
			}
			
			result.time = result.time.getTime() / 1000;
			result.cr_time = result.cr_time.getTime() / 1000;
			
			return result;
		},
		
		parse: function (resp, xhr) {
			resp.vault = core._coll.Vaults.get(resp.vault);
			
			if (resp.vault1) {
				resp.vault1 = core._coll.Vaults.get(resp.vault1);
			}			
			
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
		
		events: {
			'change .type': 'toggleTransferControl',
			'change .value': 'recalcValue1',
			'change .vault': 'onVaultChange',
			'change .vault1': 'onVault1Change'
		},
		
		save: function() {
			var type = this.$('.type:checked').val(),
				t = (type === 2); // type: transfer 
			
			this.model.set(Payment.prototype.parse({
				'name':   this.$('.name').val(),
				'value':  this.$('.value').val(),
				'value1': t ? this.$('.value').val() : null, // todo calc!
				'type':   type,
				'time':   this.$('.time').val(),
				'vault':  this.$('.vault').val(),
				'vault1': t ? this.$('.vault1').val() : null
			}));
			
			var tags = this.$('.tags').val().split(',');
				tags = _(tags).chain()
					.map(function(tag) { return _(tag).trim(); })
					.filter(function(tag) { return tag.length > 0; })
					.uniq().value();
			
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
			
			data.vaults = core._coll.Vaults.map(function(vault){
				return {
					id: vault.get('id'),
					name: vault.get('name')
				};
			});
			
			return data;
		},
		
		render: function(){
			Rib.Views.Form.prototype.render.call(this);
			
			this.toggleTransferControl({init: true});
			this.recalcValue1();
			this.onVaultChange();
			this.onVault1Change();
			
			return this;
		},
		
		toggleTransferControl: function(opt) {
			if (this.$('.transfer-radio:checked').length) {
				this.$('.on-transfer').fadeIn();
			} else {
				this.$('.on-transfer')[opt.init ? 'hide' : 'fadeOut']();
			}
		},
		
		recalcValue1: function() {
			var value1 = this.$('.value').val();
			this.$('.value1').text(value1);
		},
		
		vaultId2Currency: function(id) {
			// var vault = core._coll.Vaults.get(id);
			return '$'+id; // vault.get('currency').get('short_name')
		},
		
		onVaultChange: function() {
			var id = this.$('.vault').val();
			this.$('.currency').text(this.vaultId2Currency(id));
		},
		
		onVault1Change: function() {
			var id = this.$('.vault1').val();
			this.$('.currency1').text(this.vaultId2Currency(id));
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
			
			_.bindAll(this, 'changeName', 'changeValue', 'changeTags', 'changeTagName', 'create', 'changeType');
			
			$('#add-payment').click(this.create);
			
			this.collection.bind('change:name', this.changeName);
			this.collection.bind('change:value', this.changeValue);
			this.collection.bind('change:type', this.changeType);
			
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
			this.changeType(model);
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
		},
		
		changeType: Rib.U.model2ElProxy(function(el, model) {
			var classes = 'minus plus transfer',
				type = model.get('type');
			$(el).removeClass(classes).addClass(classes.split(' ')[type]);
			$('.minus-sign', el).text( type === 0 ? '-' : '' );
		})
	});
	
	return Payment;
})();
