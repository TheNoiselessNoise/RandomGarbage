<?php
	require("../side/connect.php");
	require("../side/service.class.php");
	$listener = new Listeners();

	if(!isset($_SESSION)) { 
        session_start(); 
    }

	$sqlDelDB = "DROP DATABASE " . $_SESSION["db"] . ";";
	$resultDelDB = $conn->query($sqlDelDB);

	$temp = new mysqli($servername, $username, $password);
    $sGetDatabases = "SHOW DATABASES";
    $rGetDatabases = $temp->query($sGetDatabases);
    while($roGetDatabases = $rGetDatabases->fetch_array()){
     	$_SESSION["db"] = $roGetDatabases[0];
    }
    
	if($resultDelDB){
		$_SESSION["msg"] = "DATABASE_DELETE_SUCCESS";
	} else {
		$_SESSION["msg"] = "DATABASE_DELETE_FAIL";
	}
?>