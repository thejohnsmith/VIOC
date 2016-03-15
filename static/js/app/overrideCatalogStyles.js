jQuery(function ($) {
	var containsCatalog = window.location.href.indexOf('catalog.aspx') != -1;
	var containsAddToCart = window.location.href.indexOf('addToCart.aspx') != -1;
	var containsCart = window.location.href.indexOf('cart.aspx') != -1;
	var containsManageLists = window.location.href.indexOf('manageLists.aspx') != -1;
	$('.ContentBoxGrey').hide();
	if ($('.ContentBoxGrey').length) {
		$('.ContentBoxGrey').css('width','1200px');
		$('.ContentBoxGrey').show();
	}
	if (containsCatalog) {
		$('#catalogContent').css('margin','0 auto');
	}
	if (containsAddToCart || containsCart || containsManageLists) {
		if ($('#CtlBrdCrm').length) {
			$('#CtlBrdCrm').css({'width':'1200px','float':'none','margin':'0 auto'}	);
		}
	}
});