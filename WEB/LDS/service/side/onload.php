<?php
	require("connect.php");
	require("service.class.php");
	$listener = new Listeners();

	if(!isset($_SESSION)) { 
    	session_start(); 
  	}

  	$_SESSION["msg"] = "";

  	if($_SESSION["db"] == ""){
		$_SESSION["db"] = $db;
  	}

	$_SESSION["current_table"] = "";
	$_SESSION["prev_table"] = "";
	$_SESSION["tables_in_db"] = $listener->getTablesFromDB();
	$_SESSION["primary_keys"] = $listener->getPrimaryKeys();

	header("Location: ../service.php");
?>