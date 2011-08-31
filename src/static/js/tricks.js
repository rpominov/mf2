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
