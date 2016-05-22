<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";

	$return = array();
	try {
		// Construct Query
		$query = "select `graph_id`, `graph_name` from graphs;";
		// Fetch Query Results
		$query_result = $graph_mysqli->query($query);
		$return["results"] = $query_result->fetch_all(MYSQLI_ASSOC);
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	// Return Values
	echo json_encode($return);
	mysqli_free_result($query_result);
?>