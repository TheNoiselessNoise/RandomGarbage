<?php
  require("side/config.php");
  require("side/recaptcha.php");
  require("side/messages.php");
  require("side/connect.php");
  require("side/service.class.php");
  $recaptcha = new Recaptcha();
  $listener = new Listeners();

  $listener->updatePermissions();
  
  if(!isset($_SESSION)){
    session_start();
  }

  if(!isset($_SESSION["login_name"])){
    header("Location: login.php");
  }

  if($_SESSION["current_table"] == ""){
    $_SESSION["tables_in_db"] = $listener->getTablesFromDB();
    $_SESSION["primary_keys"] = $listener->getPrimaryKeys();
  }
?>

<!DOCTYPE html>  
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<title>LDS - <?php echo ucfirst(basename(__FILE__, ".php")); ?></title>
<link rel="icon" type="image/png" sizes="16x16" href="../lds.png">
<link href='https://fonts.googleapis.com/css?family=Exo' rel='stylesheet'>
<link href="css/materialize-fonts.css" type="text/css" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="css/materialize.min.css">
<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="css/hover-min.css">
<link rel="stylesheet" type="text/css" href="css/animate.css">
<link href="sweetalert/sweetalert.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<script src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/materialize.min.js"></script>
<script src="js/lds_js.js"></script>
<?php
  if($_SESSION["s_hover_styles"] == "true"){
    echo "<link rel='stylesheet' href='css/hover.css'>";
  }

  if($_SESSION["s_overflow_styles"] == "true"){
    echo "<link rel='stylesheet' href='css/overflow.css'>";
    echo "<style>
            #over_table::-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
              border-radius: 10px;
              background-color: #F5F5F5;
            }

            #over_table::-webkit-scrollbar {
              width: 12px;
              background-color: #F5F5F5;
            }

            #over_table::-webkit-scrollbar-thumb {
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
              background-color: " . $_SESSION["s_ui_color"] . ";
            }
          </style>";
  }
?>

<?php
  echo $listener->uiColoring(
    $listener->hexToRGB($_SESSION["s_ui_color"])
  );

  echo "<style>
          html, body {
            background: " . $_SESSION["s_ui_back_color"] . ";
          }

          .tableDump *, .dataDump * {
            color: " . $_SESSION["s_ui_text_color"] . " !important;
          }
        </style>";
?>
</head>
<body>

<?php
  if(isset($_POST["msg"])){
    $messages = new Messages();
    $messages->checkMessage($_POST["msg"]);
  }

  if($_SESSION["msg"] != ""){
    $messages = new Messages();
    $messages->checkMessage($_SESSION["msg"]);
    $_SESSION["msg"] = "";
  }
?>

<!-- MAIN NAVBAR -->
 <nav>
    <div class="nav-wrapper ui-color">
      <a href="#!" class="brand-logo">
        <img src="../lds_w.png" width="50" alt="logo" style="vertical-align: middle; padding: 0 0 5px 10px;">
      </a>
      
      <ul style="float: right">
        <li><a href="#" data-activates="slide-out" class="button-collapse show-on-large tooltipped" data-position="bottom" data-delay="50" data-tooltip="App Settings"><i class="material-icons white-text">settings</i></a></li>
      </ul>

      <ul style="float: right">
        <li><a class="modal-trigger tooltipped" href="#modal1" data-position="bottom" data-delay="50" data-tooltip="SQL History"><i class="material-icons white-text">history</i></a></li>
      </ul>
      
      <ul>
        <li><a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons white-text">menu</i></a></li>
      </ul>
      
      <ul class="right hide-on-med-and-down">
        <li>
          <a href='#' class="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Change UI Color">
            <label for="set-ui-color">
              <i class="material-icons white-text">invert_colors</i>
            </label>
          </a>
        </li>
        <li>
          <a href='#' class="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Change UI Background">
            <label for="set-ui-back-color">
              <i class="material-icons white-text">call_to_action</i>
            </label>
          </a>
        </li>
        <li>
          <a href='#' class="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Change UI Text Color">
            <label for="set-ui-text-color">
              <i class="material-icons white-text">text_fields</i>
            </label>
          </a>
        </li>
        <li>
          <a href="account.php" class="tooltipped" data-position="bottom" data-delay="50" data-tooltip="User Settings">
            <i class="material-icons white-text">account_circle</i>
          </a>
        </li>
        <li>
          <a href="logout.php" class="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Log Off">
            <i class="material-icons white-text">highlight_off</i>
          </a>
        </li>
      </ul>
      <ul class="side-nav ui-color-a-7" id="mobile-demo">
        <li class="center">
          <button class="btn waves-effect waves-light">DONATE</button>
        </li>
        <li>
          <input onchange="setSettings('s_ui_color', $(this).val())" type="color" id="set-ui-color" value=<?php echo $_SESSION["s_ui_color"]; ?>>
        </li>
        <li>
          <input onchange="setSettings('s_ui_back_color', $(this).val())" type="color" id="set-ui-back-color" value=<?php echo $_SESSION["s_ui_back_color"]; ?>>
        </li>
        <li>
          <input onchange="setSettings('s_ui_text_color', $(this).val())" type="color" id="set-ui-text-color" value=<?php echo $_SESSION["s_ui_text_color"]; ?>>
        </li>
        <li><a href="account.php">Settings</a></li>
        <li><a href="logout.php">Log Out</a></li>
      </ul>
    </div>
  </nav>
<!-- END MAIN NAVBAR -->

<!-- SELECT -->
<div class="row">
  <?php
    if($listener->checkHasPasswd()){
      echo "<div class='input-field col s12 m12' id='alertbox'>
              <div class='card red darken-1'>
                <i class='material-icons cursor' style='float:right' onclick='$(\"#alertbox\").remove()'>close</i>
                <div class='card-content center'>
                  <span class='card-title white-text'>Please, make a password in account settings!</span>
                </div>
              </div>
            </div>";
    }
  ?>

      <?php
        if($_SESSION["can_read"] != "0"){
          echo "<div class='input-field col s12 m6'>
                  <select class='browser-default ui-color-a-2' name='database' id='getDatabase' onchange='getDatabase(\"db\", this.value)'>
                    " . $listener->getAllDBs() . "
                  </select>
              </div>
              <div class='input-field col s12 m6'>
                <select class='browser-default ui-color-a-2' name='table' id='getTable' onchange='getTables(this.value)'>
                  " . $listener->getAllTables() . "
                </select>
              </div>
            </div>

            <div class='input-field'>
              <input class='center' type='text' onkeyup='searchData($(\"#getTable\").val(), this.value)' id='tableSearch' placeholder='Choose a table first...' disabled='disabled'>
            </div>";
        }
      ?>
        
    
<!-- END SELECT -->

<!-- SETTINGS NAVBAR -->
<ul id="slide-out" class="side-nav">
  <?php require("side/settings_inweb_settings.php"); ?>
</ul>
<!-- END SETTINGS NAVBAR -->

<!-- SERVICE CONTAINERS -->
<div class="addDump"></div>
<div class="tableDump"></div>
<div class="dataDump"></div>
<!-- END SERVICE CONTAINERS -->  

<!-- SQL History -->
<div id="modal1" class="modal bottom-sheet">
  <div class="modal-content">
    <h4>SQL History</h4>
    <div class="row">
      <?php
        echo $listener->getHistory();
      ?>
    </div>
  </div>
  <div class="modal-footer">
    <a href="#!" class="modal-action modal-close waves-effect waves-blue btn-flat">Close</a>
  </div>
</div>

<!-- FOOTER -->
<?php
  echo "<footer class='ui-color'>Code by XYZT &copy; 2018</footer>";
?>
<!-- END FOOTER -->

<?php
  if($_SESSION["current_table"] != ""){
    echo "<script>getTables('" . $_SESSION["current_table"] . "')</script>";
  }
?>

</body>
</html>
