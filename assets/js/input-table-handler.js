var table = $("div.input-matrix").addTable();
table.extendTable(0);
table.extendTable(1);

$("#btn-solve").on('click', function () {

	$('#div-result').removeClass("hidden");
	$('#el3').collapse("show");
	$('#result').text(table.toJSON());
});