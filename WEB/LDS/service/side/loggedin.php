<?php
	ini_set('display_errors', 1);
	require("connect.php");
	require("config.php");
	require("recaptcha.php");
	require("service.class.php");
	$recaptcha = new Recaptcha();
	$listener = new Listeners();
	
	if(!isset($_SESSION)){
		session_start();
	}

	if(isset($_SESSION["login_name"])){
		header("Location: ../service.php");
	}

	if(!isset($_POST["username"]) or !isset($_POST["password"])){
		echo $listener->errRedir("../login.php", "LOGIN_EMPTY_EMAIL_OR_PASS");
	} else {
		if($listener->isCaptcha() and !isset($_POST["recaptcha"])){
			echo $listener->errRedir("../login.php", "RECAPTCHA_EMPTY");
		} else {
			if($listener->isCaptcha() and (!isset($_POST["recaptcha_a"]) or !isset($_POST["recaptcha_b"]) or !isset($_POST["recaptcha_d"]))){
				echo $listener->errRedir("../login.php", "RECAPTCHA_MANIPULATED");
			} else {
				if($listener->isCaptcha()){
					list($a, $b, $d) = $recaptcha->checkResult($_POST["recaptcha_a"], $_POST["recaptcha_b"], $_POST["recaptcha_d"]);

					if(!$a or !$b or !$d){
						echo $listener->errRedir("../login.php", "RECAPTCHA_MANIPULATED");
					}
				}

				if(!$listener->isCaptcha() or $recaptcha->calcRecaptcha($a, $b, $d, $_POST["recaptcha"])){
					$user = $mconn->real_escape_string($_POST["username"]);
					$pass = $mconn->real_escape_string($_POST["password"]);
					$hashed = sha1($pass);

					$sqlLogin = "SELECT * FROM lds_admin
								 JOIN lds_settings ON lds_admin.id = lds_settings.user_id
								 WHERE lds_admin.username = '{$user}' AND lds_admin.password = '{$hashed}'";
					$resultLogin = $mconn->query($sqlLogin);
					$row = $resultLogin->fetch_array();

					if($resultLogin->num_rows > 0){
						if($resultLogin->num_rows == 1){
							$_SESSION["login_name"] = $user;
							$_SESSION["isAdmin"] = $row["isAdmin"];
							$_SESSION["db"] = $row["db"];
							$_SESSION["login_id"] = $row["id"];
							$_SESSION["can_add"] = $row["can_add"];
							$_SESSION["can_read"] = $row["can_read"];
							$_SESSION["can_edit"] = $row["can_edit"];
							$_SESSION["can_delete"] = $row["can_delete"];
							$_SESSION["can_read_forbidden"] = $row["can_read_forbidden"];
							$_SESSION["can_add_mod"] = $row["can_add_mod"];
							$_SESSION["can_manage_mod"] = $row["can_manage_mod"];
							$_SESSION["s_is_mobile"] = $row["s_is_mobile"];
							$_SESSION["s_show_col_types"] = $row["s_show_col_types"];
							$_SESSION["s_hover_styles"] = $row["s_hover_styles"];
							$_SESSION["s_overflow_styles"] = $row["s_overflow_styles"];
							$_SESSION["s_data_limit_from"] = $row["s_data_limit_from"];
							$_SESSION["s_data_limit_to"] = $row["s_data_limit_to"];
							$_SESSION["s_ui_color"] = $row["s_ui_color"];
							$_SESSION["s_ui_back_color"] = $row["s_ui_back_color"];
							$_SESSION["s_ui_text_color"] = $row["s_ui_text_color"];

							header("Location: onload.php");
						} else {
							echo $listener->errRedir("../login.php", "LOGIN_SOMEWRONG");
						}
					} else {
						$sqlLogin = "SELECT * FROM lds_admin
								 JOIN lds_settings ON lds_admin.id = lds_settings.user_id
								 WHERE lds_admin.username = '{$user}' AND lds_admin.password = ''";
						$resultLogin = $mconn->query($sqlLogin);
						$row = $resultLogin->fetch_array();
						if($resultLogin->num_rows > 0){
							if($resultLogin->num_rows == 1){
								if($row["password"] == ""){
									$_SESSION["login_name"] = $user;
									$_SESSION["isAdmin"] = $row["isAdmin"];
									$_SESSION["db"] = $row["db"];
									$_SESSION["login_id"] = $row["id"];
									$_SESSION["can_add"] = $row["can_add"];
									$_SESSION["can_read"] = $row["can_read"];
									$_SESSION["can_edit"] = $row["can_edit"];
									$_SESSION["can_delete"] = $row["can_delete"];
									$_SESSION["can_read_forbidden"] = $row["can_read_forbidden"];
									$_SESSION["can_add_mod"] = $row["can_add_mod"];
									$_SESSION["can_manage_mod"] = $row["can_manage_mod"];
									$_SESSION["s_is_mobile"] = $row["s_is_mobile"];
									$_SESSION["s_show_col_types"] = $row["s_show_col_types"];
									$_SESSION["s_hover_styles"] = $row["s_hover_styles"];
									$_SESSION["s_overflow_styles"] = $row["s_overflow_styles"];
									$_SESSION["s_data_limit_from"] = $row["s_data_limit_from"];
									$_SESSION["s_data_limit_to"] = $row["s_data_limit_to"];
									$_SESSION["s_ui_color"] = $row["s_ui_color"];
									$_SESSION["s_ui_back_color"] = $row["s_ui_back_color"];
									$_SESSION["s_ui_text_color"] = $row["s_ui_text_color"];

									header("Location: onload.php");
								}
							}
						} else {
							echo $listener->errRedir("../login.php", "LOGIN_WRONG");
						}
					}

					#echo $listener->errRedir("LOGIN_SUCCESSFUL");
				} else {
					echo $listener->errRedir("../login.php", "RECAPTCHA_WRONG");
				}
			}
		}
	}
?>
