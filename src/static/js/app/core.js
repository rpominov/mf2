/*global $ _ Backbone Rib _t __ core Tag Payment Vault Filter Router*/

// shortcut for Backbone.Collection
window.__ = function(models) { return new Backbone.Collection(models); };

window.core = (function(){
	"use strict";
	
	function process_initial(data){
		/**
		 * Dependences:
		 * T2ps → Payments, Tags
		 * Payments → Vaults
		 * Filters → Payments, T2ps ?
		 */
		
		_("Vaults Payments Tags T2ps Filters".split(" ")).each(function(type){
			core._coll[type].reset(core._coll[type].parse(data[type]));
		});
		
		core.def.data_loading.resolve();
	}
	
	var core = {
		
		// Deferred Objects
		def: {
			colletions_creating: $.Deferred(),
			data_loading: $.Deferred()
		},
		
		// Deferred helpers
		coll: function(c){ this.def.colletions_creating.done(c); },
		data: function(c){ this.def.data_loading.done(c); },
		
		// Collections
		_coll: {},
		
		// Views
		_views: {},
		
		// Router
		_router: null,
		
		init: function(initial_data){
			
			var cc = this._coll = {
				Vaults   : new Vault.Collection(),
				Payments : new Payment.Collection(),
				Tags     : new Tag.Collection(),
				T2ps     : new T2p.Collection(),
				Filters  : new Filter.Collection()
			};
			
			this.def.colletions_creating.resolve(this._coll);
			
			if (initial_data) {
				process_initial(initial_data);
			} else {
				$.ajax({
					url: '/api/all',
					success: process_initial,
					error: function(){
						throw "initial data loading failed";
					},
					contentType: 'application/json',
					dataType: 'json'
				});
			}			
		}
	};
	
	core.data(function() {
		
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
		
		core._views.App = new AppView({el: $('body')[0]});
				
		core._router = new Router();
		Backbone.history.start();
	});
	
	return core;
	
})();
