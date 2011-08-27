/**
 * Rib.js - Backbone.js extension 
 * Author: https://github.com/pozadi
 * License: MIT
 */

/*global window*/

window.Rib = (function(Backbone, $, _){
	"use strict";
	
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
	
	/**
	 * Utils
	 */
	Rib.U = {
		el2ModelProxy: function(callback){
			return function(event){
				var el = $(event.target);
			
				while(true){
					
					if (el.filter(document.body).length === 1) {
						return;
					}
					
					if (el.attr('id') && _(el.attr('id')).startsWith('cid_')) {
						var cid = el.attr('id').split('_')[1],
						    model = this.collection.getByCid(cid);
						    
						if (model) {
							callback.call(this, model, el);
						}
						return;
					}
					
					el = el.parent();
				}
			};
		},
		
		model2ElProxy: function(callback){
			return function(model){
				var el = this.$('#cid_' + model.cid); // will called in View context, so we can use this.$
				if(el.length > 0){
					var params = [el[0]].concat([].slice.call(arguments));
					callback.apply(this, params);
				}
			};
		}
	};
	
	return Rib;
	
})(window.Backbone, window.jQuery, window._);
