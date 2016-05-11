<?php
	require_once "../config.php";
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "../../_logfiles/load_edges.log" , KLogger::DEBUG ); // DEBUG
	// $log->logDebug('Log Initialized.'); // DEBUG

	$return = array();
	try {
		// Retrieve Settings
		$graph_id = $_POST["graph_id"];

		// Construct Query
		$query = "select `source_node_id`, `target_node_id` from edges where `graph_id`=$graph_id";
		// $log->logDebug($query); // DEBUG
		// Fetch Query Results
		$query_result = $graph_mysqli->query($query);
		$return["results"] = mysqli_fetch_all($query_result);
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	// Return Values
	echo json_encode($return);
	mysqli_free_result($query_result);
?>