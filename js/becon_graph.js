var session_id = null;
var graph_id = null;
var graph = null;
var svg = null;

//////////////////////////////////////////////////////////////////////////////
// Helper Functions
//////////////////////////////////////////////////////////////////////////////
function calibrate_canvas(svg){
	'use strict'
	// get body and document elements
	var document_ = document.documentElement;
	var body_ = document.getElementsByTagName('body')[0];
	// find appropriate width and height
	var w_ = window.innerWidth || document_.clientWidth || body_.clientWidth;
	var h_ =  window.innerHeight|| document_.clientHeight || body_.clientHeight;
	// make space for control elements
	h_ -= 300;
	svg.attr('width', w_).attr('height', h_);
}

function init_graph(svg) {
	var w_ = 0;
	var h_ = 0;
	var stored_session = sessionStorage.getItem('graph');
	if(stored_session && run_instructions.allow_stored){
		console.log('Loading graph from autosave');
		graph = Graph.fromJSON(svg, stored_session);
	} else if(run_instructions.init_dummy){
		var xLoc = w_/2 - 25,
		yLoc = 100;
		console.log('Initializing graph with dummy data');
		var x_ = w_/2 - 25,
				y_ = h_/2 - 25,
				id_ = 0;
		var nodes = {
			0: new Node({x: x_-200, y: y_-100, id: id_++, type: consts.INPUT, name: 'r'}),
			1: new Node({x: x_-200, y: y_+100, id: id_++, type: consts.INPUT, name: 'g'}),
			2: new Node({x: x_, y: y_, id: id_++, type: consts.OPERATIONAL, operation_type: 'sb'}),
			3: new Node({x: x_+200, y: y_, id: id_++, type: consts.OUTPUT, name: 'relative_growth_rate'}),
		};
		var edges = [
			{source: 1, target: 2},
			{source: 0, target: 2},
			{source: 2, target: 3},
		];
		var graph_id = run_instructions.init_dummy_DB_ID;
		graph = new Graph(svg, graph_id);
		graph.fromObj_load_nodes(nodes);
		graph.fromObj_load_edges(edges);
	} else if(run_instructions.init_dummy_DB){
		var graph_id = run_instructions.init_dummy_DB_ID;
		graph = new Graph(svg, graph_id);
		graph.fromDB_load_nodes();
		graph.fromDB_load_edges();
	} else {
		console.log('Initializing empty graph');
		graph = new Graph(svg, 0);
	}
	return graph;
}

function setup() {
	// create svg and calibrate
	svg = d3.select('#graph-holder').append('svg')
	calibrate_canvas(svg);
	// create graph and update
	graph = init_graph(svg);
	graph.update_graph();
	// create window resize listener
	window.onresize = function(){graph.update_window(graph.svg);}
}
//////////////////////////////////////////////////////////////////////////////
// 'Main' Function
//////////////////////////////////////////////////////////////////////////////
document.onload = (function(d3, saveAs, Blob, undefined){
	'use strict'
	setup();
})(window.d3, window.saveAs, window.Blob);
