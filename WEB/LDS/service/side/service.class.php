<?php
  if(!isset($_SESSION)){
    session_start();
  }

	class Listeners {
		public function checkAdmin(){
			require("connect.php");

  		$sqlGetAdmin = "SELECT * FROM lds_admin";
  		$rGetAdmin = $mconn->query($sqlGetAdmin);
  		if($rGetAdmin->num_rows > 0){
    		return true;
  		} else {
        return false;
      }
		}

    public function checkIfIsAdmin(){
      require("connect.php");

      $sqlIsAdmin = "SELECT * FROM lds_admin WHERE id = '" . $_SESSION["login_id"] . "' AND username = '" . $_SESSION["login_name"] . "'";
      $rSqlIsAdmin = $mconn->query($sqlIsAdmin);

      if($rSqlIsAdmin->num_rows == 1){
        return true;
      } else {
        return false;
      }
    }

    public function isCaptcha(){
      require("connect.php");
      $sql = "SELECT * FROM lds_admin WHERE CAPTCHA = '1'";
      $rsql = $mconn->query($sql);
      if($rsql->num_rows > 0){
        return true;
      } else {
        return false;
      }
    }

    public function checkHasPasswd(){
      require("connect.php");

      $haspasswd = true;
      $sqlGetPasswd = "SELECT * FROM lds_admin WHERE id = '" . $_SESSION["login_id"] . "' AND password <> ''";
      $rGetPasswd = $mconn->query($sqlGetPasswd);
      if($rGetPasswd->num_rows > 0){
        $haspasswd = false;
      }

      return $haspasswd;
    }

		public function errRedir($page, $err){
			return "<form id='errorRedirect' action='{$page}' method='post'>
				<input type='hidden' name='msg' value='{$err}'>
			  </form><script>document.getElementById('errorRedirect').submit();</script>";
			#return "<script>window.location = '{$page}?msg={$err}';</script>"; //pro _GET
		}

    public function createLDS(){
      $sql = "CREATE DATABASE lds;
              CREATE TABLE ";
    }

		public function getAllDBs(){
			require("connect.php");
			$dbs = "";

			$sqlGetDatabases = "SHOW DATABASES";
      $resultGetDatabases = $conn->query($sqlGetDatabases);
  		while($rowGetDatabases = $resultGetDatabases->fetch_array()){
      	if(!in_array($rowGetDatabases["Database"], $forbiddenDatabases)){
    			if($_SESSION["db"] == $rowGetDatabases["Database"]){
            $dbs .= "<option value='" . $rowGetDatabases["Database"] . "' selected>" . $rowGetDatabases["Database"] . "</option>";
          } else {
            $dbs .= "<option value='" . $rowGetDatabases["Database"] . "'>" . $rowGetDatabases["Database"] . "</option>";
          }
        }
      }
      return $dbs;
		}

    public function setValueAdmin($col, $val){
      require("connect.php");
      $sql = "UPDATE lds_settings SET {$col} = '{$val}' WHERE user_id = '" . $_SESSION["login_id"] . "'";
      $mconn->query($sql);
    }

    public function insertSettings($id){
      require("connect.php");
      $sqlInsertSettings = "INSERT INTO lds_settings
                            VALUES('{$id}',
                                   '',
                                   'false',
                                   'false',
                                   'true',
                                   'true',
                                   '0',
                                   '0',
                                   '#1565C0',
                                   '#FFFFFF',
                                   '#000000')";
      $mconn->query($sqlInsertSettings);
    }

    public function updatePermissions(){
      require("connect.php");
      $sqlUpdatePerms = "SELECT * FROM lds_admin WHERE id = '" . $_SESSION["login_id"] . "'";
      $rUpdatePerms = $mconn->query($sqlUpdatePerms);
      $row = $rUpdatePerms->fetch_array();

      $_SESSION["can_add"] = $row["can_add"];
      $_SESSION["can_read"] = $row["can_read"];
      $_SESSION["can_edit"] = $row["can_edit"];
      $_SESSION["can_delete"] = $row["can_delete"];
      $_SESSION["can_read_forbidden"] = $row["can_read_forbidden"];
      $_SESSION["can_add_mod"] = $row["can_add_mod"];
      $_SESSION["can_manage_mod"] = $row["can_manage_mod"];
    }

		public function getAllTables(){
			require("connect.php");
			$tables = "";

			$sqlGetTables = "SHOW TABLES FROM ${db}";
      $resultGetTables = $conn->query($sqlGetTables);
      if($resultGetTables->num_rows > 0){
        $tables .= "<option id='selectPlaceholderTable'>Choose a table</option>";
        while($rowGetTables = $resultGetTables->fetch_array()){
          if(@!in_array($rowGetTables["Tables_in_${db}"], $forbiddenTables[$_SESSION["db"]])){
            if($rowGetTables["Tables_in_${db}"] == $_SESSION["current_table"] or $rowGetTables["Tables_in_${db}"] == $_SESSION["prev_table"]){
              $tables .= "<option value='" . $rowGetTables["Tables_in_${db}"] . "' selected>" . $rowGetTables["Tables_in_${db}"] . "</option>";
            } else {
              $tables .= "<option value='" . $rowGetTables["Tables_in_${db}"] . "'>" . $rowGetTables["Tables_in_${db}"] . "</option>";
            }
          } else {
            if($_SESSION["can_read_forbidden"] == "1"){
              if($rowGetTables["Tables_in_${db}"] == $_SESSION["current_table"] or $rowGetTables["Tables_in_${db}"] == $_SESSION["prev_table"]){
                $tables .= "<option value='" . $rowGetTables["Tables_in_${db}"] . "' selected>" . $rowGetTables["Tables_in_${db}"] . "</option>";
              } else {
                $tables .= "<option value='" . $rowGetTables["Tables_in_${db}"] . "'>" . $rowGetTables["Tables_in_${db}"] . "</option>";
              }
            }
          }
        }
      } else {
        $tables .= "<option>No table exists!</option>";
      }
      return $tables;
		}

    public function getHistory(){
      require("connect.php");
      $history = "";

      $sqlGetHistory = "SELECT * FROM lds_history WHERE user_id = '" . $_SESSION["login_id"] . "' ORDER BY date DESC";
      $resultGetHistory = $mconn->query($sqlGetHistory);

      if($resultGetHistory->num_rows > 0){
        $history .= "<table class='striped bordered'>
                      <tr>
                        <th>Database</th>
                        <th>Command</th>
                      </tr>";

        while($row = $resultGetHistory->fetch_array()){
          $history .= "<tr class='cursor' onclick=''>
                        <td class='pink-text'>" . $row["db_name"] . "</td>
                        <td>" . $row["query"] . "</td>
                      </tr>";
        }

        $history .= "</table>";
      } else {
        $history .= "<div class='row'>
                        <div class='col s12'>
                          <span class='pink-text'>No history of sql commands</span>
                        </div>
                      </div>";
      }

      return $history;
    }

    public function hexToRGB($hex){
      list($r, $g, $b) = sscanf($hex, "#%02x%02x%02x");
      return array($r, $g, $b);
    }

    public function uiColoring($rgb){
      $styling = "<style type='text/css' media='screen'>
                    .ui-color {
                      background: " . $_SESSION["s_ui_color"] . " !important;
                    }";

      $counter = 1;
      for($i = 0.1; $i <= 1; $i += 0.1){
        $styling .= ".ui-color-a-{$counter} {
                        background: rgba({$rgb[0]}, {$rgb[1]}, {$rgb[2]}, {$i});
                      }";
        $counter++;
      }
      $styling .= "</style>";

      return $styling;
    }

    public function getTablesFromDB(){
      require("connect.php");
      $getTables = "SHOW TABLES FROM {$db}";
      $rGetTables = $conn->query($getTables);

      $tables = array();
      while($row = $rGetTables->fetch_array()){
        array_push($tables, $row["Tables_in_${db}"]);
      }

      return $tables;
    }

    public function getColsFromTable(){ //session
      require("connect.php");
      $getCols = "SHOW COLUMNS FROM " . $_SESSION["current_table"];
      $rGetCols = $conn->query($getCols);
      
      $columns = array();
      while($row = $rGetCols->fetch_array()){
        array_push($columns, $row["Field"]);
      }

      return $columns;
    }

    public function gCFT($table){ //private
      require("connect.php");
      $getCols = "SHOW COLUMNS FROM {$table}";
      $rGetCols = $conn->query($getCols);
      
      $columns = array();
      while($row = $rGetCols->fetch_array()){
        array_push($columns, $row["Field"]);
      }

      return $columns;
    }

    public function getColsFromTables(){
      require("connect.php");
      $getTables = $this->getTablesFromDB();
      $getCols = array();

      foreach($getTables as $table){
        $getCols[$table] = $this->gCFT($table);
      }

      return $getCols;
    }

    public function getTypesOfCols(){
      require("connect.php");
      $getCols = "SHOW COLUMNS FROM " . $_SESSION["current_table"];
      $rGetCols = $conn->query($getCols);
      
      $types = array();
      while($row = $rGetCols->fetch_array()){
        array_push($types, $row["Type"]);
      }

      return $types;
    }

    public function getLengthOfCols(){
      return count($this->getColsFromTable());
    }

    public function getPrimaryKeys(){
      require("connect.php");
      $tables = $this->getTablesFromDB();
      $keys = array();

      foreach($tables as $table) {
        $getKeys = "SHOW KEYS FROM {$table} WHERE Key_name = 'PRIMARY'";
        $rGetKeys = $conn->query($getKeys);

        if($rGetKeys->num_rows != 0){
          while($row = $rGetKeys->fetch_array()){
            $keys[$table] = $row["Column_name"];
          }
        } else {
          $keys[$table] = "NONE";
        }
      }

      return $keys;
    }
  }
?>