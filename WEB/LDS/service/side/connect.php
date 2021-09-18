<?php
  mb_internal_encoding("utf-8");

  if(!isset($_SESSION)) { 
    session_start(); 
  }

  $servername = "localhost";
  $username = "root";
  $password = "";
  $mdb = "lds";
  $mconn = new mysqli($servername, $username, $password, $mdb);
  $mconn->query("SET NAMES utf8");

  if(isset($_SESSION["db"]) && $_SESSION["db"] != ""){
      $db = $_SESSION["db"];
  } else {
    $temp = new mysqli($servername, $username, $password);
    $sGetDatabases = "SHOW DATABASES";
    $rGetDatabases = $temp->query($sGetDatabases);
    while($roGetDatabases = $rGetDatabases->fetch_array()){
      $db = $roGetDatabases[0];
    }
  }
  
  $forbiddenDatabases = ["lds"];
  $forbiddenTables = ["serverlist"=>array("users"), "phpbook"=>array("users")]; // ["db1"=>array("first_table")]
  //$forbiddenTables = ["serverlist"=>array("users"), "phpbook"=>array("users"), "lds"=>array("lds_admin")]; // ["db1"=>array("first_table")]

  // Create connection
  if($db != ""){
    try {
        $conn = new mysqli($servername, $username, $password, $db);
    } catch(Exception $e){
        $temp = new mysqli($servername, $username, $password);
        $sGetDatabases = "SHOW DATABASES";
        $rGetDatabases = $temp->query($sGetDatabases);
        while($roGetDatabases = $rGetDatabases->fetch_array()){
            $db = $roGetDatabases[0];
        }
        $conn = new mysqli($servername, $username, $password, $db);
    }
    // Check connection
    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }

    $conn->query("SET NAMES utf8");

    # ---- GETTING MODS
    $_SESSION["new_mods"] = array();
    $r = $mconn->query("SELECT * FROM lds_admin WHERE password = ''");
    if($r->num_rows > 0){
        while($mods = $r->fetch_assoc()){
          array_push($_SESSION["new_mods"], $mods["username"]);
        }
    }
  }
?>
