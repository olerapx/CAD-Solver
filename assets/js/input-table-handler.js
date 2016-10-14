var table = $("div.input-matrix").addTable();

$("#btn-solve").on('click', function () {
	alert(table.toJSON());
});