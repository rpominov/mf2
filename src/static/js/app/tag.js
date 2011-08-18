/*global window $ Backbone _ _t Tag Tags Payment Payments*/

$(function(){
	"use strict";

	window.Tag = Backbone.Model.extend({
		
		defaults: {
			name: '',
			payments_ids: []
		}
	});
	
	Tag.Collection = Backbone.Collection.extend({
		model: Tag,
		url: '/tag',
		
		getForPayment: function(payment_id) {
			
		},
		
		setForPayment: function(payment_id, tags_strings) {
			this.trigger('teg_changed:' + payment_id);
			
			// todo
		}
	});
	
	Tag.views = {};
	
	Tag.views.bigList = Backbone.View.extend({
		
		tagName: "li",
		className: "tag",
		tmpl: _t('tag.big-list'),
		
		events: {
			'click .text': 'onClickText'
		},
		
		initialize: function (args) {
			/*var remove = _.bind(function(){ $(this.el).remove(); }, this);
			this.model.bind('destroy', remove);
			this.bind('close', remove)*/
		},
		
		onClickText: function() {
			// todo
		},
		
		render: function() {
			$(this.el).html(this.tmpl(this.model.toJSON()));
			return this;
		}
	});
});
