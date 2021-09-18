<?php
	if(!isset($_SESSION)){
		session_start();
	}
	
	require("../side/connect.php");
	require("../side/service.class.php");
	$listener = new Listeners();

	if(!isset($_POST["id"]) or !isset($_POST["conf"]) or !isset($_POST["table"])){
		echo $listener->errRedir("../service.php", "REGISTER_EMPTY_VALUES");
	} else {
		if($_SESSION["can_edit"] == "1"){
			$id = htmlspecialchars($conn->real_escape_string($_POST["id"]));
			$conf = htmlspecialchars($conn->real_escape_string($_POST["conf"]));
			$table = htmlspecialchars($conn->real_escape_string($_POST["table"]));

			if($conf == "true"){
				$primary = $_SESSION["primary_keys"][$table];
				$sqlDeleteData = "DELETE FROM ${table} WHERE ${primary} = ${id}";
				$conn->query($sqlDeleteData);
				exit(header("Location: ../service.php"));
			} else {
				echo "<script>
					function confirmation(){
						var primary = $('#showData').attr('data-value');
						var confirmation = confirm('Do you really want to delete this record?\\nTable: ${table}, ' + primary + ': ${id}?');
						if(confirmation == true){
							deleteData(document.getElementById(\"getTable\").value, ${id}, true);
						}
					}
					confirmation();
				</script>";
				exit();
			}
		} else {
			echo $listener->errRedir("../service.php", "DONT_HAVE_PERMISSION");
		}
	}
?>