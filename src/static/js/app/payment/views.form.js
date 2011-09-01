/*global $ _ Rib _t __ core Tag Payment Vault Filter*/

(function(){
	"use strict";
	
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
		
		validate: function() {
			// todo
			
			// date format
			// no transfers between same vaults
			// value type: float
			
			return true;
		},
		
		save: function() {
			var type = this.$('.type:checked').val(),
				t = (type == 2); // type: transfer 
			
			this.model.set({
				'name':   this.$('.name').val(),
				'value':  this.$('.value').val(),
				'value1': t ? this.$('.value').val() : null, // todo calc!
				'type':   type,
				'time':   $.datepicker.parseDate('mm/dd/yy', this.$('.time').val())
			});
			
			this.model.set(Payment.prototype.parse({
				'vault':  this.$('.vault').val(),
				'vault1': t ? this.$('.vault1').val() : null
			}));
			
			var tags = this.$('.tags').val().split(',');
				tags = _(tags).chain()
					.map(function(tag) { return _(tag).trim(); })
					.compact().uniq().value();
			
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
			
			data.time = $.datepicker.formatDate('mm/dd/yy', this.model.get('time'));
			
			return data;
		},
		
		render: function(){
			Rib.Views.Form.prototype.render.call(this);
			
			this.$('.time').datepicker({ autoSize: true });
			
			this.$('.tags').tagit({
			    availableTags: core._coll.Tags.pluck('name')
			});
			
			//this.$('.tags-td').attr('valign', 'top');
			
			/*this.$('.tags').autocomplete({
			    source: core._coll.Tags.pluck('name')
			});*/
			
			/*var el = this.$('.tags').data('autocomplete').element,
				orig_val = _(el.val).bind(el);
				
			el.val = function(value) {
				if (typeof value === 'undefined') {
					value = orig_val();
					value = value.split(',');
					value = _(value).chain().last().trim().value();
					return value;
				} else {
					var _value = orig_val().split(',');
					_value = _(_value).first(_value.length - 1);
					_value.push(value);
					_value = _(_value).uniq().join(', ');
					return orig_val(_value);
				}
			};*/
			
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
	
})();
