var table = new InputTable("div.input-matrix");
table.extendTableWithDefaultName(0);
table.extendTableWithDefaultName(1);

$("#btn-solve").on('click', function () {

	$('#div-result').removeClass("hidden");
	$('#el3').collapse("show");
	$('#result').text(table.toJSON());
});