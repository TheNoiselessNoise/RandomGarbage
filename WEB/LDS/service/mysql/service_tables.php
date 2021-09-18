<?php
	session_start();
	require("../side/connect.php");
	require("../side/service.class.php");
	$listener = new Listeners();

	if(isset($_POST["table"])){
		$table = htmlspecialchars($conn->real_escape_string($_POST["table"]));
		$db = $_SESSION["db"];
		$isPrimaryKey = $_SESSION["primary_keys"][$table] != "NONE";

		if(!$isPrimaryKey){
			$_SESSION["prev_table"] = $_SESSION["current_table"];
			$_SESSION["current_table"] = $table;
			//exit($listener->errRedir("service.php", "NO_PRIMARY_KEY"));
			$main = "NONE";
		} else {
			$main = $_SESSION["primary_keys"][$table];
		}
		#-------------------------------------------
		$tableArray = $listener->getTablesFromDB();
		#-----------------------------------------

		if($_SESSION["can_read_forbidden"] == 0 and @in_array($table, $forbiddenTables[$_SESSION["db"]]) or !in_array($table, $tableArray)){
			echo "<table><tr><th>Table could not be found!</th></tr></table>";
		} else {
			$_SESSION["current_table"] = $table;
			$valArray = $listener->getColsFromTable();
			$typeArray = $listener->getTypesOfCols();

			$wholeTable = "";

			if($_SESSION["s_is_mobile"] == "true"){
				$wholeTable .= ($_SESSION['can_add'] == '1' && $isPrimaryKey ? "<div id='addData' class='center cursor' onclick='addData(document.getElementById(\"getTable\").value)'><i class='fa fa-plus-circle fa-3x'></i></div>" : "") . "<div id='over_table' style='width:75%;height: 500px;margin:0 auto;overflow-y:auto'><table id='showData' class='" . ($_SESSION['s_is_mobile'] == 'true' ? "responsive-table striped bordered" : "striped bordered") . "' data-value='{$main}'>";
			} else {
				$wholeTable .= "<div id='over_table' style='width:75%;margin:0 auto'><table id='showData' class='" . ($_SESSION['s_is_mobile'] == 'true' ? "responsive-table striped bordered" : "striped bordered") . "' data-value='{$main}'>
				" . ($_SESSION['can_add'] == '1' ? "<tr>
					<td class='center cursor' colspan='" . (count($valArray) + 2) . "' onclick='addData(document.getElementById(\"getTable\").value)'><i class='fa fa-plus-circle fa-3x'></i></td></tr>" : "");
			}

			if(!in_array($main, $valArray)){
				$_SESSION["current_table"] = $table;
				$_SESSION["tables_in_db"] = $listener->getTablesFromDB();
    			$_SESSION["primary_keys"] = $listener->getPrimaryKeys();
			}

			$scriptDeleteData = "<script>function deleteData(t, i, c) {
    						$.post('mysql/service_del_data.php', { table: t, id: i, conf: c }, function(data) {
        						$('.dataDump').html(data);
    						});
						}</script>";

			$scriptAddData = "<script>function addData(t) {
    						$.post('mysql/service_add_data.php', { table: t }, function(data) {
        						$('.dataDump').html(data);
        						window.location = '#service_add_data';
    						});
						}</script>";

			$scriptEditData = "<script>function editData(t, i) {
    						$.post('mysql/service_edit_data.php', { table: t, id: i }, function(data) {
        						$('.dataDump').html(data);
        						window.location = '#service_edit_data';
    						});
						}</script>";

			$scriptSearchData = "<script>function searchData(t, s, m) {
    						$.post('mysql/service_tables.php', { table: t, search: s, main:m }, function(data) {
        						$('.tableDump').html(data);
    						});
						}</script>";

      		$scriptEnableSearch = "<script>
      								$('#tableSearch').removeAttr('disabled');
      								$('#tableSearch').attr('placeholder', 'Searching...');
      							   </script>";
      		$scriptRemoveSelectPlaceholder = "<script>
      									$('#selectPlaceholderTable').remove();
      								   </script>";
      								   
			#-------------------------------------------
      		if(isset($_POST["search"]) and $_POST["search"] != ""){
      			$search = $conn->real_escape_string($_POST["search"]);
      			$sqlWholeTable = "SELECT * FROM ${table} WHERE (";
      			for($i = 0; $i < count($valArray); $i++){
      				if($i == 0){
      					$sqlWholeTable .= $valArray[$i] . " LIKE '%${search}%'";
      				} elseif($i == (count($valArray) - 1)){
      					$sqlWholeTable .= " OR `" . $valArray[$i] . "` LIKE '%${search}%')";
      				} else {
      					$sqlWholeTable .= " OR `" . $valArray[$i] . "` LIKE '%${search}%'";
      				}
      			}

      			#$sqlWholeTable .= " LIMIT 20";
      		} else {
      			if(isset($_SESSION["s_data_limit_from"]) and isset($_SESSION["s_data_limit_to"])){
					if($_SESSION["s_data_limit_from"] == 0 and $_SESSION["s_data_limit_to"] > 0){
						$sqlWholeTable = "SELECT * FROM ${table}
									  	  LIMIT " . ($_SESSION["s_data_limit_to"]);
					} elseif($_SESSION["s_data_limit_from"] > 0 and $_SESSION["s_data_limit_to"] == 0){
						$sqlWholeTable = "SELECT * FROM ${table}
									      LIMIT " . PHP_INT_MAX . " OFFSET " . ($_SESSION["s_data_limit_from"] - 1);
					} elseif($_SESSION["s_data_limit_from"] == 0 and $_SESSION["s_data_limit_to"] == 0){
						$sqlWholeTable = "SELECT * FROM ${table}";
					} else {
						$sqlWholeTable = "SELECT * FROM ${table}
									  	  LIMIT " . ($_SESSION["s_data_limit_to"] - $_SESSION["s_data_limit_from"] + 1) . " OFFSET " . ($_SESSION["s_data_limit_from"] - 1);
					}
				} else {
					$sqlWholeTable = "SELECT * FROM ${table}";
				}
			}
			
			$resultWholeTable = $conn->query($sqlWholeTable);

			$wholeTable .= "<tr>
								<th class='center' colspan='" . (count($valArray) + 2) . "'>" . ucfirst($table) . " [" . $resultWholeTable->num_rows . "]</th>
							</tr>
							<tr>";

			$length = 0; #getting types of columns
			foreach($valArray as $val){
				if($_SESSION["s_show_col_types"] == "true"){
					$wholeTable .= "<th>${val} [" . $typeArray[$length] . "]</th>";
				} else {
					$wholeTable .= "<th>${val}</th>";
				}
				$length++;
			}
			$wholeTable .= "<th></th><th></th>";
			$wholeTable .= "</tr>";

			
			while($rowWholeTable = $resultWholeTable->fetch_array()){
				$wholeTable .= "<tr>";

				foreach($valArray as $val){
					if($rowWholeTable[$val] == ""){
						$wholeTable .= "<td><input style='visibility: hidden;'></td>";
					} else {
						$wholeTable .= "<td>" . $rowWholeTable[$val] . "</td>";
					}
				}
				
				if($_SESSION["can_edit"] == "1" && $isPrimaryKey){
					$wholeTable .= "<td id='" . $rowWholeTable[$main] . "' class='cursor' " . ($_SESSION['s_is_mobile'] == 'true' ? "style='text-align:center'" : "") . " onclick='editData(document.getElementById(\"getTable\").value, this.id)'><i class='fa fa-pencil' aria-hidden='true'></i></td>";
					$wholeTable .= "<td id='" . $rowWholeTable[$main] . "' class='cursor' " . ($_SESSION['s_is_mobile'] == 'true' ? "style='text-align:center'" : "") . " onclick='deleteData(document.getElementById(\"getTable\").value, this.id, false)'><i class='fa fa-times' aria-hidden='true'></i></td>";
				} else {
					$wholeTable .= "<td>&nbsp;</td><td>&nbsp;</td>";
				}

				$wholeTable .= "</tr>";
			}

			if($_SESSION["can_add"] == "1" && $isPrimaryKey){
				if($_SESSION["s_is_mobile"] == "true"){
					$wholeTable .= "</table></div><div id='addData' class='center cursor' onclick='addData(document.getElementById(\"getTable\").value)'>
										<i class='fa fa-plus-circle fa-3x'></i>
									</div>";
				} else {
					$wholeTable .= "<tr>
									<td id='addData' class='center cursor' colspan='" . (count($valArray) + 2) . "' onclick='addData(document.getElementById(\"getTable\").value)'>
										<i class='fa fa-plus-circle fa-3x'></i>
									</td>
								</tr>
							</table></div>";
				}
			} else {
				$wholeTable .= "</table></div>";
			}

			echo $scriptRemoveSelectPlaceholder;
			echo $scriptEnableSearch;
			echo $scriptDeleteData;
			echo $scriptAddData;
			echo $scriptEditData;
			echo $scriptSearchData;
			echo $wholeTable;
		}
	}
?>