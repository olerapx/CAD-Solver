$(document).ready(function() {
    loadPage("main.html");
});

/* Sets handlers for navbar */
$("ul.navbar-nav li:not(.nav-algos):not(#li-login)").each(function() {

    $(this).on("click", function() {    	
    	loadPage(($(this)).attr("data-page"));

        $("ul.navbar-nav li").toggleClass("active", false);
        $(this).toggleClass("active", true);
    });
});

function loadPage(page) {
	$(".container").empty();
	$(".container").load(page, function() {
		$('body').css('background-image', 'url('+($('.page-bg')).attr("src")+')');
	});
}