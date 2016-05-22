<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";
	
	$return = array();
	try {
		// Retrieve Settings
		$graph_id = $_POST["graph_id"];
		// Construct Query
		$query = "select * from graphs where `graph_id`=$graph_id;";
		$graph_mysqli->query($query);
		// Fetch Query Results
		$results = mysqli_fetch_row($graph_mysqli->query($query));
		$return["results"] = $results;
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	// Return Values
	echo json_encode($return);
?>