<?php
  require("../side/service.class.php");
  $listener = new Listeners();
  $tables = $listener->getColsFromTable(); //used for select

	$addForm = "<div>
	    		  Table:
				  <input type='text' id='queryTable'>
				  SQL SELECT Command:
				  <textarea width='250' height='50' id='selectQuery'></textarea>
				  <button onclick='selectMainQuery($(\"#selectQuery\").val(), $(\"#queryTable\").val())'>RUN</button>
				</div>";
	$addForm = "<div id='addForm' class='container'>
  <div class='row'>
    <div class='col s12 m6 offset-m3'>
      <div class='card'>
      	<i class='material-icons right cursor' onclick='$(\"#addForm\").remove()'>close</i>
        <div class='card-content center'>
          <span class='card-title black-text'>SQL SELECT Command</span>
            <div class='row'>
              <div class='input-field col s12'>
                <textarea id='selectQuery' class='materialize-textarea'></textarea>
          		  <label for='selectQuery'>Command</label>
              </div>
            </div>

            <div class='row'>
            	<div class='input-field col s12'>
          			<input type='button' onclick='selectMainQuery($(\"#selectQuery\").val())' class='btn' value='Run'>
          		</div>
          	</div>
        </div>
      </div>
    </div>
  </div>
</div>";

  #------------------------------------------------------------------------------------

  $script = "<script>
        var rows = 0;
        function setRow(num){
          if(num == 1){
            rows += 1;
            var string = '<div id=\"row\">#' + rows + ' Column Name:<input type=\"text\" name=\"colName' + rows + '\">Type: <select name=\"type' + rows + '\"><option value=\"INT\">INT</option><option value=\"VARCHAR\">VARCHAR</option><option value=\"FLOAT\">FLOAT</option><option value=\"TEXT\">TEXT</option><option value=\"DATE\">DATE</option></select> Length: <input class=\"parLen\" type=\"number\" name=\"len' + rows + '\" value=\"1\"> NULL: <input type=\"checkbox\" name=\"null' + rows + '\"> A_I: <input type=\"checkbox\" name=\"ai' + rows + '\"> KEY? <input type=\"radio\" name=\"key\" value=\"' + rows + '\"></div>';
            var string = '<div><div class=\"row\"><div class=\"input-field col s12\"><input name=\"colName' + rows + '\" id=\"colName' + rows + '\" type=\"text\"><label for=\"colName' + rows + '\">#' + rows + ' Column Name</label></div></div><div class=\"row\"><select name=\"type' + rows + '\"><option value=\"INT\" selected>INT</option><option value=\"VARCHAR\">VARCHAR</option><option value=\"FLOAT\">FLOAT</option><option value=\"TEXT\">TEXT</option><option value=\"DATE\">DATE</option></select></div><div class=\"row\"><div class=\"input-field col s12\"><input name=\"len' + rows + '\" id=\"parLen' + rows + '\" type=\"number\" value=\"1\"><label for=\"parLen' + rows + '\">Length</label></div></div><div class=\"row\"><div class=\"input-field col s3\"><input type=\"checkbox\" name=\"null' + rows + '\" id=\"null' + rows + '\"><label for=\"null' + rows + '\">NULL</label></div><div class=\"input-field col s3\"><input type=\"checkbox\" name=\"ai' + rows + '\" id=\"ai' + rows + '\"><label for=\"ai' + rows + '\">A_I</label></div><div class=\"input-field col s5\"><input type=\"radio\" name=\"key\" id=\"key' + rows + '\" value=\"' + rows + '\"><label for=\"key' + rows + '\">PRIMARY KEY?</label></div></div><hr><hr><hr></div>';

            $('#body').append(string);
            Materialize.updateTextFields();
          } else {
            rows -= 1;
            if(rows < 0){
              rows = 0;
            }
            var setRows = document.getElementById('body');
              setRows.removeChild(setRows.lastChild);
          }

          $('#length').val(rows);
        }
         </script>";

  $addForm = "<form id='addTable' action='mysql/service_main_add_table.php' method='post'>
        Table Name:
        <input type='text' name='tableName'>
        <div id='rows'></div>
        <input type='hidden' id='length' name='length' value='0'>
        <input type='button' style='float:left' onclick='setRow(-1)' value='Remove'>
        <input type='button' style='float:right' onclick='setRow(1)' value='Add'>
        <input type='submit' value='Create'>
        </form>";

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