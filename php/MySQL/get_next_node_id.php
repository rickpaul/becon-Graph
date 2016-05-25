<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "../../_logfiles/get_max_node_id.log" , KLogger::DEBUG ); // DEBUG
	// $log->logDebug('Log Initialized.'); // DEBUG

	$return = array();
	try {
		// Construct Query
		$query = "
			SELECT 
				`AUTO_INCREMENT`
			FROM 
				INFORMATION_SCHEMA.TABLES
			WHERE 
				TABLE_SCHEMA = 'becon_graph'
			AND 
				TABLE_NAME = 'nodes';
		";
		// Fetch Query Results
		// $log->logDebug($query); // DEBUG
		$query_result = $graph_mysqli->query($query);
		$return["results"] = mysqli_fetch_row($query_result);
		// $log->logDebug(json_encode($return["results"])); // DEBUG
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	// Return Values
	echo json_encode($return);
	mysqli_free_result($query_result);
?>