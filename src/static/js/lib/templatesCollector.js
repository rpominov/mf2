/**
 * Templates collector grabs all templates from dom,
 * removes dom elemets
 * and compiles templates for later use.
 * 
 * Author: https://github.com/pozadi
 * License: http://sam.zoy.org/wtfpl/COPYING
 * 
 * Depends on
 * 	 jQuery or Zepto
 *   and
 *   doT.js or doU.js (https://github.com/olado/doT)
 * 
 * Usage:
 *   in js:
 *    user_model = {name: 'Wally', age: 37} 
 * 
 *    user_html = T('user', user_model)
 *    // OR
 *    user_html = T('user')(user_model)
 * 
 *   in html:
 *    <script type="text/html" class="template" data-bind="user.name_part">
 *       <span class="name">{{! it.name }}</span>
 *    </script>
 * 
 *    <script type="text/html" class="template" data-bind="user">
 *       {{#def['user.name_part']}}
 *       <span class="age">{{! it.age }}</span>
 *    </script>
 * 
 *   ... all doT fetures include includes works
 */
"use strict";

window.T = function($, doT){
	
	var T = function(name, model) {
		var t = T._compiled[name]
		return t ? (model ? t(model) : t) : null
	}
	
	T._compiled = {}
	T._source = {}
	
	T._grabAll = function() {
		
		console && console.time && console.time('templates grabbing');
		
		$('script.template').each(function(){
			var el = $(this)
			T._source[el.attr('data-bind')] = el.html()
			el.remove()
		})
		
		for (var name in T._source) {
			T._compiled[name] = doT.template(T._source[name], null, T._source)
		}
		
		console && console.timeEnd && console.timeEnd('templates grabbing');
	}
	
	$(T._grabAll)
	
	return T
	
}(window.jQuery || window.Zepto, window.doT || window.doU)