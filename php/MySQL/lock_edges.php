<?php
	// DEPRECATED, I THINK! 05-21-2016
	// DEPRECATED, I THINK! 05-21-2016
	// DEPRECATED, I THINK! 05-21-2016
	// DEPRECATED, I THINK! 05-21-2016
	// DEPRECATED, I THINK! 05-21-2016
	// DEPRECATED, I THINK! 05-21-2016
	// DEPRECATED, I THINK! 05-21-2016
	// DEPRECATED, I THINK! 05-21-2016
	// DEPRECATED, I THINK! 05-21-2016
	// DEPRECATED, I THINK! 05-21-2016
	// DEPRECATED, I THINK! 05-21-2016
	header("Content-Type: application/json", true);
	require_once "../config.php";

	$return = array();
	try {
		// Retrieve Settings
		$graph_id = $_POST["graph_id"];
		// Construct Query
		$query = "update `edges` set `locked`=1 where `graph_id`=$graph_id;";
		// Fetch Query Results
		$query_result = $graph_mysqli->query($query);
		// Return Affected Rows (as success/failure)
		// (Note: Will return 0 if nothing is changed.)
		if ($graph_mysqli->affected_rows > 0) {
			$return["results"] = $graph_mysqli->affected_rows;
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