<?php
	if(!isset($_SESSION)){
		session_start();
	}
	
	require("../side/connect.php");
	require("../side/service.class.php");
	$listener = new Listeners();

	if($_SESSION["can_edit"] == "1"){
		$colArray = $listener->getColsFromTable();
		$varArray = [];
		$defArray = [];
		$primary_key_val = "";

		$length = htmlspecialchars($conn->real_escape_string($_POST["length"]));
		$table = htmlspecialchars($conn->real_escape_string($_POST["table"]));
		for($i = 1; $i <= $length; $i++){
			if(!isset($_POST["check" . $i])){
				#header("Location: ../service.php");
			}

			${"check" . $i} = htmlspecialchars($conn->real_escape_string($_POST["check" . $i]));
			array_push($varArray, ${"check" . $i});
		}

		#count null values in $varArray
		$temp = $colArray;
		for($i = 0; $i < count($temp); $i++){
			if($varArray[$i] == ""){
				unset($varArray[$i]);
				unset($colArray[$i]);
			}

			if($_SESSION["primary_keys"][$table] == $colArray[$i]){
				$primary_key_val = ${"check" . ($i + 1)};
			}
		}

		$varArray = array_values($varArray);
		$colArray = array_values($colArray);

		$i = 0;
		$sqlMainEdit = "UPDATE ${table} SET ";
		for($i = 0; $i < count($colArray); $i++){
			if($varArray[$i] != ""){
				if($i == count($colArray) - 1){
					$sqlMainEdit .= $colArray[$i] . " = '" . $varArray[$i] . "'";
				} else {
					$sqlMainEdit .= $colArray[$i] . " = '" . $varArray[$i] . "', ";
				}
			}
		}

		$primary_key = $_SESSION["primary_keys"][$table];

		$sqlMainEdit .= " WHERE {$primary_key} = '{$primary_key_val}'";
		#echo $sqlMainEdit;
		$conn->query($sqlMainEdit);
		header("Location: ../service.php");
	} else {
		echo $listener->errRedir("../service.php", "DONT_HAVE_PERMISSION");
	}
?>

<?php
	/*
	foreach($colArray as $col){
		$sqlMainEdit = "UPDATE ${table} SET ${col} = '" . $varArray[$i] . "' WHERE id = '${def1}'";
		$conn->query($sqlMainEdit);
		$i += 1;
	}
	*/
?>