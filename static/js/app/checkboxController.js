var programSettingsController = jQuery.extend({}, checkboxController.controller);
programSettingsController.init("quantity-limit", function (storeIds) {
	console.log("Stores changed: %O", storeIds);
	var plural = (storeIds.length = 1) ? "" : "s";
	$(".program-settings.footer-row").toggleClass("none", (storeIds.length < 2));
	$(".program-settings.footer-row td.program-settings-footer").html("Adjust " + storeIds.length + " selected store" + plural + " to use:");
});
