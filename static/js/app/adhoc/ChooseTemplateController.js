/* Choose Template Controller
 * @description - Loads templates with data from custom Adobe API.
 * @filename - ChooseTemplateController.js
 * @author - Anthony Gill, John Smith : Epsilon 2016
 * @instructions -
  a. The first page is a “Choose Template” page.  Thus, create /static/app/adhoc/ChooseTemplateController.js
  b. The controller should have an init() function.  Init() should call a WatchForAnchor() function.
      This function will monitor for a certain element of the page to appear.
      When it does, it will fire a callback.
  c. The callback of WatchForPageReady () should fire an AdjustUI() function.
      That function can be hollow for now.
      This is where we’ll store code to hack the UI.
  d. The above controller should be included within the global footer.
      At the bottom of the file should be a URL check.
      If the URL contains a certain pageId, it should call the init function.
      So in effect, the controller will only fire up when it is loaded on a specific page.
      The controller will then run its AdjustUI() method and hack the UI as needed.
  e. WatchForPageReady() should check the value of a IsPageReady() function every 500ms via a SetInterval()
      When the condition is met, cancel the SetInterval and then fire the callback.
 */
ChooseTemplateController = (function ($) {
	'use strict';
	var controller = {
		intervalHandle: null,
		init: function () {
			var controller = this;
			controller.WatchForAnchor(function () {
				controller.WatchForPageReady(function () {
					controller.AdjustUI();
				});
			});
		},
		isPageReady: function () {
			console.warn('isPageReady: true.');
			return true;
		},
		WatchForAnchor: function (callback) {
			var controller = this;
			console.warn('Watching for: Anchors...');
			if (controller.templateAnchor) {
				// ...
			}
			if (typeof callback === 'function') {
				callback();
			}
		},
		WatchForPageReady: function (callback) {
			var controller = this;
			console.warn('Watching for: Page ready...');
			controller.intervalHandle = setInterval(function () {
				if (controller.isPageReady()) {
					clearInterval(controller.intervalHandle);
					callback();
				}
			}, 500);
		},
		AdjustUI: function () {
			console.warn('Adjusting UI...');
		}
	};
	return {
		controller: controller
	};
})(jQuery);

ChooseTemplateController.controller.init();