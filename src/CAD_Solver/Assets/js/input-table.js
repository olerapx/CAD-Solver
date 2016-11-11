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

		this.rowCounter = 0;
		this.columnCounter = 0;

		this.topHeaderGenericNameIndex = this.options.headers.startNameIndex;
		this.leftHeaderGenericNameIndex = this.options.headers.startNameIndex;
		this.topHeaderCustomNameIndex = 0;
		this.leftHeaderCustomNameIndex = 0;

		this.hasCustomTopHeaderName = true;
		this.hasCustomLeftHeaderName = true;

		if (this.options.buttons.affect!=='both') this.options.content.diagonalElementsDisabled = false;

		this.topHeaderCellsNumber = 0;
		this.leftHeaderCellsNumber = 0;

		this.table = $("<table>").addClass("table input-table table-responsive table-bordered");
		this.tbody = $("<tbody>");
		this.table.append(this.tbody);

		if (this.options.buttons.addLeft)
			this.leftHeaderCellsNumber ++;

		if (this.options.headers.addLeft)
			this.leftHeaderCellsNumber ++;	

		if (this.options.buttons.addTop) {
			this.topHeaderCellsNumber ++;
			this.constructButtonRow();
		}
		
		if (this.options.headers.addTop) {
			this.topHeaderCellsNumber ++;
			this.constructHeaderRow();
		}	

		this.addFirstItem(this.getNextLeftHeaderName(), this.getNextTopHeaderName());

		this.addHandlers();

		element.append(this.table);		
	}

	toJSON() {
		return this.getData();
	}

	addHandlers() {
		this.table.on("click", "tbody tr button.btn-extend", (event) => {
			this.extendTableWithDefaultName($(event.currentTarget).attr('item-id'));
		});

		this.table.on("click", "tbody tr button.btn-reduce", (event) => {
			this.reduceTable($(event.currentTarget).attr('item-id'));
		});

		/* symmetrical value change */
		if(this.options.content.symmetrical) {
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

	extendTableWithDefaultName(index, force = false) {
		this.extendTable(this.getNextLeftHeaderName(), this.getNextTopHeaderName(), index, force);
	}

	getNextLeftHeaderName() {
		if (typeof this.options.headers.leftTitles !== 'undefined' && this.hasCustomLeftHeaderName) {
			let name = this.options.headers.leftTitles[this.leftHeaderCustomNameIndex];

			if (typeof name === 'undefined')		
				this.hasCustomLeftHeaderName = false;
			else {
				this.leftHeaderCustomNameIndex++;
				return name;	
			}
		}

		let name = this.options.headers.leftGenericHeader+this.leftHeaderGenericNameIndex;
		this.leftHeaderGenericNameIndex++ ;
		return name;	
	}

	getNextTopHeaderName() {
		if (typeof this.options.headers.topTitles !== 'undefined' && this.hasCustomTopHeaderName) {
			let name = this.options.headers.topTitles[this.topHeaderCustomNameIndex];

			if (typeof name === 'undefined')			
				this.hasCustomTopHeaderName = false;
			else {
				this.topHeaderCustomNameIndex++;
				return name;	
			}
		}

		let name = this.options.headers.topGenericHeader+this.topHeaderGenericNameIndex;
		this.topHeaderGenericNameIndex++ ;
		return name;	
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

	addFirstItem(rowName, colName) {
		if (!(this.rowCounter === 0 && this.columnCounter === 0)) return;

	 	let index = -1
		this.columnCounter ++;

		this.addRow(rowName, index + 1);

		this.addTopButtonCell(index+1);
		this.addTopHeaderCell(colName, index+1);
	}

	extendTable (rowName, colName, index, force = false) {
		index = Number(index);

		if (force || this.options.buttons.affect === 'row' || this.options.buttons.affect === 'both')			
			this.addRow(rowName, index + 1);			

		if (force || this.options.buttons.affect === 'column' || this.options.buttons.affect === 'both')
			this.addColumn (colName, index + 1);
	}

	addRow(rowName, index) {
		index = Number(index);
		this.rowCounter ++;

		$(this.tbody.children('.content-row')).each((i, row) => {
			this.shiftRow($(row), index, +1);
		});

		let row = $("<tr class='content-row'>");

		this.addLeftButtonCell(row, index);
		this.addLeftHeaderCell(row, rowName, index);	

		row.attr("row-id", index);

		for (let i = 0; i < this.columnCounter; i++)
			this.addCell(row, i);

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
					this.shiftCellsRow($(cell), index, diff);
			});

			if (this.options.buttons.addLeft) {
				row.children("td.button-cell").children().each((i, btn) => {
					$(btn).attr("item-id", id + diff);
				});
			}

			if (this.options.headers.addLeft) {
				row.children("th").attr("header-id", id + diff);
			}
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
		this.columnCounter ++;

		$(this.tbody.children('.content-row')).each((i, row) => {

			$($(row).children()).each((i, cell) => {
				this.shiftCellsColumn($(cell), index, +1);
			});
		});

		this.shiftButtonCells(index, +1);
		this.shiftHeaderCells(index, +1);

		this.addTopButtonCell(index);

		this.addTopHeaderCell(colName, index);

		$(this.tbody.children('.content-row')).each((i, row) => {
			this.addCell($(row), index);
		});
	}

	shiftCellsColumn (cell, index, diff) {
		index = Number(index);
		diff = Number(diff);

		let id = Number(cell.attr("col-id"));

		if (id >= index)
			cell.attr("col-id", id + diff);

		if (Number(cell.attr('col-id')) !== Number(cell.attr('row-id')) && cell.hasClass("td-disabled")) {
			cell.removeClass('td-disabled');
			cell.text(this.options.content.defaultValue);
		}
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
		if (!this.options.buttons.addLeft) return;

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
		if (!this.options.headers.addLeft) return;

		let headerCell = $("<th>");
		headerCell.text(itemName).attr("header-id", index);

		if (this.options.headers.editable)
			headerCell.attr("contenteditable", true);
		row.append(headerCell);
	}

	addTopButtonCell (index) {
		if (!this.options.buttons.addTop) return;

		index = Number(index);

		let buttonRow = $(this.tbody.children('#button-row'));
		buttonRow.appendAt(this.constructButtonCell(index), index + this.leftHeaderCellsNumber);
	}

	addTopHeaderCell (name, index) {
		if (!this.options.headers.addTop) return;

		index = Number(index);
		let headerRow =  $(this.tbody.children('#header-row'));

		let cell = $("<th>").text(name).attr("header-id", index);
		if (this.options.headers.editable)
			cell.attr("contenteditable", true);

		headerRow.appendAt(cell, index+this.leftHeaderCellsNumber);
	}

	addCell(row, index) {
		index = Number(index);

		let cell = $("<td>").text(this.options.content.defaultValue);

		cell.attr("row-id", row.attr("row-id"));

		if (row.children().length === this.leftHeaderCellsNumber)
			cell.attr("col-id", 0);
		else
			cell.attr("col-id", Number(row.children(":nth-child("+(index+this.leftHeaderCellsNumber)+")").attr("col-id"))+1);

		if (Number(cell.attr("row-id")) === Number (cell.attr("col-id")) && this.options.content.diagonalElementsDisabled) {
			cell.addClass("td-disabled");
			cell.text("M");
		}
		else if (this.options.content.editable)
			cell.attr("contenteditable", true);

		row.appendAt(cell, index+this.leftHeaderCellsNumber);
	}

	reduceTable (index) {
		index = Number(index);

		if (this.options.buttons.affect === 'row' || this.options.buttons.affect === 'both' && this.rowCounter > 1) {
			this.deleteRow(index);
			this.rowCounter --;
		}

		if (this.options.buttons.affect === 'column' || this.options.buttons.affect === 'both' && this.columnCounter > 1) {			
			this.deleteColumn(index);
			this.columnCounter --;
		}
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
		if (!this.options.buttons.addTop) return;

		index = Number(index);
		$(this.tbody.children('#button-row')).removeAt(index + this.leftHeaderCellsNumber);
	}

	deleteHeaderCell(index) {
		if (!this.options.headers.addTop) return;

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
