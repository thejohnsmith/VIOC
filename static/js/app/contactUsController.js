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
		/** Check for empty input
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
		/** @todo hook this function up corectly. **/
		bulkValidate: function (e) {
			e.preventDefault();
			console.warn('bulk fired');
			var notEmptyFields = true;
			controller.contactFormField.removeClass('input-error').attr('aria-invalid', 'false').each(function () {

				// If any field is empty add error class and ARIA invalid true
				if ($(this).val().trim() == '') {
					$(this).addClass('input-error').attr('aria-invalid', 'true');
					notEmptyFields = false;
					return;
				}
			});
			return notEmptyFields;
		},
		onSubmit: function (e) {
			e.preventDefault();
			console.log('Submit pressed');

			// Check all fields
			bulkValidate();
		},
		onSuccess: function () {
			console.log('Validation success.');
			toastr.success('The form has passed validation');
			controller.submitHandler();
		},
		clearFields: function () {
			controller.contactFormField.removeClass('input-error').attr('aria-invalid', 'false').val('');
		},
		submitHandler: function () {
			// https://adobe-uat-vioc.epsilon.com/jssp/vioc/sendContactUs.jssp?name=Anthony&email=anthony.gill@epsilon.com&phone=5555555555&comments=I%20work!
			var saveData = {
				'name': $('#name').val(),
				'email': $('#email').val(),
				'phone': $('#phone').val(),
				'comments': $('#message').val()
			};
			console.warn('name was: ' + saveData.name);
			$.ajax({
				url: controller.apiPath + 'sendContactUs.jssp',
				method: 'GET',
				data: saveData,
				success: function (results) {
					console.log('Save was successful!');
					controller.clearFields();
					toastr.success('Your request has been submitted.');
				},
				dataType: 'json'
			});
		}
	};
	return {
		controller: controller
	};
})(jQuery);

contactUsController.controller.init();
