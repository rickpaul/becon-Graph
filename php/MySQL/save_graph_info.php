<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";

	$return = array();
	try {
		// Retrieve Settings
		$graph_id = $_POST["graph_id"];
		$graph_name = $_POST["graph_name"];
		$graph_desc = $_POST["graph_desc"];
		// Construct Query
		$query = "insert into `graphs`
		(`graph_id`, `graph_name`, `graph_desc`)
		values ($graph_id, '$graph_name', '$graph_desc')
		on duplicate key update `graph_name`='$graph_name', `graph_desc`='$graph_desc';";
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