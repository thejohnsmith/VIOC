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
			controller.intervalHandle = setInterval(function () {
				if (controller.isPageReady()) {
					clearInterval(controller.intervalHandle);
					callback();
				}
			}, 500);
		},
		AdjustUI: function () {
			var controller = this;
			controller.RemoveEmptyCells();
			controller.SetNavigation();
			controller.UpdateBreadCrumbs();
		},
		/**
		 * [SetNavigation Set navigation state]
		 */
		SetNavigation: function () {
			$('.navBarItem > a').filter(function () {
				return $(this).text() === 'ON DEMAND MARKETING';
			}).addClass('navBarSelectedLinkColor').addClass('customColorOverridable').removeClass('navBarEnhancedLinkColor');
		},
		/**
		 * [UpdateBreadCrumbs Custom breadcumb handler]
		 */
		UpdateBreadCrumbs: function () {
			var controller = this;

			// Set 1st Level Breadcrumb

			// Set 2nd Level Breadcrumb
			$('.breadcrumbs_previous:first a').html();
			$('.breadcrumbs_previous:first a').attr('href', '');

			// Set 3rd Level Breadcrumb
			$('.breadcrumbs_previous:last a').html();
			$('.breadcrumbs_previous:last a').attr('href', '');
		},
		RemoveEmptyCells: function () {
			console.info('RemoveEmptyCells');
			$('td, tr').filter(function () {
				$.trim($(this).html()) === '&nbsp;';
				$.trim($(this).html()) === '';
			}).remove();
		},
		RemoveHtmlComments: function () {
			var htmlComments = $('*').contents().filter(function () {
				return this.nodeType === 8;
			});
		}
	};
	return {
		controller: controller,
		setNavigation: controller.SetNavigation()
	};
})(jQuery);

// Only execute this controller on a certain page
if (window.location.href.indexOf(pageKey) > -1) {
	CatalogController.controller.init();
}
