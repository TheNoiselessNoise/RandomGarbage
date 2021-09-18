<html>
    <head>
        <meta charset="utf-8">
        <title>MusicFlood</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="jquery.min.js" charset="utf-8"></script>
        <script src="p5.min.js" charset="utf-8"></script>
        <script src="p5.sound.min.js" charset="utf-8"></script>
        <script src="p5.dom.min.js" charset="utf-8"></script>
        <script src="side.js" charset="utf-8"></script>
        <script src="block.js" charset="utf-8"></script>
        <script src="healthbar.js" charset="utf-8"></script>
        <script src="powerups.js" charset="utf-8"></script>
        <script src="particles.js" charset="utf-8"></script>
        <script src="sound.js" charset="utf-8"></script>
        <style media="screen">
            * {
                padding: 0;
                margin: 0;
            }
            canvas {
                padding: 0;
                margin: 0;
            }
        </style>
    </head>
    <body>
        <?php
            if(isset($_GET["song"])){
                echo "<input type='hidden' id='song' value='" . $_GET["song"] . "'>";
            } else {
                header("Location: listing.php");
            }
        ?>
    </body>
</html>
