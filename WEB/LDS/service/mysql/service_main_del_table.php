<?php
	require("../side/connect.php");
	require("../side/service.class.php");
	$listener = new Listeners();

    if(isset($_POST["table"]) or !empty($_POST["table"])){
    	$table = htmlspecialchars($conn->real_escape_string($_POST["table"]));
    	$sqlDelTable = "DROP TABLE ${table};";
		$resultDelTable = $conn->query($sqlDelTable);

		if($resultDelTable){
			$_SESSION["msg"] = "TABLE_DELETE_SUCCESS";
		} else {
			$_SESSION["msg"] = "TABLE_DELETE_FAIL";
		}
    } else {
    	$_SESSION["msg"] = "TABLE_DELETE_FAIL";
    }

    header("Location: ../service.php")
?>