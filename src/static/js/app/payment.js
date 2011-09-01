/*global $ _ Rib _t __ core Tag Payment Vault Filter*/

window.Payment = (function(){
	"use strict";

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
			var undef; // undefined
			
			if (resp.vault !== undef) {
				resp.vault = core._coll.Vaults.get(resp.vault);
			}
			
			if (resp.vault1) { // undefined or null
				resp.vault1 = core._coll.Vaults.get(resp.vault1);
			}			
			
			if (resp.time !== undef) {
				resp.time = new Date(resp.time * 1000);
			}
			
			if (resp.cr_time !== undef) {
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
	
	return Payment;
	
})();
