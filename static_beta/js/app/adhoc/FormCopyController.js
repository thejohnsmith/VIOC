/* FormCopy Controller
 * @NOTE - The On-Demand Marketing URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/catalog.aspx?uigroup_id=479602&folder_id=1633307
 *
 * @description - Loads templates with data from custom Adobe API.
 * @filename - FormCopyController.js
 * @author - Anthony Gill, John Smith : Epsilon 2016
 */
var pageAnchor = '#ctl00_content_CtlAddToCart_ProductFootnote_divFootNote';
var pageKey = 'addToCart.aspx';

FormCopyController = (function ($) {
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
			//  console.warn('Watching for: Page ready...');
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
			controller.CalculatePrice();
			controller.ChangeText();
			controller.SetRequiredInput();

			// Change Add To Cart text on submit button to, 'Send for Approval'
			$('.ButtonAddToCart.addToCartBtn span:contains("Add to Cart")').html('Send for Approval');

			// Change Qty text to, 'Recipients'
			$('.qtyInputContainer span:contains("Qty:")').html('Recipients');

			// Add Pricing
			$('.qtyInputContainer').append('<div id="costContainer"><span id="cost" class="FontBold">Cost: $0.00</span></div>');

			// Change required helper text by removing the Senior Purchaser bit.
			$('#ctl00_content_CtlAddToCart_InteractivityContainer_ProductFootnote_Stringcontrol3:contains("Item requires approval by Senior Purchaser")').html('Item requires approval');

			var htmlComments = $('*').contents().filter(function () {
				return this.nodeType === 8;
			});
			$('td, tr').filter(function () {
				$.trim($(this).html()) === '&nbsp;';
				$.trim($(this).html()) === '';
			}).remove();
		},

		/**
		 * [CalculatePrice Set navigation state]
		 */
		CalculatePrice: function () {
			var controller = this;
			/**
			 * pricePerEmail
			 * @NOTE !! Cost will be static for the power-users demonstration !!
			       // var pricePerEmail = 0.002;
			      // var cost = ((number * pricePerEmail).toFixed(2));  
			      // $('#cost').html('Cost: $' + cost);
			      // var number = $('.qtyInputContainer input').val();
			 * @TODO:
			 * 		Enable cost updating
			 *   	Use onChange for Qty field
			 *    Make sure the cost does not get duplicated
			 * @type {Number}
			 */

			$('body').on('keyup', $('#ctl00_content_CtlAddToCart_ProductOrderInfoController_AddToCartActionBox_mItemQuantity_txtQty'), function () {
				var pricePerEmail = 0.002;
				var number = $('#ctl00_content_CtlAddToCart_ProductOrderInfoController_AddToCartActionBox_mItemQuantity_txtQty').val();
				var cost = ((number * pricePerEmail).toFixed(2));
				$('#cost').html('Cost: $' + cost);
			}).trigger('keyup');
		},
		/**
		 * [SetRequiredInput Set navigation state]
		 */
		SetRequiredInput: function () {
			$('#Text_SubjectLine, #Text_Sendfromemailaddress, #SenderAddress').attr('required', true);
			$('#Text_SubjectLine_LabelCell, #Text_Sendfromemailaddress_LabelCell, #SenderAddress_LabelCell').append('<span class="pfRequiredAsterik pfRequired Font11"><span id="">*</span></span>');
		},
		/**
		 * [ChangeText Set navigation state]
		 */
		ChangeText: function () {
			$('#Text_SubjectLine').attr('required', 'required');
			$('#ctl00_content_CtlAddToCart_InteractivityContainer_ProductFootnote_footnote, ctl00_content_CtlAddToCart_ProductFootnote_footnote').text('Required fields');

			$('.pfFormNote.pfrequirednote.pfRequired').filter(function () {
				return $(this).text() === 'Delivery Preferences';
			}).text('Must allow two days for approval');

      $('#PreHeaderText_LabelCell').filter(function () {
				return $(this).text() === 'PreHeader Text';
			}).text('Preheader Text');

      $('#PreHeaderText_InputCell .pfFormNote.pfrequirednote.pfRequired').filter(function () {
				return $(this).text() === 'This text appears above the header of the email';
			}).text('This text appears above the header of the email');
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

// Only execute this controller on the addToCart page.
if (window.location.href.indexOf(pageKey) > -1) {
	FormCopyController.controller.init();
}
