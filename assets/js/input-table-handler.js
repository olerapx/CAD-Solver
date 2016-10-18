var table = $("div.input-matrix").addTable();

$("#btn-solve").on('click', function () {

	$('#div-result').removeClass("hidden");
	$('#el3').collapse("show");
	$('#result').text(table.toJSON());
});