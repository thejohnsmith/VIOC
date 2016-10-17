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
			controller.AddDisclaimers();
			controller.SetDeliveryTime();

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
			$("#" + target + "DD").remove();
			$("input#" + target).hide().after("<select id='" + target + "DD'></select>");

			// Loop through the times
			for (var idx = 0; idx < times.length; idx++) {
				// Build an option with the disclaimer
				var option = $("<option/>").html(times[idx]).val(times[idx]);

				if (times[idx] == '9AM CST')
					$(option).prop('selected', true)

					// If the text in the input matches the current disclaimer, mark this option as checked
				if ($("#" + target).val() == times[idx])
					$(option).prop("checked", true);

				// Add the option to the dropdown
				$("#" + target + "DD").append(option);
			}

			// If the dropdown changes, update the hidden input
			$("#" + target + "DD").change(function () {
				var parent = $(this).attr('id').replace("DD", "");
				console.log("input#" + parent + " changed to " + $(this).val());
				$("input#" + parent).val($(this).val());
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
			var disclaimers = [
				"",
				"Includes up to 5 quarts of the oil type and grade advertised in the coupon (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. No cash or credit back; cash value $0.001.",
				"Includes up to 6 quarts of the oil type and grade advertised in the coupon (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. No cash or credit back; cash value $0.001.",
				"Includes up to 5 quarts of the oil type and grade advertised in the coupon (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. Haz. Waste fee extra. No cash or credit back; cash value $0.001.",
				"Includes up to 6 quarts of the oil type and grade advertised in the coupon (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. Haz. Waste fee extra. No cash or credit back; cash value $0.001.",
				"Includes up to 5 quarts of conventional, synthetic blend, full synthetic, or diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. No cash or credit back; cash value $0.001.",
				"Includes up to 6 quarts of conventional, synthetic blend, full synthetic, or diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. No cash or credit back; cash value $0.001.",
				"Includes up to 5 quarts of conventional, synthetic blend, full synthetic, or diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. Haz waste fee extra. No cash or credit back; cash value $0.001.",
				"Includes up to 6 quarts of conventional, synthetic blend, full synthetic, or diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube & maintenance check; plus tax, if applicable; not valid with same service offers / discounts (including fleet); see store for additional details or restrictions; good only at participating locations. Haz waste fee extra. No cash or credit back; cash value $0.001",
				"Excluding batteries and state inspections."
			];
			// ==============================================================================
			// Implement Disclaimer Dropdowns
			// ==============================================================================
			for (var ddIdx = 0; ddIdx < ddTargets.length; ddIdx++) {
				var target = ddTargets[ddIdx];
				// Hide the text input and inject a dropdown
				// Do debug the value, change "hide" to "show".
				$("#" + target + "Choices").remove();
				$("#" + target).hide().after("<div id='" + target + "Choices' style='height: 300px; width: 368px; background-color: white; padding: 4px; font-size: 12px; border: 1px solid #CCC; border-radius: 3px; overflow-y: scroll;'></div>");
				// Loop through the disclaimers
				for (var idx = 0; idx < disclaimers.length; idx++) {
					// Build an option with the disclaimer
					var checked = ($("#" + target).val() == disclaimers[idx])
						? "checked"
						: "";
					var disclaimer_label = (disclaimers[idx] != "")
						? disclaimers[idx]
						: "No Disclaimer";
					var option = $("<div style='width: 340px; white-space: normal; padding:4px'>").html("<label><input type='radio' value='" + disclaimers[idx] + "' data-target='" + target + "' name='" + target + "DDChoice' " + checked + "/>&nbsp;&nbsp;" + disclaimer_label + "</label>").val(disclaimers[idx]);
					// Add the option to the dropdown
					$("#" + target + "Choices").append(option);
				}
				// If the dropdown changes, update the hidden input
				$("input[name=" + target + "DDChoice]").change(function () {
					var parent = $(this).attr('data-target');
					console.log("#" + parent + " changed to " + $(this).val());
					$("#" + parent).val($(this).val());
				});

				// Hack
				controller.OnPressSaveContent();
				controller.ChangeText();
				controller.AttachEventListeners();
			}
		},
		AttachEventListeners: function () {
			var controller = this;
			$('#ctl00_content_CtlAddToCart_InteractivityContainer_ctl00_pf3PrefillSave_lnkSavePrefill').on('click', function () {
				controller.OnPressSaveContent();
			});
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
			var pricePerEmail = 0.002;
			var number = $('#ctl00_content_CtlAddToCart_ProductOrderInfoController_AddToCartActionBox_mItemQuantity_txtQty').val();
			var cost = ((number * pricePerEmail).toFixed(2));
			// Add Pricing
			$('.qtyInputContainer').append('<div id="costContainer"><span id="cost" class="FontBold">Cost: $' + cost + '</span></div>');
		},
		OnPressSaveContent: function () {
			var controller = this;
			$('#cboxTitle').remove();
			$("#ctl00_content_CtlAddToCart_InteractivityContainer_ctl00_pf3PrefillSave_lblQuickFillInstructions").html('<div id="cboxTitle">Save Customizations</div><br> Input a name for your saved customizations for future use.');
			$("#cboxTitle").css({
				'font-size': '16px',
				'top': '-20px',
				'left': '5px',
				'text-align': 'left',
				'width': '100%',
				'font-weight': 'bold',
				'color': '#fff'
			});
		},
		/**
		 * [ChangeText Set navigation state]
		 */
		ChangeText: function () {
			// Change Add To Cart text on submit button to, 'Send for Approval'
			$('.ButtonAddToCart.addToCartBtn span:contains("Add to Cart")').html('Send for Approval');
			// Change Qty text to, 'Recipients'
			$('.qtyInputContainer span:contains("Qty:")').html('Recipients');

			// Change required helper text by removing the Senior Purchaser bit.
			$('.FontItalic.Font11:contains("Item requires approval by Senior Purchaser")').html('Item requires approval by VIOC Franchise Marketing');
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
	return {controller: controller};
})(jQuery);
// Only execute this controller on the addToCart page.
if (window.location.href.indexOf(pageKey) > -1) {
	FormCopyController.controller.init();
}
jQuery(document).ready(FormCopyController.controller.init();)
