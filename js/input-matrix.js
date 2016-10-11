$.fn.addTable = function () {

	var table = $("<table>").addClass("table input-table table-responsive table-bordered");
	var tbody = $("<tbody>");
	table.append(tbody);

	addButtonRow(tbody);
	addHeaderRow(tbody);

	extend(tbody, "A1");
	extend(tbody, "A2");
	extend(tbody, "A3");

	$(this).append(table);
}

var itemNumber = 0;

$("div.input-matrix").addTable();

function addButtonRow (tbody) {
	var buttonRow = $("<tr id='button-row'>").append($("<td>"));

	tbody.append(buttonRow);
}

function addHeaderRow(tbody) {
	var headerRow = $("<tr id='header-row'>").append($("<th>"));

	tbody.append(headerRow);
}

function extend (tbody, itemName) {
	itemNumber ++;

	addRow(tbody, itemName);
	addColumn (tbody, itemName);
}

function addRow (tbody, rowName) {
	var row = $("<tr class='content-row'>").append($("<th>").text(rowName));
	tbody.append(row);
}

function addColumn (tbody, columnName) {
	addButtonCell (tbody);
	addHeaderCell(tbody, columnName);

	$(tbody.children('.content-row')).each(function (index, row) {
		if (index < itemNumber-1)
			addCell($(row), "0");
		else 
			for (var i=0; i<itemNumber; i++)
				addCell($(row), "0");
	});
}

function addButtonCell (tbody) {
	var buttonRow = $(tbody.children('#button-row'));

	var cell = $("<td>");

	var buttonPlus = $('<button type="button">').addClass("btn btn-sm btn-success btn-extend").text("+");
	var buttonMinus = $('<button type="button">').addClass("btn btn-sm btn-success btn-reduce").text("-").css('margin-left', 3);
	cell.append(buttonPlus);
	cell.append(buttonMinus);

	buttonRow.append(cell);
}

function addHeaderCell (tbody, name) {
	var headerRow =  $(tbody.children('#header-row'));

	var cell = $("<th>").text(name);
	headerRow.append(cell);
}

function addCell(row, value) {
	var cell = $("<td>").text(value);
	row.append(cell);
}
