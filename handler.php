<?php

if (isset($_POST['video']) && isset($_POST['amount'])) {

	require 'vendor/autoload.php';
	$api = new \Sovit\TikTok\Api(array(
		"user-agent"     => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36',
		"proxy-host"     => false,
		"proxy-port"     => false,
		"proxy-username" => false,
		"proxy-password" => false,
		"cache-timeout"  => 3600, // 1 hours cache timeout
		"cookie_file"  => sys_get_temp_dir() . 'tiktok.txt' // cookie file, necessary for trending feed
	), $cache_engine = false);

	error_reporting(0);

	$arr = $api->getTrendingFeed((int) $_POST['amount']);

	usort($arr, function ($a, $b) {
		return ($a->stats->playCount - $b->stats->playCount);
	});

	// print_r($arr);
	// echo $api->getVideoByUrl();

	// Распознавание
	// $arr = file_get_contents('https://api.audd.io/?api_token=2c84115434fe2bf749dfc778d13a2c68&url=https://sf16-sg.tiktokcdn.com/obj/tiktok-obj/e23a18fca259ad56165d59f6179e0898.mp3');

	// echo "</pre>";

	$video = array();

	foreach ($arr as $key1 => $value) {
		foreach ($value as $key2 => $value_2) {

			$views = str_split($value_2->stats->playCount);
			$newViews = $value_2->stats->playCount;

			if(count($views) >= 4 && count($views) < 7) {
				$newViews = '';
				for ($i=0; $i < count($views) - 3; $i++) { 
					$newViews .= $views[$i];
				}
				$newViews .= 'К';
			} elseif(count($views) >= 7) {
				$newViews = '';
				for ($i=0; $i < count($views) - 6; $i++) { 
					$newViews .= $views[$i];
				}
				$newViews .= 'M';
			}

			// вычленяем #
			$resStr = "";
			$hashArr = array();
			$descStr = $value_2->desc;
			$pos = strpos($descStr, "#");
			$descStr = str_split($descStr);
			if($pos !== false){
				for($i = $pos; $i < count($descStr); $i++){
					$resStr .= $descStr[$i];
				}
				$hashArr = explode(' ', $resStr);
			}
			

			//

			$video[$key2]['videoLink'] = $value_2->video->playAddr;
			$video[$key2]['videoViews'] = $newViews;
			$video[$key2]['videoLikes'] = $value_2->stats->diggCount;
			$video[$key2]['videoHash'] = $hashArr;
			$video[$key2]['videoAuthor'] = $value_2->author->uniqueId;
			$video[$key2]['videoId'] = $value_2->id;
			$video[$key2]['originCover'] = $value_2->video->originCover;
		}
	}

	usort($video, function($a, $b){
		return ($b['videoViews'] - $a['videoViews']);
	});

	echo json_encode($video);

	// echo "<pre>";
	// print_r($arr);
	// print_r($video);

}
