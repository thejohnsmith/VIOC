/* StorePages Controller
 * @NOTE - The Store Pages URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/CustomPage.aspx?uigroup_id=479602&page_id=10792
 *
 * @description - Loads Store Pages template markup
 * @filename - StorePagesController.js
 * @author - John Smith : Epsilon 2016
 */
var pageAnchor = '.asyncMarkup';
var pageKey = marcomUserData.$constants.storePagesUrl;

var StorePagesController = StorePagesController || (function ($) {
	'use strict';
	var controller = {
		intervalHandle: null,
		init: function () {
			var controller = this;
			programManagementFilters.controller.init();
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
			controller.EventHandlers();
		},
		EventHandlers: function () {
			var controller = this;
			$('.deleteOffer > button').on('click', function (e) {
				e.preventDefault();
				var data = $(this).data();
				return controller.DeleteOffer(data);
			});
		},
		EditOffer: function () {
			var controller = this;
		},
		DeleteOffer: function (data) {
			var controller = this;
			var offerId = {};
			var storeId = {};
			offerId = data.offerid;
			storeId = data.storeid;

			jConfirm('Are you sure you want to delete these settings?', 'Please Confirm', function (r) {
				if (r) {
					$('#sortOffer .store-item[data-storeid="' + offerId + '"]').hide();

					// TODO this is temp and only for UI checking.
					// We will incorporate actual deletion in the next sprint.
					controller.HandleEmptyTable();

					// STUB
					//  controller.deleteSettings(selectedConfigId, function () {
					// 	controller.hardUIRefresh();
					// 	controller.buildUI(controller.store_data);
				}

			});
		},
		HandleEmptyTable: function() {
			var sortOffer = $('#sortOffer');
			var visibleOffers = sortOffer.find('.store-item:visible');

			// Account for the last removal, -1
			visibleOffers = visibleOffers.length;
			if (typeof visibleOffers === 'number' && visibleOffers === 0){
				sortOffer.find('.error').fadeIn('slow');
			}
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
			var controller = this;
			console.info('hi');
			// $('.navBarItem > a').filter(function () {
			// 	return $(this).text() === 'STORE PAGES';
			// }).addClass('navBarSelectedLinkColor, customColorOverridable').removeClass('navBarEnhancedLinkColor');
			// return this;
			controller.ShowUI();
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
		controller: controller
	};
})(jQuery);

// Only execute this controller on a certain page
if (window.location.href.indexOf(pageKey) > -1) {
	StorePagesController.controller.ShowUI();
}

// var $j = jQuery;
// $j('.asyncMarkup').load("https://files.marcomcentral.app.pti.com/epsilon/static_beta/marcom_custom/storePages.html", function () {
// 	console.debug('Done loading storePages.html, Calling StorePagesController');
// 	if (typeof StorePagesController === 'object') {
//
// 	}
// 	try {
// 		StorePagesController.controller.init();
// 	} catch (e) {
// 		console.debug('Error: %O', e);
// 		if (typeof (console) != 'undefined') {
// 			console.log(e);
// 		}
// 		return false;
// 	}
// });

var $j = jQuery;

function getData() {
	return jQuery.get('https://files.marcomcentral.app.pti.com/epsilon/static_beta/marcom_custom/storePages.html').success(function () {
		console.log('Fires after the AJAX request succeeds');
	});
	var $j = jQuery;
  $j('.asyncMarkup').load("https://files.marcomcentral.app.pti.com/epsilon/static_beta/marcom_custom/storePages.html", function () {
    console.debug('Done loading storePages.html, Calling StorePagesController');
    /*try {
      StorePagesController.controller.init();
    } catch (e) {
      console.error("error=" + e);
      if (typeof (console) != "undefined") {
        console.log(e);
      }
      return false;
    }*/
  });
}

function showDiv() {
	var dfd = jQuery.Deferred();

	dfd.done(function () {
		console.log('Fires after the animation succeeds');
	});

	jQuery('.asyncMarkup').fadeIn(1000, dfd.resolve);

	return dfd.promise();
}
jQuery.when(getData(), showDiv()).then(function (ajaxResult) {
	StorePagesController.controller.init();
	console.log('Fires after BOTH showDiv() AND the AJAX request succeed!');
	// 'ajaxResult' is the server’s response
});
