$(document).ready(function(){
	//Menu
	$.fn.slideFadeToggle = function(options, callback) {
	if (typeof callback == 'function') { // make sure the callback is a function
		   callback.call(this); // brings the scope to the callback
	   }
	   return this.animate({opacity: 'toggle', height: 'toggle'}, 400);
	};
	jQuery(document).ready(function() {
		jQuery(".toggle").next(".hidden").hide();
		
		jQuery(".toggle").click(function() {
			$('.current').not(this).toggleClass('current').next('.hidden').slideFadeToggle();
			$(this).toggleClass('current').next().slideFadeToggle(500, function(){
			var this_element = $(this);
			setTimeout(function(){
			var scroll_to = this_element.prev('.toggle').offset().top;
			$('html, body').animate({scrollTop: scroll_to }, 500);
			}, 500);
			});
		});
	});
	
	
	//Contact form
	$("#ajax-contact-form").submit(function() {
		var str = $(this).serialize();		
		$.ajax({
			type: "POST",
			url: "contact_form/contact_process.php",
			data: str,
			success: function(msg) {
				// Message Sent - Show the 'Thank You' message and hide the form
				if(msg == 'OK') {
					result = '<div class="notification_ok">Your message has been sent. Thank you!</div>';
					$("#fields").hide();
				} else {
					result = msg;
				}
				$('#note').html(result);
			}
		});
		return false;
	});
	
	
	//Background Video
	jQuery(".player").mb_YTPlayer();

});














