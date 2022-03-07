// Bs menu js

$(".main-menu").on( 'bs-menu-loaded', function(){
	var mainMenu = $( '.main-menu' );
	mainMenu.css( {
		opacity: 1,
		visibility: 'visible'
	} );
} ).bsMenu();

// datepicker

$( function() {
    $( "#datepickerform" ).datepicker();
	$( "#datepickerto" ).datepicker();
  } );
 