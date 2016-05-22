<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";

	$return = array();
	try {
		// Retrieve Settings
		$graph_id = $_POST["graph_id"];
		$source_node_id = $_POST["source_node_id"];
		$target_node_id = $_POST["target_node_id"];
		// Construct Query
		$query = "insert into `edges` (`graph_id`, `source_node_id`, `target_node_id`) values ($graph_id, $source_node_id, $target_node_id);";
		// Fetch Query Results
		$query_result = $graph_mysqli->query($query);
		// Return Affected Rows (as success/failure)
		// (Note: Will return 0 if nothing is changed.)
		if ($graph_mysqli->affected_rows > 0) {
			$return["results"] = 1;
		} else {
			$return["results"] = 0;
		}
	} catch (Exception $e) {
		$return["error"] = $e;
	}
	// Return Values
	echo json_encode($return);
	mysqli_free_result($query_result);
?>