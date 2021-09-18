<?php
  require("side/config.php");
  require("side/recaptcha.php");
  require("side/messages.php");
  require("side/connect.php");
  require("side/service.class.php");
  require("side/service-account.class.php");
  $recaptcha = new Recaptcha();
  $listener = new Listeners();
  $account = new Account();

  $listener->updatePermissions();
  
  if(!isset($_SESSION)){
    session_start();
  }

  if(!isset($_SESSION["login_name"])){
    header("Location: login.php");
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
<link href="css/materialize-fonts.css" type="text/css" rel="stylesheet">
<link href='https://fonts.googleapis.com/css?family=Exo' rel='stylesheet'>
<link rel="stylesheet" type="text/css" href="css/materialize.min.css">
<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="css/hover-min.css">
<link rel="stylesheet" type="text/css" href="css/animate.css">
<link href="sweetalert/sweetalert.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" type="text/css" href="css/style.css">

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

      <ul>
        <li><a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons white-text">menu</i></a></li>
      </ul>
      
      <ul class="right hide-on-med-and-down">
        <li>
          <a href='service.php' class="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Back to Service"><i class="material-icons white-text">wb_cloudy</i></a>
        </li>
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
        <li>
          <a href='service.php'>Back to Service</a>
        </li>
        <li><a href="account.php">Settings</a></li>
        <li><a href="logout.php">Log Out</a></li>
      </ul>
    </div>
  </nav>
<!-- END MAIN NAVBAR -->

<!-- SETTINGS -->
<div class='row'>
  <div class="<?php echo ($_SESSION['can_add_mod'] == '1' ? 'col s12 m6 l6' : 'col s12 m6 offset-m3'); ?>">
    <div class='card'>
      <div class='card-content center'>
        <span class='card-title black-text'>Change password</span>
        <form action='side/account/changepass.php' method='post'>

          <div class='row'>
            <?php
              if($listener->checkHasPasswd()){
                echo "<div class='input-field col s6'>
                        <input type='hidden' name='oldpass'>
                        <input id='newpass' type='password' name='newpass'>
                        <label for='newpass'>New password</label>
                      </div>
                      <div class='input-field col s6'>
                        <input id='newpasscheck' type='password' name='newpasscheck'>
                        <label for='newpasscheck'>New password again</label>
                      </div>";
              } else {
                echo "<div class='input-field col s6'>
                        <input id='oldpass' type='password' name='oldpass'>
                        <label for='oldpass'>Old password</label>
                      </div>
                      <div class='input-field col s6'>
                        <input id='newpass' type='password' name='newpass'>
                        <label for='newpass'>New password</label>
                      </div>
                      <div class='input-field col s6 offset-m6'>
                        <input id='newpasscheck' type='password' name='newpasscheck'>
                        <label for='newpasscheck'>New password again</label>
                      </div>";
              }
            ?>
          </div>

          <div class='row'>
            <div class='input-field col s12'>
              <input type='submit' class='btn' value='Set new password'>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>

<?php
  echo $account->addModerators();  
  echo $account->accountPermissions();
  echo $account->manageModerators();  
?>

<!-- END SETTINGS -->

<!-- FOOTER -->
<?php
  echo "<footer class='ui-color'>Code by XYZT &copy; 2018</footer>";
?>
<!-- END FOOTER -->

<script src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/materialize.min.js"></script>
<script src="js/lds_js.js"></script>

</body>
</html>