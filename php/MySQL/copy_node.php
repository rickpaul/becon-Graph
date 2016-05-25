<?php
	// DEPRECATED? 05-24-2016
	// DEPRECATED? 05-24-2016
	// DEPRECATED? 05-24-2016
	// DEPRECATED? 05-24-2016
	// DEPRECATED? 05-24-2016
	// DEPRECATED? 05-24-2016
	// DEPRECATED? 05-24-2016
	// DEPRECATED? 05-24-2016
	// DEPRECATED? 05-24-2016
	// DEPRECATED? 05-24-2016
	header("Content-Type: application/json", true);
	require_once "../config.php";
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "../../_logfiles/copy_node.log" , KLogger::DEBUG ); // DEBUG
	// $log->logDebug('Log Initialized.'); // DEBUG

	$return = array();
	try {
		// Retrieve Settings
		$node_id = $_POST["node_id"];
		$old_graph_id = $_POST["old_graph_id"];
		$new_graph_id = $_POST["new_graph_id"];
		//Construct Query
		$query = "
		CREATE TEMPORARY TABLE `tmp_copy_node` AS (
		SELECT
			`graph_id`,
			`name`,
			`type`,
			`description`,
			`operation_left`,
			`operation_right`,
			`input_source_id`,
			`output_target_id`,
			`x_pos`,
			`y_pos`,
			`operation_type`,
			`concept_aggregation`
		FROM
			`nodes`
		WHERE
			`nodes`.`node_id` = $node_id AND `nodes`.`graph_id` = $old_graph_id
		);

		UPDATE
			`tmp_copy_node`
		SET
			`graph_id` = $new_graph_id
		WHERE
			1;

		INSERT
		INTO
			`nodes` (
				`graph_id`,
				`name`,
				`type`,
				`description`,
				`operation_left`,
				`operation_right`,
				`input_source_id`,
				`output_target_id`,
				`x_pos`,
				`y_pos`,
				`operation_type`,
				`concept_aggregation`
			)
		SELECT
			*
		FROM
			`tmp_copy_node`;

		DROP TEMPORARY TABLE IF EXISTS
			`tmp_copy_node`;
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