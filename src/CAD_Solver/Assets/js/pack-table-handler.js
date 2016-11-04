var tableOptions = {
	headers: {		
		addTop: true,		
		addLeft: true,
		editable: false,
		topGenericHeader: '',
		leftGenericHeader: 'Block ',
		startNameIndex: 1,	/* e.g. A1, A2, A3 */
		topTitles: ['Width', 'Height']
	},
	buttons: {
		addTop: false,
		addLeft: true,
		affect: 'row' /* which side of table buttons extend or reduce. Can be row, column, both */
	},
	content: {
		symmetrical: false, /* when a value (i,j) changes, a value (j, i) changes too */
		editable: true,
		defaultValue: 0, /* default empty cell value */
		diagonalElementsDisabled: false, /* disable input in elements (i,i) */
	}
};

var table = new InputTable("div.pack-table", tableOptions);
table.extendTableWithDefaultName(0, true);
table.extendTableWithDefaultName(1);

$("#btn-solve").on('click', function () {

	$('#div-result').removeClass("hidden");
	$('#el3').collapse("show");
	$('#result').text(table.toJSON());
});