jQuery(function ($) {
	var containsCatalog = window.location.href.indexOf('catalog.aspx') != -1;
	var containsAddToCart = window.location.href.indexOf('addToCart.aspx') != -1;
	$('.ContentBoxGrey').hide();
	if ($('.ContentBoxGrey').length) {
		$('.ContentBoxGrey').css('width','1200px');
		$('.ContentBoxGrey').show();
	}
	if (containsCatalog) {
		$('#catalogContent').css('margin','0 auto');
	}
	if (addToCart) {
		if ($('#CtlBrdCrm').length) {
			$('#CtlBrdCrm').css('width','1200px');
		}
	}
});