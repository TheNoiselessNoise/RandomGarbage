<html>
    <head>
        <meta charset="utf-8">
        <title>Sound</title>

        <script src="jquery.min.js" charset="utf-8"></script>
        <script src="p5.min.js" charset="utf-8"></script>
        <script src="p5.sound.min.js" charset="utf-8"></script>
        <script src="p5.dom.min.js" charset="utf-8"></script>
        <script src="sound.js" charset="utf-8"></script>
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
