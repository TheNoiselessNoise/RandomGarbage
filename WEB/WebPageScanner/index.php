<?php
	require("scanner.class.php");
	if(isset($_POST["url"])){
		$scanner = new Scanner($_POST["url"]);
		$scanner->webCrawler();
		$scanner->portScanner();
	}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>XYZT's Revolution Scanner</title>
	<link rel="stylesheet" href="scanner.css">
	<script src="jquery.min.js"></script>
	<script>
		$(document).ready(function(){
			$("input[type='radio']").on("click", function(){
				var attr = $(this).attr("id");
				var form = "";
				if(attr == "webcrawler"){
					form = "<h1>NOT WORKING YET</h1>";
				} else if(attr == "portscanner"){
					form = "<form method='post'>\
									<label for='portscanner_from'>From:\
										<input type='number' placeholder='(default)'>\
									</label>\
									<label for='portscanner_to'>To:\
										<input type='number' placeholder='(default)'>\
									</label>\
									<h1>NOT WORKING YET</h1>\
								</form>";
				} else if(attr == "wpscanner"){
					form = "<form method='post'>\
									<label for='wpscanner_location'>Default WP Location:\
										<input type='text' placeholder='(default) [/]'>\
									</label>\
									<label for='wpscanner_plugins'>Plugins Enumaration:\
										<input type='checkbox' name='wpscanner_plugins' id='wpscanner_plugins' placeholder='(default)'>\
									</label>\
									<h1>NOT WORKING YET</h1>\
								</form>";
				} else {
					$("#output").html("");
				}

				if(form != ""){
					$("#output").html(form);
				} else {
					$("#output").html("");
				}
			});
		});
	</script>
</head>
<body>
	<h1 id="theanknown">
		<span>XYZT</span>'s Scanner
	</h1>

	<form method="post" id="revolutionForm">
		<label for="url">
			<input type="text" id="url" name="url" placeholder=">URL<">
		</label>
		<div id="settings">
			<!-- <label for="webcrawler">Webcrawler
				<input type="radio" id="webcrawler" name="type" value="webcrawler">
			</label>
			<label for="portscanner">Port scanner
				<input type="radio" id="portscanner" name="type" value="portscanner">
			</label>
			<label for="wpscanner">WordPress Scanner
				<input type="radio" id="wpscanner" name="type" value="wpscanner">
			</label> -->
			<div id="output"></div>
		</div>
		<input type="submit" value="Scan">
	</form>

	<?php
		if(isset($_POST["url"])){
			echo $scanner->webCrawler_showResults();
			#echo $scanner->portScanner_showResults();
		}
	?>
</body>
</html>