////////////////////////////////////////////////////////////////////////////////
// Helper Variables
// These probably aren't necessary forever
////////////////////////////////////////////////////////////////////////////////
// var console_callback_fn = function(e, d){console.log(d);};
////////////////////////////////////////////////////////////////////////////////
// State Variables
// These probably aren't necessary forever
////////////////////////////////////////////////////////////////////////////////
var edit_graph = null; // Sloppy...
////////////////////////////////////////////////////////////////////////////////
// WEB CODE
////////////////////////////////////////////////////////////////////////////////

function WEB_show_load_graph_subform() {
	WEB_hide_graph_info_subform();
	$('#graph_load_subform').show();
}

function WEB_hide_load_graph_subform() {
	$('#graph_load_subform').hide();
}

function WEB_handle_load_graph() {
	graph.graph_id = parseInt($('#graph-select').val());
	$('#txt-graph-id').text('...');
	$('#txt-graph-name').text('...');
	$('#txt-graph-desc').text('...');
	graph.fromDB_load_nodes();
	graph.fromDB_load_edges();
	AJAX_load_Graph_Info(graph.graph_id, function(error, graph_info){
		$('#txt-graph-id').text(graph_info.id);
		$('#txt-graph-name').text(graph_info.name);
		$('#txt-graph-desc').text(graph_info.desc);
	});
}

function WEB_hide_graph_info_subform() {
	$('#graph_info_subform').hide();
}
function WEB_show_graph_info_subform() {
	WEB_hide_load_graph_subform();
	$('#graph_info_subform').show();
}

function WEB_handle_graph_saveAs() {
	$('#graph-name-input').val('');
	$('#graph-desc-input').val('');
	WEB_show_graph_info_subform();
	edit_graph = false;
}

function WEB_handle_edit_graph_info() {
	AJAX_load_Graph_Info(graph.graph_id, function(error, graph_info){
		$('#graph-name-input').val(graph_info.name);
		$('#graph-desc-input').val(graph_info.desc);
		WEB_show_graph_info_subform();
		edit_graph = true;
	});
}

function graph_name_acceptable(graph_name_) {
	// TODO: Fill in with other checks
	return graph_name_ != '';
}

function WEB_save_graph_info() {
	var graph_name = $('#graph-name-input').val();
	if (!graph_name_acceptable(graph_name)){return;}
	var graph_desc = $('#graph-desc-input').val();
	AJAX_save_Graph_Info
	// if( edit_graph ) {
	// 	AJAX_save_Graph_Info(graph.graph_id, graph_name, graph_desc,function(error, success_){
	// 		if( !error && success_ ) {
	// 			$('#txt-graph-name').text(graph_name);
	// 			$('#txt-graph-desc').text(graph_desc);
	// 		} else {
	// 			console.log('ERROR'); // TODO: HANDLE BETTER
	// 		}
	// 	});
	// } else {
	// 	var old_graph_id = graph.graph_id;
	// 	AJAX_save_new_Graph(graph_name, graph_desc, function(error, new_graph_id){
	// 		if( !error ) {
	// 			AJAX_copy_Edges(old_graph_id, new_graph_id);
	// 			$('#txt-graph-id').text(new_graph_id);	
	// 			$('#txt-graph-name').text(graph_name);
	// 			$('#txt-graph-desc').text(graph_desc);
	// 			graph.graph_id = new_graph_id;
	// 		} else {
	// 			console.log('ERROR'); // TODO: HANDLE BETTER
	// 		}
	// 	});
	// }
	WEB_populate_graph_select_box();
	WEB_hide_graph_info_subform();
	edit_graph = null;
}
function WEB_handle_save_graph() {
	graph.toDB_save_nodes();
	graph.toDB_save_edges();
}
function WEB_handle_new_graph() {
	AJAX_get_Graph_ID_Count(function(error, graph_id_) {
		if( !error ) {
			console.log('Initializing empty graph');
			graph = new Graph(svg, graph_id_);
			graph.update_graph();
			$('#txt-graph-id').text(graph_id_);
			$('#txt-graph-name').text('');
			$('#txt-graph-desc').text('');
			edit_graph = false;
			WEB_show_graph_info_subform();
		}
	});
}
function WEB_handle_run_graph(){
	// Do Nothing
}
function WEB_handle_check_graph(){
	// Do nothing
}
function WEB_hide_graph_control() {
	$('#graph-control-holder').hide();
}

function WEB_show_graph_control() { 
	$('#graph-control-holder').show();
	WEB_hide_graph_info_subform();
}

function WEB_show_operation_node_subform() {
	// Show Subform
	$('#operation_subform').show(); 
	// Find and Fill Operation Type
	var radio_id = operation_HTML_ID_Map[graph.selected_node.operation_type];
	$(radio_id).prop('checked', true);
	// Find and Fill Operation Sources
	graph.selected_node.populate_operation_inputs();
	$('#op-left-source-select').val(graph.selected_node.operation_left);
	$('#op-rght-source-select').val(graph.selected_node.operation_right);
}
function WEB_hide_operation_node_subform() { $('#operation_subform').hide(); }
function WEB_show_concept_node_subform() { $('#concept_value_subform').show(); }
function WEB_hide_concept_node_subform() { $('#concept_value_subform').hide(); }
function WEB_show_input_node_subform() { 
	// Show Subform
	$('#input_select_subform').show(); 
	// Find and Fill Input Value
	$('#input-source-select').val(graph.selected_node.input_source);
}
function WEB_hide_input_node_subform() { $('#input_select_subform').hide(); }

function WEB_show_edge_form() {
	// console.log('WEB_show_edge_form');
	// Remove Other Forms
	WEB_hide_node_form();
	WEB_hide_graph_control();
	// Show Edge Form
	$('#edge-form-holder').show();
	// Show Appropriate Subforms
	WEB_show_edge_subforms();	
}
function WEB_hide_edge_form() {
	// console.log('WEB_hide_edge_form');
	// Collapse Edge Form
	$('#edge-form-holder').hide();
	// Collapse Edge Subforms
	WEB_hide_edge_subforms();
	// Show Default Form
	WEB_show_graph_control();
}
function WEB_show_edge_subforms() {
	// console.log('WEB_show_edge_subforms');
	// Do Nothing
}
function WEB_hide_edge_subforms() {
	// console.log('WEB_hide_edge_subforms');
	$('#really-delete-edge-button').hide();
}

function WEB_show_node_form() {
	// Remove Other Forms
	WEB_hide_edge_form(); // needs to be this ...
	WEB_hide_graph_control(); // ... order
	// Set Node Name box to Appropriate Value
	$('#node-name-input').val(graph.selected_node.name);
	// Set Checkbox to Appropriate Value
	var radio_id = node_type_HTML_ID_Map[graph.selected_node.type_];
	$(radio_id).prop('checked', true);
	// Show the Form
	$('#node-form-holder').show();
	// Show Appropriate Subforms
	WEB_show_node_subforms();
}
function WEB_hide_node_form() {
	// Show Default Form
	WEB_show_graph_control();
	// Remove any error from node name input
	web_effect_entry_acceptable($('#node-name-input'));
	// Hide Appropriate Subforms
	WEB_hide_node_subforms();
	// Hide Node Form
	$('#node-form-holder').hide();
} 
function WEB_hide_node_subforms() {
	WEB_hide_operation_node_subform();
	WEB_hide_concept_node_subform();
	WEB_hide_input_node_subform();
	$('#btn_delete_node_confirm').hide();
}
function WEB_show_node_subforms()
{
	// Hide All Subforms
	WEB_hide_node_subforms();
	// Get Node Type
	var node_type = $('input[name=node_type_radio]:checked', '#update-node-form').attr('id');
	if(node_type === 'node-type-concept'){
		// Show Relevant Form
		WEB_show_concept_node_subform();
		// Preview Change
		// graph.selected_node.type = consts.CONCEPT;
	} else if(node_type === 'node-type-input'){
		// Show Relevant Form
		WEB_show_input_node_subform();
		// Preview Change
		// graph.selected_node.type = consts.INPUT;
	} else if(node_type === 'node-type-operational'){
		// Preview Change
		// graph.selected_node.type = consts.OPERATIONAL;
		// Show Relevant Form
		WEB_show_operation_node_subform();
	} else if(node_type === 'node-type-output'){
		 // Preview Change
		// graph.selected_node.type = consts.OUTPUT;
	} else{
		throw new Error('Node Type not recognized');
	};
	// graph.update_graph();
}

function WEB_populate_input_select_box(){
	$('#input-source-select').find('option').remove().end();
	$.ajax({
		url: '/data/',
		success: function(data){
				$(data).find('a:contains(.json)').each(function(){
					var input_file = $(this).attr('href');
					$('<option value='+input_file+'>'+input_file+'</option>').appendTo('#input-source-select');
			});
		}
	});
}

function WEB_populate_graph_select_box(){
	$('#graph-select').find('option').remove().end();
	AJAX_load_Graphs(function(error, results){
		results.forEach(function(d){
			$('<option value='+d.graph_id+'>'+d.graph_name+'</option>').appendTo('#graph-select');
		});
	});
}

function WEB_handle_operation_switch(){
	graph.selected_node.switch_operation_order();
}
function WEB_populate_operation_inputs(){
	graph.selected_node.populate_operation_inputs();
}
function WEB_handle_right_op_select(){
	graph.selected_node.operation_right = parseInt($('#op-rght-source-select').val());
}
function WEB_handle_left_op_select(){
	graph.selected_node.operation_left = parseInt($('#op-left-source-select').val());
}

function web_graph_mode_change_handle(){
	var node_type = $('input[name=graph-control-input]:checked').attr('id');
	if (node_type == 'graph-control-move') {
		graph.node_placement_mode = false;
	} else if (node_type == 'graph-control-add-node') {
		graph.node_placement_mode = true;
	}
}
// function WEB_handle_operation_change(){
	// Do Nothing
	// var operation_type = $('input[name=operation_radio]:checked', '#update-node-form').val();
	// graph.selected_node.operation_type = operation_type;
	// graph.update_graph();
// }

function web_graph_mode_set_mode_move() {
	$('#graph-control-move').prop('checked', true);
	graph.node_placement_mode = false;
}
function WEB_set_graph_control_node_placement_mode() {
	$('#graph-control-add-node').prop('checked', true);
	graph.node_placement_mode = true;
}
function web_effect_require_resubmit(object, new_placeholder) {
	// Object should be jquery
	object.css({'background-color' : '#FF2222'});
	object.effect('shake');
	object.val('');
	object.attr('placeholder', new_placeholder);      
}
function web_effect_entry_acceptable(object) {
	object.css({'background-color' : '#FFFFFF'});
}


function check_node_name_input(node_name) { // TODO: Move
	return !(
		(node_name==null) ||
		(node_name=='') ||
		(node_name.indexOf(' ')>=0) ||
		(node_name.indexOf('\t')>=0)
	)
}

function WEB_handle_node_delete(event) {
	$('#btn_delete_node').prop('disabled', true); // TODO: Not Working
	$('#btn_delete_node_confirm').show();
}
function WEB_handle_node_delete_really(event) {
	graph.node_delete(graph.selected_node);
}
function web_handle_edge_delete(event) {
	'use strict'
	$('#delete-edge-button').prop('disabled', true); // TODO: Not Working
	$('#really-delete-edge-button').show();
}
function web_handle_edge_delete_really(event) {
	'use strict'
	graph.edge_delete(graph.selected_edge);
}
function WEB_handle_node_cancel(event) {
	'use strict'
	event.preventDefault();
	WEB_hide_node_form();
	return false;
}
function WEB_handle_node_submit(event)
{
	'use strict'
	event.preventDefault();
	// Check Node Name
	var node_name_obj = $('#node-name-input')
	var node_name = node_name_obj.val();
	if(check_node_name_input(node_name)) {
		web_effect_entry_acceptable(node_name_obj);
	}
	else {
		web_effect_require_resubmit(node_name_obj, 'Please Enter Valid Node Name');
		return false;
	}
	// Check for Duplicate Name
	var node_names = d3.values(graph.nodes).map(function(d){return d.name;});
	if (graph.selected_node.name != node_name && node_names.indexOf(node_name) >= 0 ) {
		web_effect_require_resubmit(node_name_obj, 'Please Enter Unique Node Name');
		return false;
	}
	graph.selected_node.name = node_name;
	
	// Save Node Type
	var node_type = $('input[name=node_type_radio]:checked', '#update-node-form').val();
	node_type = parseInt(node_type);
	graph.selected_node.type = node_type;
	// Save Node Metadata
	if(node_type === consts.CONCEPT){
		
	} else if(node_type === consts.INPUT){
		graph.selected_node.input_source_ = $('#input-source-select').val();
	} else if(node_type === consts.OPERATIONAL){
		var op_left_input = $('#op-left-source-select').val();
		if(op_left_input) {
			graph.selected_node.operation_left = parseInt($('#op-left-source-select').val());
		}
		var op_rght_input = $('#op-rght-source-select').val();
		if(op_rght_input) {
			graph.selected_node.operation_right = parseInt($('#op-rght-source-select').val());
		}
		graph.selected_node.operation_type = $('input[name=operation_radio]:checked', '#update-node-form').val();
	} else if(node_type === consts.OUTPUT){
	} else {
		throw new Error('Node Type not recognized');
	}

	// Clean Up
	console.log('Node Information Submitted.');
	graph.node_deselect();
	graph.update_graph();
	return false;
}