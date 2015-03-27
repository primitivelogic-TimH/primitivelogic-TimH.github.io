// On window load. This waits until images have loaded which is essential
$(window).load(function(){
	
	// Fade in images so there isn't a color "pop" document load and then on window load
	$(".menu_img img").animate({opacity:1},500);
	
	// clone image
	$('.menu_img img, .author_foto img, .hover_img img').each(function(){
		var el = $(this);
		el.css({"position":"absolute"}).wrap("<div class='img_wrapper' style='display: inline-block'>").clone().addClass('img_grayscale').css({"position":"absolute","z-index":"1","opacity":"0"}).insertBefore(el).queue(function(){
			var el = $(this);
			el.parent().css({"width":this.width,"height":this.height});
			el.dequeue();
		});
		this.src = grayscale(this.src);
	});
	
	// Fade menu image 
	$('.toggle').mouseover(function(){
		$(this).find('.img_grayscale').stop().animate({opacity:1}, 500);
	})
	$('.toggle').mouseout(function(){
		$(this).find('img:first').stop().animate({opacity:0}, 500);
	});

	// Fade author foto 
	$('.author_foto').mouseover(function(){
		$(this).find('.img_grayscale').stop().animate({opacity:1}, 500);
	})
	$('.author_foto').mouseout(function(){
		$(this).find('img:first').stop().animate({opacity:0}, 500);
	});
	
	// Fade portfolio images 
	$('.projects .element').mouseover(function(){
		$(this).find('.img_grayscale').stop().animate({opacity:1}, 300);
	})
	$('.projects .element').mouseout(function(){
		$(this).find('img:first').stop().animate({opacity:0}, 300);
	});
	
});

// Grayscale w canvas method
function grayscale(src){
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var imgObj = new Image();
	imgObj.src = src;
	canvas.width = imgObj.width;
	canvas.height = imgObj.height; 
	ctx.drawImage(imgObj, 0, 0); 
	var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
	for(var y = 0; y < imgPixels.height; y++){
		for(var x = 0; x < imgPixels.width; x++){
			var i = (y * 4) * imgPixels.width + x * 4;
			var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
			imgPixels.data[i] = avg; 
			imgPixels.data[i + 1] = avg; 
			imgPixels.data[i + 2] = avg;
		}
	}
	ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
	return canvas.toDataURL();
}