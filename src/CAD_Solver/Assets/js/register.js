$(function() {
	$('#birthdate').datepicker({
		locale:"ru", 
		defaultViewDate: {
			year:2000,
			month:1,
			day:1
		},
		format:"dd.mm.yyyy"
	});
});
