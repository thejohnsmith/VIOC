/* StoreWebsites Controller
 * @NOTE - The Store Websites URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/CustomPage.aspx?uigroup_id=479602&page_id=10792
 *
 * @description - Loads Store Websites template markup
 * @filename - StoreWebsitesController.js
 * @author - John Smith : Epsilon 2016
 */
var pageAnchor = '.asyncMarkup';
var pageKey = marcomUserData.$constants.storeWebsiteUrl;

StoreWebsitesController = (function ($) {
	'use strict';
	var controller = {
		intervalHandle: null,
		init: function () {
			var controller = this;
			controller.AdjustUI();
			// controller.WatchForPageReady(function () {
			// 	controller.AdjustUI();
			// });
		},
		isPageReady: function () {
			return $(pageAnchor).length > 0;
		},
		WatchForPageReady: function (callback) {
			var controller = this;
			// controller.intervalHandle = setInterval(function () {
			// 	if (controller.isPageReady()) {
			// 		clearInterval(controller.intervalHandle);
			// 		callback();
			// 	}
			// }, 500);
		},
		AdjustUI: function () {
			var controller = this;
			controller.SetNavigation();
			controller.UpdateBreadCrumbs();
			controller.InitializeTabs();
		},
		InitializeTabs: function () {
			if ($('#parentHorizontalTab').length < -1) {
				return false;
			}
			$('#parentHorizontalTab').easyResponsiveTabs({
				type: 'default', // Types: default, vertical, accordion
				width: 'auto', // auto or any width like 600px
				fit: true, // 100% fit in a container
				tabidentify: 'hor_1', // The tab groups identifier
				activate: function (event) { // Callback function if tab is switched
					var $tab = $(this);
					var $info = $('#nested-tabInfo');
					var $name = $('span', $info);
					$name.text($tab.text());
					$info.show();
				}
			});
		},
		/**
		 * [SetNavigation Set navigation state]
		 */
		SetNavigation: function () {
			$('.navBarItem > a').filter(function () {
				return $(this).text() === 'STORE WEBSITES';
			}).addClass('navBarSelectedLinkColor, customColorOverridable').removeClass('navBarEnhancedLinkColor');
			return this;
		},
		/**
		 * [UpdateBreadCrumbs Custom breadcumb handler]
		 */
		UpdateBreadCrumbs: function () {
			// var controller = this;

			// Set 1st Level Breadcrumb

			// Set 2nd Level Breadcrumb
			// $('.breadcrumbs_previous:first a').html();
			// $('.breadcrumbs_previous:first a').attr('href', '');

			// Set 3rd Level Breadcrumb
			// $('.breadcrumbs_previous:last a').html();
			// $('.breadcrumbs_previous:last a').attr('href', '');
		},
		ShowUI: function () {
			$('.js-content').fadeIn();
			$('.js-loading').hide();
		}
	};
	return {
		controller: controller,
		setNavigation: controller.SetNavigation()
	};
})(jQuery);

// // Only execute this controller on a certain page
// if (window.location.href.indexOf(pageKey) > -1) {
// 	StoreWebsitesController.controller.init();
// }
