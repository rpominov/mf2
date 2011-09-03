/*global $ _ Rib Backbone _t __ core Tag Payment Vault Filter*/

window.Router = (function(){
	"use strict";
	
	var Router = Backbone.Router.extend({
	
		routes: {
			"!":                "index",
			"!by/:what/:id":    "by",
			"!new/:what":       "create",
			"!settings":        "settings",
			"!settings/:where": "settings_go"
		},
		
		backUrl: '!',
		
		by: function(what, id) {
			core._views.App.closeDialog();			
			this.backUrl = '!by/' + what + '/' + id;
		},
		
		create: function(what) {
			
			switch (what) {
				case 'filter':
					core._coll.Filters.newEntity();
					break;
				case 'vault':
					core._coll.Vaults.newEntity();
					break;
				case 'payment':
					core._coll.Payments.newEntity();
					break;
				default:
					this.back();
					break;
			}
		},
		
		settings: function() {},
		settings_go: function() {},
		
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
