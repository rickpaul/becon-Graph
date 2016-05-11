var php_raw_data; // DEBUG
// var graph_nodes; // DEBUG
// var graph_edges; // DEBUG

function AJAX_load_Node_Info(graph_id, node_id) {
	console.log('Sending php request for (graph:node) '+graph_id+': '+node_id);
	$.ajax({
				url: '../php/MySQL/load_node_info.php',
				data: {
					graph_id: graph_id,
					node_id: node_id,
				},
				type: 'POST',
				dataType: 'JSON',
				cache: false
		})
		.done(function(data){
			console.log('PHP Done');
			php_raw_data = data; // DEBUG
			if(data.error){
				// TODO: Handle Error
				console.log('Data Error');
				console.log(data.error);
			} else if(data.results) {
				// UNIMPLEMENTED
			} else {
				throw new Error('Data Results not recognized');
			}
		})
		.fail(function(error){
			console.log('PHP Fail');
			// TODO: Handle Error
			console.log(error);
			console.log(error.responseText);
		})
	;
}

function AJAX_load_Graph_Nodes(graph_id, callback) {
	console.log('LOAD GRAPH NODES: Sending php request for (graph) '+graph_id);
	$.ajax({
			url: phpMySQLPrefix+'load_nodes.php',
			data: {
				graph_id: graph_id
			},
			type: 'POST',
			dataType: 'JSON',
			cache: false
		})
		.done(function(data){
			console.log('LOAD GRAPH NODES: Retrieved php request for (graph) '+graph_id);
			php_raw_data = data; // DEBUG
			if(data.error){
				// TODO: Handle Error
				console.log('Data Error');
				console.log(data.error);
			} else if(data.results) {
				// return array of node IDs
				var graph_nodes = data.results.map(function(d){
					return +d[0];
				});
				console.log('LOAD GRAPH NODES: Processed php request for (graph) '+graph_id);
				callback(graph_nodes);
			} else {
				throw new Error('Data Results not recognized');
			}
		})
		.fail(function(error){
			console.log(error);
			throw new Error(error.responseText); // TODO: Handle error publicly
		})
	;
}

function AJAX_load_Graph_Edges(graph_id, callback) {
	$.ajax({
			url: phpMySQLPrefix+'load_edges.php',
			data: {
				graph_id: graph_id
			},
			type: 'POST',
			dataType: 'JSON',
			cache: false
		})
		.done(function(data){
			console.log('PHP Done');
			php_raw_data = data; // DEBUG
			if(data.error){
				// TODO: Handle Error
				console.log('Data Error');
				console.log(data.error);
			} else if(data.results) {
				// return array of node IDs
				var graph_edges = data.results.map(function(d){
					return {source: +d[0], target: +d[1]};
				});
				callback(graph_edges);
			} else {
				throw new Error('Data Results not recognized');
			}
		})
		.fail(function(error){
			console.log(error);
			throw new Error(error.responseText); // TODO: Handle error publicly
		})
	;
}