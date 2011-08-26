(function(win, $, Backbone, _){
	"use strict";
	
	// shortcut for Backbone.Collection
	win.__ = function(models) { return new Backbone.Collection(models); };
	
	win.core = {
		
		// Deferred Objects
		colletions_creating: $.Deferred(),
		data_loading: $.Deferred(),
		
		// Collections
		_coll: {},
		coll: function(callback){
			this.colletions_creating.done(callback);
		},
		
		// Views
		_views: {},
		
		init: function(Vault, Filter, Payment, Tag, T2p, AppView){
			
			var cc = this._coll = {
				Vaults   : new Vault.Collection(),
				Payments : new Payment.Collection(),
				Tags     : new Tag.Collection(),
				T2ps     : new T2p.Collection(),
				Filters  : new Filter.Collection()
			};
			
			this.colletions_creating.resolve(this._coll);
			
			/**
			 * Fetch dependences:
			 * T2ps → Payments, Tags
			 * Payments → Vaults
			 * Filters → Payments, T2ps
			 */
			
			$.ajax({
				url: '/api/all',
				success: function(data){
					
					_("Vaults Payments Tags T2ps Filters".split(" ")).each(function(type){
						cc[type].reset(cc[type].parse(data[type]));
					});
					
					/*global core */
					core.data_loading.resolve();
				},
				error: function(){
					throw "initial data loading failed";
				},
				contentType: 'application/json',
				dataType: 'json'
			});
			
			this.data_loading.done(function() {
				
				// set lazy removing not used tags
				/* causes memory leak 
				 * dangerous thing in any way 
				window.setInterval(function(){
					var not_used = Tags.filter(function(tag){
						return !tag.isNew() && T2ps.getByTag(tag).length === 0; 
					});
					if (not_used.length > 0) {
						not_used[0].destroy();
					}
				}, 5000);*/
				
			});
			
			this._views.App = new AppView({el: $('body')[0]});
		}
	};
	
})(window, window.jQuery, window.Backbone, window._);
