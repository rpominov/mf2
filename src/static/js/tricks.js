$(function(){
	"use strict";
	
	$('.tooltip-contener.on-click').live('click',    function(){ $(this).   addClass('hover') })
	$('.tooltip-contener.on-click').live('mouseout', function(){ $(this).removeClass('hover') })
})
