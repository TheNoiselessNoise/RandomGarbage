<?php
  require("side/connect.php");
  require("side/config.php");
  require("side/recaptcha.php");
  require("side/messages.php");
  require("side/service.class.php");
  $recaptcha = new Recaptcha();
  $listener = new Listeners();

  if(!isset($_SESSION)){
    session_start();
  }

  if(isset($_SESSION["login_name"])){
    header("Location: service.php");
  }

  if($listener->checkAdmin()){
      echo $listener->errRedir("login.php", "REGISTER_ADMIN_EXISTS");
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
<link rel="icon" type="image/png" sizes="16x16" href="../lds.png">
<title>LDS - <?php echo ucfirst(basename(__FILE__, ".php")); ?></title>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css">
<link href="sweetalert/sweetalert.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
<!-- Preloader -->
<div class="preloader">
  <div class="cssload-speeding-wheel"></div>
</div>

<?php
  if(isset($_POST["msg"])){
    $messages = new Messages();
    $messages->checkMessage($_POST["msg"]);
  }
?>

<!--
<section id="wrapper" class="login-register">
  <div class="login-box" style="margin: 2em auto;">
    <div class="white-box" style="text-align: center">
      <img src="../lds.png" width="100" alt="logo" style="margin: 0 0 1em 0;">
      <form class="form-horizontal form-material" id="loginform" action="side/registration.php" method="post">
        <h3 class="box-title m-b-20">Register</h3>
        <div class="form-group">
          <div class="col-xs-12">
            <input class="form-control" type="text" name="username" required="" placeholder="Username">
          </div>
        </div>
        <div class="form-group">
          <div class="col-xs-12">
            <input class="form-control" type="password" name="password" required="" placeholder="Password">
          </div>
        </div>
        <div class="form-group">
          <div class="col-xs-12">
            <input class="form-control" type="password" name="password_check" required="" placeholder="Password again">
          </div>
        </div>
        <div class="form-group">
          <div class="col-xs-12">
            <?php
                $recaptcha->create();
            ?>
          </div>
        </div>
        <div class="form-group text-center m-t-20">
          <div class="col-xs-12">
            <button class="btn btn-primary btn-lg btn-block text-uppercase waves-effect waves-light" type="submit">Register</button>
          </div>
        </div>
      </form>
      <a href="login.php">Have an account?</a>
    </div>
  </div>
</section>
-->
<div id="login_form">
    <center>
      <div class="section"></div>
      <img src="../lds_b.png" width="100" alt="logo" style="margin: 0 0 1em 0;">

      <div class="container">
        <div class="z-depth-1 grey lighten-4 row" style="display: inline-block; padding: 10px 48px 0px 48px; border: 1px solid #EEE;">
          <h5 class="pink-text">REGISTER</h5>

          <form class="col s12" action="side/registration.php" method="post" autocomplete="off">
            <div class='row'>
              <div class='input-field col s12'>
                <input class='validate' type='text' name='username' id="username" />
                <label for='username'>Username</label>
              </div>
            </div>

            <div class='row'>
              <div class='input-field col s12'>
                <input class='validate' type='password' name='password' id="password" />
                <label for='password'>Password</label>
              </div>
            </div>

            <div class='row'>
              <div class='input-field col s12'>
                <input class='validate' type='password' name='password_check' id="password_check" />
                <label for='password_check'>Password again</label>
              </div>
            </div>

            <div class="row">
              <div class="input-field col s12">
                <?php
                  $recaptcha->create();
                ?>
              </div>
              <label style='float: right;'>
                <a class="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Recaptcha is just one little security, which can be turned off when logging in, in admin menu">Recaptcha?</a>
              </label>
            </div>

            <br />
            <center>
              <div class='row'>
                <button type='submit' name='btn_login' class='col s12 btn btn-large waves-effect indigo'>Register</button>
              </div>
            </center>
          </form>
        </div>
      </div>
    </center>
</div>

<script src="js/jquery.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min.js"></script>
</body>
</html>
