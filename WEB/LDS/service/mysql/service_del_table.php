<?php
  require("../side/service.class.php");
  $listener = new Listeners();

	$addForm = "<div id='addForm' class='container'>
  <div class='row'>
    <div class='col s12 m6 offset-m3'>
      <div class='card'>
        <i class='material-icons right cursor' onclick='$(\"#addForm\").remove()'>close</i>
        <div class='card-content center'>
          <span class='card-title black-text'>Select table to delete</span>
          <form action='mysql/service_main_del_table.php' method='post'>
            <div class='row'>
              <div class='input-field col s12'>
                <select class='browser-default ui-color-a-2' name='table'>
                  " . $listener->getAllTables() . "
                </select>
              </div>
            <div class='row'>
              <div class='input-field col s12'>
                <input type='submit' class='btn' value='Delete'>
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