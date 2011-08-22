/*global window $ Backbone _ _t Filter Filters Payment Payments T2ps*/

$(function(){
	"use strict";

	window.Filter = Backbone.Model.extend({
		
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
		url: '/filter',
		
		initialize: function() {
		}
	});
	
	Filter.views = {};
	
	Filter.views.InList = Backbone.View.extend({
		
		tagName: "li",
		className: "filter",
		tmpl: _t('filter.in-list'),
		
		events: {
			'click .text': 'onClickText',
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete'
		},
		
		initialize: function (args) {
			_.bindAll(this, 'changeName');
			
			this.model.bind('destroy', _.bind(function(){ $(this.el).remove(); }, this));
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
		},
		
		render: function() {
			var data = this.model.toJSON();
			$(this.el).html(this.tmpl(data));
			return this;
		}
	});
	
	
	Filter.views.Form = Backbone.View.extend({
		
		tagName: "form",
		className: "filter",
		tmpl: _t('filter.form'),
		
		events: {
			'submit'       : 'onSubmit',
			'click .cancel': 'onClickCancel'
		},
		
		initialize: function () {
			var remove = _.bind(function(){ $(this.el).remove(); }, this);
			this.model.bind('destroy', remove);
			this.bind('close', remove);
		},
		
		onSubmit: function() {
			
			this.model.set({
				'name': this.$('.name').val()
			});
			
			this.model.save();
			this.trigger('close');
			return false; // prevent submit
		},
		
		onClickCancel: function() {
			if(this.model.isNew()) {
				this.model.destroy();
			}
			this.trigger('close');
		},
		
		render: function() {
			var data = this.model.toJSON();
			data.cid = this.model.cid; // need cid for labels in form
			$(this.el).html(this.tmpl(data));
			return this;
		}
	});
});
