var tableOptions = {
	headers: {		
		addTop: true,		
		addLeft: true,
		editable: false,
		topGenericHeader: '',
		leftGenericHeader: 'Block ',
		startNameIndex: 1,	/* e.g. A1, A2, A3 */
		topTitles: ['Width', 'Height']
	},
	buttons: {
		addTop: false,
		addLeft: true,
		affect: 'row' /* which side of table buttons extend or reduce. Can be row, column, both */
	},
	content: {
		symmetrical: false, /* when a value (i,j) changes, a value (j, i) changes too */
		editable: true,
		defaultValue: 0, /* default empty cell value */
		diagonalElementsDisabled: false, /* disable input in elements (i,i) */
	}
};

var table = new InputTable("div.pack-table", tableOptions);
table.extendTableWithDefaultName(0, true);
table.extendTableWithDefaultName(1);

$("#btn-solve").on('click', function () {

	$("#algo-processing").addClass("glyphicon-refresh spinning");
	$("#result-canvas").empty();

	let width = $("#stripe-width").val();
	if (width === "") 
		width = "0";

	let data = {
			table: JSON.parse(table.toJSON()),
			width: width
	};

	$.ajax({
		url: '/tdsp',
		type: 'POST',
		data: JSON.stringify(data),
		contentType: 'application/json; charset=utf-8',
		dataType: 'html',

		success: function (data) {
			$('#div-result').removeClass("hidden");
			$('#el1').collapse("hide");
			$('#el3').collapse("show");	

			$("html, body").animate({ scrollTop: $(document).height() }, 'swing');

			let k =  $.parseJSON(data);

			if (k.hasOwnProperty("error"))
			{
				alert(k.error);
				return;
			}

			let konva = new Konva.Stage({
      			container: 'canvas-container',
      			width: 500,
      			height: 500
			});

			let layer = new Konva.Layer();

			for(let i in k) {
				let rect = new Konva.Rect(k[i]);
				layer.add(rect);
			}

			konva.add(layer);
		},

		error: function() {
			alert("Произошла ошибка при отправке данных на сервер. Пожалуйста, повторите позднее.");
		},

		complete: function() {
			$("#algo-processing").removeClass("glyphicon-refresh spinning");
		}
	});
});
