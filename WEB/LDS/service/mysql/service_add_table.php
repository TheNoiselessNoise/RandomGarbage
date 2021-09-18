<?php
	$addForm = "<div id='addForm' class='container'>
  					<div class='row'>
    					<div class='col s12 m6 offset-m3'>
      						<div class='card'>
      							<i class='material-icons right cursor' onclick='$(\"#addForm\").remove()'>close</i>
        						<div class='card-content center'>
          							<span class='card-title black-text'>Create Table</span>
          							<form action='mysql/service_main_add_table.php' method='post' id='addTable'>
          								<input type='hidden' id='length' name='length' value='0'>
          								<div id='head'>
            								<div class='row'>
              									<div class='input-field col s12'>
                									<input id='tableName' type='text' name='tableName'>
                									<label for='tableName'>Table name</label>
              									</div>
            								</div>
            							</div>

            							<div id='body'>
            							</div>

										<div id='spec'>
											<div class='row'>
            									<div class='input-field col s12'>
          											<input type='button' onclick='setRow(1)' class='btn left' value='Add'>
          											<input type='button' onclick='setRow(-1)' class='btn right' value='Remove'>
          										</div>
          									</div>
          								</div>

           								<div id='foot'>
           									<div class='row'>
            									<div class='input-field col s12'>
          											<input type='submit' class='btn' value='Create'>
          										</div>
          									</div>
          								</div>
          							</form>
        						</div>
      						</div>
    					</div>
    				</div>
    			</div>";
	
	echo $addForm;
?>