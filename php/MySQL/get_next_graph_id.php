<?php
	header("Content-Type: application/json", true);
	require_once "../config.php";

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
			TABLE_NAME = 'graphs';
		";
		// Fetch Query Results
		$query_result = $graph_mysqli->query($query);
		$return["results"] = mysqli_fetch_row($query_result);
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	// Return Values
	echo json_encode($return);
	mysqli_free_result($query_result);
?>