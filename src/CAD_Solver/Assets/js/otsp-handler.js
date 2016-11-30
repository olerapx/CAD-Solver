var tableOptions = {
	headers: {		
		addTop: true,		
		addLeft: true,
		editable: true,
		topGenericHeader: 'A',
		leftGenericHeader: 'A',
		startNameIndex: 1	/* e.g. A1, A2, A3 */
	},
	buttons: {
		addTop: true,
		addLeft: true,
		affect: 'both' /* which side of table buttons extend or reduce. Can be row, column, both */
	},
	content: {
		symmetrical: false, /* when a value (i,j) changes, a value (j, i) changes too */
		editable: true,
		defaultValue: 0, /* default empty cell value */
		diagonalElementsDisabled: true, /* disable input in elements (i,i) */
	}
};

var table = new InputTable("div.input-matrix", tableOptions);
table.extendTableWithDefaultName(0);
table.extendTableWithDefaultName(1);

$("#btn-solve").on('click', function () {

	$("#algo-processing").addClass("glyphicon-refresh spinning");
	$("#result-graph").empty();

	$.ajax({
		url: '/otsp',
		type: 'POST',
		data: table.toJSON(),
		contentType: 'application/json; charset=utf-8',
		dataType: 'html',

		success: function (data) {
			$('#div-result').removeClass("hidden");
			$('#el1').collapse("hide");
			$('#el3').collapse("show");	

			$("html, body").animate({ scrollTop: $(document).height() }, 'swing');

			let g =  $.parseJSON(data);

			if (g.hasOwnProperty("error"))
			{
				alert(g.error);
				return;
			}

			let s = new sigma({
				graph:  g,
				renderer: {
					container: 'result-graph',
					type: "canvas"
				},
				settings: {
				    edgeLabelSize: 'proportional',
				    labelThreshold: 1,
				    edgeLabelThreshold: 0,
				    minNodeSize: 5,
				    maxNodeSize: 5,
				    minEdgeSize: 1,
				    maxEdgeSize: 1,
                    minArrowSize: 7
				}
			});			

			let dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

			s.refresh();
		},

		error: function() {
			alert("Произошла ошибка при отправке данных на сервер. Пожалуйста, повторите позднее.");
		},

		complete: function() {
			$("#algo-processing").removeClass("glyphicon-refresh spinning");
		}
	});
});
