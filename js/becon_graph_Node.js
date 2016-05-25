	//////////////////////////////////////////////////////////////////////////////
	// Node Object
	//////////////////////////////////////////////////////////////////////////////
	var Node = function(params){
		'use strict'
		this.fromSimpleObject(params);
		this.in_data = {}; // UNIMPLEMENTED
		this.out_data = {}; // UNIMPLEMENTED
	};
	Node.prototype = {
		////////////////////////////////////////////////////////////////////////////
		// JSON Functions
		////////////////////////////////////////////////////////////////////////////
		fromSimpleObject: function(params){
			'use strict'
			// Universal Params
			this.id = params.id;
			this.name = params.name || node_default.node_name_prefix + this.id;
			this.type_ = params.type || node_default.node_type;
			this.x = params.x;
			this.y = params.y;
			this.desc = params.desc
			// Concept Params
			if(params.concept_aggregation) {this.concept_aggregation = params.concept_aggregation;}
			// Input Params
			// if(typeof(params.input_mode_)!=='undefined') {this.input_mode_ = params.input_mode_;}
			if(typeof(params.input_source)!=='undefined') {this.input_source_ = params.input_source;}
			// if(typeof(params.input_scalar_)!=='undefined') {this.input_scalar_ = params.input_scalar_;}
			if(typeof(params.earliest_date)!=='undefined') {this.earliest_date = params.earliest_date;}
			if(typeof(params.latest_date)!=='undefined') {this.latest_date = params.latest_date;}
			if(typeof(params.periodicity)!=='undefined') {this.periodicity = params.periodicity;}
			// Operation Params
			if(params.operation_type) {this.operation_type = params.operation_type;}
			if(typeof(params.operation_left)!=='undefined') {this.operation_left = params.operation_left;}
			if(typeof(params.operation_right)!=='undefined') {this.operation_right = params.operation_right;}
			// Output Params
			if(params.output_target) {this.output_target = params.output_target;}
		},
		toSimpleObject: function(){
			'use strict'
			var save_params = {
				id: this.id,
				name: this.name,
				type: this.type_,
				x: this.x,
				y: this.y,
				desc: this.desc
			};
			if(this.type_ === consts.CONCEPT){
				save_params.concept_aggregation = this.concept_aggregation;
			} else if(this.type_ === consts.INPUT){
				save_params.input_source = this.input_source_;
				// save_params.input_mode_ = this.input_mode_;
				// if(this.input_mode_ === consts.SCALAR){
				// 	save_params.input_scalar_ = this.input_scalar_;
				// } else if(this.input_mode_ === consts.SOURCE){
				// 	save_params.input_source_ = this.input_source_;
				// } else {
				// 	throw new Error('Node type not recognized');
				// }
				// save_params.earliest_date = this.earliest_date;
				// save_params.latest_date = this.latest_date;
				// save_params.periodicity = this.periodicity;
			} else if(this.type_ === consts.OPERATIONAL){
				save_params.operation_type = this.operation_type;
				save_params.operation_left = this.operation_left;
				save_params.operation_right = this.operation_right;
			} else if(this.type_ === consts.OUTPUT){
				save_params.output_target = this.output_target;
			} else {
				throw new Error('Node type not recognized.');
			}
			return save_params;
		},
		toJSON: function(){
			'use strict'
			return JSON.stringify(
				this.toSimpleObject()
			);
		},
		toDB: function(){
			//UNIMPLEMENTED
		},
		////////////////////////////////////////////////////////////////////////////
		// Setter Functions
		////////////////////////////////////////////////////////////////////////////
		set type(new_type){
			'use strict'
			if (new_type === this.type) {return;}
			if (new_type === consts.CONCEPT){
				if(!this.concept_aggregation) {this.concept_aggregation = node_default.concept_aggregation}
			} else if (new_type === consts.INPUT){
				// if(!this.input_mode_) {this.input_mode_ = node_default.input_mode;}
				if(!this.input_source_) {this.input_source_ = node_default.input_source;}
				// if(!this.input_scalar_) {this.input_scalar_ = node_default.input_scalar;}
				// if(!this.earliest_date) {this.earliest_date = node_default.earliest_date;}
				// if(!this.latest_date) {this.latest_date = node_default.latest_date;}
				// if(!this.periodicity) {this.latest_date = node_default.latest_date;}
			} else if (new_type === consts.OUTPUT){
				if(!this.output_target) {this.output_target = node_default.output_target;}
			} else if (new_type === consts.OPERATIONAL){
				if(!this.operation_type) {this.operation_type = node_default.operation_type;}
				if(typeof(this.operation_left)==='undefined') {this.operation_left = consts.DEFAULT;}
				if(typeof(this.operation_right)==='undefined') {this.operation_right = consts.DEFAULT;}
			}
			this.type_ = new_type;
		},
		// set input_source(new_source) {
		// 	'use strict'
		// 	this.input_source_ = new_source;
		// 	this.input_mode_ = consts.SOURCE;
		// },
		// set input_scalar(_) {
		// 	'use strict'
		// 	this.input_scalar_ = _;
		// 	this.input_mode_ = consts.SCALAR;
		// },
		// set operation_left(new_value){
		// 	if(new_value && typeof(new_value)==='number') {
		// 		this.operation_left = new_value;
		// 	}
		// }, // OVERPROTECTIVE
		// set operation_right(new_value){
		// 	if(new_value && typeof(new_value)==='number') {
		// 		this.operation_right = new_value;
		// 	}
		// }, // OVERPROTECTIVE
		////////////////////////////////////////////////////////////////////////////
		// Getter Functions
		////////////////////////////////////////////////////////////////////////////
		// get id(){
		// 	'use strict'
		// 	return this.id_;
		// },
		// get input_source() {
		// 	'use strict'
		// 	return this.input_source_;
		// },
		// get input_scalar() {
		// 	'use strict'
		// 	return this.input_scalar_;
		// },
		// get input_mode() {
		// 	'use strict'
		// 	return this.input_mode_;
		// },
		get type(){
			'use strict'
			return this.type_;
		},
		get fill_color(){
			'use strict'
			return colors[this.type_];
		},
		get select_color(){
			'use strict'
			return colors_brighter[this.type_];
		},
		get stroke_color(){ 
			'use strict' 
			return colors_darker[this.type_]; 
		},
		get text(){
			'use strict'
			if ( this.type_ === consts.CONCEPT ) {
				return this.name;
			} else if ( this.type_ === consts.INPUT ) {
				return 'IN: ' + this.name;
			} else if ( this.type_ === consts.OUTPUT ) {
				return 'OUT: ' + this.name;
			} else if ( this.type_ === consts.OPERATIONAL ) {
				var left_str = '??';
				var rght_str = '??';
				try {
					if(typeof(this.operation_left)!=='undefined' && this.operation_left !== consts.DEFAULT) {
						left_str = (graph.nodes[this.operation_left]).name;
					}
					if(typeof(this.operation_right)!=='undefined' && this.operation_right !== consts.DEFAULT) {
						rght_str = graph.nodes[this.operation_right].name;
					}
				} catch(exception) {
					console.log(exception);
				}
				return (left_str + ' ' + operation_translator[this.operation_type] + ' ' + rght_str);
			} else {
				throw new Error('Node type not recognized');
			}
		},
		////////////////////////////////////////////////////////////////////////////
		// Functions
		////////////////////////////////////////////////////////////////////////////
		switch_operation_order: function(){
			'use strict'
			if (typeof(this.operation_left)==='undefined' || 
					typeof(this.operation_right)==='undefined' || 
					this.operation_right === consts.DEFAULT || 
					this.operation_left === consts.DEFAULT) {
				console.log('Operation node missing inputs.');
				return;
			}
			// var temp = this.operation_left;
			// this.operation_left = this.operation_right;
			// this.operation_right = temp;
			// Only switch visual (save will happen when we save)
			$('#op-rght-source-select').val(this.operation_left);
			$('#op-left-source-select').val(this.operation_right);
		},
		populate_operation_inputs: function(){
			var this_node = this;
			var input_node;
			var input_node_name;
			if(graph.edges_by_target.has_key(this.id)) {
				var in_node_ids = graph.edges_by_target.get(this.id);
				$("#op-rght-source-select").empty();
				$("#op-left-source-select").empty();
				$('<option value='+consts.DEFAULT+'>- choose -</option>').appendTo('#op-rght-source-select');
				$('<option value='+consts.DEFAULT+'>- choose -</option>').appendTo('#op-left-source-select');
				in_node_ids.forEach( function(d){
					input_node_name = graph.nodes[d].name;
					$('<option value='+d+'></option>').html(input_node_name).appendTo('#op-rght-source-select');
					$('<option value='+d+'></option>').html(input_node_name).appendTo('#op-left-source-select');
				});
				if (typeof(this.operation_left)==='undefined') {this.operation_left = consts.DEFAULT;}
				if (typeof(this.operation_right)==='undefined'){this.operation_right = consts.DEFAULT;}
				$('#op-left-source-select').val(this.operation_left);
				$('#op-rght-source-select').val(this.operation_right);
			}
		},
		check_node_name: function(new_name){
			'use strict'
			// UNIMPLEMENTED
		},
		get earliestDate(){
			'use strict'
			console.log('node '+this.id+': earliestDate');
			if( typeof(this.earliest_date) !== 'undefined' ) {
				return this.earliest_date;
			} else if ( this.type_ === consts.INPUT ) {
				this.load_data();
				return this.earliest_date;
			} else {
				var source_node_ids = graph.edges_by_target.get(this.id);
				this.earliest_date = d3.max(source_node_ids.map(function(d){
					return graph.nodes[d].earliestDate;
				}));
				return this.earliest_date;
			}
		},
		get latestDate(){
			'use strict'
			console.log('node '+this.id+': latestDate');
			if( typeof(this.latest_date) !== 'undefined' ) {
				return this.latest_date;
			} else if ( this.type_ === consts.INPUT ) {
				this.load_data();
				return this.latest_date;
			} else {
				var source_node_ids = graph.edges_by_target.get(this.id);
				this.latest_date = d3.min(source_node_ids.map(function(d){
					return graph.nodes[d].latestDate;
				}));
				return this.latest_date;
			}
		},

		load_data: function(){
			'use strict'
			console.log('node '+this.id+': load_data');
			if ( this.type_ !== consts.INPUT ) {
				throw new Error('Improper Load Attempt');
			}
			if ( this.input_mode_ === consts.SCALAR ) {
				this.latest_date = null; // UNIMPLEMENTED
				this.earliest_date = null; // UNIMPLEMENTED
				this.periodicity = null; // UNIMPLEMENTED
			} else if ( this.input_mode_ === consts.SOURCE ) {
				var this_node = this;
				var min_date, max_date, dt;
				console.log('node '+this.id+': reading '+filePrefix+this.input_source_);
				d3.json(filePrefix+this.input_source_, function(error, data){
					if (error) { throw error };
					min_date = parseDate(data[0][0]);
					max_date = parseDate(data[0][0]);
					this_node.in_data = {};
					data.forEach(function(d) {
						dt = parseDate(d[0]);
						min_date = Math.min(min_date, dt);
						max_date = Math.max(max_date, dt);
						this_node.in_data[dt] = +d[1];
					});
					this_node.latest_date = max_date; // UNIMPLEMENTED
					this_node.earliest_date = min_date; // UNIMPLEMENTED
					this_node.periodicity = null; // UNIMPLEMENTED
				});
			} else {
				throw new Error('Node source type_ not recognized');
			}
		},
	};