<?php
	header("Content-Type: application/json", true);
	// require_once "../config.php";
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "../../_logfiles/save_node_info.log" , KLogger::DEBUG ); // DEBUG
	// $log->logDebug('Log Initialized.'); // DEBUG

	$return = array();
	try {
		// Retrieve Settings
		$graph_id = $_POST["graph_id"];
		$node_id = $_POST["node_id"];
		$columns = $_POST["columns"];
		$values = $_POST["values"];
		$update = array();
		foreach ($_POST["values"] as $i => $value) {
			array_push($update, "$columns[$i]=$value");
		}
		$update = implode(', ' ,$update);
		$values = implode(', ' ,$values);
		$columns = implode(', ' ,$columns);

		// Construct Query
		$query = "insert into `nodes`
		(`graph_id`, `node_id`, $columns)
		values ($graph_id, $node_id, $values)
		on duplicate key update $update;
		";
		// $log->logDebug($query); // DEBUG
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