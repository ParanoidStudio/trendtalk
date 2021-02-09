var videos = [];
var currPage = 0;
var isLoaded = false;
var vidAmount = 0;
var clearFix = $("#clearfix");
var vidCnt = 0;
var videoCount = 0;

var supPage = 0;


var animationpl = [];




$(document).ready(() => {
	
	getFeed(16);
	console.log("entry");

	let interval = setInterval(()=>{
		getFeed(100);
	}, 2000);

	let initialTimeout = setTimeout(() => {
		updatePages(0);
	}, 1000);

});






function getFeed(amnt) {
	amnt += 1;
    $.ajax({
        type: "POST",
        url: "handler.php",
        data: {
			video: true,
			amount: amnt,
        },
        success: function (response) {
            let newVideos = JSON.parse(response);
            //console.log("Videos loaded successfully!");
			
			for(let k in newVideos){
				let flag = true;
				for(let j in videos){
					if(newVideos[k].videoId == videos[j].videoId 
						|| newVideos[k].videoLink == null){
							flag = false;
							break;
						}
				}
				if(flag)
					videos[vidCnt++] = newVideos[k];
			}

			//console.log(videos);

        },
        error: function (responce) {
            console.log("Video loading failed! Ne supper!");
        }
    });
}









// обновляем секции

function updatePages(cp = currPage){
	console.log("updating");
	if(	cp < 0) return;

	let blockLeader = cp + cp%2;

	if($("[data-pg='"+(blockLeader - 4)+"'").length != 0){ // blockLeader - 4 > 0
		console.log("cleaning old");
		for(let i = 0; i < 3; i++){
			$("[data-pg='"+ (blockLeader - 5)+"'] [data-vid='"+i+"']").attr("src", "");
			$("[data-pg='"+ (blockLeader - 4)+"'] [data-vid='"+i+"']").attr("src", "");
		}
	}

	if($("[data-pg='"+(blockLeader + 3)+"'").length != 0){ // blockLeader + 3 > supPage
		console.log("clearing new");
		for(let i = 0; i < 3; i++){
			$("[data-pg='"+ (blockLeader + 3)+"'] [data-vid='"+i+"']").attr("src", "");
			$("[data-pg='"+ (blockLeader + 4)+"'] [data-vid='"+i+"']").attr("src", "");
		}
	}


	for(let i = blockLeader - 3; i <= blockLeader + 2; i++){
		if(i + i%2 == blockLeader || i <= 0) continue;

		if(i > blockLeader && $("[data-pg='"+i+"']").length == 0){
			buildNewPage(i);
		}

		fillPage(i); 
	}

}
















// Строим новые секции
function buildNewPage(number){

	supPage++;
	console.log("building");

	let isGray = '';
	if((number) % 2==0) isGray = 'gray';
		
		$('#lightFullPage').append("<div class='section trends-videos "+isGray+"' data-pg='"+number+"'>" +
								"<div class='container'>" +
									"<div class='trends-videos__inner' data-page='" + number + "'>");
		

		for (let i = 0; i < 3; i++) {

			let v = videos[(number - 1) * 3 + i];

			videoCount++;
			// 
			$("[data-page='" + number + "']").append(
			"<div class='trends-videos__item'>" +
				"<video data-vid='"+ i +"' data-id='"+ videoCount +"' src='' poster='" + v.originCover + "' controls></video>" + // src
					"<div class='video-info'>" +
						"<div class='views__inner'>" +
							"<p class='views-word'><span class='views_amount'>Просмотры:</span></p>" +
							"<span data-views='"+ i +"' class='views_amount'>"+v.videoViews+"</span>" + //text
						"</div>" +
							"<p data-hash='"+ i +"' class='hashtags>'" +
							"</p>" +
					"</div>" +
                    


						"<div class='active'>" +
							"<div class='likes-views'>" +
								"<div class='likes'>" +
									"<img src='images/like.svg'>" +
									"<span data-slikes ='"+i+"' class='active-span'>" + v.videoLikes +
									"</span>" +
								"</div>" +
								"<div class='views'>" +
									"<img src='images/view.svg'>" +
									"<span data-sviews ='"+i+"' class='active-span'>" + v.videoViews +
									"</span>" +
								"</div>" +
							"</div>" +
	
							"<div class='subscribe'>" +
								"<span style='display: block'>" +
									"Подписаться на автора" +
								"</span>" +
								"<a data-sauthor ='"+i+"' class='author_link' href='"+'https://tiktok.com/@' + v.videoAuthor + '?/'+"'>"+v.videoAuthor+"</a>" +
							"</div>" +
	
							"<div data-shash ='"+i+"' class='hashtags_active'>" +
								"<span>" +
									"Хештеги" +
								"</span>" +
								"<p class='hashtags_active'>" +"<a href='#'></a>" +
							"</div>" +
	
							// "<div class='listen-music'>" +
							// 	"<p>" +
							// 		"Слушать трек из видео тут: " +
							// 	"</p>" +
							// 	"<div class='social-buttons'>" +
							// 		"<a class='scl_btn' href='#'>" +"<img src='images/spotify.svg'>" +"</a>" +
							// 		"<a class='scl_btn' href='#'>" +"<img src='images/google-music.svg'>" +"</a>" +
							// 		"<a class='scl_btn' href='#'>" +"<img src='images/yandex-music.svg'>" +"</a>" +
							// 	"</div>" +
							// "</div>" +
							"<div class='open-active'>" + 
								"<a data-slink ='"+i+"' class='open-tt' href='"+'https://tiktok.com/@' + v.videoAuthor + '?/'+"'>" +
									"Открыть в Тик Ток" +
								"</a>" +
							"</div>" +

						
						"</div>" +

						"<div class='plashka' id='plashka"+videoCount+"' style='width: 100%;height: 100%'>" +
									

						"</div>" +

						"<div class='plashka__piece'>" +
								
						"</div>" +
				"</div>");


			for(let hash in v.videoHash){
				$("[data-pg='"+currPage+"'] [data-hash='"+i+"']").append("<a href='#'>"+v.videoHash[hash]+"</a>");
			}	

			if (!isEmpty(v.videoHash)){
				for(let hash in v.videoHash){
					$("[data-pg='"+currPage+"'] [data-shash='"+i+"']").find("p").append("<a href='"+"https://tiktok.com/tags/"+v.videoHash[hash].substr(1)+"'>"+v.videoHash[hash]+"</a>");
				}
			} else {
				$("[data-pg='"+currPage+"'] [data-shash='"+i+"']").text("");
			}


		   animationpl[videoCount] = bodymovin.loadAnimation({
			    container: document.getElementById('plashka'+videoCount), // Required
			    path: 'images/pl.json', // Required
			    renderer: 'svg', // Required
			    loop: false, // Optional
			    autoplay: false, // Optional
			    // name: "Hello World", // Name for future reference. Optional.
		  });
		}


		$('#lightFullPage').append("</div></div></div>");
	}



















// Добавление инфы в html

function fillPage(cp) {
	
	console.log("filli+++" + cp);

	for(let i = 0; i < 3; i++){

		$("[data-pg='"+cp+"'] [data-vid='"+i+"']").attr("src", videos[(cp - 1) * 3 + i].videoLink);

	}
			
    return true;
}













function isEmpty(arr){
	for(let key in arr){
		if(key != '')
		return false;
	}
	return true;
}















// Storage for our goods

		// Управление видео


// for(let vidos of document.body.getElementsByTagName('video')){
// 	vidos.addEventListener('playing', function(){
// 		let id = this.dataset.id;
// 		if(id !== prevId){
// 			var volume = $('body video[data-id="'+prevId+'"')[0].volume;
// 			var muted = $('body video[data-id="'+prevId+'"')[0].muted;
// 			$('body video[data-id="'+id+'"')[0].volume = volume;
// 			$('body video[data-id="'+id+'"')[0].muted = muted;
// 		}
		
// 		prevId = id;

// 		$('body video').each(function() {
// 		if ($(this).data('id') != id) {
// 			$(this).trigger('pause');
// 		}
// })})};












// function fillPage(amnt) {
	
// 	$("[data-pg='"+ currPage +"']").show();

// 	for(let j = 0; j < 3; j++){
// 		let v = videos[(currPage - 1) * 3 + j];

// 		$("[data-pg='"+currPage+"'] [data-vid='"+j+"']").attr("src", v.videoLink);
// 		$("[data-pg='"+currPage+"'] [data-vid='"+j+"']").attr("poster", v.originCover);

// 		$("[data-pg='"+currPage+"'] [data-views='"+j+"']").text(v.videoViews);

// 		for(let hash in v.videoHash){
// 			$("[data-pg='"+currPage+"'] [data-hash='"+j+"']").append("<a href='#'>"+v.videoHash[hash]+"</a>");
// 		}
		
// 		$("[data-pg='"+currPage+"'] [data-sviews='"+j+"']").text(v.videoViews);
// 		$("[data-pg='"+currPage+"'] [data-slikes='"+j+"']").text(v.videoLikes);
// 		$("[data-pg='"+currPage+"'] [data-sauthor='"+j+"']").text("@"+v.videoAuthor);
// 		$("[data-pg='"+currPage+"'] [data-sauthor='"+j+"']").attr('href', 'https://tiktok.com/@' + v.videoAuthor + '?/');

// 		if (!isEmpty(v.videoHash)){
// 			for(let hash in v.videoHash){
// 				$("[data-pg='"+currPage+"'] [data-shash='"+j+"']").find("p").append("<a href='"+"https://tiktok.com/tags/"+v.videoHash[hash].substr(1)+"'>"+v.videoHash[hash]+"</a>");
// 			}
// 		} else {
// 			$("[data-pg='"+currPage+"'] [data-shash='"+j+"']").text("");
// 		}

// 		$("[data-pg='"+currPage+"'] [data-slink='"+j+"']").attr('href', 'https://tiktok.com/@' + v.videoAuthor + '?/');
// 	}
			
//     return true;
// }