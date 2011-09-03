/*global $*/

$(function(){
	"use strict";
	
	/* not need for now
	$('.tooltip-contener.on-click').live('click',    function(){ $(this).   addClass('hover') })
	$('.tooltip-contener.on-click').live('mouseout', function(){ $(this).removeClass('hover') })
	*/
	
	function set_sizes() {
		$('.center > .padding').css('min-height', ($(window).height() - 180) + 'px');
	}
	set_sizes();
	$(window).resize(set_sizes);
	
	$('.sidebar .block h3 .text').click(function(){
		// todo save status in cookies
		$(this).parent().parent().toggleClass('folded').find('ul').toggle('blind', {}, 200);
	});
	
});
