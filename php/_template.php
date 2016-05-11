<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "../../_logfiles/load_node_info.log" , KLogger::DEBUG ); // DEBUG
	// $log->logDebug('Log Initialized.'); // DEBUG
	// $log->logDebug(json_encode($_POST)); // DEBUG
	// $log->logDebug(file_get_contents('php://input')); // DEBUG
	// $log->logDebug($_SERVER['REQUEST_METHOD']); // DEBUG
	
	$return = array();
	try {
		// Retrieve Settings
		$______ = $_POST["______"];

		// Construct Query
		$query = "______";

		// Fetch Query Results
		$results = mysqli_fetch_array($graph_mysqli->query($query));
		$return["results"] = $results;
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	// Return Values
	echo json_encode($return);
?>