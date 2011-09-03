/*global $ _ Rib _t __ core Tag Payment Vault Filter*/

window.Settings = (function(){
	"use strict";
	
	/**
	 * Model
	 */
	var Settings = Rib.Model.extend({
		
	});
	
	/**
	 * View
	 */
	
	Settings.View = Rib.View.extend({
		
		visible: false,
		
		events: {
			'click .menu li': 'clickOnMenu',
			'click .cancel': 'hide',
			'submit .settings-form': 'saveSettings'
		},
		
		initialize: function (args) {
			
			_.bindAll(this, 'toggle', 'show', 'go');
			
			$('#sys-settings').click(this.toggle);
			
			core.router(_(function(router){
				router.bind('route:settings', this.show);
				router.bind('route:settings_go', this.go);
			}).bind(this));
		},
		
		toggle: function() {
			this[ this.visible ? 'hide' : 'show' ]();
		},
		
		show: function() {
			
			$('.top').addClass('settings-mode');
			
			$(this.el).show();
			this.$('.panel').show('blind', {}, 200);
			
			core._router.navigate('#!settings');
			
			this.visible = true;
		},
		
		hide: function() {
			
			$('.top').removeClass('settings-mode');
			
			this.$('.panel').hide('blind', {}, 200, _(function(){
				$(this.el).hide();
			}).bind(this));
			
			core._router.back();
			
			this.visible = false;
		},
		
		clickOnMenu: function(event) {
			var el = event.target,
				where = null;
				
			_('view currencies import'.split(' ')).each(function(option){
				if ($(el).hasClass(option)) {
					where = option;
				}
			});
			
			if (where !== null) {
				this.go(where);
			}
		},
		
		go: function(where) {
			
			if(!this.visible) {
				this.show();
			}
			
			this.$('.current').removeClass('current');
			this.$('.' + where).addClass('current');
			
			core._router.navigate('#!settings/' + where);
		},
		
		saveSettings: function() {
			// todo
			
			this.hide();
			
			return false; // prevent submit
		}
	});
	
	return Settings;
	
})();
