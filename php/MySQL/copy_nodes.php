<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";
	require_once "../KLogger.php"; // DEBUG
	$log = new KLogger ( "../../_logfiles/copy_nodes.log" , KLogger::DEBUG ); // DEBUG
	$log->logDebug('Log Initialized.'); // DEBUG

	function get_node_ids($graph_mysqli, $old_graph_id) {
		// Retrieve Settings
		$graph_id = $_POST["graph_id"];
		// Construct Query
		$query = "select `node_id` from nodes where `graph_id`=$old_graph_id;";
		// Fetch Query Results
		$query_result = $graph_mysqli->query($query);
		return $query_result->fetch_all(MYSQLI_NUM);
	}

	function copy_single_node($graph_mysqli, $node_id, $old_graph_id, $new_graph_id) {
		$query = "				

			DROP TEMPORARY TABLE IF EXISTS
				`tmp_copy_node`;

			CREATE TEMPORARY TABLE `tmp_copy_node` (
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
		";
		// $log->logDebug($query); // DEBUG
		// Fetch Query Results
		if($query_result = $graph_mysqli->multi_query($query)) {
			while ($result = $graph_mysqli->next_result()) {
				// DO NOTHING
			} 
		}
		return ($query_result);
	}

	$return = array();
	try {
		// Retrieve Settings
		$old_graph_id = $_POST["old_graph_id"];
		$new_graph_id = $_POST["new_graph_id"];

		$node_ids = get_node_ids($graph_mysqli, $old_graph_id);
		$success = true;
		foreach($node_ids as $node_id) {
			$success = ($success && copy_single_node($graph_mysqli, $node_id[0], $old_graph_id, $new_graph_id));
		}
		$return["results"] = $success;
	} catch (Exception $e) {
		$return["error"] = $e;
	}
	echo json_encode($return);
?>










