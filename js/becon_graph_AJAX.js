var php_raw_data; // DEBUG

function AJAX_TrueFalse_Call(url, data, callback) {
	'use strict'
	$.ajax({
			url: url,
			data: data,
			type: 'POST',
			dataType: 'JSON',
			cache: false
		})
		.done(function(data){
			php_raw_data = data; // DEBUG
			if(data.error){
				console.log(data.error);
				callback(data.error, null);
			} else if(typeof(data.results) !== 'undefined') {
				callback(null, data.results); // data results is success is num rows affected. 0/1.
			} else if(typeof(data.results) === 'undefined') {
				console.log('Data Results not recognized');
				callback('Data Results not recognized', null);
			}
		})
		.fail(function(error){
			php_raw_data = error; // DEBUG
			console.log(error);
			callback(error.responseText, null);
		})
	;
}

function AJAX_delete_Node(node_id, callback) {
	var url = phpMySQLPrefix+'delete_node.php';
	var data = {
		node_id: node_id,
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

// DEPRECATED? 05-24-2016
function AJAX_copy_Node(node_id, old_graph_id, new_graph_id, callback) {
	var url = phpMySQLPrefix+'copy_node.php';
	var data = {
		node_id: node_id,
		old_graph_id: old_graph_id,
		new_graph_id: new_graph_id,
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_copy_Nodes(old_graph_id, new_graph_id, callback) {
	var url = phpMySQLPrefix+'copy_nodes.php';
	var data = {
		old_graph_id: old_graph_id,
		new_graph_id: new_graph_id,
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_copy_Edges(old_graph_id, new_graph_id, callback) {
	var url = phpMySQLPrefix+'copy_edges.php';
	var data = {
		old_graph_id: old_graph_id,
		new_graph_id: new_graph_id,
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_save_Edge(graph_id, source_node_id, target_node_id, callback) {
	var url = phpMySQLPrefix+'save_edge.php';
	var data = {
		graph_id: graph_id,
		source_node_id: source_node_id,
		target_node_id: target_node_id
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_delete_Edge(graph_id, source_node_id, target_node_id, callback) {
	var url = phpMySQLPrefix+'delete_edge.php';
	var data = {
		graph_id: graph_id,
		source_node_id: source_node_id,
		target_node_id: target_node_id
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

// DEPRECATED! 05-21-2016.
// Using for debugging.
function AJAX_lock_Edges(graph_id, callback) {
	var url = phpMySQLPrefix+'lock_edges.php';
	var data = {
		graph_id: graph_id
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_unlock_Edges(graph_id, callback) {
	var url = phpMySQLPrefix+'unlock_edges.php';
	var data = {
		graph_id: graph_id
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_delete_unlocked_Edges(graph_id, callback) {
	var url = phpMySQLPrefix+'unlock_edges.php';
	var data = {
		graph_id: graph_id
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_save_Graph_Info(graph_id, graph_name, graph_desc, callback) {
	var url = phpMySQLPrefix+'save_graph_info.php';
	var data = {
		graph_id: graph_id,
		graph_name: graph_name,
		graph_desc: graph_desc
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_save_new_Graph(graph_name, graph_desc, callback) {
	$.ajax({
			url: phpMySQLPrefix+'insert_graph.php',
			data: {
				graph_name: graph_name,
				graph_desc: graph_desc
			},
			type: 'POST',
			dataType: 'JSON',
			cache: false
		}).done(function(data){
			php_raw_data = data; // DEBUG
			if(data.error){
				console.log(data.error);
				callback(data.error, null);
			} else if(typeof(data.results) !== 'undefined') {
				callback(null, data.results);
			} else if(typeof(data.results) === 'undefined') {
				console.log('Data Results not recognized');
				callback('Data Results not recognized', null);
			}
		}).fail(function(error){
			console.log(error);
			callback(error.responseText, null);
		})
	;
}

function AJAX_save_Node_Info(graph_id, node_obj, callback) {
	var MySQL_columns = [
		'`name`',
		'`type`',
		'`x_pos`',
		'`y_pos`',
		'`description`',
	];
	var node_data = [
		'\''+ node_obj.name+'\'',
		'\''+	Node_type_MySQL_ID_Map[node_obj.type]+'\'',
		node_obj.x,
		node_obj.y,
		'\''+	node_obj.desc+'\'',
	];
	if(node_obj.type === consts.CONCEPT) {
		// MySQL_columns.push('`concept_aggregation`');
		// node_data.push(node_obj.concept_aggregation);
	} else if(node_obj.type === consts.INPUT) {
		MySQL_columns.push('`input_source_id`');
		node_data.push(node_obj.input_source);
	} else if(node_obj.type === consts.OUTPUT) {
		MySQL_columns.push('`output_target_id`');
		node_data.push(node_obj.output_target);
	} else if(node_obj.type === consts.OPERATIONAL) {
		MySQL_columns.push('`operation_type`');
		node_data.push(node_obj.operation_type);
		MySQL_columns.push('`operation_left`');
		node_data.push(node_obj.operation_left);
		MySQL_columns.push('`operation_right`');
		node_data.push(node_obj.operation_right);
	}
	// Send Save Command
	var url = phpMySQLPrefix+'save_node_info.php';
	var data = {
		graph_id: graph_id,
		node_id: node_obj.id,
		columns: MySQL_columns,
		values: node_data
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_load_Node_Info(graph_id, node_id, callback) {
	// console.log('LOAD NODE INFO: Sending php request for (graph:node) '+graph_id+': '+node_id); // DEBUG
	$.ajax({
			url: phpMySQLPrefix+'load_node_info.php',
			data: {
				graph_id: graph_id,
				node_id: node_id,
			},
			type: 'POST',
			dataType: 'JSON',
			cache: false
		})
		.done(function(data){
			if(data.error){
				console.log(data.error);
				callback(data.error, null);
			} else if(data.results) {
				// console.log('LOAD NODE INFO: Received php request for (graph:node) '+graph_id+': '+node_id); // DEBUG
				var node_params = {};
				node_params.id = parseInt(data.results.node_id);
				node_params.name = data.results.name;
				node_params.type = MySQL_ID_node_type_Map[data.results.type];
				node_params.x = parseInt(data.results.x_pos);
				node_params.y = parseInt(data.results.y_pos);
				if(node_params.type === consts.CONCEPT) {
					node_params.concept_aggregation = data.results.concept_aggregation;
				} else if(node_params.type === consts.INPUT) {
					node_params.input_source = parseInt(data.results.input_source_id);
				} else if(node_params.type === consts.OUTPUT) {
					node_params.output_target = parseInt(data.results.output_target_id);
				} else if(node_params.type === consts.OPERATIONAL) {
					node_params.operation_left = parseInt(data.results.operation_left);
					node_params.operation_right = parseInt(data.results.operation_right);
					node_params.operation_type = data.results.operation_type;
				}
				// console.log('LOAD NODE INFO: Processed php request for (graph:node) '+graph_id+': '+node_id); // DEBUG
				callback(null, node_params);
			} else if(typeof(data.results) === 'undefined') {
				console.log('Data Results not recognized');
				callback('Data Results not recognized', null);
			}
		})
		.fail(function(error){
			console.log(error);
			callback(error.responseText, null);
		})
	;
}

function AJAX_load_Graph_Nodes(graph_id, callback) {
	// console.log('LOAD GRAPH NODES: Sending php request for (graph) '+graph_id); // DEBUG
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
			// console.log('LOAD GRAPH NODES: Retrieved php request for (graph) '+graph_id); // DEBUG
			php_raw_data = data; // DEBUG
			if(data.error){
				console.log(data.error);
				callback(data.error, null);
			} else if(data.results) {
				var graph_nodes = data.results.map(function(d){
					return +d[0];
				});
				// console.log('LOAD GRAPH NODES: Processed php request for (graph) '+graph_id); // DEBUG
				callback(null, graph_nodes);
			} else if(typeof(data.results) === 'undefined') {
				console.log('Data Results not recognized');
				callback('Data Results not recognized', null);
			}
		})
		.fail(function(error){
			console.log(error);
			callback(error.responseText, null);
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
			if(data.error){
				console.log(data.error);
				callback(data.error, null);
			} else if(data.results) {
				var graph_edges = data.results.map(function(d) {
					return {source: +d[0], target: +d[1]};
				});
				callback(null, graph_edges);
			} else if(typeof(data.results) === 'undefined') {
				console.log('Data Results not recognized');
				callback('Data Results not recognized', null);
			}
		})
		.fail(function(error){
			console.log(error);
			callback(error.responseText, null);
		})
	;
}

function AJAX_get_Node_ID_Count(callback) {
	$.ajax({
			url: phpMySQLPrefix+'get_next_node_id.php',
			cache: false
		})
		.done(function(data){
			php_raw_data = data; // DEBUG
			if(data.error){
				console.log(data.error);
				callback(data.error, null);
			} else if(typeof(data.results) !== 'undefined') {
				callback(null, data.results[0]);
			} else if(typeof(data.results) === 'undefined') {
				console.log('Data Results not recognized');
				callback('Data Results not recognized', null);
			}
		})
		.fail(function(error){
			console.log(error);
			callback(error.responseText, null);
		})
	;
}

function AJAX_get_Graph_ID_Count(callback) {
	$.ajax({
			url: phpMySQLPrefix+'get_next_graph_id.php',
			cache: false
		})
		.done(function(data){
			php_raw_data = data; // DEBUG
			if(data.error){
				console.log(data.error);
				callback(data.error, null);
			} else if(typeof(data.results) !== 'undefined') {
				callback(null, data.results[0]);
			} else if(typeof(data.results) === 'undefined') {
				console.log('Data Results not recognized');
				callback('Data Results not recognized', null);
			}
		})
		.fail(function(error){
			console.log(error);
			callback(error.responseText, null);
		})
	;
}

function AJAX_load_Graphs(callback) {
	$.ajax({
			url: phpMySQLPrefix+'load_graphs.php',
			cache: false
		})
		.done(function(data){
			if(data.error){
				console.log(data.error);
				callback(data.error, null);
			} else if(data.results) {
				callback(null, data.results);
			} else if(typeof(data.results) === 'undefined') {
				console.log('Data Results not recognized');
				callback('Data Results not recognized', null);
			}
		})
		.fail(function(error){
			console.log(error);
			callback(error.responseText, null);
		})
	;
}

function AJAX_load_Graph_Info(graph_id, callback) {
	$.ajax({
			url: phpMySQLPrefix+'load_graph_info.php',
			data: {
				graph_id: graph_id
			},
			type: 'POST',
			dataType: 'JSON',
			cache: false
		})
		.done(function(data){
			if(data.error){
				console.log(data.error);
				callback(data.error, null);
			} else if(data.results) {
				var graph_info = {};
				graph_info['id'] = data.results[0];
				graph_info['name'] = data.results[1];
				graph_info['desc'] = data.results[2];
				callback(null, graph_info);
			} else if(typeof(data.results) === 'undefined') {
				console.log('Data Results not recognized');
				callback('Data Results not recognized', null);
			}
		})
		.fail(function(error){
			console.log(error);
			callback(error.responseText, null);
		})
	;
}
