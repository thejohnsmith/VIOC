
var StorePageDetailNewsController = (function ($) {

	var controller = {

		// ===========================================================================
		// Variables
		// ===========================================================================
		
		// None

		// ===========================================================================
		// Boot Methods
		// ===========================================================================

		init: function() {
			var controller = this;
			controller.populateUI();
			controller.attachEventListeners();
			controller.showUI();
			console.log("News Controller Init Complete!");
		},

		populateUI: function() {
			// Build the HTML here, without event handling
		},
		
		attachEventListeners: function() {
			// Delegate user events to handler functions
		},
		
		showUI: function() {
			// Unhide the UI now that it is built and ready for interaction
		},
		
		// ===========================================================================
		// Event Handlers
		// ===========================================================================

		onClickSomething: function(e) {
			// Handle something being clicked
		}
	};

	return {
		controller: controller,
	};
})(jQuery);

StorePageDetailController.controller.postInitCallbacks.push(
	function() { StorePageDetailNewsController.controller.init() } 
);
