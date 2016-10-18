var table = $("div.input-matrix").addTable();
table.extendTable("A2", 0);
table.extendTable("A3", 1);

$("#btn-solve").on('click', function () {

	$('#div-result').removeClass("hidden");
	$('#el3').collapse("show");
	$('#result').text(table.toJSON());
});