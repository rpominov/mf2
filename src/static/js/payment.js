var Payment = Backbone.Model.extend({
	
});

var PaymentsCollection = Backbone.Collection.extend({
    model : Payment
});

var PaymentView = Backbone.View.extend({
	
	tagName: "li",
	className: "payment",
	
	initialize: function (args) {
		_.bindAll(this, 'changeName');
		this.model.bind('change:name', this.changeName);
	},
	
	events: {
		'click .name': 'handleClick'
	},
	
	handleClick: function() {
		alert('In the name of science... you monster');
		// Other actions as necessary
	},
	
	changeName: function() {
		$('.name', this.el).text(this.model.get('name'));
	},
	
	render: function() {
		var name = this.model.get('name');
    	$(this.el).html('<span class="name">' + name + '</span>');
	}
});