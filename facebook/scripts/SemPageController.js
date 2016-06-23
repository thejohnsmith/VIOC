/* SEM_Coupon Controller
 * @URL
 * 	- Dev http://files.marcomcentral.app.pti.com/epsilon/facebook/
 *  - Staging
 *  - Production
 *
 * @description - Loads coupon data from custom Adobe API.
 * @filename - SemPageController.js
 * @authors - Anthony Gill, John Smith : Epsilon 2016
 */
var SemPageController = (function ($) {
	var controller = {
		templatePath: 'https://files.marcomcentral.app.pti.com/epsilon/facebook/templates',
		apiPath: 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/',
		couponData: {},
		init: function () {
			var controller = this;
			// Ex. ?p=StdRem1
			var pfid = controller.getParameterByName('p', window.location.href) || null;
			controller.getCouponPageData(pfid, function () {
				controller.updateUI(function () {
					controller.showUI();
				});
			});
			controller.attachEventListeners();
		},
		/**
		 * [getCouponPageData Calls facebookSignupCoupons API, stores results in couponData.]
		 * @param  {[type]}   pfid     [description]
		 * @param  {[type]}   rid      [description]
		 * @param  {Function} callback [description]
		 * @return {[object]}           [couponData]
		 */
		getCouponPageData: function (pfid, callback) {
			var controller = this;
			$.get(controller.apiPath + 'facebookSignupCoupons.jssp?p=' + encodeURIComponent(pfid), function (results) {
				var json_results = JSON.parse(results);
				controller.couponData = json_results;
				if (typeof callback === 'function') {
					callback(json_results);
				}
			});
		},
		updateUI: function (callback) {
			var controller = this;
			var template1 = $('#coupons-template-desktop').html();
			var html1 = Mustache.to_html(template1, controller.couponData);
			$('#coupons-section-desktop').html(html1);
			var template2 = $('#disclaimer-template-desktop').html();
			var html2 = Mustache.to_html(template2, controller.couponData);
			$('#disclaimer-section-desktop').html(html2);
			var template3 = $('.coupons-template-mobile').html();
			var html3 = Mustache.to_html(template3, controller.couponData);
			$('.coupons-section-mobile').html(html3);
			var template4 = $('.disclaimer-template-mobile').html();
			var html4 = Mustache.to_html(template4, controller.couponData);
			$('.disclaimer-section-mobile').html(html4);
			if (typeof callback === 'function') {
				callback();
			}
		},
		showUI: function () {
			$('.js-loading').fadeOut();
			$('.js-content').fadeIn();
		},
		attachEventListeners: function () {
			var controller = this;
			// CONNECT FORM
			$('#connect_bar_submit').on('click', function (e) {
				controller.validateConnectForm(e);
			});
			// OFFERS FORM
			$('#ctl00_FooterContent2_connect1_btnSignUp').on('click', function (e) {
				controller.validateOffersForm(e);
			});
		},
		validateOffersForm: function (e) {
			e.preventDefault();
			var controller = this;
			var $cwuEmailField = $('#ctl00_FooterContent2_connect1_txtEmail');
			var $cwuZipField = $('#ctl00_FooterContent2_connect1_txtZip');
			var badCWUForm = false;
			var errorMessage = '';
			if (($cwuEmailField.val()).search('@') == -1 || ($cwuEmailField.val()).indexOf('.') == -1) {
				badCWUForm = true;
				errorMessage = errorMessage + 'You must enter a valid email.\n';
			}
			if (parseInt($cwuZipField.val()) < 10000 || parseInt($cwuZipField.val()) > 99999 || isNaN(parseInt($cwuZipField.val()))) {
				badCWUForm = true;
				errorMessage = errorMessage + 'You must enter a valid zip code.\n';
			}
			if (!badCWUForm) {
				var email_value = encodeURIComponent($cwuEmailField.val());
				var zipcode_value = encodeURIComponent($cwuZipField.val());
				var apiPath = controller.apiPath + 'facebookSignUp.jssp';
				$.ajax({
					url: apiPath,
					type: 'GET',
					contentType: 'application/json',
					processData: true,
					data: {
						email: email_value,
						zip: zipcode_value
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					success: function (data) {
						alert('Thank You! Your address has been submitted.');
						return;
					},
					error: function () {
						alert('Save failed. Please try again at a later time.');
						return;
					}
				});
			} else {
				alert(errorMessage);
			}
		},
		/**
		 * @description Fields were pulled from default.js
		 */
		validateConnectForm: function (e) {
			e.preventDefault();
			var controller = this;
			var email_elm = $('#carecare-optin .email-box');
			var email_input = $('#carecare-optin .email-box input');
			var email_value = email_input.val();
			var zipcode_value = '';
			var validation_elm = $('#optin-message');
			var validation_message = $('#optin-message > p');
			var submit_elm = $('#carecare-optin .submit');
			// Validate 'Email'
			if (($('#email').val()).search('@') === -1 || ($('#email').val()).indexOf('.') === -1) {
				// Show error container and message
				validation_elm.css('display', 'block');
				email_elm.addClass('input-error');
				validation_message.html('<strong class="text-default">Please enter a valid email address.</strong><br>');
				$('#email').focus(); // Put focus on Input field
				// Show the rest
				submit_elm.css('display', 'block');
				email_elm.css('display', 'block');
				return;
			} else {
				// Add a loding indicator
				validation_message.html('Submitting...<br />');
				submitEmail(email_value);

				function submitEmail(email_value) {
					// @Example
					// https://adobe-prod-vioc.epsilon.com/jssp/vioc/facebookSignUp.jssp?email=foo&zip=01234
					// Get newest value of input
					email_value = email_input.val();
					var apiPath = controller.apiPath + 'facebookSignUp.jssp';
					$.ajax({
						url: apiPath,
						type: 'GET',
						contentType: 'application/json',
						processData: true,
						data: {
							email: email_value,
							zip: zipcode_value
						},
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						},
						success: function (data) {
							// Remove error and bring the automatic toggling back
							email_elm.css('display', 'block').removeClass('input-error').addClass('hidevioc');
							submit_elm.css('display', 'none');
							validation_elm.css('display', 'block');
							validation_message.html('<strong>Thank You! Your address has been submitted.</strong>');
							return;
						},
						error: function () {
							console.error('Save failed.');
							return;
						}
					});
				}
			}
		},
		getParameterByName: function (name, url) {
			var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
			var results = regex.exec(url);
			if (!url) {
				url = window.location.href;
			}
			name = name.replace(/[\[\]]/g, '\\$&');
			if (!results) {
				return undefined;
			}
			if (!results[2]) {
				return '';
			}
			return decodeURIComponent(results[2].replace(/\+/g, ' '));
		}
	};
	return {
		controller: controller
	};
})(jQuery);
// Only execute this controller on a certain page
// if (window.location.href.indexOf(pageKey) > -1) {
//
SemPageController.controller.init();
// }
