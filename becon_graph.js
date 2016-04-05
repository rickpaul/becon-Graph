// Use MySQL and D3 Together
// http://www.d3noob.org/2013/02/using-mysql-database-as-source-of-data.html

// Uglification
// http://marijnhaverbeke.nl/uglifyjs
// http://closure-compiler.appspot.com/home#code%3D%252F%252F%2520%253D%253DClosureCompiler%253D%253D%250A%252F%252F%2520%2540compilation_level%2520SIMPLE_OPTIMIZATIONS%250A%252F%252F%2520%2540output_file_name%2520default.js%250A%252F%252F%2520%253D%253D%252FClosureCompiler%253D%253D%250A%250A%252F%252F%2520ADD%2520YOUR%2520CODE%2520HERE%250Afunction%2520hello(name)%2520%257B%250A%2520%2520alert('Hello%252C%2520'%2520%252B%2520name)%253B%250A%257D%250Ahello('New%2520user')%253B%250A%250A
// https://jscrambler.com/en/compare-plans

// http://www.html5rocks.com/en/tutorials/speed/v8/ js speedup
// http://notesbyanerd.com/customizing-sublime-for-js customize sublime
// https://css-tricks.com/exposing-form-fields-radio-button-css/ Checkbox Reveal

// http://plnkr.co/edit/MOczs02DNeUJGzXAPdMd?p=preview Graph search
// http://eloquentjavascript.net/20_node.html what is node
// http://debugbrowser.com/ watch video on how to debug in chrome
// http://nvd3.org/ graphs and charts
// http://tenxer.github.io/xcharts/examples/ graphs and charts
// http://www.findtheconversation.com/concept-map/

// Use Underscore.js

// Add Save
// Add Node Tags
// Add SessionStorage.clear() button


//////////////////////////////////////////////////////////////////////////////
// USED RESOURCES
//////////////////////////////////////////////////////////////////////////////
// https://bl.ocks.org/cjrd/6863459 // Graph Editing
// http://bl.ocks.org/bollwyvl/871b7c781b92fd0044f5 // Drag and Zoom Slider
//////////////////////////////////////////////////////////////////////////////
// Constants and Globals
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
	CONCEPT_META_KEYS: ['fn_type'],
	OPERATIONAL_META_KEYS: ['op', 'inp_1', 'inp_2'],
	INPUT_META_KEYS: ['inp_src', 'earliest_date', 'latest_date', 'periodicity'],
	OUTPUT_META_KEYS: ['out_tgt'],
	add: 'ad',
	sub: 'sb',
	mlt: 'ml',
	div: 'dv',
	gt:  'gt',
	lt:  'lt',
	// addID: 'op_ad',
	// subID: 'op_sb',
	// mltID: 'op_ml',
	// divID: 'op_dv',
	// gtID: 'op_gt',
	// ltID: 'op_lt',
};

// Color Generation:
// 	colors = d3.scale.category10();
//  colors_brighter = d3.rgb(colors(1).brighter().toString())
//  colors_darker = d3.rgb(colors(1).darker().toString())
var colors = {};
colors[consts.CONCEPT] = '#9467BD';
colors[consts.OPERATIONAL] = '#D62728';
colors[consts.INPUT] = '#FF7F0E';
colors[consts.OUTPUT] = '#1F77B4';

var colors_brighter = {};
colors_brighter[consts.CONCEPT] = '#D393FF';
colors_brighter[consts.OPERATIONAL] = '#FF3739';
colors_brighter[consts.INPUT] = '#FFB52A';
colors_brighter[consts.OUTPUT] = '#2CAAFF';

var colors_darker = {};
colors_darker[consts.CONCEPT] = '#674884';
colors_darker[consts.OPERATIONAL] = '#951B1C';
colors_darker[consts.INPUT] = '#B25809';
colors_darker[consts.OUTPUT] = '#1E701E';

var node_default = {};
node_default['node_name_prefix'] = 'node_';
node_default['node_type'] = consts.CONCEPT;
node_default['op_type'] = consts.add;

var graph;

////////////////////////////////////////////////////////////////////////////////
// WEB CODE
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// WEB CODE CONSTANTS
////////////////////////////////////////////////////////////////////////////////
var node_type_HTML_ID_Map = {};
node_type_HTML_ID_Map[consts.CONCEPT] = '#node-type-concept';
node_type_HTML_ID_Map[consts.CONCEPT] = '#node-type-input';
node_type_HTML_ID_Map[consts.CONCEPT] = '#node-type-operational';
node_type_HTML_ID_Map[consts.CONCEPT] = '#node-type-output';
var operation_HTML_ID_Map = {};
operation_HTML_ID_Map[consts.add] = '#op_ad';
operation_HTML_ID_Map[consts.sub] = '#op_sb';
operation_HTML_ID_Map[consts.mul] = '#op_ml';
operation_HTML_ID_Map[consts.div] = '#op_dv';
operation_HTML_ID_Map[consts.gt] = '#op_gt';
operation_HTML_ID_Map[consts.lt] = '#op_lt';

function WEB_hide_graph_control(){ $('#graph-holder').hide(); }
function WEB_show_graph_control() { $('#graph-holder').show(); }
function WEB_show_operation_node_subform() { 
	console.log('WEB_show_operation_node_subform');
	// Show Subform
	$('#operation_subform').show(); 
	// Select Previous Operation
	var radio_id = graph.selected_node.operation_type
	$(radio_id).prop('checked', true);
}
function WEB_hide_operation_node_subform() { $('#operation_subform').hide(); }
function WEB_show_concept_node_subform() { $('#concept_value_subform').show(); }
function WEB_hide_concept_node_subform() { $('#concept_value_subform').hide(); }
function WEB_show_input_node_subform() { $('#input_select_subform').show(); }
function WEB_hide_input_node_subform() { $('#input_select_subform').hide(); }

function WEB_show_edge_form() {
	console.log('WEB_show_edge_form');
	// Remove Other Forms
	WEB_hide_node_form();
	WEB_hide_graph_control();
	// Show Appropriate Subforms
	WEB_show_edge_subforms();
	// Show Edge Form
	$('#edge-form-holder').show();
}
function WEB_hide_edge_form() {
	console.log('WEB_hide_edge_form');
	// Collapse Edge Form
	$('#edge-form-holder').hide();
	// Collapse Edge Subforms
	WEB_hide_edge_subforms();
	// Show Default Form
	WEB_show_graph_control();
}
function WEB_show_edge_subforms() {
	console.log('WEB_show_edge_subforms');
	// Do Nothing
}
function WEB_hide_edge_subforms() {
	console.log('WEB_hide_edge_subforms');
	$('#really-delete-edge-button').hide();
}

function WEB_show_node_form() {
	console.log('WEB_show_node_form');
	// Remove Other Forms
	WEB_hide_graph_control();
	WEB_hide_edge_form();
	// Set Node Name box to Appropriate Value
	$('#node-name-input').val(graph.selected_node.node_name);
	// Set Checkbox to Appropriate Value
	var radio_id = graph.selected_node.type;
	$(radio_id).prop('checked', true);
	// Show the Form
	$('#node-form-holder').show();
	// Show Appropriate Subforms
	WEB_show_node_subforms();
}
function WEB_hide_node_form() {
	console.log('WEB_hide_node_form');
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
	console.log('WEB_hide_node_subforms');
	WEB_hide_operation_node_subform();
	WEB_hide_concept_node_subform();
	WEB_hide_input_node_subform();
	$('#really-delete-node-input').hide();
}
function WEB_show_node_subforms()
{
	console.log('WEB_show_node_subforms');
	// Hide All Subforms
	WEB_hide_node_subforms();
	// Get Node Type
	var node_type = $('input[name=node_type_radio]:checked', '#update-node-form').attr('id');
	console.log(node_type);
	if(node_type === 'node-type-concept'){
		// Show Relevant Form
		WEB_show_concept_node_subform();
		// Preview Change
		graph.selected_node.type = consts.CONCEPT;
	} else if(node_type === 'node-type-input'){
		// Show Relevant Form
		WEB_show_input_node_subform();
		// Preview Change
		graph.selected_node.type = consts.INPUT;
	} else if(node_type === 'node-type-operational'){
		// Preview Change
		graph.selected_node.type = consts.OPERATIONAL;
		// Show Relevant Form
		WEB_show_operation_node_subform();
	} else if(node_type === 'node-type-output'){
		 // Preview Change
		graph.selected_node.type = consts.OUTPUT;
	} else{
		console.log('ERROR: Node Type not recognized');
	};
		graph.update_graph();
}

function WEB_populate_input_select_box(){
	$.ajax({
		url: '/data/',
		success: function(data){
				$(data).find('a:contains(.json)').each(function(){
					var input_file = $(this).attr('href');
					$('<option></option>').html(input_file).appendTo('#input-source-select');
			});
		}
	});
}

function web_graph_mode_change_handle(){
	var node_type = $('input[name=graph-control-input]:checked').attr('id');
	if (node_type == 'graph-control-move') {
		graph.node_placement_mode = false;
	} else if (node_type == 'graph-control-add-node') {
		graph.node_placement_mode = true;
	}
}
function WEB_handle_operation_change(){
	var operation_type = $('input[name=operation_radio]:checked', '#update-node-form').val();
	graph.selected_node.node_meta['op'] = operation_type;
	graph.update_graph();
}
function web_graph_mode_set_mode_move() {
	$('#graph-control-move').prop('checked', true);
	graph.node_placement_mode = false;
}
function web_graph_mode_set_mode_place() {
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

function check_node_name_input(node_name) {
	return !(
		(node_name==null) ||
		(node_name=='') ||
		(node_name.indexOf(' ')>=0) ||
		(node_name.indexOf('\t')>=0)
	)
}

function web_handle_node_delete(event) {
	$('#delete-node-input').prop('disabled', true); // TODO: Not Working
	$('#really-delete-node-input').show();
}
function web_handle_node_delete_really(event) {
	graph.node_delete(graph.selected_node);
}
function web_handle_edge_delete(event) {
	$('#delete-edge-input').prop('disabled', true); // TODO: Not Working
	$('#really-delete-edge-input').show();
}
function web_handle_edge_delete_really(event) {
	graph.edge_delete(graph.selected_edge);
}
function web_handle_cancel(event)
{
	event.preventDefault();
	WEB_hide_node_form();
	return false;
}
function web_handle_submit(event)
{
	event.preventDefault();
	if(graph.selected_node == null){ return false; } // TODO: Never hits this...
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
	node_names = d3.values(graph.nodes).map(function(d){return d.node_name;});
	console.log(node_names);
	if (graph.selected_node.node_name != node_name && node_names.indexOf(node_name) >= 0 )
	{
		web_effect_require_resubmit(node_name_obj, 'Please Enter Unique Node Name');
		return false;
	}
	graph.selected_node.node_name = node_name;
	
	// Save Node Type
	// TODO: This is already being done.
	var node_type = $('input[name=node_type_radio]:checked', '#update-node-form').val();
	graph.selected_node.node_type = node_type;

	// Clean Up
	console.log('Node Information Submitted.');
	graph.node_deselect();
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
	// Array Dictionary Object (For Holding Edge Relationships)
	//////////////////////////////////////////////////////////////////////////////
	var Array_Dictionary = function(){
		// Basically a hash table where the key links to an array
		this.dict = {};
	}
	Array_Dictionary.prototype.add = function(key, value) {
		if(!this.dict[key]){
			this.dict[key] = [];
		}
		this.dict[key].push(value);
	};
	Array_Dictionary.prototype.delete = function(key, value) {
		if(!this.dict[key]){
			throw new Error('Key not found');
		}
		this.dict[key].splice(this.dict[key].indexOf(value),1);
		if (this.dict[key].length==0){
			delete this.dict[key];
		}
	};
	Array_Dictionary.prototype.exists = function(key, value) {
		if(!this.dict[key]){
			return false;
		}
		return this.dict[key].indexOf(value) >= 0;
	};
	//////////////////////////////////////////////////////////////////////////////
	// Node Object
	//////////////////////////////////////////////////////////////////////////////
	var Node = function(params){
		this.id = params.id;
		this.name_ = params.name_ || node_default.node_name_prefix + this.id;
		this.type_ = params.type_ || node_default.node_type;
		this.x = params.x;
		this.y = params.y;
		this.in_data = {};
		this.out_data = {};
	};
	Node.prototype = {
		////////////////////////////////////////////////////////////////////////////
		// JSON Functions
		////////////////////////////////////////////////////////////////////////////
		toSimpleObject: function(){
			return {
				id: this.id,
				name_: this.name_,
				type_: this.type_,
				x: this.x,
				y: this.y
			};
		},
		toJSON: function(){
			return JSON.stringify(
				this.toSimpleObject()
			);
		},
		////////////////////////////////////////////////////////////////////////////
		// Setter Functions
		////////////////////////////////////////////////////////////////////////////
		set type(new_type){
			if (new_type === this.type_) {return;}
			if (this.type_ === consts.CONCEPT){
				// Delete Old Metadata
				// Set New Metadata
			} else if (this.type_ === consts.INPUT){
			} else if (this.type_ === consts.OUTPUT){
			} else if (this.type_ === consts.OPERATIONAL){
			}
			this.type_ = new_type;
		},
		set operation_type(value){
			if (this.type_ !== consts.OPERATIONAL){
				throw new Error('Node does not support operation type.');
			}
			this.op_type = value;
		},
		////////////////////////////////////////////////////////////////////////////
		// Getter Functions
		////////////////////////////////////////////////////////////////////////////
		get type(){
			return this.type_;
		},
		get operation_type(){
			if (this.type_ !== consts.OPERATIONAL){
				throw new Error('Node does not support operation type.');
			}
			if (!this.op_type){
				this.op_type = node_default.op_type;
			}
			return this.op_type;
		},
		get operation_left(){
			// UNIMPLEMENTED
		},
		get operation_right(){
			// UNIMPLEMENTED
		},
		get fill_color(){
			return colors[this.type_];
		},
		get select_color(){
			return colors_brighter[this.type_];
		},
		get stroke_color(){
			return colors_darker[this.type_];
		},
		get text(){
			if ( this.type_ === consts.CONCEPT ) {
				return this.name_;
			} else if ( this.type_ === consts.INPUT ) {
				return 'IN: ' + this.name_;
			} else if ( this.type_ === consts.OUTPUT ) {
				return 'OUT: ' + this.name_;
			} else if ( this.type_ === consts.OPERATIONAL ) {
				return (this.name_ + ' : ' + this.operation_type);
			} else {
				// raise error
			}
		},
		////////////////////////////////////////////////////////////////////////////
		// Functions
		////////////////////////////////////////////////////////////////////////////
		switch_operation_order: function(){
			if (this.type_ !== consts.OPERATIONAL){
				throw new Error('Node does not support operation type.');
			}
			if (!this.operation_left || !this.operation_right){
				throw new Error('Operation node missing inputs.');
			}
			// UNIMPLEMENTED
		},
		check_node_name: function(new_name){
			// UNIMPLEMENTED
		},
		get_node_time_stats: function(){
			// UNIMPLEMENTED
		},
		get_node_values: function(time){
			// UNIMPLEMENTED
		},
	};
	//////////////////////////////////////////////////////////////////////////////
	// Graph Object
	//////////////////////////////////////////////////////////////////////////////
	var Graph = function(svg_, nodes_, edges_){
		////////////////////////////////////////////////////////////////////////////
		// Graph State Variables
		////////////////////////////////////////////////////////////////////////////
		// Add Nodes and Edges
		this.nodes = nodes_ || {};
		this.id_ct = d3.max(Object.keys(nodes_).map(function(d){return parseInt(d);})) || 0;
		this.edges_by_target = new Array_Dictionary();
		this.edges_by_source = new Array_Dictionary();
		this.edges = edges_ || [];
		graph = this; // TODO: Do we only need to do this once?
		edges_.forEach(function(edge){
			graph.edges_by_source.add(edge.source, edge.target);
			graph.edges_by_target.add(edge.target, edge.source);
		});
		// Initialize SVG
		this.svg = svg_;
		this.svg = initialize_svg_markers(this.svg);
		this.svg_group = initialize_svg_graph_group(this.svg);
		// Initialize SVG Groups
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

		this.lastKeyDown = -1;
		this.shiftNodeDraw = false;
		// this.justScaled = false; // Deprecated TODO: Delete
		// this.selected_text = false; // Deprecated TODO: Delete

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
				// console.log('dragstart');
			})
			.on('drag', function(d){
				graph.circle_dragmove_handle.call(graph, d);
			})
			.on('dragend', function(d){
				// console.log('dragend');
				graph.just_dragged = false;
			});

			// Zoom Listener
			this.graph_zoom = d3.behavior.zoom()
				.scaleExtent([.1, 1])
				.on('zoomstart', function(d){
					// console.log('zoomstart');
					graph.just_dragged = true;
				})
				.on('zoom', function(d){
					graph.zoomed.call(graph);
					return true;
				})
				.on('zoomend', function(d){
					// console.log('zoomend');
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
	// Graph Static Functions
	//////////////////////////////////////////////////////////////////////////////
	Graph.fromJSON = function(svg_, json_){
		'use strict'
		json_ = JSON.parse(json_);
		var nodes_obj = {};
		d3.entries(json_.nodes).map(function(d){
			nodes_obj[d.key] = new Node(d.value);
		});
		return new Graph(svg_, nodes_obj, json_.edges);
	};
	//////////////////////////////////////////////////////////////////////////////
	// Graph Prototype Functions
	//////////////////////////////////////////////////////////////////////////////
	Graph.prototype = {
		////////////////////////////////////////////////////////////////////////////
		// JSON Functions
		////////////////////////////////////////////////////////////////////////////
		toJSON: function(){
			var nodes_obj = {};
			d3.entries(this.nodes).map(function(d){
				nodes_obj[d.key] = d.value.toSimpleObject();
			});
			return JSON.stringify({
				'edges': this.edges,
				'nodes': nodes_obj
			});
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
			// Clear Node and Edge Selections
			if (this.selected_node){
				this.node_deselect();
			}
			if (this.selected_edge){
				this.edge_deselect();
			}
		},
		svg_mouseup_handle: function(){
			console.log('svg_mouseup_handle');
			if(this.justScaleTransGraph) {
				this.justScaleTransGraph = false;
			} else if (this.node_placement_mode) {
				// Create and Add New Node
				var loc = d3.mouse(this.svg_group.node());
				this.id_ct++;
				this.nodes[this.id_ct] = new Node(loc[0], loc[1], this.id_ct);
				// Change Graph Mode to Move Mode
				web_graph_mode_set_mode_move();
				// Update and Return
				this.update_graph();
			} else if (this.shiftNodeDraw) {
				this.shiftNodeDraw = false;
				this.dragline.classed('hidden', true);
			}

		},
		path_mousedown_handle: function(d3path, d){
			// prevent default
			d3.event.stopPropagation();
			if(this.node_placement_mode){ return; }
			// remove node selection if selected
			if(this.selected_node){
				this.node_deselect();
			}
			if(d === this.selected_edge){ // select same edge
				// remove edge selection on double click
				this.edge_deselect();
			}
			else if ((this.selected_edge) && (d !== this.selected_edge))	{ // change edge
				// remove edge selection
				this.edge_deselect()
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
			// console.log('dragmove');
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
		circle_mousedown_handle: function(d3_circle_under, node_under){
			if(run_instructions.verbose){console.log('circle_mousedown_handle');}
			// prevent default
			d3.event.stopPropagation();
			if(this.node_placement_mode){ return; }
			if (this.selected_node){
				this.node_deselect();
			}
			if (this.selected_edge){
				this.edge_deselect();
			}
			// If SHIFT_KEY, make dragline
			if (d3.event.shiftKey){
				this.mousedown_node = node_under;
				this.shiftNodeDraw = d3.event.shiftKey;
				this.dragline
					.classed('hidden', false)
					.attr('d', 'M'+node_under.x+','+node_under.y+'L'+node_under.x+','+node_under.y);
			} else {
				// Store State Variables
				this.node_select(d3_circle_under, node_under);
			}
		},
		circle_mouseup_handle: function(d3_circle_under, node_under){
			if(run_instructions.verbose){console.log('circle_mouseup_handle');}
			// d3.event.stopPropagation(); // Do not prevent default!
			this.shiftNodeDraw = false;
			d3_circle_under.classed('connect-node', false);

			// Handle Edge Dragging
			if(this.mousedown_node) {
				// Handle Edge Dragging / Remove Drag Line
				this.dragline.classed('hidden', true);
				// Handle Edge Dragging / Dragging to Original Node
				if( this.mousedown_node === node_under ) {
					this.just_dragged = false; // Should this be here?
				// Handle Edge Dragging / Dragging to New Node
				} else {
					var source_node_id = this.mousedown_node.id;
					var target_node_id = node_under.id;
					var source_node_type = this.mousedown_node.node_type;
					var target_node_type = node_under.node_type;
					// Handle Edge Dragging / Dragging to New Node / Add New Edge / Error Handling
					var error = this.check_new_edge_validity(source_node_id, target_node_id, source_node_type, target_node_type)
					// Handle Edge Dragging / Dragging to New Node / Add New Edge
					if (error) {
						if(run_instructions.verbose){console.log('Error Drawing New Edge: ' + error);} // TODO: Make error more verbose, have it appear to user.
					} else {
						this.edges_by_source.add(source_node_id, target_node_id);
						this.edges_by_target.add(target_node_id, source_node_id);
						this.edges.push({source: source_node_id, target: target_node_id});
						this.update_graph();
					}
				}
			}
			this.mousedown_node = null;
		},
		check_new_edge_validity: function(source_node_id, target_node_id, source_node_type, target_node_type) {
			if (source_node_type === consts.OUTPUT) {
				return 'Output nodes cannot pass along data';
			} else if (target_node_type === consts.INPUT) {
				return 'Input nodes cannot receive data';
			} else if (target_node_type === consts.OPERATIONAL) {
				// TODO: Check for > 2 edges-in
				return null; 
			} else if (this.edges_by_source.exists(source_node_id, target_node_id)) {
				return 'Duplicate Edge detected.'
			} else if (this.edges_by_target.exists(source_node_id, target_node_id)) {
				return 'Reverse Edge detected.'
			}
			// Everything OK
			return null;
		},
		edge_delete: function(edge){
			// Remove Select
			this.edge_deselect();
			// Delete Edge
			this.edge_delete_link(edge);
			//Update Graph
			this.update_graph();
		},
		edge_delete_link: function(edge){
			this.edges.splice(this.edges.indexOf(edge),1);
			this.edges_by_source.delete(edge.source, edge.target);
			this.edges_by_target.delete(edge.target, edge.source);
		},
		node_delete: function(node){
			// Remove Select
			this.node_deselect();
			// Delete Node
			delete this.nodes[node.id];
			// Delete Associated Edges
			this.node_delete_associated_edges(node.id);
			//Update Graph
			this.update_graph();
		},
		node_delete_associated_edges: function(delete_node_id){
			// Find Edges
			var delete_edges = this.edges.filter(function(edge){
				return (edge.source === delete_node_id || edge.target === delete_node_id);
			});
			// Delete Edges
			delete_edges.map(function(edge){
				graph.edge_delete_link(edge);
			});
		},
		node_select: function(d3path, d){
			console.log('node_select');
			// Change Node State Variables
			this.selected_node = d;
			this.selected_node_circle = d3path;
			// Change Node Circle Appearance
			this.selected_node_circle
				.classed(consts.selectedClass, true); // TODO: what does this do..? Can delete?
			this.selected_node_circle
				.select('circle')
					.classed(consts.selectedClass, true)
					.style('fill', function(d) { return d.select_color; })
			// Add Editing Form
			WEB_show_node_form();
		},
		node_deselect: function(){
			console.log('node_deselect');
			// Remove Editing Form
			WEB_hide_node_form();
			// Change Node Circle Appearance
			this.selected_node_circle
				.classed(consts.selectedClass, false); // what does this do..? Can delete?
			this.selected_node_circle
				.select('circle')
					.classed(consts.selectedClass, false)
					.style('fill', function(d) { return d.fill_color; })
			// Change Node State Variables
			this.selected_node = null;
			this.selected_node_circle = null;
		},
		edge_select: function(d3path, d){
			console.log('edge_select');
			// Change Edge State Variables
			this.selected_edge = d;
			this.selected_edge_path = d3path;
			// Change Edge Path Appearance
			this.selected_edge_path
				.classed(consts.selectedClass, true);
			// Add Editing Form
			WEB_show_edge_form();
		},
		edge_deselect: function(){
			console.log('edge_deselect');
			// Remove Editing Form
			WEB_hide_edge_form();
			// Change Edge Path Appearance
			this.selected_edge_path
				.classed(consts.selectedClass, false);
			// Change Edge State Variables
			this.selected_edge = null;
			this.selected_edge_path = null;
		},
		update_graph_paths: function(){
			var graph = this;
			// find paths by selecting unique edges
			this.paths = this.paths.data(this.edges, function(d){
				return (d.source + '+' + d.target);
			});
			// update paths
			this.paths
				.style('marker-end', 'url(#end-arrow)') // Add Arrow
				.classed(consts.selectedClass, function(d){ // Make Selected Paths Different Style
					return d === this.selected_edge;
				})
				.attr('d', function(d){
					return 'M' + graph.nodes[d.source].x + ',' + graph.nodes[d.source].y + 'L' + graph.nodes[d.target].x + ',' + graph.nodes[d.target].y;
				});
			// add new paths
			this.paths
				.enter()
				.append('path')
					.style('marker-end', 'url(#end-arrow)') // Add Arrow
					.classed('link', true)
					.attr('d', function(d) {
						return 'M' + graph.nodes[d.source].x + ',' + graph.nodes[d.source].y + 'L' + graph.nodes[d.target].x + ',' + graph.nodes[d.target].y;
						// return 'M' + d.source.x + ',' + d.source.y + 'L' + d.target.x + ',' + d.target.y;
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
			this.circles = this.circles.data(d3.values(this.nodes));
			// Update Existing Nodes
			// Update Existing Nodes / Update Position
			var circle_update = this.circles
				.attr('transform', function(d){
					return 'translate('+d.x+','+d.y+')';
				});
			// Update Existing Nodes / Update Text
			circle_update
				.select('text')
					.text(function(d){return d.text;});
			// Update Existing Nodes / Update Color
			circle_update
				.select('circle')
					.style('fill', function(d) { return d.fill_color; })
					.style('stroke', function(d) { return d.stroke_color; });
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
					.style('fill', function(d) { 
						console.log(d);
						console.log(d.id);
						return d.fill_color; })
					.style('stroke', function(d) { return d.stroke_color; });
			// Add New Nodes / Add Text
			circle_enter
				.append('svg:text')
					.attr('x', 0)
					.attr('y', 4)
					.attr('class', 'circle-id')
					.text(function(d){return d.text;});

			// Remove Deleted Nodes
			this.circles.exit().remove()
		},
		update_graph: function(){
			// Save Current Version of Graph to Session Storage
			sessionStorage.setItem('graph', this.toJSON());
			sessionStorage.setItem('nodes', JSON.stringify(this.nodes));
			// Update Graphs Circles and Edges
			this.update_graph_circles();
			this.update_graph_paths();
		},
		run_graph: function() {
			var remaining_nodes = d3.values(this.nodes).filter(function(d){return (d.node_type===consts.INPUT);});
			var new_nodes;
			// );
			var output_remains = false;
			this.run_time = 0;
			var target_ids, target_node;
			while(output_remains){
				new_nodes = {};
				remaining_nodes.forEach(function(source_node){
					target_ids = graph.edges_by_source[source_id];
					target_ids.forEach(function(target_id){
						target_node = graph.nodes[target_id];
						new_nodes[target_id] = target_node;
						graph.send_signal(source_node, target_node);
					});
					remaining_nodes = d3.values(new_nodes).filter(function(d){return (d.node_type!==consts.OUTPUT);});
				});
				this.advance_run_time();
			}
		},
		validate_graph: function(){
			// UNIMPLEMENTED
		},
		get_graph_time_stats: function(){
			// UNIMPLEMENTED
			// Get Earliest Date
			// Get Latest Date
			// Get Time Step
		},
		send_signal: function(source_node, target_node){
			if (source_node.node_type === consts.INPUT){
				// CONSIDER: Can fill in all data at once?
				target_node.in_signal[this.time_] = source_node.read_input(this.time_);
			} else if (source_node.node_type === consts.OPERATIONAL){

				// Save Locally, then write out when finished?
			} else if (source_node.node_type === consts.CONCEPT){
				// combine signals
			} else if (source_node.node_type === consts.OUTPUT){
				// Save Locally, then write out when finished?
			} else {
				console.log('ERROR: Node Type not recognized');
			}
		},
		advance_run_time: function(){
			// UNIMPLEMENTED
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
	var height =  window.innerHeight|| docEl.clientHeight || bodyEl.clientHeight;
	height -= 300;
	// create svg and set svg width and height
	var svg = d3.select('#graph-holder').append('svg')
				.attr('width', width)
				.attr('height', height);
	var stored_session = sessionStorage.getItem('graph');
	if(stored_session && false){
		console.log('Loading graph from autosave');
		graph = Graph.fromJSON(svg, stored_session)
	} else if(run_instructions.init_dummy){
		var xLoc = width/2 - 25,
		yLoc = 100;
		console.log('Initializing graph with dummy data');
		var x_ = width/2 - 25,
				y_ = height/2 - 25,
				id_ = 0;
		var nodes = {
									0: new Node({x: x_-200, y: y_-100, id: id_++, type_: consts.INPUT, name_: 'r'}),
									1: new Node({x: x_-200, y: y_+100, id: id_++, type_: consts.INPUT, name_: 'g'}),
									2: new Node({x: x_, y: y_, id: id_++, type_: consts.OPERATIONAL, operation_type: 'sb'}),
									3: new Node({x: x_+200, y: y_, id: id_++, type_: consts.OUTPUT, name_: 'relative_growth_rate'}),
								};
		var edges = [
									{source: 1, target: 2},
									{source: 0, target: 2},
									{source: 2, target: 3},
								];
		graph = new Graph(svg, nodes, edges);
	} else {
		console.log('Initializing empty graph');
		graph = new Graph(svg);
	}
	graph.update_graph();
})(window.d3, window.saveAs, window.Blob);
