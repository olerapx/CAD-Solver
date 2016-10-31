var tableOptions = {
	items: {
		defaultName: 'A',
		startNameIndex: 1	
	},
	headers: {
		addTopButtons: true,
		addTopHeaders: true,
		addLeftButtons: true,
		addLeftHeaders: true
	},
	symmetrical: false,
	editable: true,
	headersEditable: true
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