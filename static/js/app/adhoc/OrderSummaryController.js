/* Order Summary Controller
 * @NOTE - The On-Demand Marketing URL for Beta is:
 * @LINK - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/orderSummary.aspx?uigroup_id=479602&orderId=8004082&new=1
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
		reqId: getParameterByName('reqId', window.location.href),
		init: function () {
			var controller = this;
			// console.debug('reqId, ', controller.reqId);
			// console.log('reqId: ', typeof controller.reqId);
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
			controller.SetNavigation();
			// Hide unnecessary stuff
			$("#ctl00_content_OrderSummary_trPaymentMethod").hide();
			$("#ctl00_content_OrderSummary_CtlTotals_rowSubtotal").hide();
			$("#ctl00_content_OrderSummary_CtlTotals_rowOrderTotal").hide();

			// Show the appropriate UI
			if (getParameterByName("new") == 1) {
				//$('#CtlCart, .ButtonRowFloatR').hide();
				$('.thanky-msg').html($('.thanky-msg').html().replace("%%User.FirstName%%",marcomUserData.$user.firstName));
				$('.thanky-msg').show();
				$("#homePageUrl").attr('href', marcomUserData.$constants.homePageUrl);
				if ($("#orderConfirmationNumber").html() == "")
					$("#orderConfirmationNumber").closest('div').hide();
			} else {
				// console.info('showing table page.');
				$('#CtlCart, .ButtonRowFloatR').show();
			}

			if ($('#ctl00_content_OrderSummary_lblCustRefText') && $('#ctl00_content_OrderSummary_CtlOrderItemList_CtlOrderItems_ctl02_tdIOQuantity')) {
				var orderQuantity = $('#ctl00_content_OrderSummary_CtlOrderItemList_CtlOrderItems_ctl02_tdIOQuantity').text();
				var orderNumber = $('#ctl00_content_OrderSummary_lblCustRefText').text();

				// console.info('orderQuantity: ', $.trim(orderQuantity));
				// console.info('orderNumber: ', $.trim(orderNumber));

				$('#orderConfirmationQuantity').text(orderQuantity);
				$('#orderConfirmationNumber').text(orderNumber);
				$('#CtlBrdCrm').hide()

				// $('#homePageUrl').href(marcomUserData.$constants.homePageGroupUrl);

			} else {
				console.error('There was a problem obtaining the Order Number and Order Quantity.');
			}

		},
		/**
		 * [SetNavigation Set navigation state]
		 */
		SetNavigation: function () {
			$('.navBarItem > a').filter(function () {
				return $(this).text() === 'ON DEMAND MARKETING';
			}).addClass('navBarSelectedLinkColor').addClass('customColorOverridable').removeClass('navBarEnhancedLinkColor');
		}
	};
	return {
		controller: controller
	};
})(jQuery);

// Only execute this controller on a certain page
if (window.location.href.indexOf(pageKey) > -1) {
	OrderSummaryController.controller.init();
}
