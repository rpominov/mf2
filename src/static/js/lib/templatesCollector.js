/**
 * Templates collector grabs all templates from dom,
 * removes dom elemets
 * and compiles templates for later use.
 * 
 * Author: https://github.com/pozadi
 * License: http://sam.zoy.org/wtfpl/COPYING
 * 
 * Depends on
 *   jQuery (or Zepto) and doT.js (https://github.com/olado/doT)
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
 *       <span class="name"><%! it.name %></span>
 *    </script>
 * 
 *    <script type="text/html" class="template" data-bind="user">
 *       <%#def['user.name_part']%>
 *       <span class="age"><%! it.age %></span>
 *    </script>
 * 
 *   ... all doT fetures include includes works
 */
"use strict";

window.T = function(win, $, doT){
	
	var T = function(name, model) {
		var t = T._compiled[name]
		return t ? (model ? t(model) : t) : null
	}
	
	T._compiled = {}
	T._source = {}
	
	T._settings = {
		evaluate:    /\<\%([\s\S]+?)\%\>/g,
		interpolate: /\<\%=([\s\S]+?)\%\>/g,
		encode:      /\<\%!([\s\S]+?)\%\>/g,
		use:         /\<\%#([\s\S]+?)\%\>/g, //compile time evaluation
		define:      /\<\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\>/g, //compile time defs
		varname: 'it',
		strip : true,
		append: true
	}
	
	T._grabAll = function() {
		
		win.console && win.console.time && win.console.time('templates grabbing');
		
		$('script.template').each(function(){
			var el = $(this)
			T._source[el.attr('data-bind')] = el.html()
			el.remove()
		})
		
		for (var name in T._source) {
			T._compiled[name] = doT.template(T._source[name], T._settings, T._source)
		}
		
		win.console && win.console.timeEnd && win.console.timeEnd('templates grabbing');
	}
	
	$(T._grabAll)
	
	return T
	
}(window, window.jQuery || window.Zepto, window.doT || window.doU)
