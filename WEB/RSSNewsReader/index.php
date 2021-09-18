<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>notMy news</title>
	<style>
		* {
			padding: 0;
			margin: 0;

			transition: all ease-in-out .2s;
		}

		#wrapper {
			display: flex;
		}

		.channel {
			flex: 1 1 1em;
		}

		.channel:not(:first-child){
			border-left: 3px solid #4F4F4F;
		}

		.channel > a {
			display: block;
			margin: 3vh 0;
		}

		.channel > a > h3 {
			text-align: center;
		}

		.channel .news {

		}

		.channel .news > a {
			display: block;
		  	background: #4f4f4f;
		  	color: #fff;
		  	text-decoration: none;
		}

		.channel .news > a:not(:first-child){
			margin: 3vh 0 0 0;
		}

		.channel .news > a > * {
			display: block;
			text-align: center;
			padding: 1.5vh 0;
		}

		.channel .news > a > *:first-child {
			border-bottom: 2px dashed #afafaf;
		}
		
		.channel .news > a:hover {
			background: #dbdbdb;
			color: #000;
		}
	</style>
</head>
<body>
	<?php

		$urls = [
			"https://www.hackerone.com/blog.rss",
			// yes, you can add another
		];

		$div = "<div id='wrapper'>";
		foreach($urls as $url){
			$div .= "<div class='channel'>";

			$content = file_get_contents($url);
			$xml = new SimpleXMLElement($content);

			$channel = $xml->channel[0];
			$chtitle = $channel->title[0];
			$chdesc = $channel->description[0];
			$chlink = $channel->link[0];

			$div .= "<a href='${chlink}'>
						<h3>${chtitle}</h3>
					</a>";

			$items = $channel->item;
			$div .= "<div class='news'>";
			foreach($items as $item){
				$ititle = $item->title[0];
				$idesc = $item->description[0];
				$ilink = $item->link[0];
				$ipubdate = $item->pubDate[0];

				$dt = date("d. m. Y H:i:s", strtotime($ipubdate));

				$div .= "<a href='${ilink}' target='_blank'>
							<span class='title'>${ititle}</span>
							<span class='description'>${idesc}</span>
							<span class='date'>${dt}</span>
						</a>";
			}

			$div .= "</div></div>";
		}

		echo $div . "</div>";

	?>
</body>
</html>