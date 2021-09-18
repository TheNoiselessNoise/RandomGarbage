<?php
	$addForm = "<div id='addQuery' class='container'>
  <div class='row'>
    <div class='col s12 m6 offset-m3'>
      <div class='card'>
        <i class='material-icons right cursor' onclick='$(\"#addQuery\").remove()'>close</i>
        <div class='card-content center'>
          <span class='card-title black-text'>SQL INSERT Command</span>
          <form id='addQueryForm' action='mysql/service_main_add_query.php' method='post'>
            <div class='row'>
              <div class='input-field col s12'>
              	<textarea class='materialize-textarea' form='addQueryForm' id='query' name='addQuery'></textarea>
                <label for='query'>Command</label>
              </div>
            </div>
            <div class='row'>
              <div class='input-field col s12'>
                <input type='submit' class='btn' value='Run'>
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