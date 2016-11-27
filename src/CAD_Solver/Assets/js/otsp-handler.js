var tableOptions = {
	headers: {		
		addTop: true,		
		addLeft: true,
		editable: true,
		topGenericHeader: 'A',
		leftGenericHeader: 'A',
		startNameIndex: 1	/* e.g. A1, A2, A3 */
	},
	buttons: {
		addTop: true,
		addLeft: true,
		affect: 'both' /* which side of table buttons extend or reduce. Can be row, column, both */
	},
	content: {
		symmetrical: false, /* when a value (i,j) changes, a value (j, i) changes too */
		editable: true,
		defaultValue: 0, /* default empty cell value */
		diagonalElementsDisabled: true, /* disable input in elements (i,i) */
	}
};

var table = new InputTable("div.input-matrix", tableOptions);
table.extendTableWithDefaultName(0);
table.extendTableWithDefaultName(1);

$("#btn-solve").on('click', function () {

	$('#div-result').removeClass("hidden");
	$('#el1').collapse("hide");
	$('#el3').collapse("show");

	$("html, body").animate({ scrollTop: $(document).height() }, 'swing');
	$('#result').text(table.toJSON());


	var g =  {
		nodes: [
			{ id:1, label:"A1", size: 0.5, x: Math.random(), y: Math.random() },
			{ id:2, label:"A2", size : 0.5, x: Math.random(), y: Math.random() },
		],
		edges: [
			{ id : 10, source : 1, target : 2, label: "10", color: "#FF0000" }
		]
	};

	s = new sigma({
		graph: g,
		renderer: {
			container: 'result-graph',
			type: "canvas"
		},
		settings: {
			edgeLabelSize: 'proportional',
			minNodeSize: 5,
			maxNodeSize: 5
		}
	});
});
