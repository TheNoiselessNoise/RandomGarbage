<?php
	require("service.class.php");
	$listener = new Listeners();

	if(!isset($_SESSION)) { 
        session_start(); 
    }
    
	$setArray = ["db", "s_is_mobile", "s_show_col_types", "s_hover_styles", "s_overflow_styles", "s_data_limit_from", "s_data_limit_to", "s_ui_color", "s_ui_back_color", "s_ui_text_color"];

	# WHY THIS PIECE OF SH.CODE THROWS ME AN ERROR ... SOLVE IT
	#if(!in_array($_POST["option"], $setArray)){
	#	header("Location: ../side/onload.php");
	#}

	#deafult color -> #1565C0

	if(isset($_POST["option"])){
		$option = $_POST["option"];
		$settings = $_POST["settings"];

		#resetting current table on change database
		if($option == "db"){
			$_SESSION["current_table"] = "";
			$_SESSION["db"] = $settings;
		}

		$_SESSION[$option] = $settings;
		$listener->setValueAdmin($option, $settings);

		exit(header("Location: ../service.php"));
	}
?>