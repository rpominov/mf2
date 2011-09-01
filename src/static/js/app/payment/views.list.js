/*global $ _ Rib _t __ core Tag Payment Vault Filter*/

(function(){
	"use strict";
	
	/**
	 * List view
	 */
	Payment.Views.List = Rib.Views.EditableCollection.extend({
		
		tmpl: _t('payment.in_list'),
		
		FormView: Payment.Views.Form,
		
		events: {
		},
		
		initialize: function (args) {
			Rib.Views.EditableCollection.prototype.initialize.call(this);
			
			Rib.U.bindAll(this, this.collection, {
				'change:name':   'changeName',
				'change:value':  'changeValue',
				'change:value1': 'changeValue1',
				'change:type':   'changeType',
				'change:time':   'changeTime',
				'change:vault':  'changeVaults',
				'change:vault1': 'changeVaults'
			});
			
			_.bindAll(this, 'create', 'changeTags', 'changeTagName');
			
			$('#add-payment').click(this.create);
			
			core._coll.T2ps.bind('payment', this.changeTags);
			core._coll.Tags.bind('change:name', this.changeTagName);
		},
		
		create: function() {
			if (core._coll.Vaults.length === 0) {
				Rib.U.alert(_t('messages.no-vaults', null));
				return;
			}
			
			this.collection.add({
				time: new Date(),
		        cr_time: new Date(),
		        vault: core._coll.Vaults.getDefault()
           });
		},
		
		addOne: function(model) {
			Rib.Views.EditableCollection.prototype.addOne.call(this, model);
			
			if(model.isNew()){
				this.edit(model);
			}
			
			this.changeTags(model);
			this.changeType(model);
			this.changeVaults(model);
			this.changeTime(model);
		},
		
		changeName: Rib.U.model2ElProxy(function(el, model) {
			$('.name', el).text(model.get('name'));
		}),
		
		changeValue: Rib.U.model2ElProxy(function(el, model) {
			$('.value', el).text(model.get('value'));
		}),
		
		changeValue1: Rib.U.model2ElProxy(function(el, model) {
			$('.value1', el).text(model.get('value1'));
		}),
		
		changeTime: Rib.U.model2ElProxy(function(el, model) {
			$('.time', el).text($.datepicker.formatDate('mm/dd/yy', model.get('time')));
		}),
		
		changeVaults: Rib.U.model2ElProxy(function(el, model) {
			
			_(['vault', 'vault1']).each(function(vault){
				$('.tag-list .' + vault, el).remove();
			
				var data = model.get(vault);
				data = data === null ? null : Rib.Views.DefaultCollection.prototype.forTmpl(data);
				
				$('.tag-list', el).append(_t(vault + '.small-list', data));
			});
			
			// todo currency
		}),
		
		changeTags: Rib.U.model2ElProxy(function(el, model) {
			
			$('.tag-list .tag', el).remove();
			
			var tags = core._coll.T2ps.getByPayment(model),
				list = $('.tag-list', el);
			
			_(tags).each(function(tag){
				var data = tag.toJSON();
				data.cid = tag.cid;
				list.append(_t('tag.small-list', data));
			});
		}),
		
		changeTagName: function(tag) {
			this.$('.cid_' + tag.cid).text(tag.get('name'));
		},
		
		changeType: Rib.U.model2ElProxy(function(el, model) {
			var classes = 'minus plus transfer',
				type = model.get('type');
			$(el).removeClass(classes).addClass(classes.split(' ')[type]);
			$('.minus-sign', el).text( type === 0 ? '-' : '' );
		})
	});
	
})();
