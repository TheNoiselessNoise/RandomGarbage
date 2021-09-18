<?php
	require("../connect.php");
	require("../service.class.php");
	$listener = new Listeners();

	if(!isset($_POST["modname"]) or !isset($_POST["modmanage"]) or empty($_POST["modname"]) or empty($_POST["modmanage"])){
		echo $listener->errRedir("../../account.php", "ADD_MOD_EMPTY_VALUES");
	} else {
		if($_SESSION["can_add_mod"] == "1"){
			$arr = ["modmanageread", "modmanagesimple", "modmanagesimpleplus", "modmanageadvanced", "modmanagefullaccess"];
			$name = $mconn->real_escape_string($_POST["modname"]);
			$manage = $mconn->real_escape_string($_POST["modmanage"]);

			$add = 0;
			$read = 0;
			$edit = 0;
			$delete = 0;
			$forbidden = 0;
			$mod = 0;

			if($manage == "modmanageread"){
				$read = 1;
			} else if($manage == "modmanagesimple"){
				$read = 1;
				$edit = 1;
			} else if($manage == "modmanagesimpleplus"){
				$add = 1;
				$read = 1;
				$edit = 1;
				$delete = 1;
			} else if($manage == "modmanageadvanced"){
				$add = 1;
				$read = 1;
				$edit = 1;
				$delete = 1;
				$forbidden = 1;
			} else if($manage == "modmanagefullaccess"){
				$add = 1;
				$read = 1;
				$edit = 1;
				$delete = 1;
				$forbidden = 1;
				$mod = 1;
			} else {
				echo $listener->errRedir("../../account.php", "SOMETHING_WRONG");
			}

			if(in_array($manage, $arr)){
				$sqlAddMod = "INSERT INTO lds_admin
							  VALUES(NULL,
							  		'{$name}',
							  		'',
						  			'1',
					  				'0',
					  				'{$read}',
						  			'{$add}',
							  		'{$edit}',
							  		'{$delete}',
							  		'{$forbidden}',
							  		'{$mod}',
							  		'{$mod}',
							  		'0')";

				$rAddMod = $mconn->query($sqlAddMod);

				if($rAddMod){
					$listener->insertSettings($mconn->insert_id);
					echo $listener->errRedir("../../account.php", "ADD_MOD_SUCCESS");
				} else {
					echo $listener->errRedir("../../account.php", "ADD_MOD_FAIL");
				}
			} else {
				echo $listener->errRedir("../../account.php", "ADD_MOD_FAIL");
			}
		} else {
			echo $listener->errRedir("../../account.php", "DONT_HAVE_PERMISSION");
		}
	}
?>