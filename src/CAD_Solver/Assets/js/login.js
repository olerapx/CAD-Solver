function loginQuerySuccess(result) {
	if (result.result == 'error') {
		$('#login-error').removeClass("hidden");
		$('#login-error').text(result.error);
	}
	else {
		$("#login-modal").modal("hide");

		window.location = result.returnUrl;
	}
}

function loginQueryFailed() {
	$('#login-error').removeClass("hidden");
	$('#login-error').text("Произошла ошибка при отправке данных на сервер. Пожалуйста, повторите позднее.");
}

function loginQueryBegin() {
	$("#login-processing").addClass("glyphicon-refresh spinning");
}

function loginQueryComplete() {
	$("#login-processing").removeClass("glyphicon-refresh spinning");
}
