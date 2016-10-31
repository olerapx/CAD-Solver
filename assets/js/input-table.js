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
	$(this.children(':nth-child(' + (index + 1) + ')')).remove();
};


class InputTable {
	constructor(element, options) {
		this.options = options;
		element = $(element);

		this.itemCounter = 0;
		this.nameIndexCounter = this.options.items.startNameIndex;

		this.topHeaderCellsNumber = 0;
		this.leftHeaderCellsNumber = 0;

		this.table = $("<table>").addClass("table input-table table-responsive table-bordered");
		this.tbody = $("<tbody>");
		this.table.append(this.tbody);

		if (this.options.headers.addLeftButtons)
			this.leftHeaderCellsNumber ++;

		if (this.options.headers.addLeftHeaders)
			this.leftHeaderCellsNumber ++;	

		if (this.options.headers.addTopButtons) {
			this.topHeaderCellsNumber ++;
			this.constructButtonRow();
		}
		
		if (this.options.headers.addTopHeaders) {
			this.topHeaderCellsNumber ++;
			this.constructHeaderRow();
		}	

		this.addFirstItem(this.options.items.defaultName + this.nameIndexCounter);

		this.addHandlers();

		element.append(this.table);		
	}

	toJSON() {
		return this.getData();
	}

	addHandlers() {
		this.table.on("click", "tbody tr button.btn-extend", (event) => {
			this.extendTable(this.options.items.defaultName + this.nameIndexCounter, $(event.currentTarget).attr('item-id'));
		});

		this.table.on("click", "tbody tr button.btn-reduce", (event) => {
			this.reduceTable($(event.currentTarget).attr('item-id'));
		});

		/* symmetrical value change */
		if(this.options.symmetrical) {
			this.table.on("input propertychange paste", "tbody tr.content-row td", (event) => {
				let rowID = Number($(event.currentTarget).attr("row-id"));
				let colID = Number($(event.currentTarget).attr("col-id"));

				$(event.currentTarget).parent().parent().children().children("[row-id="+colID+"]").filter("[col-id="+rowID+"]").text($(event.currentTarget).text());
			});
		}

		/* symmetrical header change */
		this.table.on("input propertychange paste", "tbody tr th", (event) => {
			let headerID = Number($(event.currentTarget).attr("header-id"));
			$(event.currentTarget).parent().parent().children().children("[header-id="+headerID+"]").not(event.currentTarget).text($(event.currentTarget).text());
		});		
	}

	extendTableWithDefaultName(index) {
		this.extendTable(this.options.items.defaultName + this.nameIndexCounter, index);
	}

	constructButtonRow () {
		let buttonRow = $("<tr id='button-row'>");
		for (let i=0; i<this.leftHeaderCellsNumber; i++)
			buttonRow.append($("<td>"));

		this.tbody.append(buttonRow);
	}

	constructHeaderRow() {
		let headerRow = $("<tr id='header-row'>");
		for (let i=0; i<this.leftHeaderCellsNumber; i++)
			headerRow.append($("<th>"));

		this.tbody.append(headerRow);
	}

	addFirstItem(itemName) {
		if (this.itemCounter === 0)
			this.extendTable(itemName, -1);
	}

	extendTable (itemName, index) {
		index = Number(index);
		this.itemCounter ++;

		this.addRow(itemName, index + 1);
		this.addColumn (itemName, index + 1);

		this.nameIndexCounter++;
	}

	addRow(rowName, index) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {
			this.shiftRow($(row), index, +1);
		});

		let row = $("<tr class='content-row'>");

		this.addLeftButtonCell(row, index);
		this.addLeftHeaderCell(row, rowName, index);		
		
		row.attr("row-id", index);
		this.tbody.appendAt(row, index + this.topHeaderCellsNumber);
	}

	shiftRow (row, index, diff) {
		index = Number(index);
		diff = Number(diff);

		let id = Number(row.attr("row-id"));
		if (id >= index) {
			row.attr("row-id", id + diff);				

			$(row.children()).each((i, cell) => {
				if (i >= this.leftHeaderCellsNumber)
					this.shiftRowCells($(cell), index, diff);
			});

			if (this.options.headers.addLeftButtons) {
				row.children("td.button-cell").children().each((i, btn) => {
					$(btn).attr("item-id", id + diff);
				});
			}

			if (this.options.headers.addLeftHeaders) {
				row.children("th").attr("header-id", id + diff);
			}
		}
	}

	shiftRowCells(cell, index, diff) {
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
				this.shiftCellsColumn($(cell), index, +1);
			});
		});

		this.shiftButtonCells(index, +1);
		this.shiftHeaderCells(index, +1);

		this.addTopButtonCell(index);

		this.addTopHeaderCell(colName, index);
		this.addMissingCells(index, "0");
	}

	shiftCellsColumn (cell, index, diff) {
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

	addLeftButtonCell(row, index) {
		if (!this.options.headers.addLeftButtons) return;

		let cell = this.constructButtonCell(index);
		cell.addClass('button-cell');

		row.append(cell);
	}

	constructButtonCell (index) {
		let cell = $("<td>");

		let buttonPlus = $('<button type="button">').addClass("btn btn-sm btn-success btn-extend").text("+");
		let buttonMinus = $('<button type="button">').addClass("btn btn-sm btn-success btn-reduce").text("-").css('margin-left', 3);

		buttonPlus.attr("item-id", index);
		buttonMinus.attr("item-id", index);

		cell.append(buttonPlus);
		cell.append(buttonMinus);	

		return cell;	
	}

	addLeftHeaderCell(row, itemName, index) {
		if (!this.options.headers.addLeftHeaders) return;

		let headerCell = $("<th>");
		headerCell.text(itemName).attr("header-id", index);

		if (this.options.headersEditable)
			headerCell.attr("contenteditable", true);
		row.append(headerCell);
	}

	addTopButtonCell (index) {
		if (!this.options.headers.addTopButtons) return;

		index = Number(index);

		let buttonRow = $(this.tbody.children('#button-row'));
		buttonRow.appendAt(this.constructButtonCell(index), index + this.leftHeaderCellsNumber);
	}

	addTopHeaderCell (name, index) {
		if (!this.options.headers.addTopHeaders) return;

		index = Number(index);
		let headerRow =  $(this.tbody.children('#header-row'));

		let cell = $("<th>").text(name).attr("header-id", index);
		if (this.options.headersEditable)
			cell.attr("contenteditable", true);

		headerRow.appendAt(cell, index+this.leftHeaderCellsNumber);
	}

	addMissingCells(index, value) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {

			if (i != index)
				this.addCell($(row), value, index);
			else 
				for (let j = 0; j < this.itemCounter; j++)
					this.addCell($(row), value, j);
		});
	}

	addCell(row, value, index) {
		index = Number(index);

		let cell = $("<td>").text(value);

		cell.attr("row-id", row.attr("row-id"));

		if (row.children().length === this.leftHeaderCellsNumber)
			cell.attr("col-id", 0);
		else
			cell.attr("col-id", Number(row.children(":nth-child("+(index+this.leftHeaderCellsNumber)+")").attr("col-id"))+1);

		if (Number(cell.attr("row-id")) === Number (cell.attr("col-id"))) {
			cell.addClass("td-disabled");
			cell.text("M");
		}
		else if (this.options.editable)
			cell.attr("contenteditable", true);

		row.appendAt(cell, index+this.leftHeaderCellsNumber);
	}

	reduceTable (index) {
		if (this.itemCounter <= 1) return;

		index = Number(index);

		this.deleteRow(index);
		this.deleteColumn(index);

		this.itemCounter--;
	}

	deleteRow (index) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {

			this.shiftRow($(row), index, -1);
		});

		this.tbody.removeAt(index + this.topHeaderCellsNumber);
	}

	deleteColumn (index) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {
		
			$($(row).children()).each((i, cell) => {
				this.shiftCellsColumn($(cell), index, -1);
			});

			$(row).removeAt(index + this.leftHeaderCellsNumber);
		});
		this.shiftHeaderCells(index, -1);
		this.shiftButtonCells(index, -1);

		this.deleteButtonCell(index);
		this.deleteHeaderCell(index);
	}

	deleteButtonCell(index) {
		if (!this.options.headers.addTopButtons) return;

		index = Number(index);
		$(this.tbody.children('#button-row')).removeAt(index + this.leftHeaderCellsNumber);
	}

	deleteHeaderCell(index) {
		if (!this.options.headers.addTopHeaders) return;

		index = Number(index);
		$(this.tbody.children('#header-row')).removeAt(index + this.leftHeaderCellsNumber);
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