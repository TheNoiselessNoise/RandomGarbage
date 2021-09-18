<?php
  require("side/config.php");
  require("side/recaptcha.php");
  require("side/messages.php");
  require("side/connect.php");
  require("side/service.class.php");
  $recaptcha = new Recaptcha();
  $listener = new Listeners();
  
  if(!isset($_SESSION)){
    session_start();
  }

  if(isset($_SESSION["login_name"])){
    header("Location: service.php");
  }

  if(!isset($_COOKIE["lds_lang"])){
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
<link rel="icon" type="image/png" sizes="16x16" href="../lds.png">
<title>LDS - <?php echo ucfirst(basename(__FILE__, ".php")); ?></title>
<link rel="stylesheet" type="text/css" href="css/materialize-fonts.css">
<link rel="stylesheet" type="text/css" href="css/materialize.min.css">
<link rel="stylesheet" type="text/css" href="css/hover-min.css">
<link rel="stylesheet" type="text/css" href="css/animate.css">
<link rel="stylesheet" type="text/css" href="sweetalert/sweetalert.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<script>
  function checkForMod(name){
    $.post("side/something.php", {username:name}, function(data){
      console.log(data);
      if(data == true){
        $("#password").hide();
      } else {
        $("#password").show();
      }
    });
  }
</script>
</head>
<body>

<?php
  if(isset($_POST["msg"])){
    $messages = new Messages();
    $messages->checkMessage($_POST["msg"]);
  }
?>

<div id="login_form">
    <center>
      <div class="section"></div>
      <img src="../lds_b.png" width="100" alt="logo" style="margin: 0 0 1em 0;">

      <div class="container">
        <div class="z-depth-1 grey lighten-4 row" style="display: inline-block; padding: 10px 48px 0px 48px; border: 1px solid #EEE;">
          <h5 class="pink-text">LOGIN</h5>

          <form class="col s12" action="side/loggedin.php" method="post" autocomplete="off">
            <div class='row'>
              <div class='input-field col s12'>
                <input class='validate' type='text' name='username' id="username" onkeyup="checkForMod(this.value)" />
                <label for='username'>Username</label>
              </div>
            </div>

            <div class='row'>
              <div class='input-field col s12'>
                <input class='validate' type='password' name='password' id="password" />
                <label for='password'>Password</label>
              </div>
              <label style='float: right;'>
                <a class='pink-text' href='#!'>
                  <b>
                    Forgot Password? 
                    <i class='material-icons info tooltipped cursor' data-position='bottom' data-delay='50' data-tooltip='Sad.. Ask the Admin!'>info_outline</i>
                  </b>
                </a>
              </label>
            </div>

            <div class="row">
              <div class="input-field col s12">
                <?php
                  if($listener->isCaptcha()){
                    $recaptcha->create();
                  }
                ?>
              </div>
            </div>

            <br />
            <center>
              <div class='row'>
                <button type='submit' name='btn_login' class='col s12 btn btn-large waves-effect indigo'>Login</button>
              </div>
            </center>
          </form>
        </div>
      </div>
      <?php
        if($listener->checkAdmin()){
          echo "<p>Admin account is registered already! Please, log in.</p>";
        } else {
          echo "<a href='register.php'>You don't have an admin account, register it here!</a>";
        }
      ?>
    </center>
</div>

<script src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/materialize.min.js"></script>
</body>
</html>
