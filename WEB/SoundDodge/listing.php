<?php
    $files = array_slice(scandir('songs/'), 2);

    foreach ($files as $song) {
        echo "<a href='index.php?song=" . $song . "'>" . $song . "</a><br>";
    }
?>
<br>
Upload Your Song: <a href="upload.php">HERE</a>
