$(document).ready(function() {
	fakeLogin();
});

$('#login-submit').on('click', function() {
	resetStorage();

	var email = ($('#login-email').val());
	var pass = ($('#login-pass').val());

	if (email!="" && pass!="") {
		localStorage.setItem("email", email);
		localStorage.setItem("logged", true);
		fakeLogin();
		$("#loginModal").modal("hide")

		return;
	}
	fakeLogout();
});

$('#li-logout').on('click', function() {
	fakeLogout();
});


function resetStorage () {
	localStorage.clear();
	localStorage.setItem("email", "");
	localStorage.setItem("logged", false);
}

function fakeLogin() {
	var logged = localStorage.getItem ("logged");

	if (logged != "true") {
		fakeLogout();
		return;
	}

	var email = localStorage.getItem ("email");

	$('#li-signup').toggleClass("hidden", true);
	$('#li-login').toggleClass("hidden", true);	
	$('#li-username').toggleClass("hidden", false);	
	$('#a-username').text(email);	
}

function fakeLogout() {
	$('#li-signup').toggleClass("hidden", false);
	$('#li-login').toggleClass("hidden", false);	
	$('#li-username').toggleClass("hidden", true);	

	resetStorage();
}