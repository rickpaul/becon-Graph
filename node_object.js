console.log('here');
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

var operation_HTML_ID_Map = {};
operation_HTML_ID_Map[consts.add] =  '#op_ad';
operation_HTML_ID_Map[consts.sub] =  '#op_sb';
// operation_HTML_ID_Map[consts.add] =  '#op_ad';
// operation_HTML_ID_Map[consts.add] =  '#op_ad';
// operation_HTML_ID_Map[consts.add] =  '#op_ad';
// operation_HTML_ID_Map[consts.add] =  '#op_ad';


	var Node = function(x_, y_, id_, type_, name_){
		this.id_ = id_;
		this.name_ = name_ || node_default.node_name_prefix + this.id_;
		this.type_ = type_ || node_default.node_type;
		this.x_ = x_;
		this.y_ = y_;
		this.in_data = {};
		this.out_data = {};
	};

	Node.prototype = {
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
		get edge_color(){
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

node = new Node(0,0,0);
node.type_ = 2;
console.log(node.type);
console.log(node.name_);
console.log(node.text);