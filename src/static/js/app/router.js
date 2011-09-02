/*global $ _ Rib Backbone _t __ core Tag Payment Vault Filter*/

window.Router = (function(){
	"use strict";
	
	var Router = Backbone.Router.extend({
	
		routes: {
			"":              "correct",
			"!":             "index",
			"!by/:what/:id": "by",
			"!new/:what":    "create",
			"!settings":     "settings"
		},
		
		by: function(what, id) {
			/*var tag = core._coll.Tags.get(id) || core._coll.Tags.getByCid(id);
			
			if (tag) {
				alert(tag.get('name'));
			} else {
				Rib.U.alert(_t('messages.tag-not-found', null));
			}*/
			
			console.log('go to by/' + what + '/' + id);
			
			core._views.App.closeDialog();
		},
		
		create: function(what) {
			
			console.log((+new Date()) + ' go to new/' + what);
			
			switch (what) {
				case 'filter':
					core._coll.Filters.add({});
					break;
				case 'vault':
					core._coll.Vaults.add({});
					break;
				case 'payment':
					core._coll.Payments.create();
					break;
				default:
					this.clear('ggg');
			}
		},
		
		settings: function() {
			console.log((+new Date()) + ' go to settings');
		},
		
		index: function() {
			console.log((+new Date()) + ' go to index');
			
			core._views.App.closeDialog();
		},
		
		correct: function() {
			this.navigate('#!');
		},
		
		back: function() {
			window.history.back();
		}
	
	});
	
	return Router;
	
})();
