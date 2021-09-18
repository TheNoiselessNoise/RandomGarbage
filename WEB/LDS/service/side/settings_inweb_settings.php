<?php		
	if(!isset($_SESSION)){
		session_start();
	}

	$red = "rgba(255, 0, 0, 0.2)";
	$green = "rgba(0, 255, 0, 0.2)";
	echo "<li style='background:" . ($_SESSION['s_is_mobile'] == 'true' ? $green : $red) . "'><label for='s_is_mobile' class='cursor'>Mobile version</label><input type='checkbox' id='s_is_mobile' onclick='setSettings(\"s_is_mobile\", this.checked)'" . ($_SESSION['s_is_mobile'] == 'true' ? 'checked' : '') . "></li>";

	echo "<li style='background:" . ($_SESSION['s_show_col_types'] == 'true' ? $green : $red) . "'><label for='s_show_col_types' class='cursor'>Show column types</label><input type='checkbox' id='s_show_col_types' onclick='setSettings(\"s_show_col_types\", this.checked)'" . ($_SESSION['s_show_col_types'] == 'true' ? 'checked' : '') . "></li>";

	echo "<li style='background:" . ($_SESSION['s_hover_styles'] == 'true' ? $green : $red) . "'><label for='s_hover_styles' class='cursor'>Table Highlighting</label><input type='checkbox' id='s_hover_styles' onclick='setSettings(\"s_hover_styles\", this.checked)'" . ($_SESSION['s_hover_styles'] == 'true' ? 'checked' : '') . "></li>";

	echo "<li style='background:" . ($_SESSION['s_overflow_styles'] == 'true' ? $green : $red) . "'><label for='s_overflow_styles' class='cursor'>Limit table display</label><input type='checkbox' id='s_overflow_styles' onclick='setSettings(\"s_overflow_styles\", this.checked)'" . ($_SESSION['s_overflow_styles'] == 'true' ? 'checked' : '') . "></li><hr>";

	# ----- DELETING
	if($_SESSION["can_delete"] == "1"){
		echo "<li><h5 class='center'>Deleting</h5></li>
			  <li onclick='deleteDatabase()'><i class='material-icons prefix' style='vertical-align: middle'>cloud</i> " . $_SESSION["db"] . "</li>";

		if($_SESSION["current_table"] != ""){
			echo "<li onclick='deleteTable()'><i class='material-icons prefix' style='vertical-align: middle'>view_list</i> " . $_SESSION["current_table"] . "</li>";
		} else {
			echo "<li onclick='selectTable()'><i class='material-icons prefix' style='vertical-align: middle'>view_list</i> Delete a table</li>";
		}

		echo "<hr>";
	}

	# ----- LIMITING

	echo "<li><h5 class='center'>Limiting</h5></li>
		  <li>From:<input type='number' min='0' onchange='setSettings(\"s_data_limit_from\", this.value)' value='" . $_SESSION["s_data_limit_from"] . "'></li>
		  <li>To:<input type='number' min='0' onchange='setSettings(\"s_data_limit_to\", this.value)' value='" . $_SESSION["s_data_limit_to"] . "'></li>
		  <li>[0, 0] - From first to last</li>";

	if($_SESSION["can_add"] == "1"){
		echo "<hr><li class='section'><h5 class='center'>Adding</h5></li>
			  <li onclick='addDatabase()'>Database <i class='fa fa-plus-square' aria-hidden='true'></i></li>
		  	  <li onclick='addTable()'>Table <i class='fa fa-plus-square' aria-hidden='true'></i></li>
		  	  <li onclick='addQuery()'>SQL INSERT Command <i class='fa fa-pencil' aria-hidden='true'></i></li>
		  	  <li onclick='selectQuery()'>SQL SELECT Command <i class='fa fa-pencil' aria-hidden='true'></i></li>";
	}
?>