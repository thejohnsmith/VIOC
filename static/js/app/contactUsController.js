/** Contact Us Form Controller
 *  @file contactUsController.js
 */

var contactUsController = (function ($) {
	var controller = {
		apiPath: marcomUserData.$constants.apiPath,
		contactFormField: $('#contact-form-main .required-field'),
		contactFormSubmit: $('#contact-form-main #submit-btn'),
		successmsg: $('.successmsg'),
		errormsg: $('.errormsg'),
		successClass: 'input-success',
		errorClass: 'input-error',
		ariaInvalid: 'aria-invalid',
		init: function () {
			var controller = this;
			controller.attachEventListeners();
		},
		attachEventListeners: function () {
			// Submit Button pressed
			controller.contactFormSubmit.click(this.onSubmit);
		},
		/** Check for empty input fields
		 *  Toggle error/succes classes,
		 *  Toggle ARIA invalid true/false
		 */
		singleValidate: function (input) {
			var inputValue = $(input).val();
			if (inputValue == '') {
				$(input).removeClass(controller.successClass)
					.addClass(controller.errorClass)
					.attr(controller.ariaInvalid, 'true');
				return false;
			} else {
				$(input).addClass(controller.successClass)
					.removeClass(controller.errorClass)
					.attr(controller.ariaInvalid, 'false');
				return true;
			}
		},
		bulkValidate: function () {
			var notEmptyFields = true;
			controller.contactFormField.each(function (i, input) {
				if (!controller.singleValidate(input))
					notEmptyFields = false;
			});
			return (notEmptyFields);
		},
		onSubmit: function (e) {
			e.preventDefault();
			// Check all fields
			if (controller.bulkValidate()) {
				controller.executeFormSubmit();
			} else {
				toastr.error('Please complete all fields.');
			}
		},
		executeFormSubmit: function () {
			var saveData = {
				'name': $('#name').val(),
				'email': $('#email').val(),
				'phone': $('#phone').val(),
				'comments': $('#message').val()
			};
			controller.contactFormSubmit.attr("disabled","disabled");
			$.ajax({
				url: controller.apiPath + 'sendContactUs.jssp',
				method: 'GET',
				data: saveData,
				dataType: 'json',
				statusCode: {
					400: function () {
						controller.showError();
					},
					200: function () {
						controller.showSuccess();
						controller.clearFields();
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.warn(jqXHR.status);
					console.warn(jqXHR.statusText);
					console.warn(jqXHR.responseText);
					controller.contactFormSubmit.attr("disabled",null);
					// controller.errormsg.html('<p>' + JSON.parse(jqXHR.responseText).error + '</p>');
				}
			});
		},
		clearFields: function () {
			controller.contactFormField
				.removeClass(controller.errorClass)
				.attr(controller.ariaInvalid, 'false')
				.val('');
		},
		showSuccess: function () {
			controller.successmsg.fadeIn();
			controller.contactFormSubmit.attr("disabled",null);
			toastr.success('Your request has been submitted.');
		},
		showError: function () {
			// controller.errormsg.fadeIn();
			controller.contactFormSubmit.attr("disabled",null);
			toastr.error('Your message was not sent. Please check that all fields have been filled.');
		}
	};
	return {
		controller: controller
	};
})(jQuery);

if (window.location.href.indexOf(marcomUserData.$constants.helpPageUrl) > -1) {
	contactUsController.controller.init();
}
