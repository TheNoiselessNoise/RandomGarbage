<?php
	require("../side/connect.php");
	require("../side/service.class.php");
	$listener = new Listeners();

	if(!isset($_POST["addDatabase"])){
		header("Location: ../service.php"); // headers are not working in these files, you need in js window.location or exit()
	} else {
		$addDatabase = htmlspecialchars($conn->real_escape_string($_POST["addDatabase"]));
		$sqlAddDB = "CREATE DATABASE ${addDatabase};";
		$resultAddDB = $conn->query($sqlAddDB);
		
		if($resultAddDB){
			exit($listener->errRedir("../service.php", "DATABASE_ADD_SUCCESS"));
		} else {
			exit($listener->errRedir("../service.php", "DATABASE_ADD_FAIL"));
		}
	}
?>