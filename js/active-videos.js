// $(".trends-videos__item .video-info").click(function(){
	

// 	// var animation = bodymovin.loadAnimation({
// 	//   container: document.getElementById('plashka'), // Required
// 	//   path: 'images/pl.json', // Required
// 	//   renderer: 'svg/canvas/html', // Required
// 	//   loop: false, // Optional
// 	//   autoplay: true, // Optional
// 	//   name: "Hello World", // Name for future reference. Optional.
// 	// })

// 	$(this).parents(".trends-videos__item").addClass("activated");
// 	$(this).parents(".trends-videos__item").removeClass("disactive");
// })

// $(".trends-videos__item .active").click(function(){
// 	$(this).parents(".trends-videos__item").addClass("disactive");
// 	$(this).parents(".trends-videos__item").removeClass("activated");
// })


// $(".trends-videos__item #plashka").click(function(){
// 	animationpl.play();
// 	$(this).addClass("plashka_activated");
// })

// $(".trends-videos__item .plashka_activated").click(function(){
	
// 	$(this).removeClass("plashka_activated");
// 	animationpl.stop();
// })


$("body").on('mouseenter','.plashka__piece', function(){
	$(this).parent().addClass("plashka-is-hover");
	console.log("pidoras");
})
$("body").on('mouseleave', '.plashka__piece', function(){
	$(this).parent().removeClass("plashka-is-hover");
})

$("body").on('click', '.plashka__piece',function(){
	var id = $(this).parent().find('video').data('id');
	$(this).parent().addClass("plashka-is-clicked");
	animationpl[id].play();
	$(this).parent().find(".active").fadeIn(200);
	$(this).parent().find(".video-info").fadeOut(200);


})

$("body").on('click', '.plashka',function(){
	var id = $(this).parent().find('video').data('id');
	$(this).parent().removeClass("plashka-is-clicked");
	animationpl[id].stop();
	$(this).parent().find(".active").fadeOut(200);
	$(this).parent().find(".video-info").fadeIn(200);

})