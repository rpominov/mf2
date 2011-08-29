/**
 * Templates collector grabs all templates from dom,
 * removes dom elemets
 * and compiles templates for later use.
 *
 * Also replaces {{}} with <%%> for Django templates compatibility.
 * 
 * Author: https://github.com/pozadi
 * License: Public Domain
 * 
 * Depends on
 *   jQuery (or Zepto) and doT.js (https://github.com/olado/doT)
 * 
 * Usage:
 *   in js:
 *    user_model = {name: 'Wally', age: 37} 
 * 
 *    user_html = t('user', user_model)
 *    // OR
 *    user_html = t('user')(user_model)
 * 
 *   in html:
 *    <script type="text/html" class="template" data-bind="user.name-part">
 *       <span class="name"><%! it.name %></span>
 *    </script>
 * 
 *    <script type="text/html" class="template" data-bind="user">
 *       <%#def['user.name-part']%>
 *       <span class="age"><%! it.age %></span>
 *    </script>
 * 
 *   ... all doT fetures include includes works
 */
"use strict";

window._t = function(_, $, doT){
	
	var promise,
	
	_t = function(name, model) {
		var t = _t._compiled[name] || _(promise).bind(null, name);
		return typeof model === "undefined" ? t : t(model);
	};
	
	promise = function(name) {
		if (!_t._grabbing.isResolved()) {
			throw "try to draw template before grabbing";
		}
		
		var t = _t._compiled[name];
		
		if (t) {
			return t.apply(this, [].slice.call(arguments, 1));
		} else {
			throw "unknown template";
		}
	};
	
	_t._grabbing = $.Deferred();
	
	_t.ready = function(callback) {
		_t._grabbing.done(callback);
	};
	
	_t._compiled = {};
	_t._source = {};
	
	_t._settings = {
		evaluate:    /<%([\s\S]+?)%>/g,
		interpolate: /<%=([\s\S]+?)%>/g,
		encode:      /<%!([\s\S]+?)%>/g,
		use:         /<%#([\s\S]+?)%>/g, //compile time evaluation
		define:      /<%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#%>/g, //compile time defs
		varname: 'it',
		strip : true,
		append: true
	};
	
	_t._grabAll = function() {
		
		$('script.template').each(function(){
			var el = $(this);
			_t._source[el.attr('data-bind')] = el.html();
			el.remove();
		});
		
		for (var name in _t._source) {
			_t._compiled[name] = doT.template(_t._source[name], _t._settings, _t._source);
		}
		
		_t._grabbing.resolve();
	};
	
	$(_t._grabAll);
	
	return _t;
	
}(window._, window.jQuery || window.Zepto, window.doT || window.doU);
