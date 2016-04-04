4// http://notesbyanerd.com/customizing-sublime-for-js customize sublime
// https://css-tricks.com/exposing-form-fields-radio-button-css/ Checkbox Reveal

// http://plnkr.co/edit/MOczs02DNeUJGzXAPdMd?p=preview Graph search
// http://eloquentjavascript.net/20_node.html what is node
// http://debugbrowser.com/ watch video on how to debug in chrome
// http://nvd3.org/ graphs and charts
// http://tenxer.github.io/xcharts/examples/ graphs and charts
// http://www.findtheconversation.com/concept-map/

// Add Delete
// Add Save
// Add Auto-Save
// Add Node Tags


//////////////////////////////////////////////////////////////////////////////
// USED RESOURCES
//////////////////////////////////////////////////////////////////////////////
// https://bl.ocks.org/cjrd/6863459 // Graph Editing
// http://bl.ocks.org/bollwyvl/871b7c781b92fd0044f5 // Drag and Zoom Slider
//////////////////////////////////////////////////////////////////////////////
// Constants
//////////////////////////////////////////////////////////////////////////////
var consts =  {
	selectedClass: 'selected',
	connectClass: 'connect-node',
	circleGClass: 'concept-g',
	graphClass: 'graph',
	activeEditId: 'active-editing',
	BACKSPACE_KEY: 8,
	DELETE_KEY: 46,
	ENTER_KEY: 13,
	CONCEPT: 1,
	OPERATIONAL: 2,
	INPUT: 3,
	OUTPUT: 4,
};
var graph;
var colors = d3.scale.category10();

////////////////////////////////////////////////////////////////////////////////
// WEB CODE
////////////////////////////////////////////////////////////////////////////////

function web_edit_edge_show() {
	// Remove Graph Control (Default Form)
	web_graph_control_hide();
	// Show The Form
	$('#update-edge-form').show();
}
function web_edit_edge_hide() {
	// Hide The Form
	$('#update-edge-form').hide();
	// Replace Graph Control (Default Form)
	web_graph_control_show();
}
function web_graph_control_show() {
	$('#graph-control-holder').show(); // Show the form
}
function web_graph_control_hide(){
	$('#graph-control-holder').hide(); // Show the form
}
function web_graph_mode_change_handle(){
	var node_type = $('input[name=graph-control-input]:checked').attr('id');
	if (node_type == 'graph-control-move') {
		graph.node_placement_mode = false;
	} else if (node_type == 'graph-control-add-node') {
		graph.node_placement_mode = true;
	}
}
function web_operation_mode_change_handle(){
	var operation_type = $('input[name=operation-type-input]:checked', '#update-node-form').val();
	graph.selected_node.node_name = operation_type;
	graph.update_graph();
}
function web_graph_mode_set_mode_move() {
	console.log('Setting Graph Mode to Movement Mode');
	$('#graph-control-move').prop('checked', true);
	graph.node_placement_mode = false;
}
function web_graph_mode_set_mode_place() {
	console.log('Setting Graph Mode to Add Node Mode');
	$('#graph-control-add-node').prop('checked', true);
	graph.node_placement_mode = true;
}

function web_hide_subforms() {
	web_edit_operation_hide();
	web_edit_concept_hide();
	$('#really-delete-node-input').hide();
}
function web_show_subforms()
{
	// Hide All Subforms
	web_hide_subforms();
	// Get Node Type
	var node_type = $('input[name=node-type-input]:checked', '#update-node-form').attr('id');
	if(node_type == 'node-type-concept'){
		// Show Relevant Form
		web_edit_concept_show();
		// Preview Change
		graph.selected_node.node_type = consts.CONCEPT;
	} else if(node_type=='node-type-input'){
		// Preview Change
		graph.selected_node.node_type = consts.INPUT;
	} else if(node_type=='node-type-operational'){
		// Show Relevant Form
		web_edit_operation_show();
		// Preview Change
		graph.selected_node.node_type = consts.OPERATIONAL;
		var operation_type = $('input[name=operation-type-input]:checked', '#update-node-form').val();
		graph.selected_node.node_name = operation_type;
	} else if(node_type=='node-type-output'){
		 // Preview Change
		graph.selected_node.node_type = consts.OUTPUT;
	} else{
		console.log('ERROR: Node Type not recognized');
	};
		graph.update_graph();
}

function web_edit_node_show() {
	// Remove Graph Control (Default Form)
	web_graph_control_hide();
	// Set Node Name box to Appropriate Value
	$('#node-name-input').val(graph.selected_node.node_name);
	// Set Checkbox to Appropriate Value
	if (graph.selected_node.node_type == consts.CONCEPT) {
		$('#node-type-concept').prop('checked', true);
	} else if (graph.selected_node.node_type == consts.INPUT) {
		$('#node-type-input').prop('checked', true);
	} else if (graph.selected_node.node_type == consts.OPERATIONAL) {
		$('#node-type-operational').prop('checked', true);
	} else if (graph.selected_node.node_type == consts.OUTPUT) {
		$('#node-type-output').prop('checked', true);
	} else{
		console.log('ERROR: Node Type not recognized');
	};
	// Show the Form
	$('#update-node-form').show();
	// Show Appropriate Subforms
	web_show_subforms();
}
function web_edit_node_hide() {
	// Replace Graph Control (Default Form)
	web_graph_control_show();
	// Remove any error from node name input
	web_effect_entry_acceptable($('#node-name-input'));
	// Hide the Form
	$('#update-node-form').hide();
}

function web_edit_operation_show() {
	$('#operation-type-input').show();
}

function web_edit_operation_hide() {
	$('#operation-type-input').hide();
}
function web_edit_concept_show() {
	$('#concept-type-input').show();
}
function web_edit_concept_hide() {
	$('#concept-type-input').hide();
}

function web_effect_require_resubmit(object, new_placeholder)
{
	// Object should be jquery
	object.css({'background-color' : '#FF6666'});
	object.effect('shake');
	object.val('');
	object.attr('placeholder', new_placeholder);      
}
function web_effect_entry_acceptable(object)
{
		object.css({'background-color' : '#FFFFFF'});
}

function check_node_name_input(node_name)
{
	return !(
		(node_name==null) ||
		(node_name=='') ||
		(node_name.indexOf(' ')>=0) ||
		(node_name.indexOf('\t')>=0)
	)
}

function web_handle_delete(event)
{
	$('#delete-node-input').prop('disabled', true);
	$('#really-delete-node-input').show();
}

function web_handle_delete_really(event)
{
	console.log('here');
	graph.node_delete(graph.selected_node);
}

function web_handle_cancel(event)
{
	event.preventDefault();
	web_edit_node_hide();
	return false;
}
function web_handle_submit(event)
{
	event.preventDefault();
	if(graph.selected_node == null){ return; }
	// Check Node Name
	var node_name_obj = $('#node-name-input')
	var node_name = node_name_obj.val();
	if(check_node_name_input(node_name))
	{
		web_effect_entry_acceptable(node_name_obj);
	}
	else
	{
		web_effect_require_resubmit(node_name_obj, 'Please Enter Valid Node Name');
		return false;
	}
	// Check for Duplicate Name
	node_names = graph.nodes.map(function(d){return d.node_name;});
	if (graph.selected_node.node_name != node_name && node_names.indexOf(node_name) >= 0 )
	{
		web_effect_require_resubmit(node_name_obj, 'Please Enter Unique Node Name');
		return false;
	}
	graph.selected_node.node_name = node_name;
	
	// Find Node Type
	var node_type = $('input[name=node-type-input]:checked', '#update-node-form').val();
	graph.selected_node.node_type = node_type;

	// Clean Up
	console.log('Node Information Submitted.');
	graph.node_remove_select();
	graph.update_graph();
	return false;
}


////////////////////////////////////////////////////////////////////////////////
// GRAPH CODE
////////////////////////////////////////////////////////////////////////////////

document.onload = (function(d3, saveAs, Blob, undefined){
	//////////////////////////////////////////////////////////////////////////////
	// Run Parameters
	//////////////////////////////////////////////////////////////////////////////
	'use strict';
	var run_instructions = {
		verbose: true,
		init_dummy: true,
	};

	//////////////////////////////////////////////////////////////////////////////
	// SVG Helper Functions
	//////////////////////////////////////////////////////////////////////////////
	function initialize_svg_markers(svg_){
		var defs = svg_.append('svg:defs');
		defs.append('svg:marker')
			.attr('id', 'end-arrow')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', '56')
			.attr('markerWidth', 3.5)
			.attr('markerHeight', 3.5)
			.attr('orient', 'auto')
			.append('svg:path')
			.attr('d', 'M0,-5L10,0L0,5');

		// define arrow markers for leading arrow
		defs.append('svg:marker')
			.attr('id', 'mark-end-arrow')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', 7)
			.attr('markerWidth', 3.5)
			.attr('markerHeight', 3.5)
			.attr('orient', 'auto')
			.append('svg:path')
			.attr('d', 'M0,-5L10,0L0,5');
		return svg_;
	};

	function initialize_svg_graph_group(svg_){
		var svg_group = svg_.append('g')
			.classed(consts.graphClass, true);
		return svg_group;
	};

	//////////////////////////////////////////////////////////////////////////////
	// Graph Object
	//////////////////////////////////////////////////////////////////////////////
	var Graph = function(svg_, nodes_, edges_){
		////////////////////////////////////////////////////////////////////////////
		// Graph State Variables
		////////////////////////////////////////////////////////////////////////////
		this.id_ct = 0;
		this.nodes = nodes_ || [];
		this.edges = edges_ || [];
		this.svg = svg_;
		this.svg = initialize_svg_markers(this.svg);
		this.svg_group = initialize_svg_graph_group(this.svg);

		this.paths = this.svg_group.append('g').selectAll('g'); // these aren't selecting the same thing?
		this.circles = this.svg_group.append('g').selectAll('g');// these aren't selecting the same thing?

		this.selected_node = null;
		this.selected_node_circle = null;
		this.selected_edge = null;
		this.selected_edge_path = null;
		this.mousedown_node = null;
		this.mousedown_link = null;
		// this.mousedown_link_path = null;
		this.mouseup_node = null;

		this.node_placement_mode = false;

		this.just_dragged = false;	// Are we dragging a node around (repositioning)? (previously known as justDragged)

		this.justScaled = false;
		this.lastKeyDown = -1;
		this.shiftNodeDraw = false;
		this.selected_text = false;

		////////////////////////////////////////////////////////////////////////////
		// Event Listeners
		////////////////////////////////////////////////////////////////////////////
		// Save off 'this' graph for use in handlers
		graph = this;
		// Resize Listener
		window.onresize = function(){graph.update_window(graph.svg);}
		// Drag Listener
		this.circle_drag = d3.behavior.drag()
			.origin(function(d){
				return {x: d.x, y: d.y};
			})
			.on('dragstart', function(d){
				graph.just_dragged = true;
				console.log('dragstart');
			})
			.on('drag', function(d){
				graph.circle_dragmove_handle.call(graph, d);
			})
			.on('dragend', function(d){
				console.log('dragend');
				graph.just_dragged = false;
			});

			// Zoom Listener
			this.graph_zoom = d3.behavior.zoom()
				.scaleExtent([.1, 1])
				.on('zoomstart', function(d){
					console.log('zoomstart');
					graph.just_dragged = true;
				})
				.on('zoom', function(d){
					graph.zoomed.call(graph);
					return true;
				})
				.on('zoomend', function(d){
					console.log('zoomend');
					graph.just_dragged = false;
				})
			svg.call(this.graph_zoom).on('dblclick.zoom', null);
			// Zoom Slider Listener
			this.zoom_slider = d3.select('#slider-holder').append('p').append('input')
				.datum({})
				.attr('type', 'range')
				.attr('value', this.graph_zoom.scaleExtent()[1])
				.attr('min', this.graph_zoom.scaleExtent()[0])
				.attr('max', this.graph_zoom.scaleExtent()[1])
				.attr('step', (this.graph_zoom.scaleExtent()[1] - this.graph_zoom.scaleExtent()[0]) / 100)
				.on('input', function(d){
					graph.slided.call(graph);
				});
		// SVG Dragline 			
		this.dragline = this.svg_group.append('svg:path')
			.attr('class', 'link dragline hidden')
			.attr('d', 'M0,0L0,0')
			.style('marker-end', 'url(#mark-end-arrow)');
		// Graph Key Listeners
		// d3.select(window)
		this.svg.on('keydown', function(){graph.svg_keydown_handle.call(graph);})
		this.svg.on('keyup', function(){graph.svg_keyup_handle.call(graph);});
		// Graph Mouse Listeners
		this.svg.on('mousedown', function(d){graph.svg_mousedown_handle.call(graph, d);});
		this.svg.on('mouseup', function(d){graph.svg_mouseup_handle.call(graph, d);});

		// Save off 'this' graph for use in debug
		graph = this;
	};
	//////////////////////////////////////////////////////////////////////////////
	// Graph Functions
	//////////////////////////////////////////////////////////////////////////////
	Graph.prototype = {
		set_id: function(id_start) {
			this.id_ct = id_start;
		},
		////////////////////////////////////////////////////////////////////////////
		// Mechanical Functions
		////////////////////////////////////////////////////////////////////////////
		update_window: function(svg){
			// get body and document Elements
			var docEl = document.documentElement;
			var bodyEl = document.getElementsByTagName('body')[0];
			// find appropriate width and height
			var w = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
			var h = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
			// set svg width and height
			h -= 300;
			svg.attr('width', w).attr('height', h);
		},
		zoomed: function() {
			// Return if we're in node placement mode
			if (this.node_placement_mode) {
				return false;
			}
			// Move the graph
			d3.select('.graph')
				.attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
			this.zoom_slider.property('value',  d3.event.scale);
		},
		slided: function(d) {
			graph_zoom.scale(graph.zoom_slider.property('value'))
				.event(graph.svg);
		},
		////////////////////////////////////////////////////////////////////////////
		// Save and Load Functions
		////////////////////////////////////////////////////////////////////////////
		jsonify_edges: function() {
			var edge_rep = [];
			this.edges.forEach(function(d){
				edge_rep.push({
					source: d.source.id,
					target: d.target.id
				});
			});
			return edge_rep;
		},
		de_jsonify_edges: function(edge_rep, node_rep) {
			var edges = [];
			var nodes = {};
			node_rep.forEach(function(d){
				nodes[d.id] = d
			});
			edge_rep.forEach(function(d){
				this.edges.push({
					source: nodes[d.source],
					target: nodes[d.target]
				});
			});
			return edges;
		},
		save_graph: function() {
			var save_dict = {
				'nodes': this.nodes,
				'edges': this.edges,
			}
			var blob = new Blob([window.JSON.stringify(save_dict)], {type: "text/plain;charset=utf-8"});
			saveAs(blob, 'graph_checkpoint.json');
		},
		load_graph: function() {
			d3.json("~/graph_checkpoint (2).json", function(error, data){
				if (error) throw error;

			});

			// var filereader = new window.FileReader();
			// var graph_file = "~/graph_checkpoint (2).json"
			// filereader.onload = function(event){
			// 	var graph_data = JSON.parse(filereader.result);
			// 	graph.nodes = graph_data.nodes;
			// 	graph.edges = graph_data.edges;
			// 	graph.set_id(graph_data.nodes.length+1);
			// 	graph.update_graph();
			// }
			// filereader.readAsText(graph_file);
		},
		////////////////////////////////////////////////////////////////////////////
		// Event Handles
		////////////////////////////////////////////////////////////////////////////
		svg_keydown_handle: function(){
			// prevent default
			d3.event.stopPropagation();
			console.log('svg_keydown_handle UNIMPLEMENTED');
		},
		svg_keyup_handle: function(){
			// prevent default
			d3.event.stopPropagation();
			console.log('svg_keyup_handle UNIMPLEMENTED');
		},
		svg_mousedown_handle: function(){
			// do nothing
			if (this.selected_node){
				this.node_remove_select();
			}
			if (this.selected_edge){
				this.edge_remove_select();
			}
			// this.graphMouseDown = true; // can probably delete. May be useful to differentiate drag.
		},
		svg_mouseup_handle: function(){
			console.log('svg_mouseup_handle');
			console.log(this.node_placement_mode);
			console.log(this.just_dragged);
			if(this.justScaleTransGraph) {
				this.justScaleTransGraph = false;
			} else if (this.node_placement_mode) {
				// Create and Add New Node
				var loc = d3.mouse(this.svg_group.node());
				var new_node = {
					node_name: 'concept_'+this.id_ct,
					node_type: consts.CONCEPT,
					x: loc[0],
					y: loc[1],
					id: this.id_ct++
				};
				this.nodes.push(new_node);
				// Change Graph Mode to Move Mode
				web_graph_mode_set_mode_move();
				// Update and Return
				this.update_graph();
			} else if (this.shiftNodeDraw) {
				this.shiftNodeDraw = false;
				this.dragline.classed('hidden', true);
			}
			// this.graphMouseDown = false; // can probably delete. May be useful to differentiate drag.
		},
		path_mousedown_handle: function(d3path, d){
			// prevent default
			d3.event.stopPropagation();
			if(this.node_placement_mode){ return; }
			// remove node selection if selected
			if(this.selected_node){
				this.node_remove_select();
			}
			if(d === this.selected_edge){ // select same edge
				// remove edge selection on double click
				this.edge_remove_select();
			}
			else if ((this.selected_edge) && (d !== this.selected_edge))	{ // change edge
				// remove edge selection
				this.edge_remove_select()
				// save new edge selection
				this.edge_select(d3path, d);
			}
			else{ // make new edge selection
				// save new edge selection
				this.edge_select(d3path, d);
			}
		},
		circle_dragmove_handle: function(d){
			// Handles Circle Drags
			console.log('dragmove');
			graph.just_dragged = true;
			if(this.shiftNodeDraw){
				this.dragline
					.attr('d','M'+d.x+','+d.y+'L'+d3.mouse(this.svg_group.node())[0]+','+d3.mouse(this.svg_group.node())[1]);
			} else {
				d.x += d3.event.dx;
				d.y += d3.event.dy;
				this.update_graph();
			}
		},
		circle_mousedown_handle: function(d3node, d){
			if(run_instructions.verbose){console.log('circle_mousedown_handle');}
			// prevent default
			d3.event.stopPropagation();
			if(this.node_placement_mode){ return; }
			if (this.selected_node){
				this.node_remove_select();
			}
			if (this.selected_edge){
				this.edge_remove_select();
			}
			// If SHIFT_KEY, make dragline
			if (d3.event.shiftKey){
				this.mousedown_node = d;
				this.shiftNodeDraw = d3.event.shiftKey;
				this.dragline
					.classed('hidden', false)
					.attr('d', 'M'+d.x+','+d.y+'L'+d.x+','+d.y);
			} else {
				// Store State Variables
				this.node_select(d3node, d);
			}
		},
		circle_mouseup_handle: function(d3node, d){
			if(run_instructions.verbose){console.log('circle_mouseup_handle');}
			// Do not prevent default!
			// d3.event.stopPropagation();
			this.shiftNodeDraw = false;
			d3node.classed('connect-node', false);

			// Handle Edge Dragging
			if(this.mousedown_node) {
				// Handle Edge Dragging / Remove Drag Line
				this.dragline.classed('hidden', true);
				// Handle Edge Dragging / Dragging to Original Node
				if( this.mousedown_node === d ) {
					this.just_dragged = false; // Should this be here?
				// Handle Edge Dragging / Dragging to New Node
				} else {
					// Handle Edge Dragging / Dragging to New Node / Create New Edge
					var source_node = this.mousedown_node;
					var target_node = d;
					var new_edge = {source: source_node, target: target_node};
					// Handle Edge Dragging / Dragging to New Node / Check for Duplicate Edge and Reverse Edge
					var find_edge_filter = this.paths.filter(function(d2){
						// Handle Edge Dragging / Dragging to New Node / Check for Reverse Edge
						if( d2.source === new_edge.target && d2.target === new_edge.source ){
							// Handle Edge Dragging / Dragging to New Node / Remove Reverse Edge
							if(run_instructions.verbose){console.log('Reverse Edge Found. Deleting.');}
							graph.edges.splice(graph.edges.indexOf(d2), 1);
						}
						// Handle Edge Dragging / Dragging to New Node / Check for Duplicate Edge
						return d2.source === new_edge.source && d2.target == new_edge.target;
					});
					// Handle Edge Dragging / Dragging to New Node / Add New Edge / Error Handling
					var error = (find_edge_filter[0].length || 
											(this.mousedown_node.node_type===consts.OUTPUT) ||
											(d.node_type===consts.INPUT))
					// Handle Edge Dragging / Dragging to New Node / Add New Edge
					if (error) {
						if(run_instructions.verbose){console.log('Error Drawing New Edge: ' + error);} // TODO: Make error more verbose, have it appear to user.
					} else {
						this.edges.push(new_edge);
						this.update_graph();
					}
				}
			}
			this.mousedown_node = null;
		},
		check_new_edge_validity: function(source_node, target_node) {
			if (source_node.node_type === consts.OUTPUT) {
				return 'Output nodes cannot pass along data';
			}
			if (target_node.node_type === consts.INPUT) {
				return 'Input nodes cannot receive data';
			}
			if (target_node.node_type === consts.OPERATIONAL) {
				// TODO: Check for > 2 edges-in
				return null; 
			}
			var existing_edge_filter = this.paths.filter(function(d){
				return d2.source === new_edge.source && d2.target == new_edge.target;
			});
			if (find_edge_filter[0].length) {
				return 'Duplicate Edge detected.'
			}
			// Everything OK
			return null;
		},
		node_delete: function(d){
			// Remove Select
			this.node_remove_select();
			// Delete Node
			this.nodes.splice(this.nodes.indexOf(d),1);
			// Delete Associated Edges
			this.node_delete_associated_edges(d);
			//Update Graph
			this.update_graph();
		},
		node_delete_associated_edges: function(d){
			// Find Edges
			var delete_edges = this.edges.filter(function(d2){
				return (d2.source === d || d2.target === d);
			});
			// Delete Edges
			delete_edges.map(function(d2){
				graph.edges.splice(graph.edges.indexOf(d2),1);
			});
		},
		get_node_text: function(d){
			console.log('changing node text')
			if ( d.node_type === consts.CONCEPT ) {
				return d.node_name;
			} else if ( d.node_type === consts.INPUT ) {
				return 'IN: ' + d.node_name;
			} else if ( d.node_type === consts.OUTPUT ) {
				return 'OUT: ' + d.node_name;
			} else if ( d.node_type === consts.OPERATIONAL ) {
				return d.node_name;
			} else {
				// raise error
			}
		},

		node_select: function(d3path, d){
			// Change Node State Variables
			this.selected_node = d;
			this.selected_node_circle = d3path;
			// Change Node Circle Appearance
			this.selected_node_circle
				.classed(consts.selectedClass, true); // what does this do..? Can delete?
			this.selected_node_circle
				.select('circle')
					.classed(consts.selectedClass, true)
					.style('fill', function(d) { return d3.rgb(colors(d.node_type)).brighter().toString() });
			// Add Editing Form
			web_edit_node_show();
		},
		node_remove_select: function(){
			// Remove Editing Form
			web_edit_node_hide();
			// Change Node Circle Appearance
			this.selected_node_circle
				.classed(consts.selectedClass, false); // what does this do..? Can delete?
			this.selected_node_circle
				.select('circle')
					.classed(consts.selectedClass, false)
					.style('fill', function(d) { return colors(d.node_type); });
			// Change Node State Variables
			this.selected_node = null;
			this.selected_node_circle = null;
		},
		edge_select: function(d3path, d){
			this.selected_edge = d;
			this.selected_edge_path = d3path;
			this.selected_edge_path
				.classed(consts.selectedClass, true);
		},
		edge_remove_select: function(){
			this.selected_edge_path
				.classed(consts.selectedClass, false);
			this.selected_edge = null;
			this.selected_edge_path = null;
		},
		update_graph_paths: function(){
			var graph = this;
			// find paths by selecting unique edges
			this.paths = this.paths.data(this.edges, function(d){
				return (d.source.id + '+' + d.target.id);
			});
			// update paths
			this.paths
				.style('marker-end', 'url(#end-arrow)') // Add Arrow
				.classed(consts.selectedClass, function(d){ // Make Selected Paths Different Style
					return d === this.selected_edge;
				})
				.attr('d', function(d){
					return 'M' + d.source.x + ',' + d.source.y + 'L' + d.target.x + ',' + d.target.y;
				});
			// add new paths
			this.paths
				.enter()
				.append('path')
					.style('marker-end', 'url(#end-arrow)') // Add Arrow
					.classed('link', true)
					.attr('d', function(d) {
						return 'M' + d.source.x + ',' + d.source.y + 'L' + d.target.x + ',' + d.target.y;
					})
					.on('mousedown', function(d) {
						graph.path_mousedown_handle(d3.select(this), d);
					})
					.on('mouseup', function(d) {
						graph.mousedown_link = null; // why do we have this?
					});
			// remove deleted paths
			this.paths.exit().remove();
		},
		update_graph_circles: function(){
			// Find Circles
			this.circles = this.circles.data(this.nodes, function(d){
					return d.id;
				});
			// Update Existing Nodes
			// Update Existing Nodes / Update Position
			var circle_update = this.circles
				.attr('transform', function(d){
					return 'translate('+d.x+','+d.y+')';
				});
			// Update Existing Nodes / Update Text
			circle_update
				.select('text')
					.text(function(d){return graph.get_node_text(d);});
			// Update Existing Nodes / Update Color
			circle_update
				.select('circle')
					.style('fill', function(d) { return colors(d.node_type); })
					.style('stroke', function(d) { return d3.rgb(colors(d.node_type)).darker().toString(); });
			// Add New Nodes
			var circle_enter = this.circles
				.enter()
				.append('g');
			// Add New Nodes / Add Circle Groups
			circle_enter
				.classed(consts.circleGClass, true)
				.attr('transform', function(d){
					return 'translate('+d.x+','+d.y+')';
				})
				.on('mouseover', function(d){
					if (graph.shiftNodeDraw){
						d3.select(this).classed(consts.connectClass, true);
					}
				})
				.on('mouseout', function(d){
					d3.select(this).classed(consts.connectClass, false);
				})
				.on('mousedown', function(d){
					graph.circle_mousedown_handle(d3.select(this), d);
				})
				.on('mouseup', function(d){
					graph.circle_mouseup_handle(d3.select(this), d);
				})
				.call(graph.circle_drag);
			// Add New Nodes / Add Circle
			circle_enter
				.append('svg:circle')
					.attr('class', 'node')
					.attr('r', 48)
					.style('fill', function(d) { return colors(d.node_type); })
					.style('stroke', function(d) { return d3.rgb(colors(d.node_type)).darker().toString(); });
			// Add New Nodes / Add Text
			circle_enter
				.append('svg:text')
					.attr('x', 0)
					.attr('y', 4)
					.attr('class', 'circle-id')
					.text(function(d){return graph.get_node_text(d);});

			// Remove Deleted Nodes
			this.circles.exit().remove()
		},
		update_graph: function(){
			// Save Current Version of Graph to Session Storage
			sessionStorage.setItem('edges', JSON.stringify(this.jsonify_edges()));
			sessionStorage.setItem('nodes', JSON.stringify(this.nodes));
			// Update Graphs Circles and Edges
			this.update_graph_circles();
			this.update_graph_paths();
		},
	};

	//////////////////////////////////////////////////////////////////////////////
	// 'Main' Function
	//////////////////////////////////////////////////////////////////////////////
	// get body and document Elements
	var docEl = document.documentElement;
	var	bodyEl = document.getElementsByTagName('body')[0];
	// find appropriate width and height
	var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
	var height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;
	height -= 300;
	// create svg and set svg width and height
	var svg = d3.select('#graph-holder').append('svg')
				.attr('width', width)
				.attr('height', height);
	// if(sessionStorage.getItem('edges')){
	if (false){	
		console.log('Loading graph from autosave');
		var nodes = JSON.parse(sessionStorage.getItem('nodes'));
		var edges = graph.de_jsonify_edges(JSON.parse(sessionStorage.getItem('edges')), nodes);
		graph = new Graph(svg, nodes, edges);
		graph.set_id(nodes.length + 1);
	} else if(run_instructions.init_dummy){
		console.log('Initializing graph with dummy data');
		var xLoc = width/2 - 25,
				yLoc = 100;
		var nodes = [{node_name: 'concept_0', id: 0, x: xLoc, y: yLoc, node_type: consts.CONCEPT},
								 {node_name: 'concept_1', id: 1, x: xLoc, y: yLoc + 200, node_type: consts.CONCEPT}];
		var edges = [{source: nodes[1], target: nodes[0]}];
		graph = new Graph(svg, nodes, edges);
		graph.set_id(2);
	} else {
		console.log('Initializing empty graph');
		graph = new Graph(svg);
	}
	graph.update_graph();
})(window.d3, window.saveAs, window.Blob);
