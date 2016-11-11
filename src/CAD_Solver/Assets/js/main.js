/* Sets handlers for jumbotron buttons */
$("ul.main-buttons li").each(function() {

    $(this).on("click", function() {    	
		loadPage(($(this)).attr("data-page"));
		$("ul.navbar-nav li").toggleClass("active", false);
		$("ul.navbar-nav li.nav-algos").toggleClass("active", true);

		$("ul.navbar-nav li:contains(" + $(this).children().text() +")").toggleClass("active", true);
    });
});
