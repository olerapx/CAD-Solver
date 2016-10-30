var tableOptions = {
	defaultItemName: 'A',
	startItemIndex: 1,
	headers: {
		addTopButtons: true,
		addTopHeaders: true,
		addLeftButtons: false,
		addLeftHeaders: true
	},
	symmetrical: false
};

var table = new InputTable("div.input-matrix", tableOptions);
table.extendTableWithDefaultName(0);
table.extendTableWithDefaultName(1);

$("#btn-solve").on('click', function () {

	$('#div-result').removeClass("hidden");
	$('#el1').collapse("hide");
	$('#el3').collapse("show");

	$("html, body").animate({ scrollTop: $(document).height() }, 'swing');
	$('#result').text(table.toJSON());
});