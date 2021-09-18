<?php
    require_once "classes/HackIntoMe.class.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?php echo (isset($_SESSION["LOGIN_SUCCESS"]) ? "Continue..." : "Try It");?></title>
    <link rel="stylesheet" href="css/main.css">
    <script src="js/jquery.min.js"></script>
</head>
<body>
    <?php if(!isset($_SESSION["LOGIN_SUCCESS"])): ?>
        <script src="js/login.js"></script>

        <nav>
            <a href="index.php">LOGIN</a>
        </nav>

        <div id="wrapper">
            <form method="POST" id="loginForm" onsubmit="return false;">
                <label for="userToken">TOKEN
                    <input type="text" id="userToken" name="userToken">
                </label>

                <input type="button" id="submitLogin" value="Access" disabled>
                <span id="access_message"></span>
            </form>
        </div>
    <?php else: ?>
        <nav>
            <a href="index.php?a=really">Really?</a>
            <a href="index.php">LOGIN</a>
            <a href="index.php">LOGIN</a>
            <a href="index.php">LOGIN</a>
        </nav>

        <div id="wrapper">
            <?php echo HackIntoMe::getPage($_REQUEST); ?>
        </div>
    <?php endif; ?>

    <footer>
        <a href="https://xyzt.cz/">XYZT</a>
        &copy;
        <?php echo date("Y"); ?>
    </footer>
</body>
</html>