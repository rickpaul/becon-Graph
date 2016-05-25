<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "../../_logfiles/copy_edges.log" , KLogger::DEBUG ); // DEBUG
	// $log->logDebug('Log Initialized.'); // DEBUG

	$return = array();
	try {
		// Retrieve Settings
		$old_graph_id = $_POST["old_graph_id"];
		$new_graph_id = $_POST["new_graph_id"];
		//Construct Query
		$query = "
		CREATE TEMPORARY TABLE `tmp_copy_edges` AS (
		SELECT
			*
		FROM
			`edges`
		WHERE
			`edges`.`graph_id` = $old_graph_id
		);

		UPDATE
			`tmp_copy_edges`
		SET
			`graph_id` = $new_graph_id
		WHERE
			1;

		INSERT
		INTO
			`edges` 
		SELECT
			*
		FROM
			`tmp_copy_edges`;

		DROP TEMPORARY TABLE IF EXISTS
			`tmp_copy_edges`;
		";
		// $log->logDebug($query); // DEBUG
		// Fetch Query Results
		$query_result = $graph_mysqli->multi_query($query);	
		$affected_rows = $graph_mysqli->affected_rows;
		if($affected_rows == -1) {
			$return["error"] = $graph_mysqli->error;
		} else {
			$return["results"] = $affected_rows;
		}
	} catch (Exception $e) {
		$return["error"] = $e;
	}
	// Return Values
	echo json_encode($return);
	mysqli_free_result($query_result);
?>