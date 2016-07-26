/* Order Summary Controller
 * @NOTE - The On-Demand Marketing URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/orderSummary.aspx?uigroup_id=479602&orderId=8004082&new=1
 *
 * @description - Loads templates with data from custom Adobe API.
 * @filename - OrderSummaryController.js
 * @author - Anthony Gill, John Smith : Epsilon 2016
 */
var pageAnchor = '#pageAnchorFormCopy';
var pageKey = 'orderSummary.aspx';

OrderSummaryController = (function ($) {
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
			console.warn('Adjusting UI...');
			if ($('#ctl00_content_OrderSummary_lblCustRefText') && $('#ctl00_content_OrderSummary_CtlOrderItemList_CtlOrderItems_ctl02_tdIOQuantity')) {
				var orderQuantity = $('#ctl00_content_OrderSummary_CtlOrderItemList_CtlOrderItems_ctl02_tdIOQuantity').text();
				var orderNumber = $('#ctl00_content_OrderSummary_lblCustRefText').text();

				console.info('orderQuantity: ', $.trim(orderQuantity));
				console.info('orderNumber: ', $.trim(orderNumber));

				$('#orderConfirmationQuantity').text(orderQuantity);
				$('#orderConfirmationNumber').text(orderNumber);

				// $('#homePageUrl').href(marcomUserData.$constants.homePageGroupUrl);

			} else {
				console.error('There was a problem obtaining the Order Number and Order Quantity.');
			}

		}
	};
	return {
		controller: controller
	};
})(jQuery);

// Only execute this controller on a certain page
if (window.location.href.indexOf(pageKey) > -1) {
	var $j = jQuery;

	if (typeof getParameterByName === 'function') {
		var reqId = getParameterByName('reqId', window.location.href);
		console.log('reqId, %O', reqId);
		if (reqId !== 'undefined') {
			$j('#CtlBrdCrm, #CtlCart, .ButtonRowFloatR').show();
			$j('.CustomCopy').hide();
		}
		else {
			$j('.CustomCopy').show();
			$j('#CtlBrdCrm, #CtlCart, .ButtonRowFloatR').hide();
		}
	}
	OrderSummaryController.controller.init();
}
