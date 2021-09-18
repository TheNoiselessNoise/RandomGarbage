<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Music</title>
	<script src="./js/libs/jquery.min.js"></script>
	<script src="./js/libs/jquery-ui.min.js"></script>
	<script src="./js/libs/globals.js"></script>
	<script src="./js/libs/attributes.js"></script>
	<script src="./js/libs/block.js"></script>
	<script src="./js/libs/datablock.js"></script>
	<script src="./js/init.js"></script>
	<link rel="stylesheet" href="css/main.css">
</head>
<body>

	<!-- TODO: Maybe make it as PHP and then to blocks nav-link-* get_contents of *.html -->
	<!-- TODO: Make a global object that will hold info about created variables etc. -->
	<!-- TODO: Make forms for creating and deleting variable -->

	<!-- TODO: Make a button in functions tabs for creating a new function -->
	<!-- TODO: On dblclick on user-function replace right-view with contents of a function -->
	<!-- TODO: When in user-function make a back button to return to default on page load event -->

	<div id="forms">
		<form class="create-var">
			<h2>Add new variable</h2>

			<div class="var-type">
				<label for="var-boolean">
					<input type="radio" name="var-type" id="var-boolean" data-id="boolean">
					Boolean
				</label>
				<label for="var-number">
					<input type="radio" name="var-type" id="var-number" data-id="number" checked>
					Number
				</label>
				<label for="var-string">
					<input type="radio" name="var-type" id="var-string" data-id="string">
					String
				</label>
				<label for="var-map">
					<input type="radio" name="var-type" id="var-map" data-id="map">
					Map
				</label>
			</div>

			<input type="text" class="var-name" placeholder="Enter variable name">

			<div class="form-control">
				<button class="cancel">Cancel</button>
				<button class="add">Add</button>
			</div>
		</form>
	</div>

	<div id="wrapper">
		<div id="left-side">
			<div id="trashbin"></div>

			<div id="nav-blocks">
				<a href="#" class="orange active" nav-link="vars">variable</a>
				<a href="#" class="red" nav-link="list">list</a>
				<a href="#" class="yellow" nav-link="control">control</a>
				<a href="#" class="green" nav-link="operator">operator</a>
				<a href="#" class="turquoise" nav-link="math">math</a>
				<a href="#" class="purple" nav-link="funcs">functions</a>
			</div>
			<div id="blocks">

				<?php
					foreach(glob("./blocks/blocks_*.html") as $f){
						$x = explode("_", $f)[1];
						$name = explode(".", $x)[0];
						$fcontent = file_get_contents($f);
						echo "<div class=\"nav-link-${name}\">${fcontent}</div>";
					}
				?>

			</div>
		</div>
		<div id="right-side">
			<div id="code">

				<div class="block" data-id="event" data-value="window.onload">
					<div class="start-block" style="">
						<span class="block-text">on page load</span>
					</div>

					<div class="inner-blocks ui-sortable">
						<div class="block active" data-id="if">
						    <div class="start-block">
						        <span class="block-text">if</span>
						        <div class="attrs">
						            <div class="attr" data-what="boolean" style="background: rgb(218, 218, 218);">
						            	<div class="data-block active" data-id="boolean" data-type="lt">
										    <div class="attrs">
										        <div class="attr" data-what="number" style="background: rgb(218, 218, 218);">
										        	<div class="data-block active" data-id="number" data-type="string-length">
													    <div class="attrs">
													        <span class="block-text">length of</span>

													        <div class="attr" data-what="string">
								        					</div>
								    					</div>
													</div>
												</div>

										        <span class="block-text">&lt;</span>

										        <div class="attr" data-what="number">
				        						</div>
				    						</div>
										</div>
									</div>
					        	</div>
					    	</div>

					    	<div class="inner-blocks ui-sortable">

						    </div>

						    <div class="end-block"></div>
						</div>
					</div>

					<div class="end-block"></div>
				</div>

			</div>
		</div>
	</div>
	<!--
		Two types of blocks
		BLOCK: EVENTS, CONTROLS - Blocks that have start and/or middle (like if-else) and end
		DATA-BLOCK: one-line block

		BLOCK: Attributes should be in start-block and block-text can be out of attributes
		DATA-BLOCK: Does not have start-block, only attributes, text should be in attributes
	-->
<!--	<div class="block" data-id="event" data-value="window.onload">-->
<!--		<div class="start-block">-->
<!--			<span class="block-text">on page load</span>-->
<!--		</div>-->

<!--		<div class="inner-blocks">-->
<!--			<div class="row">-->
<!--				<div class="block" data-id="if">-->
<!--					<div class="start-block">-->
<!--						<span class="block-text">if</span>-->
<!--						<div class="attrs">-->
<!--							<div class="attr" data-what="boolean">-->
<!--								<div class="data-block" data-id="boolean" data-type="lt">-->
<!--									<div class="attrs">-->
<!--										<div class="attr" data-what="number">-->
<!--											<div class="data-block" data-id="var-number" data-name="my_var_number">my_var_number</div>-->
<!--										</div>-->

<!--										<span class="block-text">&lt;</span>-->

<!--										<div class="attr" data-what="number">-->
<!--											<div class="data-block" data-id="var-number" data-name="my_var_number">my_var_number</div>-->
<!--										</div>-->
<!--									</div>-->
<!--								</div>-->
<!--							</div>-->
<!--						</div>-->
<!--					</div>-->

<!--					<div class="inner-blocks">-->
<!--						<div class="data-block" data-id="function" data-value="prompt">-->
<!--							<div class="attrs">-->
<!--								<span class="block-text">prompt</span>-->

<!--								<div class="attr" data-what="string">-->
<!--									<sup class="attr-text">message</sup>-->
<!--									<div class="data-block" data-id="var-string" data-name="my_var_string">my_var_string</div>-->
<!--								</div>-->

<!--								<div class="attr" data-what="string">-->
<!--									<sup class="attr-text">defaultValue</sup>-->
<!--									<div class="data-block" data-id="var-string" data-name="my_var_string">my_var_string</div>-->
<!--								</div>-->
<!--							</div>-->
<!--						</div>-->
<!--						<div class="data-block" data-id="function" data-value="prompt">-->
<!--							<div class="attrs">-->
<!--								<span class="block-text">prompt</span>-->

<!--								<div class="attr" data-what="string">-->
<!--									<sup class="attr-text">message</sup>-->
<!--									<div class="data-block" data-id="var-string" data-name="my_var_string">my_var_string</div>-->
<!--								</div>-->

<!--								<div class="attr" data-what="string">-->
<!--									<sup class="attr-text">defaultValue</sup>-->
<!--									<div class="data-block" data-id="var-string" data-name="my_var_string">my_var_string</div>-->
<!--								</div>-->
<!--							</div>-->
<!--						</div>-->
<!--					</div>-->

<!--					<div class="end-block"></div>-->
<!--				</div>-->
<!--			</div>-->
<!--		</div>-->

<!--		<div class="end-block"></div>-->
<!--	</div>-->

</body>
</html>