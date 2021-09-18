<?php
	require("../connect.php");
	require("../service.class.php");
	$listener = new Listeners();

	if(!isset($_POST["oldpass"]) or !isset($_POST["newpass"]) or !isset($_POST["newpasscheck"]) or empty($_POST["newpass"]) or empty($_POST["newpasscheck"])){
		echo $listener->errRedir("../../account.php", "CHANGE_PASSWORD_EMPTY_VALUES");
	} else {
		if($_POST["newpass"] != $_POST["newpasscheck"]){
			echo $listener->errRedir("../../account.php", "CHANGE_PASSWORD_NEW_DONT_MATCH");
		} else {
			if($_POST["oldpass"] == $_POST["newpass"]){
				echo $listener->errRedir("../../account.php", "CHANGE_PASSWORD_WONT_CHANGE");
			} else {
				$sqlCheckPass = "SELECT password FROM lds_admin WHERE id = '" . $_SESSION["login_id"] . "'";
				$rCheckPass = $mconn->query($sqlCheckPass);
				$dbpass = $rCheckPass->fetch_array()[0];

				if($dbpass == ""){
					$hashedold = "";
				} else {
					$hashedold = sha1($mconn->real_escape_string($_POST["oldpass"]));
				}

				if($dbpass == $hashedold){
					$hashednew = sha1($mconn->real_escape_string($_POST["newpass"]));
					$sqlChangePass = "UPDATE lds_admin SET `password` = '{$hashednew}', `status` = 1 WHERE id = '" . $_SESSION["login_id"] . "'";

					$rChangePass = $mconn->query($sqlChangePass);
					
					if($rChangePass){
						echo $listener->errRedir("../../account.php", "CHANGE_PASSWORD_SUCCESS");
					} else {
						echo $listener->errRedir("../../account.php", "CHANGE_PASSWORD_FAIL");
					}
				} else {
					echo $listener->errRedir("../../account.php", "CHANGE_PASSWORD_ORIGINAL_DONT_MATCH");
				}
			}
		}
	}
?>