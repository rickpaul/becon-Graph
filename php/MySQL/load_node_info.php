<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";

	$return = array();
	try {
		// Retrieve Settings
		$node_id = $_POST["node_id"];
		$graph_id = $_POST["graph_id"];
		// Construct Query
		$query = "select * from nodes where `node_id`=$node_id and `graph_id`=$graph_id;";
		$graph_mysqli->query($query);
		// Fetch Query Results
		$results = mysqli_fetch_array($graph_mysqli->query($query));
		$return["results"] = $results;
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	// Return Values
	echo json_encode($return);
?>