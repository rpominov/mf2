window.Filter = (function(_, Backbone, Rib, _t){
	"use strict";

	var Filter = Backbone.Model.extend({
		
		defaults: {
			name: ''
		},
		
		initialize: function() {
		},
		
		validate: function(attrs) {
		    if (typeof attrs.name !== 'undefined' && !_.isString(attrs.name)) {
				return "'name' must be an String";
			}
			// todo
		}
	});
	
	Filter.Collection = Backbone.Collection.extend({
		model: Filter,
		url: '/api/filter',
		
		initialize: function() {
		}
	});
	
	Filter.Views = {};
	
	Filter.Views.InList = Rib.Views.DefaultModel.extend({
		
		tagName: "li",
		className: "filter",
		tmpl: _t('filter.in-list'),
		
		events: {
			'click .text': 'onClickText',
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete'
		},
		
		initialize: function (args) {
			Rib.Views.DefaultModel.prototype.initialize.call(this);
			
			_.bindAll(this, 'changeName');
			this.model.bind('change:name', this.changeName);
		},
		
		onClickEdit: function() {
			this.trigger('edit_clicked', this.model);
		},
		
		onClickDelete: function() {
			this.model.destroy();
		},
		
		onClickText: function() {
			// todo
		},
		
		changeName: function() {
			this.$('.name').text(this.model.get('name'));
		}
	});
	
	
	Filter.Views.Form = Rib.Views.Form.extend({
		className: "filter",
		tmpl: _t('filter.form'),
		
		save: function(){
			this.model.set({
				'name': this.$('.name').val()
			});
			
			this.model.save();
		}
	});
	
	return Filter;
})(window._, window.Backbone, window.Rib, window._t);
