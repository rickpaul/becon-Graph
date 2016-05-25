////////////////////////////////////////////////////////////////////////////////
// GRAPH CODE
////////////////////////////////////////////////////////////////////////////////
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
		svg_.select('.graph').remove();
		var svg_group = svg_.append('g')
			.classed(consts.graphClass, true);
		return svg_group;
	};
	//////////////////////////////////////////////////////////////////////////////
	// Graph Object
	//////////////////////////////////////////////////////////////////////////////
	var Graph = function(svg_, graph_id_){
		'use strict'
		////////////////////////////////////////////////////////////////////////////
		// Graph State Variables
		////////////////////////////////////////////////////////////////////////////
		graph = this;
		this.graph_id = graph_id_ || AJAX_get_Graph_ID_Count();
		this.async_tasks = 0; // hack for making sure we're dealing with async tasks.
		// Add Nodes and Edges
		// Add Nodes and Edges / Get ID Count
		queue()
			.defer(graph.increment_task_count)
			.defer(AJAX_get_Node_ID_Count)
			.await(function(error, task_action, ID_Count){
				graph.id_ct = parseInt(ID_Count);
				graph.decrement_task_count();
			})
		;
		// Add Nodes and Edges / Add Nodes
		this.nodes = {};

		// Add Nodes and Edges / Add Edges
		this.edges_by_target = new Array_Dictionary();
		this.edges_by_source = new Array_Dictionary();
		this.edges = [];

		// Initialize SVG
		this.svg = svg_;
		this.svg = initialize_svg_markers(this.svg);
		this.svg_group = initialize_svg_graph_group(this.svg);
		// Initialize SVG Groups
		this.paths = this.svg_group.append('g').selectAll('g');
		this.circles = this.svg_group.append('g').selectAll('g');

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
			this.svg.call(this.graph_zoom).on('dblclick.zoom', null);
			// Zoom Slider Listener
			$('#slider-holder').empty();
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
	};
	//////////////////////////////////////////////////////////////////////////////
	// Graph Static Functions
	//////////////////////////////////////////////////////////////////////////////
	Graph.fromJSON = function(json_){
		'use strict'
		json_ = JSON.parse(json_);
		graph.graph_id = json_.graph_id;
		graph.fromObj_load_nodes(json_.nodes);
		graph.fromObj_load_edges(json_.edges);
		return graph;
	};
	//////////////////////////////////////////////////////////////////////////////
	// Graph Prototype Functions
	//////////////////////////////////////////////////////////////////////////////
	Graph.prototype = {
		////////////////////////////////////////////////////////////////////////////
		// Async Queue Functions
		////////////////////////////////////////////////////////////////////////////
		increment_task_count: function(callback) {
			graph.async_tasks+=1;
			console.log('++ASYNC TASKS: ' + graph.async_tasks);
			if(callback){callback(null, 1);}
		},
		decrement_task_count: function(callback) {
			graph.async_tasks-=1;
			console.log('--ASYNC TASKS: ' + graph.async_tasks);
			if(callback){callback(null, -1);}
		},
		////////////////////////////////////////////////////////////////////////////
		// Clear Functions
		////////////////////////////////////////////////////////////////////////////
		clear_nodes: function() {
			this.nodes = {};
			// Reset Graph
			this.update_graph();
		},
		clear_edges: function() {
			this.edges = [];
			this.edges_by_source = new Array_Dictionary();
			this.edges_by_target = new Array_Dictionary();
			// Reset Graph
			this.update_graph();
		},
		////////////////////////////////////////////////////////////////////////////
		// Loading Functions
		////////////////////////////////////////////////////////////////////////////
		fromObj_load_nodes: function(nodes_) {
			// Create New Nodes
			var nodes_obj = {};
			// Replace Nodes
			d3.entries(nodes_).map(function(d){
				nodes_obj[d.key] = new Node(d.value);
			});
			// _.extend(this.nodes, nodes_obj);
			this.nodes = nodes_obj;
			// Reset Graph
			this.update_graph();
		},
		fromObj_load_edges: function(edges_) {
			// Clear Old Edges
			this.clear_edges();
			// Add New Edges
			edges_.forEach(function(edge_){
				graph.edges.push(edge_);
				graph.edges_by_source.add(edge_.source, edge_.target);
				graph.edges_by_target.add(edge_.target, edge_.source);
			});
			// Reset Graph
			this.update_graph();
		},
		fromDB_load_nodes: function(graph_id) {
			var load_graph_id = graph_id || this.graph_id;
			var outer_q = queue()
				.defer(graph.increment_task_count)
				.defer(AJAX_load_Graph_Nodes, load_graph_id)
				.await(function(error, task_action, nodes_) {
					graph.decrement_task_count();
					// Clear Old Nodes
					graph.clear_nodes();
					// Repopulate with Empty Nodes
					nodes_.forEach(function(d){graph.nodes[d] = null;});
					var inner_q = queue();
					// Request new Node Info
					Object.keys(graph.nodes).forEach(function(node_id) {
						graph.increment_task_count();
						inner_q.defer(AJAX_load_Node_Info, load_graph_id, node_id);
					});
					inner_q.awaitAll(function(error, nodes_) {
						// Replace Nodes
						nodes_.forEach(function(node_){
							graph.nodes[node_.id] = new Node(node_);
							graph.decrement_task_count();
						});
						// Reset Graph
						graph.update_graph();
					});
				})
			;
		},
		fromDB_load_edges: function(graph_id) {
			var load_graph_id = graph_id || this.graph_id;
			queue()
				.defer(graph.increment_task_count)
				.defer(AJAX_load_Graph_Edges, load_graph_id)
				.await(function(error, task_action, edges_) {
					// Clear Old Edges
					graph.clear_edges();
					// Add New Edges
					edges_.forEach(function(edge_){
						graph.edges.push(edge_);
						graph.edges_by_source.add(edge_.source, edge_.target);
						graph.edges_by_target.add(edge_.target, edge_.source);
					});
					graph.decrement_task_count();
					// Reset Graph
					graph.update_graph();
				})
			;
		},
		////////////////////////////////////////////////////////////////////////////
		// Saving Functions
		////////////////////////////////////////////////////////////////////////////
		toJSON: function() {
			'use strict'
			var nodes_obj = {};
			d3.entries(this.nodes).map(function(d) {
				nodes_obj[d.key] = d.value.toSimpleObject();
			});
			return JSON.stringify({
				'edges': this.edges,
				'nodes': nodes_obj,
				'graph_id': this.graph_id
			});
		},
		toDB_save_nodes: function() {
			var graph_id = graph.graph_id;
			var q = queue();
			_.each(graph.nodes, function(node_obj_, node_id_) { 
				graph.increment_task_count();
				q.defer(AJAX_save_Node_Info, graph_id, node_obj_.toSimpleObject());
			});
			q.awaitAll(function(error, successes) {
				successes.forEach(function(success_) {
					if( success_ === 1 ) { graph.decrement_task_count(); }
				});
			});
		},
		toDB_save_edges: function() {
			var graph_id = this.graph_id;
			queue()
				.defer(graph.increment_task_count)
				.defer(AJAX_unlock_Edges, graph_id)
				.await(function(error, task_action, success) {
					graph.decrement_task_count();
					// Add Graph Edges
					var inner_q = queue();
					graph.edges.forEach(function(edge_){
						graph.increment_task_count();
						inner_q.defer(AJAX_save_Edge, graph_id, edge_.source, edge_.target);
					});
					inner_q.awaitAll(function(error, successes) {
						successes.forEach(function(success_){
							if( success_ === 1 ) { graph.decrement_task_count(); }
						})
					});
					// Delete Unlocked Edges
					queue()
						.defer(graph.increment_task_count) // returns task_action
						.defer(AJAX_delete_unlocked_Edges, graph_id) // returns success
						.await(function(error, task_action, success) {
							graph.decrement_task_count();
						})
					;
				})
			;
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
			h -= 350;
			svg.attr('width', w).attr('height', h);
		},
		zoomed: function() {
			// Return if we're in node placement mode
			if (this.node_placement_mode) {
				return false;
			}
			// Move the graph
			console
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
			'use strict'
			// Clear Node and Edge Selections
			if (this.selected_node){
				this.node_deselect();
			}
			if (this.selected_edge){
				this.edge_deselect();
			}
		},
		svg_mouseup_handle: function(){
			'use strict'
			// console.log('svg_mouseup_handle');
			if(this.justScaleTransGraph) {
				this.justScaleTransGraph = false;
			} else if (this.node_placement_mode) {
				// Create and Add New Node
				var loc = d3.mouse(this.svg_group.node());
				this.add_node(loc[0], loc[1])
				// Change Graph Mode to Move Mode
				web_graph_mode_set_mode_move();
				// Update and Return
				this.update_graph();
			} else if (this.shiftNodeDraw) {
				this.shiftNodeDraw = false;
				this.dragline.classed('hidden', true);
			}

		},
		add_node: function(x_loc, y_loc) {
			this.id_ct++;
			this.nodes[this.id_ct] = new Node({
				x: x_loc, 
				y: y_loc, 
				id:this.id_ct
			});
		},
		// set_nodes: function(nodes_) {
		// 	console.log('SET NODES: '+ nodes_);
		// 	console.log('SET NODES: '+ this);
		// 	console.log('SET NODES: '+ graph);
		// 	this.nodes = nodes_;
		// 	this.update_graph();
		// },
		// set_edges: function(edges_) {
		// 	edges_.map(function(d){
		// 		this.edges_by_source.add(d.source, d.target);
		// 		this.edges_by_target.add(d.target, d.source);
		// 		this.edges.push(d);
		// 	});
		// 	this.update_graph();
		// },
		path_mousedown_handle: function(d3path, d){
			'use strict'
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
			'use strict'
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
			'use strict'
			// if(run_instructions.verbose){console.log('circle_mousedown_handle');}
			// prevent default
			d3.event.stopPropagation();
			if(this.node_placement_mode){ return; }
			if (this.selected_node){
				this.node_deselect();
			}
			if (this.selected_edge){
				this.edge_deselect();
			}
			// If Shift Key Pressed, make dragline
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
			'use strict'
			// if(run_instructions.verbose){console.log('circle_mouseup_handle');}
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
					var source_node_type = this.mousedown_node.type_;
					var target_node_type = node_under.type_;
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
			'use strict'
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
			'use strict'
			// Remove Select
			this.edge_deselect();
			// Delete Edge
			this.edge_delete_link(edge);
			//Update Graph
			this.update_graph();
		},
		edge_delete_link: function(edge){
			'use strict'
			this.edges.splice(this.edges.indexOf(edge),1);
			this.edges_by_source.delete(edge.source, edge.target);
			this.edges_by_target.delete(edge.target, edge.source);
		},
		node_delete: function(node){
			'use strict'
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
			'use strict'
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
			'use strict'
			// console.log('node_select');
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
			'use strict'
			// console.log('node_deselect');
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
			'use strict'
			// console.log('edge_select');
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
			'use strict'
			// console.log('edge_deselect');
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
			'use strict'
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
			'use strict'
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
					.style('fill', function(d) {  return d.fill_color; })
					.style('stroke', function(d) { return d.stroke_color; });
			// Add New Nodes / Add Text
			circle_enter
				.append('svg:text')
					.attr('x', 0)
					.attr('y', 4)
					.attr('class', 'circle-id')
					.text(function(d){return d.text;});

			// Remove Deleted Nodes
			this.circles.exit().remove();
		},
		update_graph: function(){
			'use strict'
			if(this.async_tasks > 0){ return; }
			// Save Current Version of Graph to Session Storage
			sessionStorage.setItem('graph', this.toJSON());
			// Update Graphs Circles and Edges
			this.update_graph_circles();
			this.update_graph_paths();
		},
		run_graph: function() {
			var remaining_nodes = d3.values(this.nodes).filter(function(d){return (d.node_type===consts.INPUT);});
			var new_nodes;
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
			// Input Nodes
			var input_nodes = graph.nodes.filter(function(node){
				return (node.type_ === consts.INPUT);
			});
			// Input Nodes / No Inbound Nodes
			input_nodes.forEach(function(node){
				if (graph.edges_by_target.has_key(node.id)){
					node.error = 'INPUT HAS INPUT';
				}
			});
			// Input Nodes / No Repeated
			// Input nodes don't have repeated data sources
			// Output nodes don't have outbound
			// Operation nodes don't have outbound
			// Operation nodes don't have repeated data targets
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