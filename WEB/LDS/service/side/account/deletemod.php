<?php
	require("../connect.php");
	require("../service.class.php");
	$listener = new Listeners();

	if(!isset($_SESSION)){
		session_start();
	}

	if(!isset($_POST["username"])){
	} else {
		if($_SESSION["can_manage_mod"] == "1"){
			$username = $mconn->real_escape_string($_POST["username"]);
			$sqlDeleteSettings = "DELETE FROM lds_settings WHERE user_id = (SELECT id FROM lds_admin WHERE username = '{$username}')";
			$sqlDeleteMod = "DELETE FROM lds_admin WHERE username = '{$username}'";
			$mconn->query($sqlDeleteSettings);
			$mconn->query($sqlDeleteMod);
		} else {
			exit($listener->errRedir("../../account.php", "DONT_HAVE_PERMISSION"));
		}
	}
?>