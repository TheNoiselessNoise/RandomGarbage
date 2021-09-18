<?php
	require("../side/connect.php");
	session_start();

	if(!isset($_POST["addQuery"])){
		header("Location: ../service.php");
	} else {
		$sqlAddQuery = $conn->real_escape_string($_POST["addQuery"]);
		$resultAddQuery = $conn->query($sqlAddQuery);

		// if($resultAddQuery){
		// 	$_SESSION["msg"] = "Query was successfully executed.";
		// } else {
		// 	$_SESSION["msg"] = "'<b>" . $sqlAddQuery . "</b>'<br>" . $conn->error;
		// }
		
		header("Location: ../service.php");
	}
?>