<?php
	$addForm = "<div id='addForm' class='container'>
  <div class='row'>
    <div class='col s12 m6 offset-m3'>
      <div class='card'>
        <i class='material-icons right cursor' onclick='$(\"#addForm\").remove()'>close</i>
        <div class='card-content center'>
          <span class='card-title black-text'>Create Database</span>
          <form action='mysql/service_main_add_database.php' method='post'>
            <div class='row'>
              <div class='input-field col s12'>
                <input id='addDatabase' type='text' name='addDatabase'>
                <label for='addDatabase'>Database name</label>
              </div>
            </div>
            <div class='row'>
              <div class='input-field col s12'>
                <input type='submit' class='btn' value='Create'>
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