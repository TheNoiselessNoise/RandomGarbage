<?php
	require("connect.php");
	require("config.php");
  	require("recaptcha.php");
  	require("messages.php");
  	require("service.class.php");
  	$recaptcha = new Recaptcha();
  	$listener = new Listeners();

	if(!isset($_SESSION)){
		session_start();
	}

	if(isset($_SESSION["login_name"])){
		header("Location: ../service.php");
	}

  	if($listener->checkAdmin()){
    	echo $listener->errRedir("../login.php", "REGISTER_ADMIN_EXISTS");
  	} else {
		if(!isset($_POST["username"]) or !isset($_POST["password"]) or !isset($_POST["password_check"])){
			echo $listener->errRedir("../register.php", "REGISTER_EMPTY_VALUES");
		} else {
			if(!isset($_POST["recaptcha"])){
				echo $listener->errRedir("../register.php", "RECAPTCHA_EMPTY");
			} else {
				if(!isset($_POST["recaptcha_a"]) or !isset($_POST["recaptcha_b"]) or !isset($_POST["recaptcha_d"])){
					echo $listener->errRedir("../register.php", "RECAPTCHA_MANIPULATED");
				} else {
					list($a, $b, $d) = $recaptcha->checkResult($_POST["recaptcha_a"], $_POST["recaptcha_b"], $_POST["recaptcha_d"]);

					if(!$a or !$b or !$d){
						echo $listener->errRedir("../register.php", "RECAPTCHA_MANIPULATED");
					}

					if($recaptcha->calcRecaptcha($a, $b, $d, $_POST["recaptcha"])){
						$user = $mconn->real_escape_string($_POST["username"]);
						$pass = $mconn->real_escape_string($_POST["password"]);
						$passCheck = $mconn->real_escape_string($_POST["password_check"]);
						$hashed = sha1($pass);

						if($pass != $passCheck){
							echo $listener->errRedir("../register.php", "REGISTER_PASSWORD_DONT_MATCH");
						} else {
							if(strlen($pass) < 6){
								echo $listener->errRedir("../register.php", "REGISTER_PASSWORD_SHORT");
							} else {
								if(strlen($user) < 5){
									echo $listener->errRedir("../register.php", "REGISTER_USERNAME_SHORT");
								} else {
									$sqlAddAdmin = "INSERT INTO lds_admin
													VALUES(NULL,
														   '{$user}',
														   '{$hashed}',
														   '1',
														   '1',
					  									   '1',
					  									   '1',
						  								   '1',
							  							   '1',
							  							   '1',
							  							   '1',
							  							   '1',
							  							   '1')";
									$rAddAdmin = $mconn->query($sqlAddAdmin);

									if($rAddAdmin){
										$listener->insertSettings($mconn->insert_id);
										echo $listener->errRedir("../login.php", "REGISTER_SUCCESSFUL");
									} else {
										echo $listener->errRedir("../register.php", "REGISTER_FAIL");
									}
								}
							}
						}	
					} else {
						echo $listener->errRedir("../register.php", "RECAPTCHA_WRONG");
					}
				}
			}
		}
	}
?>