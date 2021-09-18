<?php
	if(!isset($_SESSION)){
		session_start();
	}

	require("../side/connect.php");
	require("../side/service.class.php");
	$listener = new Listeners();

	$varArray = [];

	if($_SESSION["can_edit"] == "1"){
		$length = htmlspecialchars($conn->real_escape_string($_POST["length"]));
		$table = htmlspecialchars($conn->real_escape_string($_POST["table"]));
		for($i = 1; $i <= $length; $i++){
			if(!isset($_POST["add" . $i])){
				echo $listener->errRedir("../service.php", "SOMETHING_WRONG");
			}

			${"add" . $i} = htmlspecialchars($conn->real_escape_string($_POST["add" . $i]));
			array_push($varArray, ${"add" . $i});
		}

		$sqlMainAdd = "INSERT INTO ${table} VALUES(NULL, ";
		for($i = 0; $i < $length; $i++){
			if($varArray[$i] == "NULL"){
			
			} else {
				if($i == $length - 1){
					$sqlMainAdd .= "'" . $varArray[$i] . "')";
				} else {
					$sqlMainAdd .= "'" . $varArray[$i] . "', ";
				}
			}
		}
		$conn->query($sqlMainAdd);
		header("Location: ../service.php");
	} else {
		echo $listener->errRedir("../service.php", "DONT_HAVE_PERMISSION");
	}
?>