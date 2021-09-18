<?php
	require("../connect.php");
	require("../service.class.php");
	$listener = new Listeners();

	if(!isset($_SESSION)){
		session_start();
	}

	if(!isset($_POST["username"]) or !isset($_POST["option"]) or !isset($_POST["value"])){
	} else {
		if($_SESSION["can_manage_mod"] == "1"){
			if($_POST["value"] == "true"){
				$value = 0;
			} else {
				$value = 1;
			}

			$username = $mconn->real_escape_string($_POST["username"]);
			$option = $mconn->real_escape_string($_POST["option"]);

			$sqlModStatus = "UPDATE lds_admin SET {$option} = '{$value}' WHERE username = '{$username}'";
			$mconn->query($sqlModStatus);

		} else {
			exit($listener->errRedir("../../account.php", "DONT_HAVE_PERMISSION"));
		}
	}
?>