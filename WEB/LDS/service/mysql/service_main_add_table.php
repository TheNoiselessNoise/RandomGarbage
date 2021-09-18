<?php
	require("../side/connect.php");
	require("../side/service.class.php");
	$listener = new Listeners();

	#tableName, colNameX, typeX, if nullX, if aiX, length
	if(!isset($_POST["length"]) or !isset($_POST["tableName"])){

	} else {
		$nullArray = [];
		$aiArray = [];
		$length = htmlspecialchars($conn->real_escape_string($_POST["length"]));
		$tableName = htmlspecialchars($conn->real_escape_string($_POST["tableName"]));
		
		if(!isset($_POST["key"])){
			$key = null;
		} else {
			$key = htmlspecialchars($conn->real_escape_string($_POST["key"]));
		}

		for($i = 1; $i <= $length; $i++){
			${"colName" . $i} = htmlspecialchars($conn->real_escape_string($_POST["colName" . $i]));
			${"type" . $i} = htmlspecialchars($conn->real_escape_string($_POST["type" . $i]));
			${"len" . $i} = htmlspecialchars($conn->real_escape_string($_POST["len" . $i]));

			if(!isset($_POST["null" . $i])){
				${"null" . $i} = "off";
			} else {
				${"null" . $i} = $_POST["null" . $i];
			}

			if(!isset($_POST["ai" . $i])){
				${"ai" . $i} = "off";
			} else {
				${"ai" . $i} = $_POST["ai" . $i];
			}
		}

		$primary = "";
		$sqlAddTable = "CREATE TABLE ${db}.${tableName} (";
		for($i = 1; $i <= $length; $i++){
			if(${"type" . $i} == "FLOAT"){
				$sqlAddTable .= ${"colName" . $i} . " " . ${"type" . $i};
			} else {
				$sqlAddTable .= ${"colName" . $i} . " " . ${"type" . $i} . "(" . ${"len" . $i} . ")";
			}

			if(${"null" . $i} == "on"){
				$sqlAddTable .= " NULL";
			} else {
				$sqlAddTable .= " NOT NULL";
			}

			if(${"ai" . $i} == "on"){
				$sqlAddTable .= " AUTO_INCREMENT";
			}

			if($key == $i){
					$primary = ", PRIMARY KEY (" . ${"colName" . $i} . ")";
			}

			if($i == $length){
				if($primary != ""){
					$sqlAddTable .= $primary;
				}

				$sqlAddTable .= ");";
			} else {
				$sqlAddTable .= ", ";
			}
		}

		$resultAddTable = $conn->query($sqlAddTable);

		if($resultAddTable){
			$_SESSION["primary_keys"] = $listener->getPrimaryKeys();
			exit($listener->errRedir("../service.php", "TABLE_ADD_SUCCESS"));
		} else {
			exit($listener->errRedir("../service.php", "TABLE_ADD_FAIL"));
		}

		echo $sqlAddTable;
	}
?>