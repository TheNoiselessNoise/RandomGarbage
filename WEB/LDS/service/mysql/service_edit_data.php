<?php
	require("../side/connect.php");
	require("../side/settings.php");
	
	if(!isset($_POST["table"]) or !isset($_POST["id"])){
		header("Location: ../service.php");
	} else {
		$id = htmlspecialchars($conn->real_escape_string($_POST["id"]));
		$table = htmlspecialchars($conn->real_escape_string($_POST["table"]));
		#---------------------------------------------------------
		$valArray = [];
		$typeArray = [];
		$sqlGetCols = "SHOW COLUMNS FROM ${table}";
		$resultGetCols = $conn->query($sqlGetCols);
		while($rowGetCols = $resultGetCols->fetch_array()){
			array_push($valArray, $rowGetCols["Field"]);
			array_push($typeArray, $rowGetCols["Type"]);
		}
		#---------------------------------------------------------
		$sqlShowEditData = "SELECT * FROM ${table} WHERE " . $_SESSION["primary_keys"][$table] . " = '${id}'";
		$resultShowEditData = $conn->query($sqlShowEditData);

		$resultEdit = "<div id='over_table'>
						<h2 class='center'>Editing:</h2>
						<form id='service_edit_data' action='mysql/service_main_edit_data.php' method='post'>
							<table class='" . ($_SESSION['s_is_mobile'] == 'true' ? "responsive-table striped" : "striped bordered") . "'>
								<tr><th colspan='" . (count($valArray) + 1) . "'>" . ucfirst($table) . "</th></tr>
								<tr><th>Column:</th>";

		$i = 0;
		foreach($valArray as $val){
			if($_SESSION["s_show_col_types"] == "true"){
				$resultEdit .= "<th><input type='text' readonly='readonly' value='" . $val . " [" . $typeArray[$i] . "]'></th>";
			} else {
				$resultEdit .= "<th><input type='text' readonly='readonly' value='" . $val . "'></th>";
			}
			$i += 1;
		}

		$resultEdit .= "</tr><tr>";

		while($rowShowEditData = $resultShowEditData->fetch_array()){
			$resultEdit .= "<td>Editing: </td>";
			$i = 0;
			foreach($valArray as $val){
				$i += 1;
				if($val == $_SESSION["primary_keys"][$table]){
					$resultEdit .= "<td>
										<script>
											$('#editID').dblclick(function() {
												if ($(this).attr('readonly')) {
        											$(this).removeAttr('readonly');
    											} else {
        											$(this).attr('readonly', 'true');
    											}
    										});
										</script>
										<input type='text' id='editID' name='check" . $i . "' readonly='readonly' value='" . $rowShowEditData[$val] . "'>
									</td>";
				} else {
						$resultEdit .= "<td><input type='text' placeholder='" . $rowShowEditData[$val] . "' name='check" . $i . "' value='" . $rowShowEditData[$val] . "'></td>";
				}
			}
			$resultEdit .= "<input type='hidden' name='length' value='" . count($valArray) . "'>";
			$resultEdit .= "<input type='hidden' name='table' value='" . $table . "'>";
			$resultEdit .= "</tr><tr><td colspan='" . (count($valArray) + 1) . "'><i class='fa fa-paper-plane' aria-hidden='true' onclick='$(\"#service_edit_data\").submit()'></i></td>";
		}

		$resultEdit .= "</tr></table></form></div>";

		echo $resultEdit;
	}
?>