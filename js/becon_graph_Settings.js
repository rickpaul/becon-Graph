//////////////////////////////////////////////////////////////////////////////
// Constants and Helping Functions
//////////////////////////////////////////////////////////////////////////////

function parseDate(___){
	console.log('parseDate UNIMPLEMENTED');// UNIMPLEMENTED
	return ___;
}

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
	add: 'ad',
	sub: 'sb',
	mul: 'ml',
	div: 'dv',
	gt:  'gt',
	lt:  'lt',
	DEFAULT: -1,
	SOURCE: 'source',
	SCALAR: 'scalar',
};

var dataPrefix = '../data/'; // DEPRECATED?
var phpMySQLPrefix = '/php/MySQL/';

// Color Generation:
// 	colors = d3.scale.category10();
//  colors_brighter = d3.rgb(colors(1)).brighter().toString()
//  colors_darker = d3.rgb(colors(1)).darker().toString()
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
colors_darker[consts.OUTPUT] = '#15537d';

var node_default = {};
node_default.node_name_prefix = 'node_';
node_default.node_type = consts.CONCEPT;
node_default.operation_type = consts.add;
node_default.concept_aggregation = consts.real_valued;
// node_default.concept_aggregation = consts.logistic;
node_default.input_mode = consts.SOURCE;
node_default.input_source = consts.random;
node_default.output_target = consts.console;
node_default.earliest_date = 0;
node_default.latest_date = 0;

var operation_translator = {};
operation_translator[consts.add] = '+';
operation_translator[consts.sub] = '-';
operation_translator[consts.mul] = '*';
operation_translator[consts.div] = '/';
operation_translator[consts.gt] = '>';
operation_translator[consts.lt] = '<';

var graph;

////////////////////////////////////////////////////////////////////////////////
// WEB CODE
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// WEB CODE CONSTANTS
////////////////////////////////////////////////////////////////////////////////
var node_type_HTML_ID_Map = {};
node_type_HTML_ID_Map[consts.CONCEPT] = '#node-type-concept';
node_type_HTML_ID_Map[consts.INPUT] = '#node-type-input';
node_type_HTML_ID_Map[consts.OPERATIONAL] = '#node-type-operational';
node_type_HTML_ID_Map[consts.OUTPUT] = '#node-type-output';
var HTML_ID_node_type_Map = {};
node_type_HTML_ID_Map['node-type-concept'] = consts.CONCEPT;
node_type_HTML_ID_Map['node-type-input'] = consts.INPUT;
node_type_HTML_ID_Map['node-type-operational'] = consts.OPERATIONAL;
node_type_HTML_ID_Map['node-type-output'] = consts.OUTPUT;
var operation_HTML_ID_Map = {};
operation_HTML_ID_Map[consts.add] = '#op_ad';
operation_HTML_ID_Map[consts.sub] = '#op_sb';
operation_HTML_ID_Map[consts.mul] = '#op_ml';
operation_HTML_ID_Map[consts.div] = '#op_dv';
operation_HTML_ID_Map[consts.gt] = '#op_gt';
operation_HTML_ID_Map[consts.lt] = '#op_lt';
var HTML_ID_operation_Map = {};
HTML_ID_operation_Map['#op_ad'] = consts.add;
HTML_ID_operation_Map['#op_sb'] = consts.sub;
HTML_ID_operation_Map['#op_ml'] = consts.mul;
HTML_ID_operation_Map['#op_dv'] = consts.div;
HTML_ID_operation_Map['#op_gt'] = consts.gt;
HTML_ID_operation_Map['#op_lt'] = consts.lt;
////////////////////////////////////////////////////////////////////////////////
// MYSQL CODE CONSTANTS
////////////////////////////////////////////////////////////////////////////////
var MySQL_ID_node_type_Map = {};
MySQL_ID_node_type_Map['concept'] = consts.CONCEPT;
MySQL_ID_node_type_Map['input'] = consts.INPUT;
MySQL_ID_node_type_Map['operation'] = consts.OPERATIONAL;
MySQL_ID_node_type_Map['output'] = consts.OUTPUT;
var Node_type_MySQL_ID_Map = {};
Node_type_MySQL_ID_Map[consts.CONCEPT] = 'concept';
Node_type_MySQL_ID_Map[consts.INPUT] = 'input';
Node_type_MySQL_ID_Map[consts.OPERATIONAL] = 'operation';
Node_type_MySQL_ID_Map[consts.OUTPUT] = 'output';

var run_instructions = {
	verbose: true,
	allow_stored: false,
	init_dummy: false,
	init_dummy_DB: true,
	init_dummy_DB_ID: 2,
};