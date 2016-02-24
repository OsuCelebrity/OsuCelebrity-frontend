$(document).ready(function() {
	
	(function($){
 
		$.fn.shuffle = function() {
	 
			var allElems = this.get(),
				getRandom = function(max) {
					return Math.floor(Math.random() * max);
				},
				shuffled = $.map(allElems, function(){
					var random = getRandom(allElems.length),
						randEl = $(allElems[random]).clone(true)[0];
					allElems.splice(random, 1);
					return randEl;
			   });
	 
			this.each(function(i){
				$(this).replaceWith($(shuffled[i]));
			});
	 
			return $(shuffled);
	 
		};
	 
	})(jQuery);
		
	$('.wallpaper').shuffle();
	
	$(".wallpaper-wrapper").slick({
		autoplay: true,
		autoplaySpeed: 2000,
		speed: 500,
		arrows: false,
		fade: true,
		infinite: true,
		pauseOnHover: false
	});
	
	$('.wallpaper-wrapper').on('afterChange', function () {
		if ($(".slick-active").hasClass("image")) {
			$('.wallpaper-wrapper').slick('slickPlay');
		}
		
		if ($(".slick-active").hasClass("video")) {
			$('.wallpaper-wrapper').slick('slickPause');
			$(".slick-active video").get(0).play();
		}
	});
	
	$("video").bind("ended", function() {
		$('.wallpaper-wrapper').slick('slickNext');
	});
	
/*
	function nextvideo() {
		/* Goes to next slide
		$('.wallpaper-wrapper').slick('slickNext');
		/* After slide transition finishes, pause the Slick autoplay and play the video
		$('.wallpaper-wrapper').on('afterChange', function () {
			$('.wallpaper-wrapper').slick('slickPause');
			$(".slick-active video").get(0).play();
		});
	}
	*/
	/*
	$('.wallpaper-wrapper').on('afterChange', function () {
		/* If the current active slick item does NOT have an img tag
		if ( $(".slick-active img").length ) {
			nextvideo();
		} else {
			$('.wallpaper-wrapper').slick('slickPlay');
		}
	});
	*/
	
/*
	$('.wallpaper-wrapper').on('afterChange', function () {
			$('.wallpaper-wrapper').slick('slickPause');
			$(".slick-active video").get(0).play();
	});
*/
	/*
	window.setInterval(function () {
		$(".wallpaper-video").get(0).play();
	}, 500);


	$('.wallpaper-wrapper').on('beforeChange', function () {
		setTimeout(
			function () {
				$(".wallpaper-video").get(0).currentTime = 0;

			}, 0);
	});*/
	/*setInterval(function() {
		
	}, 500);*/
	
});