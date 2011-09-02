/*global $ _ Rib Backbone _t __ core Tag Payment Vault Filter*/

window.Router = (function(){
	"use strict";
	
	var Router = Backbone.Router.extend({
	
		routes: {
			"!":             "index",
			"!by/:what/:id": "by",
			"!new/:what":    "create",
			"!settings":     "settings"
		},
		
		backUrl: '!',
		
		by: function(what, id) {
			core._views.App.closeDialog();			
			this.backUrl = '!by/' + what + '/' + id;
		},
		
		create: function(what) {
			
			switch (what) {
				case 'filter':
					core._coll.Filters.newEntry();
					break;
				case 'vault':
					core._coll.Vaults.newEntry();
					break;
				case 'payment':
					core._coll.Payments.newEntry();
					break;
				default:
					this.back();
					break;
			}
		},
		
		settings: function() {
			// todo
		},
		
		index: function() {
			core._views.App.closeDialog();
			this.backUrl = '!';
		},
		
		back: function() {
			this.navigate(this.backUrl);
		}
	
	});
	
	return Router;
	
})();
