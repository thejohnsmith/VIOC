/** Contact Us Form Controller
 *  @file contactUsController.js
 *  @todo  -- Need this to be functional and sending emails to WarpDriveHelp@epsilon.com;
 *  					upon send, user should see a green "Your request has been submitted." alert box
 */

var contactUsController = (function ($) {
	var controller = {
		apiPath: marcomUserData.$constants.apiPath,
		contactFormField: $('#contact-form-main .required-field'),
		contactFormSubmit: $('#contact-form-main #submit-btn'),
		init: function () {
			var controller = this;
			console.log('I work!');

			controller.attachEventListeners();
		},
		attachEventListeners: function () {
			// Single input field changed
			controller.contactFormField.on('keyup blur', function () {
				controller.singleValidate(this);
			});

			// Submit Button pressed
			controller.contactFormSubmit.click(this.onSubmit);
		},
		/** Check for empty input fields
		 *  Toggle error/succes classes,
		 *  Toggle ARIA invalid true/false
		 */
		singleValidate: function (input) {
			var inputValue = $(input).val();
			console.log('input value is: ' + inputValue);
			if (inputValue === '') {
				$(input).removeClass('input-success')
					.addClass('input-error')
					.attr('aria-invalid', 'true');
			} else {
				$(input).addClass('input-success')
					.removeClass('input-error')
					.attr('aria-invalid', 'false');
			}
		},
		/** Validate all fields
		 *  Toggle error/succes classes,
		 *  Toggle ARIA invalid true/false
		 */
		bulkValidate: function () {
			console.warn('bulk fired');
			var notEmptyFields = true;
			// @TODO properly iterate over all inputs, if all pass fire executeFormSubmit, else return.
			// var contactFormFieldCount = controller.contactFormField.length;
			// var contactFormFieldError = $('#contact-form-main .required-field.input-error').length;
			controller.contactFormField.each(function (input) {
				var inputValue = $(this).val();
				if (inputValue === '') {
					$(input).removeClass('input-success')
						.addClass('input-error')
						.attr('aria-invalid', 'true');
				} else {
					$(input).addClass('input-success')
						.removeClass('input-error')
						.attr('aria-invalid', 'false');
				}
			});
			return notEmptyFields;
		},
		onSubmit: function (e) {
			e.preventDefault();
			console.log('Submit pressed');

			// Check all fields
			if (controller.bulkValidate()) {
				controller.executeFormSubmit();
			}
		},
		executeFormSubmit: function () {
			// https://adobe-uat-vioc.epsilon.com/jssp/vioc/sendContactUs.jssp?name=Anthony&email=anthony.gill@epsilon.com&phone=5555555555&comments=I%20work!
			var saveData = {
				'name': $('#name').val(),
				'email': $('#email').val(),
				'phone': $('#phone').val(),
				'comments': $('#message').val()
			};
			$.ajax({
				url: controller.apiPath + 'sendContactUs.jssp',
				method: 'GET',
				data: saveData,
				dataType: 'json'
			}).done(function () {
				console.log('Save was successful!');
				controller.clearFields();
				toastr.success('Your request has been submitted.');
			}).fail(function () {
				console.error('Save was unsuccessful!');
				toastr.warning('Your message was not sent. Please check that all fields have been filled.');
			});
		},
		clearFields: function () {
			controller.contactFormField.removeClass('input-error').attr('aria-invalid', 'false').val('');
		}
	};
	return {
		controller: controller
	};
})(jQuery);

if (window.location.href.indexOf(marcomUserData.$constants.helpPageUrl) > -1) {
	contactUsController.controller.init();
}
