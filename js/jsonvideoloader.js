var videos = [];
var currPage = 0;
var isLoaded = false;
var vidAmount = 0;
var clearFix = $("#clearfix");
var vidCnt = 0;
var videoCount = 0;
var prevId = 1;

var maxPage = 29;


var animationpl = [];


$(document).ready(() => {
	
	initialPageBuild();

	loadVideos(12);
	setTimeout( loadVideos(85), 1000);
});






function loadVideos(amnt) {
	amnt += 2;
    $.ajax({
        type: "POST",
        url: "handler.php",
        data: {
			video: true,
			amount: amnt,
        },
        success: function (response) {
            let newVideos = JSON.parse(response);
            console.log("Videos loaded successfully!");
			

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

			console.log(videos);

			
			for(let i = 0; i < amnt / 3 - 1; i++){
				if(!buildNextPage()) break;
			}


			// Управление видео

			for(let vidos of document.body.getElementsByTagName('video')){
				vidos.addEventListener('playing', function(){
					let id = this.dataset.id;
					if(id !== prevId){
						var volume = $('body video[data-id="'+prevId+'"')[0].volume;
						var muted = $('body video[data-id="'+prevId+'"')[0].muted;
						$('body video[data-id="'+id+'"')[0].volume = volume;
						$('body video[data-id="'+id+'"')[0].muted = muted;
					}
					
					prevId = id;

					$('body video').each(function() {
					if ($(this).data('id') != id) {
						$(this).trigger('pause');
					}
			})})};


        },
        error: function (responce) {
            console.log("Video loading failed! Ne supper!");
        }
    });
}







// Строим секции для fullpage
function initialPageBuild(){

	for(let i = 1; i <= maxPage; ++i){
		let isGray = '';
		if(i%2==0) isGray = 'gray';
		$('#fullpage').append("<div class='section trends-videos "+isGray+"' data-pg='"+i+"'>" +
								"<div class='container'>" +
									"<div class='trends-videos__inner' data-page='" + i + "'>");
		
		$("[data-pg='"+i+"']").hide();

		for (let id = (i - 1) * 3; id < i * 3; id++) {
			videoCount++;
			// 
			$("[data-page='" + i + "']").append(
			"<div class='trends-videos__item'>" +
				"<video data-vid='"+ (id%3) +"' data-id='"+ videoCount +"' src='' controls></video>" + // src
					"<div class='video-info'>" +
						"<div class='views__inner'>" +
							"<p class='views-word'><span class='views_amount'>Просмотры:</span></p>" +
							"<span data-views='"+ (id%3) +"' class='views_amount'></span>" + //text
						"</div>" +
							"<p data-hash='"+ (id%3) +"' class='hashtags>'" +
							"</p>" +
					"</div>" +
                    


						"<div class='active'>" +
							"<div class='likes-views'>" +
								"<div class='likes'>" +
									"<img src='images/like.svg'>" +
									"<span data-slikes ='"+(id%3)+"' class='active-span'>" +
									"</span>" +
								"</div>" +
								"<div class='views'>" +
									"<img src='images/view.svg'>" +
									"<span data-sviews ='"+(id%3)+"' class='active-span'>" +
									"</span>" +
								"</div>" +
							"</div>" +
	
							"<div class='subscribe'>" +
								"<span style='display: block'>" +
									"Подписаться на автора" +
								"</span>" +
								"<a data-sauthor ='"+(id%3)+"' class='author_link' href='#'></a>" +
							"</div>" +
	
							"<div data-shash ='"+(id%3)+"' class='hashtags_active'>" +
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
								"<a data-slink ='"+(id%3)+"' class='open-tt' href='#'>" +
									"Открыть в Тик Ток" +
								"</a>" +
							"</div>" +

						
						"</div>" +

						"<div class='plashka' id='plashka"+videoCount+"' style='width: 100%;height: 100%'>" +
									

						"</div>" +

						"<div class='plashka__piece'>" +
								
						"</div>" +
				"</div>");




			//


		   animationpl[videoCount] = bodymovin.loadAnimation({
			    container: document.getElementById('plashka'+videoCount), // Required
			    path: 'images/pl.json', // Required
			    renderer: 'svg', // Required
			    loop: false, // Optional
			    autoplay: false, // Optional
			    // name: "Hello World", // Name for future reference. Optional.
		  }) 
		}


		$('#fullpage').append("</div></div></div>");
	}

	$("#fullpage").append('<div class="section trends-videos" id="clearfix"></div>');

	$('#fullpage').fullpage({
		//options here
		
		scrollHorizontally: true,

		lazyLoading: true,
			//Скроллинг

		//Доступ
		keyboardScrolling: true,
		animateAnchor: true,
		recordHistory: true,
			// parallax: true,
			// anchors: ['section1']
	});

}

// Добавление инфы в html

function buildNextPage() {

	currPage++;
	if(currPage > maxPage || currPage * 3 >= videos.length) return false;
	
	$("[data-pg='"+ currPage +"']").show();

	for(let j = 0; j < 3; j++){
		let v = videos[(currPage - 1) * 3 + j];
		$("[data-pg='"+currPage+"'] [data-vid='"+j+"']").attr("src", v.videoLink);
		$("[data-pg='"+currPage+"'] [data-views='"+j+"']").text(v.videoViews);

		for(let hash in v.videoHash){
			$("[data-pg='"+currPage+"'] [data-hash='"+j+"']").append("<a href='#'>"+v.videoHash[hash]+"</a>");
		}
		
		$("[data-pg='"+currPage+"'] [data-sviews='"+j+"']").text(v.videoViews);
		$("[data-pg='"+currPage+"'] [data-slikes='"+j+"']").text(v.videoLikes);
		$("[data-pg='"+currPage+"'] [data-sauthor='"+j+"']").text("@"+v.videoAuthor);
		$("[data-pg='"+currPage+"'] [data-sauthor='"+j+"']").attr('href', 'https://tiktok.com/@' + v.videoAuthor + '?/');

		if (!isEmpty(v.videoHash)){
			for(let hash in v.videoHash){
				$("[data-pg='"+currPage+"'] [data-shash='"+j+"']").find("p").append("<a href='"+"https://tiktok.com/tags/"+v.videoHash[hash].substr(1)+"'>"+v.videoHash[hash]+"</a>");
			}
		} else {
			$("[data-pg='"+currPage+"'] [data-shash='"+j+"']").text("");
		}

		$("[data-pg='"+currPage+"'] [data-slink='"+j+"']").attr('href', 'https://tiktok.com/@' + v.videoAuthor + '?/');
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


/* 

<div class="section trends-videos">
			<!-- <div class="trends-line">
		
				<div class="container">
					<img src="images/main-bg.png">
					<p id="scroll">
						Тренды Тик Ток
					</p>
				</div>
			</div> -->
			<div class="container">
				<div class="trends-videos__inner">
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1000000</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video style="filter: blur(5px);" src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						
						<div class="active">
							<div class="likes-views">
								<div class="likes">
									<img src="images/like.svg">
									<span class="active-span">
										2M
									</span>
								</div>
								<div class="views">
									<img src="images/view.svg">
									<span class="active-span">
										1K
									</span>
								</div>
							</div>
	
							<div class="subscribe">
								<span style="display: block">
									Подписаться на автора
								</span>
								<a class="author_link" href="#">@natasha-natasha</a>
							</div>
	
							<div class="hashtags_active">
								<span>
									Хештеги
								</span>
								<p class="hashtags-active"><a href="#">#Описание#описание#описание#описание</a>
							</div>
	
							<div class="listen-music">
								<p>
									Слушать трек из видео тут:
								</p>
								<div class="social-buttons">
									<a class="scl_btn" href="#"><img src="images/spotify.svg"></a>
									<a class="scl_btn" href="#"><img src="images/google-music.svg"></a>
									<a class="scl_btn" href="#"><img src="images/yandex-music.svg"></a>
								</div>
							</div>
							<div class="open-active"> 
								<a class="open-tt" href="#">
									Открыть в Тик Ток
								</a>
							</div>
							
						</div>
					</div>
					<div class="trends-videos__item">
						<video  src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1М</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
						
					</div>
				</div>
			</div>
		</div>
	
		<div class="section trends-videos" id="section1">
			<div class="container">
				<div class="trends-videos__inner">
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1000000</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1М</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video style="filter: blur(5px);" src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
	
						<div class="active">
							<div class="likes-views">
								<div class="likes">
									<img src="images/like.svg">
									<span class="active-span">
										2M
									</span>
								</div>
								<div class="views">
									<img src="images/view.svg">
									<span class="active-span">
										1K
									</span>
								</div>
							</div>
	
							<div class="subscribe">
								<span style="display: block">
									Подписаться на автора
								</span>
								<a class="author_link" href="#">@natasha-natasha</a>
							</div>
	
							<div class="hashtags_active">
								<span>
									Хештеги
								</span>
								<p class="hashtags-active"><a href="#">#Описание#описание#описание#описание</a>
							</div>
	
							<div class="listen-music">
								<p>
									Слушать трек из видео тут:
								</p>
								<div class="social-buttons">
									<a class="scl_btn" href="#"><img src="images/spotify.svg"></a>
									<a class="scl_btn" href="#"><img src="images/google-music.svg"></a>
									<a class="scl_btn" href="#"><img src="images/yandex-music.svg"></a>
								</div>
							</div>
							<div class="open-active"> 
								<a class="open-tt" href="#">
									Открыть в Тик Ток
								</a>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>



		<div class="section trends-videos">
			<div class="container">
				<div class="trends-videos__inner">
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1000000</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1М</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video style="filter: blur(5px);" src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
	
						<div class="active">
							<div class="likes-views">
								<div class="likes">
									<img src="images/like.svg">
									<span class="active-span">
										2M
									</span>
								</div>
								<div class="views">
									<img src="images/view.svg">
									<span class="active-span">
										1K
									</span>
								</div>
							</div>
	
							<div class="subscribe">
								<span style="display: block">
									Подписаться на автора
								</span>
								<a class="author_link" href="#">@natasha-natasha</a>
							</div>
	
							<div class="hashtags_active">
								<span>
									Хештеги
								</span>
								<p class="hashtags-active"><a href="#">#Описание#описание#описание#описание</a>
							</div>
	
							<div class="listen-music">
								<p>
									Слушать трек из видео тут:
								</p>
								<div class="social-buttons">
									<a class="scl_btn" href="#"><img src="images/spotify.svg"></a>
									<a class="scl_btn" href="#"><img src="images/google-music.svg"></a>
									<a class="scl_btn" href="#"><img src="images/yandex-music.svg"></a>
								</div>
							</div>
							<div class="open-active"> 
								<a class="open-tt" href="#">
									Открыть в Тик Ток
								</a>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>


		<div class="section trends-videos">
			<div class="container">
				<div class="trends-videos__inner">
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1000000</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1М</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video style="filter: blur(5px);" src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
	
						<div class="active">
							<div class="likes-views">
								<div class="likes">
									<img src="images/like.svg">
									<span class="active-span">
										2M
									</span>
								</div>
								<div class="views">
									<img src="images/view.svg">
									<span class="active-span">
										1K
									</span>
								</div>
							</div>
	
							<div class="subscribe">
								<span style="display: block">
									Подписаться на автора
								</span>
								<a class="author_link" href="#">@natasha-natasha</a>
							</div>
	
							<div class="hashtags_active">
								<span>
									Хештеги
								</span>
								<p class="hashtags-active"><a href="#">#Описание#описание#описание#описание</a>
							</div>
	
							<div class="listen-music">
								<p>
									Слушать трек из видео тут:
								</p>
								<div class="social-buttons">
									<a class="scl_btn" href="#"><img src="images/spotify.svg"></a>
									<a class="scl_btn" href="#"><img src="images/google-music.svg"></a>
									<a class="scl_btn" href="#"><img src="images/yandex-music.svg"></a>
								</div>
							</div>
							<div class="open-active"> 
								<a class="open-tt" href="#">
									Открыть в Тик Ток
								</a>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="section trends-videos">
			<div class="container">
				<div class="trends-videos__inner">
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1000000</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1М</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video style="filter: blur(5px);" src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
	
						<div class="active">
							<div class="likes-views">
								<div class="likes">
									<img src="images/like.svg">
									<span class="active-span">
										2M
									</span>
								</div>
								<div class="views">
									<img src="images/view.svg">
									<span class="active-span">
										1K
									</span>
								</div>
							</div>
	
							<div class="subscribe">
								<span style="display: block">
									Подписаться на автора
								</span>
								<a class="author_link" href="#">@natasha-natasha</a>
							</div>
	
							<div class="hashtags_active">
								<span>
									Хештеги
								</span>
								<p class="hashtags-active"><a href="#">#Описание#описание#описание#описание</a>
							</div>
	
							<div class="listen-music">
								<p>
									Слушать трек из видео тут:
								</p>
								<div class="social-buttons">
									<a class="scl_btn" href="#"><img src="images/spotify.svg"></a>
									<a class="scl_btn" href="#"><img src="images/google-music.svg"></a>
									<a class="scl_btn" href="#"><img src="images/yandex-music.svg"></a>
								</div>
							</div>
							<div class="open-active"> 
								<a class="open-tt" href="#">
									Открыть в Тик Ток
								</a>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="section trends-videos">
			<div class="container">
				<div class="trends-videos__inner">
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1000000</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1М</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video style="filter: blur(5px);" src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
	
						<div class="active">
							<div class="likes-views">
								<div class="likes">
									<img src="images/like.svg">
									<span class="active-span">
										2M
									</span>
								</div>
								<div class="views">
									<img src="images/view.svg">
									<span class="active-span">
										1K
									</span>
								</div>
							</div>
	
							<div class="subscribe">
								<span style="display: block">
									Подписаться на автора
								</span>
								<a class="author_link" href="#">@natasha-natasha</a>
							</div>
	
							<div class="hashtags_active">
								<span>
									Хештеги
								</span>
								<p class="hashtags-active"><a href="#">#Описание#описание#описание#описание</a>
							</div>
	
							<div class="listen-music">
								<p>
									Слушать трек из видео тут:
								</p>
								<div class="social-buttons">
									<a class="scl_btn" href="#"><img src="images/spotify.svg"></a>
									<a class="scl_btn" href="#"><img src="images/google-music.svg"></a>
									<a class="scl_btn" href="#"><img src="images/yandex-music.svg"></a>
								</div>
							</div>
							<div class="open-active"> 
								<a class="open-tt" href="#">
									Открыть в Тик Ток
								</a>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="section trends-videos">
			<div class="container">
				<div class="trends-videos__inner">
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1000000</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1М</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video style="filter: blur(5px);" src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
	
						<div class="active">
							<div class="likes-views">
								<div class="likes">
									<img src="images/like.svg">
									<span class="active-span">
										2M
									</span>
								</div>
								<div class="views">
									<img src="images/view.svg">
									<span class="active-span">
										1K
									</span>
								</div>
							</div>
	
							<div class="subscribe">
								<span style="display: block">
									Подписаться на автора
								</span>
								<a class="author_link" href="#">@natasha-natasha</a>
							</div>
	
							<div class="hashtags_active">
								<span>
									Хештеги
								</span>
								<p class="hashtags-active"><a href="#">#Описание#описание#описание#описание</a>
							</div>
	
							<div class="listen-music">
								<p>
									Слушать трек из видео тут:
								</p>
								<div class="social-buttons">
									<a class="scl_btn" href="#"><img src="images/spotify.svg"></a>
									<a class="scl_btn" href="#"><img src="images/google-music.svg"></a>
									<a class="scl_btn" href="#"><img src="images/yandex-music.svg"></a>
								</div>
							</div>
							<div class="open-active"> 
								<a class="open-tt" href="#">
									Открыть в Тик Ток
								</a>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="section trends-videos">
			<div class="container">
				<div class="trends-videos__inner">
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1000000</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1М</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video style="filter: blur(5px);" src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
	
						<div class="active">
							<div class="likes-views">
								<div class="likes">
									<img src="images/like.svg">
									<span class="active-span">
										2M
									</span>
								</div>
								<div class="views">
									<img src="images/view.svg">
									<span class="active-span">
										1K
									</span>
								</div>
							</div>
	
							<div class="subscribe">
								<span style="display: block">
									Подписаться на автора
								</span>
								<a class="author_link" href="#">@natasha-natasha</a>
							</div>
	
							<div class="hashtags_active">
								<span>
									Хештеги
								</span>
								<p class="hashtags-active"><a href="#">#Описание#описание#описание#описание</a>
							</div>
	
							<div class="listen-music">
								<p>
									Слушать трек из видео тут:
								</p>
								<div class="social-buttons">
									<a class="scl_btn" href="#"><img src="images/spotify.svg"></a>
									<a class="scl_btn" href="#"><img src="images/google-music.svg"></a>
									<a class="scl_btn" href="#"><img src="images/yandex-music.svg"></a>
								</div>
							</div>
							<div class="open-active"> 
								<a class="open-tt" href="#">
									Открыть в Тик Ток
								</a>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="section trends-videos">
			<div class="container">
				<div class="trends-videos__inner">
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1000000</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
						<div class="video-info">
							<div class="views__inner">
								<p class="views-word">Просмотры:</p> <span class="views_amount">1М</span>
							</div>
							<p class="hashtags">
								<a href="#">
									#Описание#описание#описание#описание#Описание#описание#описание#описание#Описание#описание#описание#описание
								</a>
							</p>
						</div>
					</div>
					<div class="trends-videos__item">
						<video style="filter: blur(5px);" src="https://v58.tiktokcdn.com/video/tos/useast2a/tos-useast2a-pve-0068/0d949f936045477fa5d6db3c88a188bb/?VExpiration=1612227368&VSignature=Bus4tfbJMKPAzb05y81jBg&a=1233&br=2898&bt=1449&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202102011855530101901920203713C3BE&lr=tiktok_m&mime_type=video_mp4&pl=0&qs=0&rc=M3k4cnF4aWV4MzMzaTczM0ApZDc8NTczNGU7NzQ3NzlnN2dobC9vc241cjZgLS1fMTZzc2I1MjVgNjEyX2AzYmIxM2E6Yw%3D%3D&vl=&vr=" controls>
							
						</video>
	
						<div class="active">
							<div class="likes-views">
								<div class="likes">
									<img src="images/like.svg">
									<span class="active-span">
										2M
									</span>
								</div>
								<div class="views">
									<img src="images/view.svg">
									<span class="active-span">
										1K
									</span>
								</div>
							</div>
	
							<div class="subscribe">
								<span style="display: block">
									Подписаться на автора
								</span>
								<a class="author_link" href="#">@natasha-natasha</a>
							</div>
	
							<div class="hashtags_active">
								<span>
									Хештеги
								</span>
								<p class="hashtags-active"><a href="#">#Описание#описание#описание#описание</a>
							</div>
	
							<div class="listen-music">
								<p>
									Слушать трек из видео тут:
								</p>
								<div class="social-buttons">
									<a class="scl_btn" href="#"><img src="images/spotify.svg"></a>
									<a class="scl_btn" href="#"><img src="images/google-music.svg"></a>
									<a class="scl_btn" href="#"><img src="images/yandex-music.svg"></a>
								</div>
							</div>
							<div class="open-active"> 
								<a class="open-tt" href="#">
									Открыть в Тик Ток
								</a>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>



	
	


*/












