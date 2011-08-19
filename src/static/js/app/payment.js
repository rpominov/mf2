/*global window $ Backbone _ _t Payment Payments Tags*/

$(function(){
	"use strict";

	function expand_tags(model) {
		model.tags = _(model.tags).map(function(tag) { return Tags.get(tag); });
		model.tags = new Backbone.Collection(model.tags);
	}

	window.Payment = Backbone.Model.extend({
		
		defaults: {
           name: '',
           value: 0,
           tags: new Backbone.Collection()
		},
		
		initialize: function() {
			
		},
		
		validate: function(attrs) {
		    /*if (attrs.end < attrs.start) {
		      return "can't end before it starts";
		    }*/
		},
		
		sync: function(method, model, options) {
			
			var tags = null;
			if(_(['create', 'update']).contains(method)) {
				tags = model.get('tags');
				model.set({tags: tags.pluck('id')});
			}
			
			var result = Backbone.sync(method, model, options);
			
			if (tags !== null) {
				model.set({tags: tags});
			}
			
			return result;
		},
		
		parse: function (resp, xhr) {
			console.log('model.parce');
			
			var result = Backbone.Model.prototype.parse(resp, xhr);
			
			expand_tags(result);
			return result;
		}
	});
	
	Payment.Collection = Backbone.Collection.extend({
	    model: Payment,
	    url: '/payment',
	    
	    parse: function (resp, xhr) {
	    	console.log('collection.parce');

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
			this.bind('close', remove)
		},
		
		onSubmit: function() {
			
			this.model.set({
				'name': this.$('.name').val(),
				'value': this.$('.value').val()
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
	
	Payment.views.InList = Backbone.View.extend({
		
		tagName: "li",
		className: "payment",
		tmpl: _t('payment.in_list'),
		
		events: {
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete'
		},
		
		initialize: function (args) {
			_.bindAll(this, 'changeName', 'changeValue');
			this.model.bind('change:name', this.changeName);
			this.model.bind('change:value', this.changeValue);
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
		
		render: function() {
			$(this.el).html(this.tmpl(this.model.toJSON()));
			return this;
		}
	});
});
