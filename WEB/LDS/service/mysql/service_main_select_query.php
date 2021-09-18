<?php
	require("../side/connect.php");
	require("../side/service.class.php");
	$listener = new Listeners();
	if(!isset($_SESSION)){
		session_start();
	}

	if(!isset($_POST["selectQuery"])){
		header("Location: ../service.php");
	} else {
		$tableArray = $listener->getTablesFromDB();

		/*

		//IF PRIMARY KEY DONT EXIST
		$primaryKeys = [];
		$sqlGetPrimaryKeys = "SELECT GROUP_CONCAT(COLUMN_NAME) AS primaryKey, TABLE_NAME
							  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
							  WHERE TABLE_SCHEMA = '{$db}'
  							  AND CONSTRAINT_NAME = 'PRIMARY'
							  GROUP BY TABLE_NAME";
		$rSqlGetPrimaryKeys = $conn->query($sqlGetPrimaryKeys);
		while($row = $rSqlGetPrimaryKeys->fetch_array()){
			array_push($primaryKeys, $row["primaryKey"]);
		}
		echo var_dump($primaryKeys);
		*/

		$main = $_SESSION["primary_keys"][$_SESSION["current_table"]];
		$sqlSelectQuery = $conn->real_escape_string($_POST["selectQuery"]);
		$resultSelectQuery = $conn->query($sqlSelectQuery);
		$whole = "<div id='over_table' style='width:75%;margin:0 auto'><table id='showData' class='" . ($_SESSION['s_is_mobile'] == 'true' ? "responsive-table striped bordered" : "striped bordered") . "' data-value='{$main}'>";

		$colArray = $listener->getColsFromTable();

		if($resultSelectQuery->num_rows > 0){

			while($row = $resultSelectQuery->fetch_array()){
				$whole .= "<tr>";

				foreach($colArray as $col){
					if(in_array($col, $row)){
						$column = $row[$col];
					} else {
						$column = "";
					}

					if($column == ""){
						$whole .= "<td><input style='visibility: hidden;'></td>";
					} else {
						$whole .= "<td>" . $column . "</td>";
					}
				}

				$whole .= "</tr>";
				echo var_dump($row);
			}

			$whole .= "</table></div>";

			echo $whole;
		} else {
			echo "Nothing was found!";
		}
	}
?>