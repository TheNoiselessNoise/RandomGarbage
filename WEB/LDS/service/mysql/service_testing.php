<?php
	require("../side/connect.php");
    echo $_POST["test"];
?>
<form method="post">
  <input type="checkbox" name="test">
  <input type="submit" value="Submit">
</form>