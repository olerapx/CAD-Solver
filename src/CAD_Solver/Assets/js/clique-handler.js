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

