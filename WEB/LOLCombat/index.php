<?php
    require("combat.class.php");
    $combat = new CombatSystem();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="main.css">
    <script src="jquery.min.js"></script>
    <script src="champion.js?newversion"></script>
    <script src="main.js?version"></script>
    <title>Combat System</title>
</head>
<body>
    <div id="combat">
        <?php
            if(!isset($_POST["username"])){
                $combat->getName();
            } else {
                $combat->start($_POST["username"]);
            }
        ?>
    </div>
    <?php
        $combat->getScript();
    ?>
</body>
</html>