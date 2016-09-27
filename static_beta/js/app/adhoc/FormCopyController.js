/* FormCopy Controller
 * @NOTE - The On-Demand Marketing URL for Beta is:
 * @private - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/catalog.aspx?uigroup_id=479602&folder_id=1633307
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
			controller.AddDisclaimers();
			controller.SetDeliveryTime();
			// Change Add To Cart text on submit button to, 'Send for Approval'
			$('.ButtonAddToCart.addToCartBtn span:contains("Add to Cart")').html('Send for Approval');
			// Change Qty text to, 'Recipients'
			$('.qtyInputContainer span:contains("Qty:")').html('Recipients');
			// Add Pricing
			$('.qtyInputContainer').append('<div id="costContainer"><span id="cost" class="FontBold">Cost: $0.00</span></div>');
			// Change required helper text by removing the Senior Purchaser bit.
			$('#ctl00_content_CtlAddToCart_InteractivityContainer_ProductFootnote_Stringcontrol3:contains("Item requires approval by Senior Purchaser")').html('Item requires approval');
			/**
			 * htmlComments Removes html comments so the cells can be easily removed
			 * @type {[var]} htmlComments
			 * @returns {function} htmlComments
			 */
			var htmlComments = $('*').contents().filter(function () {
				return this.nodeType === 8;
			});
			/**
			 * Remove empty-cells
			 */
			$('td, tr').filter(function () {
				$.trim($(this).html()) === '&nbsp;';
				$.trim($(this).html()) === '';
			}).remove();
		},
		SetDeliveryTime: function () {
			// ==============================================================================
			// Set up constants
			// ==============================================================================

			var times = [
				"1AM CST",
				"2AM CST",
				"3AM CST",
				"4AM CST",
				"5AM CST",
				"6AM CST",
				"7AM CST",
				"8AM CST",
				"9AM CST",
				"10AM CST",
				"11AM CST",
				"12PM CST",
				"1PM CST",
				"2PM CST",
				"3PM CST",
				"4PM CST",
				"5PM CST",
				"6PM CST",
				"7PM CST",
				"8PM CST",
				"9PM CST",
				"10PM CST",
				"11PM CST",
				"12AM CST"
			];

			// ==============================================================================
			// Implement Disclaimer Dropdowns
			// ==============================================================================

			var target = "Text_Delivery_Time";

			// Hide the text input and inject a dropdown
			// Do debug the value, change "hide" to "show".
			$j("#" + target + "DD").remove();
			$j("input#" + target).hide().after("<select id='" + target + "DD'></select>");

			// Loop through the times
			for (var idx = 0; idx < times.length; idx++) {
				// Build an option with the disclaimer
				var option = $j("<option/>").html(times[idx]).val(times[idx]);

				if (times[idx] == '9AM CST')
					$(option).prop('selected', true)

				// If the text in the input matches the current disclaimer, mark this option as checked
				if ($j("#" + target).val() == times[idx])
					$(option).prop("checked", true);

				// Add the option to the dropdown
				$j("#" + target + "DD").append(option);
			}

			// If the dropdown changes, update the hidden input
			$j("#" + target + "DD").change(function () {
				var parent = $j(this).attr('id').replace("DD", "");
				console.log("input#" + parent + " changed to " + $j(this).val());
				$j("input#" + parent).val($j(this).val());
			});

		},
		/**
		 * Create disclaimer items - Radio input list
		 *
		 * type: radio
		 * name: target+'Disclaimer_option'
		 * value: disclaimers[idx]
		 */
		AddDisclaimers: function () {
			var controller = this;
			// ==============================================================================
			// Set up constants
			// ==============================================================================
			var ddTargets = ["C1Disclaimer", "C2Disclaimer", "C3Disclaimer"];
			var disclaimers = ["", "Includes up to 5 quarts of the oil type and grade advertised in the coupon (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. No cash or credit back; cash value $0.001.",
				"Includes up to 6 quarts of the oil type and grade advertised in the coupon (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. No cash or credit back; cash value $0.001.",
				"Includes up to 5 quarts of the oil type and grade advertised in the coupon (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. Haz. Waste fee extra. No cash or credit back; cash value $0.001.",
				"Includes up to 6 quarts of the oil type and grade advertised in the coupon (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. Haz. Waste fee extra. No cash or credit back; cash value $0.001.",
				"Includes up to 5 quarts of conventional, synthetic blend, full synthetic, or diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. No cash or credit back; cash value $0.001.",
				"Includes up to 6 quarts of conventional, synthetic blend, full synthetic, or diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. No cash or credit back; cash value $0.001.",
				"Includes up to 5 quarts of conventional, synthetic blend, full synthetic, or diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. Haz waste fee extra. No cash or credit back; cash value $0.001.",
				"Includes up to 6 quarts of conventional, synthetic blend, full synthetic, or diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. Haz waste fee extra. No cash or credit back; cash value $0.001"
			];
			// ==============================================================================
			// Implement Disclaimer Dropdowns
			// ==============================================================================
			for (var ddIdx = 0; ddIdx < ddTargets.length; ddIdx++) {
				var target = ddTargets[ddIdx];
				// Hide the text input and inject a dropdown
				// Do debug the value, change "hide" to "show".
				$j("#" + target + "Choices").remove();
				$j("#" + target).hide().after("<div id='" + target + "Choices' style='height: 300px; width: 368px; background-color: white; padding: 4px; font-size: 12px; border: 1px solid #CCC; border-radius: 3px; overflow-y: scroll;'></div>");
				// Loop through the disclaimers
				for (var idx = 0; idx < disclaimers.length; idx++) {
					// Build an option with the disclaimer
					var checked = ($j("#" + target).val() == disclaimers[idx]) ? "checked" : "";
					var disclaimer_label = (disclaimers[idx] != "") ? disclaimers[idx] : "No Disclaimer";
					var option = $j("<div style='width: 340px; white-space: normal; padding:4px'>").html("<label><input type='radio' value='" + disclaimers[idx] + "' data-target='" + target + "' name='" + target + "DDChoice' " + checked + "/>&nbsp;&nbsp;" + disclaimer_label + "</label>").val(disclaimers[idx]);
					// Add the option to the dropdown
					$j("#" + target + "Choices").append(option);
				}
				// If the dropdown changes, update the hidden input
				$j("input[name=" + target + "DDChoice]").change(function () {
					var parent = $j(this).attr('data-target');
					console.log("#" + parent + " changed to " + $j(this).val());
					$j("#" + parent).val($j(this).val());
				});
			}
		},
		/** CalculatePrice
		 * @function CalculatePrice
		 * @description Calculates the of sum of emails
		 * @event Self-invoking - Calls 'trigger(keyup)' on first load
		 * @event Triggers on keyup
		 * @const pricePerEmail - Static/hard-coded value, manually set here
		 * @var		#cost - Id of UI space
		 * @var		number - The current instance of our Quantity
		 * @var		cost - Adds two decimal places to our number
		 * @returns html output into #cost container
		 */
		CalculatePrice: function () {
			var controller = this;
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
			// Hack to display address as placeholder
			// @TODO This is pure shame, needs to be coded proper.
			$('#SenderAddress').val('3499 Blazer Parkway, Lexington. KY 40509').blur();
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
			$('.SelectSavedContentPrompt > a').filter(function () {
				return $(this).text() === 'Autofill Options';
			}).text('Select previously saved email');
			$('.SaveContentPrompt > a').filter(function () {
				return $(this).text() === 'Save Autofill Content';
			}).text('Save current customizations');
			$('.SelectSavedContentPrompt > a, .SaveContentPrompt > a').addClass('btn');
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
jQuery(document).ready(FormCopyController.controller.AddDisclaimers())
