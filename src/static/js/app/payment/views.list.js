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
			
			_.bindAll(this, 'changeTags', 'changeTagName', 'showBy');
			
			core._coll.T2ps.bind('payment', this.changeTags);
			
			core._coll.Tags   .bind('change:name', this.changeTagName);
			core._coll.Vaults .bind('change:name', this.changeTagName);
			core._coll.Filters.bind('change:name', this.changeTagName);
			
			core.router(_(function(router){
				router.bind('route:by', this.showBy);
				router.bind('route:index', this.showBy);
			}).bind(this));
		},
		
		addOne: function(model) {
			Rib.Views.EditableCollection.prototype.addOne.call(this, model);
			
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
		
		regexps: {
			tag: /tag_\S+/g,
			vault: /vault_\S+/g,
			vault1: /vault1_\S+/g
		},
		
		changeVaults: Rib.U.model2ElProxy(function(el, model) {
			
			_(['vault', 'vault1']).each(_(function(vault){
				$('.tag-list .' + vault, el).remove();
			
				var data = model.get(vault);
				data = data === null ? null : Rib.Views.DefaultCollection.prototype.forTmpl(data);
				
				$('.tag-list', el).append(_t(vault + '.small-list', data));
				
				var classStr = $(el).attr('class');
				classStr = classStr.replace(this.regexps[vault], '');
				$(el).attr('class', classStr);
				
				if (data) {
					$(el).addClass(vault + '_' + data.cid);
				}
			}).bind(this));
			
			// todo currency
		}),
		
		changeTags: Rib.U.model2ElProxy(function(el, model) {
			
			$('.tag-list .tag', el).remove();
			
			var tags = core._coll.T2ps.getByPayment(model),
				list = $('.tag-list', el);
				
			var classStr = $(el).attr('class');
			classStr = classStr.replace(this.regexps.tag, '');
			$(el).attr('class', classStr);
			
			_(tags).each(function(tag){
				var data = tag.toJSON();
				data.cid = tag.cid;
				list.append(_t('tag.small-list', data));
				$(el).addClass('tag_' + tag.cid);
			});
		}),
		
		changeTagName: function(model) {
			this.$('.cid_' + model.cid).text(model.get('name'));
		},
		
		changeType: Rib.U.model2ElProxy(function(el, model) {
			var classes = 'minus plus transfer',
				type = model.get('type');
			$(el).removeClass(classes).addClass(classes.split(' ')[type]);
			$('.minus-sign', el).text( type === 0 ? '-' : '' );
		}),
		
		setStyle: function(text) {
			var style_el = $('#filter-style')[0];
			
			if (typeof style_el.styleSheet !== 'undefined' && typeof style_el.styleSheet.cssText !== 'undefined') { // ie
				style_el.styleSheet.cssText = text;
			} else {
				$(style_el).html(text);
			}
		},
		
		showBy: function(what, id) {
			
			var showAll = _(function() {
				this.setStyle('');
			}).bind(this);
			
			var options = {
				'filter': 'Filters',
				'tag': 'Tags',
				'vault': 'Vaults'
			};
			
			if (what in options) {
				var model = core._coll[options[what]].get(id) || core._coll[options[what]].getByCid(id);
				if (model) {
					this.setStyle('li.payment{display:none} li.payment.' + what + '_' + model.cid + '{display:list-item}');
				} else {
					showAll();
				}
			} else {
				showAll();
			}
			
		}
	});
	
})();
