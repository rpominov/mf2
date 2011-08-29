/*global $ _ Backbone Rib _t __ core Tag Payment Vault Filter*/

window.AppView = (function(){
	"use strict";
	
	var AppView = Backbone.View.extend({
		
		events: {
		},
		
		initialize: function() {
			_.bindAll(this, 'hideDialog', 'openDialog');
			
			var appView = this;
			
			core.coll(function(cc){
				
				appView.childViews = {
					vaults: new Vault.Views.List({collection: cc.Vaults, el: appView.$('#vaults-block')}),
					filters: new Filter.Views.List({collection: cc.Filters, el: appView.$('#filters-block')}),
					payments: new Payment.Views.List({collection: cc.Payments, el: appView.$('#payments-list')}),
					tags: new Tag.Views.List({collection: cc.Tags, el: appView.$('#tags-block')})
				};
				
				_(appView.childViews).each(function(view){
					view.bind('need_dialog', appView.openDialog);
				});
				
				Rib.U.events.bind('need_dialog', appView.openDialog);
				
			});
		},
		
		showDialog: function(content) {
			this.$("#modal-dialog").empty().append(content).show();
		},
		
		hideDialog: function() {
			this.$("#modal-dialog").hide();
		},
		
		openDialog: function(view) {
			view.bind('close', this.hideDialog);
			this.showDialog(view.render().el);
		}
	});
	
	return AppView;
	
})();
