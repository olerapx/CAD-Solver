$.fn.appendAt = function(content, index) {
	index = Number(index);
    this.each(function(i, item) {
        let $content = $(content).clone();
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


class InputTable {
	constructor(element) {
		this.itemNumber = 0;
		this.nameIndexCounter = 1;

		element = $(element);

		let table = $("<table>").addClass("table input-table table-responsive table-bordered");
		this.tbody = $("<tbody>");
		table.append(this.tbody);

		this.constructButtonRow();
		this.constructHeaderRow();

		this.addFirstItem("A" + this.nameIndexCounter);

		table.on("click", "tbody tr#button-row button.btn-extend", (event) => {
			this.extendTable("A" + this.nameIndexCounter, $(event.currentTarget).attr('item-id'));
		});

		table.on("click", "tbody tr#button-row button.btn-reduce", (event) => {
			this.reduceTable($(event.currentTarget).attr('item-id'));
		});

		table.on("input propertychange paste", "tbody tr#header-row th", (event) => {
			let headerID = Number($(event.currentTarget).attr("header-id"));
			$(event.currentTarget).parent().parent().children().children("[header-id="+headerID+"]").text($(event.currentTarget).text());
		});

		element.append(table);		
	}

	toJSON() {
		return this.getData();
	}

	extendTableWithDefaultName(index) {
		this.extendTable("A" + this.nameIndexCounter, index);
	}

	constructButtonRow () {
		let buttonRow = $("<tr id='button-row'>").append($("<td>"));
		this.tbody.append(buttonRow);
	}

	constructHeaderRow() {
		let headerRow = $("<tr id='header-row'>").append($("<th>"));
		this.tbody.append(headerRow);
	}

	addFirstItem(itemName) {
		if (this.itemNumber === 0)
			this.extendTable(itemName, -1);
	}

	extendTable (itemName, index) {
		index = Number(index);
		this.itemNumber ++;

		this.addRow(itemName, index + 1);
		this.addColumn (itemName, index + 1);

		this.nameIndexCounter++;
	}

	addRow(rowName, index) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {
			this.shiftRow($(row), index, +1);
		});

		let headerCell = $("<th>");
		headerCell.text(rowName);
		headerCell.attr("header-id", index);

		let row = $("<tr class='content-row'>").append(headerCell);
		row.attr("row-id", index);
		this.tbody.appendAt(row, index + 2);
	}

	shiftRow (row, index, diff) {
		index = Number(index);
		diff = Number(diff);

		let id = Number(row.attr("row-id"));
		if (id >= index) {
			row.attr("row-id", id + diff);	
			row.children("th").attr("header-id", id + diff);

			$(row.children()).each((i, cell) => {
				this.shiftCellsRow($(cell), index, diff);
			});
		}
	}

	shiftCellsRow(cell, index, diff) {
		index = Number(index);
		diff = Number(diff);

		let id = Number(cell.attr("row-id"));

		if (id >= index)
			cell.attr("row-id", id + diff);
	}

	addColumn (colName, index) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {

			$($(row).children()).each((i, cell) => {
				this.shiftCellsCol($(cell), index, +1);
			});
		});

		this.shiftButtonCells(index, +1);
		this.shiftHeaderCells(index, +1);

		this.addButtonCell(index);
		this.addHeaderCell(colName, index);
		this.addMissingCells(index, "0");
	}

	shiftCellsCol (cell, index, diff) {
		index = Number(index);
		diff = Number(diff);

		let id = Number(cell.attr("col-id"));

		if (id >= index)
			cell.attr("col-id", id + diff);
	}

	shiftButtonCells(index, diff) {
		index = Number(index);
		diff = Number(diff);

		let buttonRow = $(this.tbody.children('#button-row'));

		buttonRow.children().each((i, cell) => {

			$($(cell).children()).each((i, btn) => {
				let id = Number ($(btn).attr("item-id"));

				if (id >= index)
					$(btn).attr("item-id", id + diff);
			});
		});
	}

	shiftHeaderCells (index, diff) {
		index = Number(index);
		diff = Number(diff);

		let headerRow = $(this.tbody.children('#header-row'));

		headerRow.children().each((i, cell) => {
	
			let id = Number ($(cell).attr("header-id"));

			if (id >= index)
				$(cell).attr("header-id", id + diff);
		});
	}

	addMissingCells(index, value) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {

			if (i != index)
				this.addCell($(row), value, index);
			else 
				for (let j = 0; j < this.itemNumber; j++)
					this.addCell($(row), value, j);
		});
	}

	addButtonCell (index) {
		index = Number(index);

		let buttonRow = $(this.tbody.children('#button-row'));

		let cell = $("<td>");

		let buttonPlus = $('<button type="button">').addClass("btn btn-sm btn-success btn-extend").text("+");
		let buttonMinus = $('<button type="button">').addClass("btn btn-sm btn-success btn-reduce").text("-").css('margin-left', 3);

		buttonPlus.attr("item-id", index);
		buttonMinus.attr("item-id", index);

		cell.append(buttonPlus);
		cell.append(buttonMinus);

		buttonRow.appendAt(cell, index + 1);
	}

	addHeaderCell (name, index) {
		index = Number(index);
		let headerRow =  $(this.tbody.children('#header-row'));

		let cell = $("<th>").text(name).attr("contenteditable", true).attr("header-id", index);
		headerRow.appendAt(cell, index+1);
	}

	addCell(row, value, index) {
		index = Number(index);

		let cell = $("<td>").text(value);

		cell.attr("row-id", row.attr("row-id"));

		if (row.children().length === 1)
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
	}

	reduceTable (index) {
		if (this.itemNumber <= 1) return;

		index = Number(index);

		this.deleteRow(index);
		this.deleteColumn(index);

		this.itemNumber--;
	}

	deleteRow (index) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {

			this.shiftRow($(row), index, -1);
		});

		this.tbody.removeAt(index);
	}

	deleteColumn (index) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {
		
			$($(row).children()).each((i, cell) => {
				this.shiftCellsCol($(cell), index, -1);
			});

			$(row).removeAt(index-1);
		});
		this.shiftHeaderCells( index, -1);
		this.shiftButtonCells(index, -1);

		this.deleteButtonCell(index-1);
		this.deleteHeaderCell(index-1);
	}

	deleteButtonCell(index) {
		index = Number(index);
		$(this.tbody.children('#button-row')).removeAt(index);
	}

	deleteHeaderCell(index) {
		index = Number(index);
		$(this.tbody.children('#header-row')).removeAt(index);
	}
	getData() {
		let a = new Array();

		this.tbody.children().each((i, row) => {
			row = $(row);
			a.push(new Array());

			row.children().each((j, cell) => {
				cell = $(cell);
				a[i].push(cell.text());
			});

			a[i].shift();
		});
		a.shift();

		return JSON.stringify(a);
	}
}