/*global $*/

$(function(){
	"use strict";
	
	/* not need for now
	$('.tooltip-contener.on-click').live('click',    function(){ $(this).   addClass('hover') })
	$('.tooltip-contener.on-click').live('mouseout', function(){ $(this).removeClass('hover') })
	*/
	
	$('.sidebar .block h3 .text').click(function(){
		// todo save status in cookies
		$(this).parent().parent().toggleClass('folded').find('ul').toggle('blind', {}, 200);
	});
	
	// temporary
	var shown = false;
	$('#sys-settings').click(function(){
		
		$('.top').toggleClass('settings-mode');
		
		if (shown) {
			$('#settings .panel').hide('blind', {}, 200, function(){
				$('#settings').hide();
			});
		} else {
			$('#settings').show();
			$('#settings .panel').show('blind', {}, 200);
		}
		
		shown = !shown;
	});
	
});
