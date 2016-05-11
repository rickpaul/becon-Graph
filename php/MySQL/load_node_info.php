<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "../../_logfiles/load_node_info.log" , KLogger::DEBUG ); // DEBUG
	// $log->logDebug('Log Initialized.'); // DEBUG
	
	$return = array();
	try {
		// Retrieve Settings
		$node_id = $_POST["node_id"];
		$graph_id = $_POST["graph_id"];
	

		// Construct Query
		$query = "select * from nodes where `node_id`=$node_id and `graph_id`=$graph_id;";
		// $log->logDebug($query); // DEBUG
		$graph_mysqli->query($query);
		// $log->logDebug('1'); // DEBUG
		// Fetch Query Results
		$results = mysqli_fetch_array($graph_mysqli->query($query));
		// $log->logDebug($results); // DEBUG
		$return["results"] = $results;
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	// Return Values
	echo json_encode($return);
?>