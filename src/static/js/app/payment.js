/*global window $ Backbone _ _t Payment Payments Tags Tag*/

$(function(){
	"use strict";

	function expand_tags(model) {
		model.tags = _(model.tags).chain()
						.map(function(tag) { return Tags.get(tag); })
						.filter(function(tag) { return !!tag; })
						.value();
		model.tags = new Backbone.Collection(model.tags);
	}

	window.Payment = Backbone.Model.extend({
		
		defaults: {
           name: '',
           value: 0,
           tags: null // Backbone.Collection
		},
		
		initialize: function() {
			if (this.get('tags') === null) {
				this.set({tags: new Backbone.Collection()});
			}
		},
		
		validate: function(attrs) {
		    /*if (attrs.end < attrs.start) {
		      return "can't end before it starts";
		    }*/
		},
		
		// redefine toJSON for correct save collection of tags
		toJSON: function(pluck_names) {
			var result = Backbone.Model.prototype.toJSON.call(this);
			
			result.tags = result.tags.pluck(pluck_names ? 'name' : 'id');
			return result;
		},
		
		// redefine parse for correct restore collection of tags
		parse: function (resp, xhr) {
			var result = Backbone.Model.prototype.parse(resp, xhr);
			
			expand_tags(result);
			return result;
		}
	});
	
	Payment.Collection = Backbone.Collection.extend({
		model: Payment,
		url: '/payment',
		
		// redefine parse for correct restore collection of tags
		parse: function (resp, xhr) {
			var result = Backbone.Collection.prototype.parse(resp, xhr);
			
			_(result).map(expand_tags);
			return result;
		}
	});
	
	Payment.views = {};
	
	Payment.views.Form = Backbone.View.extend({
		
		tagName: "form",
		className: "payment",
		tmpl: _t('payment.form'),
		
		events: {
			'submit'       : 'onSubmit',
			'click .cancel': 'onClickCancel'
		},
		
		initialize: function (args) {
			var remove = _.bind(function(){ $(this.el).remove(); }, this);
			this.model.bind('destroy', remove);
			this.bind('close', remove);
		},
		
		onSubmit: function() {
			
			this.model.set({
				'name': this.$('.name').val(),
				'value': this.$('.value').val()
			});
			
			var tags = this.$('.tags').val().split(',');
				tags = _(tags).chain()
							.map(function(tag) { return _(tag).trim(); })
							.filter(function(tag) { return tag.length > 0; })
							.value();
			
			Tags.getByNames(tags, _(function(tags) {
				this.model.set({'tags': new Backbone.Collection(tags)});
				this.model.save();
			}).bind(this));
			
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
			var data = this.model.toJSON(true);
			data.cid = this.model.cid; // need cid for labels in form
			data.tags = data.tags.join(', ');
			$(this.el).html(this.tmpl(data));
			return this;
		}
	});
	
	Payment.views.InList = Backbone.View.extend({
		
		tagName: "li",
		className: "payment",
		tmpl: _t('payment.in_list'),
		
		events: {
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete'
		},
		
		initialize: function (args) {
			_.bindAll(this, 'changeName', 'changeValue', 'changeTags');
			this.model.bind('change:name', this.changeName);
			this.model.bind('change:value', this.changeValue);
			this.model.bind('change:tags', this.changeTags);
			this.model.bind('destroy', _.bind(function(){ $(this.el).remove(); }, this));
		},
		
		onClickEdit: function() {
			this.trigger('edit_clicked', this.model);
		},
		
		onClickDelete: function() {
			this.model.destroy();
		},
		
		changeName: function() {
			this.$('.name').text(this.model.get('name'));
		},
		
		changeValue: function() {
			this.$('.value').text(this.model.get('value'));
		},
		
		changeTags: function() {
			this.$('.tag').remove();
			
			var tags = this.model.get('tags');
			
			tags.each(_(function(tag) {
				var view = new Tag.views.InSmallList({model: tag});
				this.$('.tag-list').append(view.render().el);
			}).bind(this));
		},
		
		render: function() {
			var data = this.model.toJSON();
			$(this.el).html(this.tmpl(data));
			this.changeTags();
			return this;
		}
	});
});
