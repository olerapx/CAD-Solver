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
	$(this.children(':nth-child(' + (index + 2) + ')')).remove();
};


class PackTable {
	constructor(element) {
		this.itemNumber = 0;
		this.nameIndexCounter = 1;

		element = $(element);

		let table = $("<table>").addClass("table input-table table-responsive table-bordered");
		this.tbody = $("<tbody>");
		table.append(this.tbody);

		this.constructHeaderRow();

		this.addFirstItem("Bl " + this.nameIndexCounter);

		table.on("click", "tbody tr button.btn-extend", (event) => {
			this.extendTable("Bl " + this.nameIndexCounter, $(event.currentTarget).attr('item-id'));
		});

		table.on("click", "tbody tr button.btn-reduce", (event) => {
			this.reduceTable($(event.currentTarget).attr('item-id'));
		});

		element.append(table);
	}

	constructHeaderRow() {
		let headerRow = $("<tr id='header-row'>").append($("<th>"), $("<th>Block</th>"), $("<th>Width</th>"), $("<th>Height</th>"));
		this.tbody.append(headerRow);
	}

	extendTableWithDefaultName(index) {
		this.extendTable("Bl " + this.nameIndexCounter, index);
	}

	addFirstItem(itemName) {
		if (this.itemNumber === 0)
			this.extendTable(itemName, -1);
	}

	extendTable (itemName, index) {
		index = Number(index);
		this.itemNumber ++;

		this.addRow(itemName, index + 1);

		this.nameIndexCounter++;
	}

	reduceTable (index) {
		if (this.itemNumber <= 1) return;

		index = Number(index);

		this.deleteRow(index);

		this.itemNumber--;
	}

	addRow(rowName, index) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {
			this.shiftRow($(row), index, +1);
		});

		let headerCell = $("<th>");
		headerCell.text(rowName);
		headerCell.attr("header-id", index);

		let buttonCell = $("<th>");
		buttonCell.attr("header-id", index);

		let buttonPlus = $('<button type="button">').addClass("btn btn-sm btn-success btn-extend").text("+");
		let buttonMinus = $('<button type="button">').addClass("btn btn-sm btn-success btn-reduce").text("-").css('margin-left', 3);
		buttonPlus.attr("item-id", index);
		buttonMinus.attr("item-id", index);

		buttonCell.append(buttonPlus, buttonMinus);

		let widthCell = $("<th>");
		widthCell.attr("col-id", 0);
		widthCell.attr("row-id", index);
		widthCell.text("0");

		let heightCell = $("<th>");
		heightCell.attr("col-id", 1);
		heightCell.attr("row-id", index);
		heightCell.text("0");

		let row = $("<tr class='content-row'>").append(buttonCell, headerCell, widthCell, heightCell);
		row.attr("row-id", index);
		this.tbody.appendAt(row, index + 1);
	}

	shiftRow (row, index, diff) {
		index = Number(index);
		diff = Number(diff);

		let id = Number(row.attr("row-id"));
		if (id >= index) {
			row.attr("row-id", id + diff);	
			row.children("th").attr("header-id", id + diff);
			row.children("th").children().attr("item-id", id + diff);

			$(row.children()).each((i, cell) => {
				this.shiftCellsRow($(cell), index, diff);
			});
		}
	}

	shiftCellsRow(cell, index, diff) {
		index = Number(index);
		diff = Number(diff);

		let id = Number(cell.attr("row-id"));

		if (id >= index) {
			cell.attr("row-id", id + diff);
			cell.children(":button").attr("item-id", id + diff);
			}
	}

	deleteRow (index) {
		index = Number(index);

		$(this.tbody.children('.content-row')).each((i, row) => {

			this.shiftRow($(row), index, -1);
		});

		this.tbody.removeAt(index);
	}

	toJSON() {
		return this.getData();
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