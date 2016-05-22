<?php
	$arr = $_POST["columns"];
	echo json_encode(implode(",", $arr));
?>