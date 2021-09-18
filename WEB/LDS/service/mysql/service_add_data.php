<?php
	require("../side/connect.php");
	include_once("../side/settings.php");
	include_once("../side/service.class.php");
	$listener = new Listeners();

	if(!isset($_POST["table"])){
		#header("Location: ../service.php");
	} else {
		$table = htmlspecialchars($conn->real_escape_string($_POST["table"]));
		
		$colArray = $listener->getColsFromTable();
		$typeArray = $listener->getTypesOfCols();
		$length = $listener->getLengthOfCols();
		
		#------------------------------
		$resultAdd = "<div id='over_table'>
						<h3 class='center'>Adding:</h3>
						<form id='service_add_data' action='mysql/service_main_add_data.php' method='post'>
							<table class='" . ($_SESSION['s_is_mobile'] == 'true' ? "responsive-table striped" : "striped bordered") . "'>
								<tr><th colspan='" . ($length + 1) . "'>" . ucfirst($table) . "</th></tr>
								<tr><th>Column:</th>";
		
		for($i = 0; $i < $length; $i++){
			if($_SESSION["s_show_col_types"] == "true"){
				if($_SESSION["s_is_mobile"] == "true"){
					$resultAdd .= "<th><input type='text' readonly='readonly' value='" . $colArray[$i] . " [" . $typeArray[$i] . "]'></th>";
				} else {
					$resultAdd .= "<th>" . $colArray[$i] . " [" . $typeArray[$i] . "]</th>";
				}
			} else {
				if($_SESSION["s_is_mobile"] == "true"){
					$resultAdd .= "<th><input type='text' readonly='readonly' value='" . $colArray[$i] . "'></th>";
				} else {
					$resultAdd .= "<th>" . $colArray[$i] . "</th>";
				}
			}
		}
		$resultAdd .= "</tr><tr>";
		$resultAdd .= "<td>Adding: </td>";
			
		$j = 0;
		foreach($colArray as $val){
			$j += 1;
			if($val == $_SESSION["primary_keys"][$table]){
				$resultAdd .= "<td><input type='text' name='add" . $j . "' value='NULL' readonly='true'></td>";
			} else {
				$resultAdd .= "<td><input type='text' name='add" . $j . "' value=''></td>";
			}
		}
		$resultAdd .= "<input type='hidden' name='length' value='" . count($colArray) . "'>";
		$resultAdd .= "<input type='hidden' name='table' value='" . $table . "'>";
		$resultAdd .= "</tr><tr><td colspan='" . (count($colArray) + 1) . "'><i class='fa fa-paper-plane' aria-hidden='true' onclick='$(\"#service_add_data\").submit()'></i></td>";
		$resultAdd .= "</tr></table></form></div>";
		echo $resultAdd;
	}
?>