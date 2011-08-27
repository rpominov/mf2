/*global $*/

$(function(){
	"use strict";
	
	/* not need for now
	$('.tooltip-contener.on-click').live('click',    function(){ $(this).   addClass('hover') })
	$('.tooltip-contener.on-click').live('mouseout', function(){ $(this).removeClass('hover') })
	*/
	
	$('.sidebar .block h3 .text').click(function(){
		// todo save status in cookies
		$(this).parent().parent().toggleClass('folded');
	});
	
	var shown = false;
	$('#sys-settings').click(function(){
		
		if (shown) {
			$('#settings').hide('blind', {}, 500, function(){
				$('.settings-wrap').hide();
			});
		} else {
			$('.settings-wrap').show();
			$('#settings').show('blind');
		}
		
		shown = !shown;
	});
});
