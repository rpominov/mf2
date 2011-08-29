/*global $ _ Backbone Rib _t __ core Tag Payment Vault Filter*/

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
		
		init: function(initial_data, Vault, Filter, Payment, Tag, T2p, AppView){
			
			var cc = this._coll = {
				Vaults   : new Vault.Collection(),
				Payments : new Payment.Collection(),
				Tags     : new Tag.Collection(),
				T2ps     : new T2p.Collection(),
				Filters  : new Filter.Collection()
			};
			
			this.def.colletions_creating.resolve(this._coll);
			
			process_initial(initial_data);
			
			this._views.App = new AppView({el: $('body')[0]});
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
		
	});
	
	return core;
	
})();
