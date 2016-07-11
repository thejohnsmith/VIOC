/* Catalog Controller
 * @NOTE - The On-Demand Marketing URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/catalog.aspx?uigroup_id=479602&folder_id=1633307
 *
 * @description - Loads templates with data from custom Adobe API.
 * @filename - CatalogController.js
 * @author - Anthony Gill, John Smith : Epsilon 2016
 */
var pageAnchor = '#ctl00_content_CtlPager_lblItemsPerPage';
var pageKey = 'catalog.aspx';

CatalogController = (function ($) {
	'use strict';
	var controller = {
		intervalHandle: null,
		init: function () {
			var controller = this;
			controller.WatchForPageReady(function () {
				controller.AdjustUI();
			});
		},
		isPageReady: function () {
			return $(pageAnchor).length > 0;
		},
		WatchForPageReady: function (callback) {
			var controller = this;
			// console.warn('Watching for: Page ready...');
			controller.intervalHandle = setInterval(function () {
				if (controller.isPageReady()) {
					clearInterval(controller.intervalHandle);
					callback();
				}
			}, 500);
		},
		AdjustUI: function () {
			// console.warn('Adjusting UI...');
		}
	};
	return {
		controller: controller
	};
})(jQuery);

// Only execute this controller on a certain page
if (window.location.href.indexOf(pageKey) > -1) {
	CatalogController.controller.init();
}
