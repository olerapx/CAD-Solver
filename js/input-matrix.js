var itemNumber = 0;
var counter = 2;

$.fn.addTable = function () {

	var table = $("<table>").addClass("table input-table table-responsive table-bordered");
	var tbody = $("<tbody>");
	table.append(tbody);

	constructButtonRow(tbody);
	constructHeaderRow(tbody);

	addFirstItem(tbody, "A1");

	$(this).append(table);
}

$.fn.appendAt = function(content, index) {
	index = Number(index);
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

$.fn.removeAt = function (index) {
	index = Number(index);
	$(this.children(':nth-child(' + (index + 3) + ')')).remove();
};

$("div.input-matrix").addTable();

function constructButtonRow (tbody) {
	var buttonRow = $("<tr id='button-row'>").append($("<td>"));
	tbody.append(buttonRow);
}

function constructHeaderRow(tbody) {
	var headerRow = $("<tr id='header-row'>").append($("<th>"));
	tbody.append(headerRow);
}

function addFirstItem(tbody, itemName) {
	extendTable(tbody, itemName, itemNumber-1);
}

function extendTable (tbody, itemName, index) {
	index = Number(index);
	itemNumber ++;

	addRow(tbody, itemName, index + 1);
	addColumn (tbody, itemName, index + 1);
}

function addRow(tbody, rowName, index) {
	index = Number(index);

	$(tbody.children('.content-row')).each(function (i, row) {

		var row = $(row);
		shiftRow(row, index, +1);
	});

	var headerCell = $("<th>");
	headerCell.text(rowName);
	headerCell.attr("header-id", index);

	var row = $("<tr class='content-row'>").append(headerCell);
	row.attr("row-id", index);
	tbody.appendAt(row, index + 2);
}

function shiftRow (row, index, diff) {
	index = Number(index);
	diff = Number(diff);

	var id = Number(row.attr("row-id"));
	if (id >= index) {
		row.attr("row-id", id + diff);	
		row.children("th").attr("header-id", id + diff);

		$(row.children()).each(function(i, cell) {

			var cell = $(cell);
			shiftCellsRow(cell, index, diff);
		});
	}
}

function shiftCellsRow(cell, index, diff) {
	index = Number(index);
	diff = Number(diff);

	var id = Number(cell.attr("row-id"));

	if (id >= index)
		cell.attr("row-id", id + diff);
}

function addColumn (tbody, colName, index) {
	index = Number(index);

		$(tbody.children('.content-row')).each(function (i, row) {

			var row = $(row);			
			$(row.children()).each(function(i, cell) {

				var cell = $(cell);
				shiftCellsCol(cell, index, +1);
			});
	});
	shiftButtonCells(tbody, index, +1);
	shiftHeaderCells(tbody, index, +1);
	addButtonCell(tbody, index);
	addHeaderCell(tbody, colName, index);
	addMissingCells(tbody, index, "0");
}

function shiftCellsCol(cell, index, diff) {
	index = Number(index);
	diff = Number(diff);

	var id = Number(cell.attr("col-id"));

	if (id >= index)
		cell.attr("col-id", id + diff);
}

function shiftButtonCells(tbody, index, diff) {
	index = Number(index);
	diff = Number(diff);

	var buttonRow = $(tbody.children('#button-row'));

	buttonRow.children().each(function (i, cell) {
		var cell = $(cell);

		$(cell.children()).each(function (i, btn) {
			var id = Number ($(btn).attr("item-id"));

			if (id >= index)
				$(btn).attr("item-id", id + diff);
		});
	});
}

function shiftHeaderCells (tbody, index, diff) {
	index = Number(index);
	diff = Number(diff);

	var headerRow = $(tbody.children('#header-row'));

	headerRow.children().each(function (i, cell) {

		var cell = $(cell);		
		var id = Number (cell.attr("header-id"));

		if (id >= index)
			cell.attr("header-id", id + diff);
	});
}

function addMissingCells(tbody, index, value) {
	index = Number(index);

	$(tbody.children('.content-row')).each(function (i, row) {

		var row = $(row);

		if (i != index)
			addCell(row, value, index);
		else 
			for (var j = 0; j < itemNumber; j++)
				addCell(row, value, j);
	});
}

function addButtonCell (tbody, index) {
	index = Number(index);

	var buttonRow = $(tbody.children('#button-row'));

	var cell = $("<td>");

	var buttonPlus = $('<button type="button">').addClass("btn btn-sm btn-success btn-extend").text("+");
	var buttonMinus = $('<button type="button">').addClass("btn btn-sm btn-success btn-reduce").text("-").css('margin-left', 3);

	buttonPlus.attr("item-id", index);
	buttonMinus.attr("item-id", index);

	cell.append(buttonPlus);
	cell.append(buttonMinus);

	buttonRow.appendAt(cell, index + 1);

	buttonRow.off('click');
	buttonRow.on("click", "button.btn-extend", function() {
		extendTable(tbody, "A" + counter, $(this).attr('item-id'));
		counter++;
	});
	buttonRow.on("click", "button.btn-reduce", function() {
		if (itemNumber > 1)
			reduceTable(tbody, $(this).attr('item-id'));
	});
}

function addHeaderCell (tbody, name, index) {
	index = Number(index);
	var headerRow =  $(tbody.children('#header-row'));

	var cell = $("<th>").text(name).attr("contenteditable", true).attr("header-id", index);
	headerRow.appendAt(cell, index+1);

	headerRow.off("input propertychange paste");
	headerRow.on("input propertychange paste", "th", function() {
		var headerID = Number($(this).attr("header-id"));
		$(this).parent().parent().children().children("[header-id="+headerID+"]").text($(this).text());
	});
}

function addCell(row, value, index) {
	index = Number(index);

	var cell = $("<td>").text(value);

	cell.attr("row-id", row.attr("row-id"));

	if (row.children().length == 1)
		cell.attr("col-id", 0);
	else
		cell.attr("col-id", Number(row.children(":nth-child("+(index+1)+")").attr("col-id"))+1);

		if (Number(cell.attr("row-id")) === Number (cell.attr("col-id"))) {
		cell.addClass("td-disabled");
		cell.text("M");
	}
	else
		cell.attr("contenteditable", true);

	row.appendAt(cell, index+1);

	row.off("input propertychange paste");
	row.on("input propertychange paste", "td", function() {
		var rowID = Number($(this).attr("row-id"));
		var colID = Number($(this).attr("col-id"));

		$(this).parent().parent().children().children("[row-id="+colID+"]").filter("[col-id="+rowID+"]").text($(this).text());
	});
}

function reduceTable (tbody, index) {
	index = Number(index);

	deleteRow(tbody, index);
	deleteColumn(tbody, index);

	itemNumber--;
}

function deleteRow (tbody, index) {
	index = Number(index);

	$(tbody.children('.content-row')).each(function (i, row) {

		var row = $(row);
		shiftRow(row, index, -1);
	});

	tbody.removeAt(index);
}

function deleteColumn (tbody, index) {
	index = Number(index);

	$(tbody.children('.content-row')).each(function (i, row) {

		var row = $(row);			
		$(row.children()).each(function(i, cell) {

			var cell = $(cell);
			shiftCellsCol(cell, index, -1);
		});

		row.removeAt(index-1);
	});
	shiftHeaderCells(tbody, index, -1);
	shiftButtonCells(tbody, index, -1);
	deleteButtonCell(tbody, index-1);
	deleteHeaderCell(tbody, index-1);
}

function deleteButtonCell(tbody, index) {
	index = Number(index);
	$(tbody.children('#button-row')).removeAt(index);
}

function deleteHeaderCell(tbody, index) {
	index = Number(index);
	$(tbody.children('#header-row')).removeAt(index);
}