$(function() {
	$('#birthdate').datepicker({
		locale:"ru", 
		defaultViewDate: {
			year:2000,
			month:1,
			day:1
		},
		format:"dd.mm.yyyy",
		autoclose: true
	});
});

function registerQuerySuccess() {
	$("#register-result-modal").modal();
}

function registerQueryFailed() {
	$("#register-result-content").text("Произошла ошибка при отправке данных на сервер. Пожалуйста, повторите позднее.");
	$("#register-result-modal").modal();
}
