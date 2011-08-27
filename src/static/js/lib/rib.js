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
		}
	});
	
	/**
	 * Default view for collection
	 */
	Rib.Views.DefaultCollection = Backbone.View.extend({
		
		tmpl: empty_template,
		list_selector: null,
		
		initialize: function () {
			_.bindAll(this, 'addOne', 'addAll', 'removeOne');
			
			this.collection.bind('add', this.addOne);
			this.collection.bind('remove', this.removeOne);
			this.collection.bind('reset', this.addAll);
		},
		
		removeOne: Rib.U.model2ElProxy(function(el, model) {
			$(el).remove();
		}),
		
		addOne: function(model) {
			var data = model.toJSON();
			data.cid = model.cid;
			(this.list_selector ? this.$(this.list_selector) : $(this.el)).append(this.tmpl(data));
		},
		
		addAll: function() {
			this.collection.each(this.addOne);
		}
	});
	
	
	/**
	 * View for editable collection
	 */
	var edit = function(model){
		var view = new this.FormView({model: model});
		this.trigger('need_dialog', view);
	};
	
	Rib.Views.EditableCollection = Rib.Views.DefaultCollection.extend({
		
		FormView: Rib.Views.DefaultModel,
		
		initialize: function (args) {
			Rib.Views.DefaultCollection.prototype.initialize.call(this);
			
			this.delegateEvents({
				'click .edit': 'onClickEdit',
				'click .delete': 'onClickDelete'
			});
		},
		
		edit: edit,
		onClickEdit: Rib.U.el2ModelProxy(edit),
		
		onClickDelete: Rib.U.el2ModelProxy(function(model){
			model.destroy();
		})
	});
	
	
	/**
	 * Form view skeleton
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
	
	return Rib;
	
})(window.Backbone, window.jQuery, window._);
