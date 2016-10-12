$.fn.addTable = function () {

	var table = $("<table>").addClass("table input-table table-responsive table-bordered");
	var tbody = $("<tbody>");
	table.append(tbody);

	addButtonRow(tbody);
	addHeaderRow(tbody);

	extend(tbody, "A1");
	extend(tbody, "A2");
	extend(tbody, "A3");

	extendAt(tbody, "lol", 1);

	$(this).append(table);
}

$.fn.appendAt = function( content, index ) {
    this.each(function(i, item) {
        var $content = $(content).clone();
        if ( index === 0 ) {
            $(item).prepend($content);
        } else {
            $content.insertAfter($(item).children().eq(index-1));
        }
    });
    $(content).remove();
    return this;
};

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

function extendAt (tbody, itemName, index) {
	itemNumber ++;

	insertRow(tbody, itemName, index);
	insertColumn (tbody, itemName, index);
}

function addRow (tbody, rowName) {
	var row = $("<tr class='content-row'>").append($("<th>").text(rowName));
	row.attr("row-id", itemNumber-1);
	tbody.append(row);
}

function insertRow(tbody, rowName, index) {
	index = Number(index);

	$(tbody.children('.content-row')).each(function (i, row) {

		var row = $(row);
		shiftRow(row, index);
	});

	var row = $("<tr class='content-row'>").append($("<th>").text(rowName));
	row.attr("row-id", index);
	tbody.appendAt(row, index + 2);
}

function shiftRow (row, index) {
	var id = Number(row.attr("row-id"));
	if (id > index) {
		row.attr("row-id", id + 1);	

		$(row.children()).each(function(i, cell) {

			var cell = $(cell);
			shiftCellRow(cell, index);
		});
	}
}

function shiftCellRow(cell, index) {
	var id = Number(cell.attr("row-id"));

	if (id > index) {
		cell.attr("row-id", id + 1);
	}
}

function insertColumn (tbody, colName, index) {
	index = Number(index);

		$(tbody.children('.content-row')).each(function (i, row) {

			var row = $(row);
			
			$(row.children()).each(function(i, cell) {

				var cell = $(cell);
				shiftCellCol(cell, index);
			});

			if (i != index)
				addCell(row, colName, index);
			else {
				for (var j = 0; j < itemNumber; j++)
					addCell(row, colName, j);
			}
	});

	addButtonCell(tbody, index);
	addHeaderCell(tbody, colName, index);
}

function shiftCellCol(cell, index) {
	var id = Number(cell.attr("col-id"));

	if (id > index) {
		cell.attr("col-id", id + 1);
	}
}

function addColumn (tbody, columnName) {
	addButtonCell (tbody, itemNumber-1);
	addHeaderCell(tbody, columnName, itemNumber-1);

	$(tbody.children('.content-row')).each(function (index, row) {
		if (index < itemNumber-1)
			addCell($(row), "0", itemNumber-1);
		else 
			for (var i=0; i<itemNumber; i++)
				addCell($(row), "0", i);
	});
}

function addButtonCell (tbody, index) {
	var buttonRow = $(tbody.children('#button-row'));

	var cell = $("<td>");

	var buttonPlus = $('<button type="button">').addClass("btn btn-sm btn-success btn-extend").text("+");
	var buttonMinus = $('<button type="button">').addClass("btn btn-sm btn-success btn-reduce").text("-").css('margin-left', 3);
	cell.append(buttonPlus);
	cell.append(buttonMinus);

	buttonRow.appendAt(cell, index+1);
}

function addHeaderCell (tbody, name, index) {
	var headerRow =  $(tbody.children('#header-row'));

	var cell = $("<th>").text(name);
	headerRow.appendAt(cell, index+1);
}

function addCell(row, value, index) {
	var cell = $("<td>").text(value);

	cell.attr("row-id", row.attr("row-id"));

	if (row.children().length == 1)
		cell.attr("col-id", 0);
	else
		cell.attr("col-id", Number(row.children(":last-child").attr("col-id"))+1);

	row.appendAt(cell, index+1);
}

function reduce (tbody) {
	
}