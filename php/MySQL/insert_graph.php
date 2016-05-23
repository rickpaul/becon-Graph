<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "../../_logfiles/insert_graph.log" , KLogger::DEBUG ); // DEBUG
	// $log->logDebug('Log Initialized.'); // DEBUG

	$return = array();
	try {
		// Retrieve Settings
		$graph_name = $_POST["graph_name"];
		$graph_desc = $_POST["graph_desc"];
		// Check for Duplicate Name / Construct Query
		$query = "select * from `graphs` where `graph_name`='$graph_name';";
		$query_result = $graph_mysqli->query($query);
		if($query_result->num_rows) {
			$return["error"] = "Error: Duplicate graph name found.";
		} else {
			// Insert Graph / Construct Query
			$query = "insert into `graphs`
			(`graph_name`, `graph_desc`)
			values ('$graph_name', '$graph_desc');";
			// Insert Graph / Fetch Query Results
			$query_result = $graph_mysqli->query($query);
			// Insert Graph / Return last ID to save as Graph ID
			$return["results"] = $graph_mysqli->insert_id;
		}
	} catch (Exception $e) {
		$return["error"] = $e;
	}
	// Return Values
	echo json_encode($return);
	mysqli_free_result($query_result);
?>