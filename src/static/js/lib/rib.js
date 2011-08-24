/**
 * Rib.js - Backbone.js extension 
 * Author: https://github.com/pozadi
 * License: MIT
 */

/*global window*/

(function(win, Backbone, $, _){
	"use strict";
	// ------------------------
	
	var 
	
	Rib = {
		Views: {}
	},
	
	empty_template = function(){return '';};
	
	
	
	/**
	 * Default view for model
	 */
	Rib.Views.DefaultModel = Backbone.View.extend({
		
		tagName: "div",
		tmpl: empty_template,
		
		initialize: function () {
			_.bindAll(this, 'remove');
			this.model.bind('destroy', this.remove);
		},
		
		prepareDataForRender: function(data) {
			return data;
		},
		
		render: function() {
			var data = this.model.toJSON();
			data = this.prepareDataForRender(data);
			$(this.el).html(this.tmpl(data));
			return this;
		},
		
		remove: function() {
			$(this.el).remove();
		}
	});
	
	
	/**
	 * Form view skeleton
	 *
	 * Usage example:
	 *
	 * Filter.Views.Form = Rib.Views.Form.extend({
	 *	 className: "filter",
	 *	 tmpl: _t('filter.form'),
	 *	
	 *	 save: function(){
	 *		this.model.set({
	 *			'name': this.$('.name').val()
	 *		});
	 *		
	 *		this.model.save();
	 *	 }
	 * });
	 */
	Rib.Views.Form = Rib.Views.DefaultModel.extend({
		
		tagName: "form",
		
		events: {
			'submit'       : 'onSubmit',
			'click .cancel': 'onClickCancel'
		},
		
		initialize: function () {
			Rib.Views.DefaultModel.prototype.initialize.call(this);
			this.bind('close', this.remove);
		},
		
		save: function() {
			// 'save' is empty by default
			
			/* Here should be something like this:
			 *
			 * this.model.set({
			 *    'name': this.$('.name').val()
			 * });
			 *
			 * this.model.save();
			 *
			 */ 
		},
		
		onSubmit: function() {
			this.save();
			this.trigger('close');
			return false; // prevent submit
		},
		
		onClickCancel: function() {
			if(this.model.isNew()) {
				this.model.destroy();
			}
			this.trigger('close');
		},
		
		prepareDataForRender: function(data) {
			data.cid = this.model.cid; // need cid for labels in form
			return data;
		}
	});	
	
	// ------------------------
	win.Rib = Rib;
})(window, window.Backbone, window.jQuery, window._);
