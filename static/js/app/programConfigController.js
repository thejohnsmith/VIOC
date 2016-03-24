var programConfigController = (function ($) {
	var controller = {
		program: {},
		config: {
			"content": {},
			"uiLayout": {},
			"preview": {}
		},
		configLoaded: false,
		saveEnabled: true,
		api_path: 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/',
		userId: marcomUserData.$user.externalId,
		programId: getParameterByName('programId', window.location.href),
		configId: getParameterByName('configId', window.location.href),
		// Call GetProgramData and fire callback
		// If a configID was provided, fire GetConfigData() and then call UpdateUI();
		// If not, just call UpdateUI();

		init: function (config) {
			var controller = this;
			controller.GetProgramData(controller.programId, function (programId) {
				if (typeof controller.configId != "undefined") {
					controller.GetConfigData(controller.configId, function () {
						controller.UpdateUI()
					});
				} else {
					controller.UpdateUI();
				}

			});
		},
		/** API call to getProgramParticipationStats.jssp
		 * @var {string} userId
		 * @return callback
		 */
		GetProgramData: function (programId, callback) {
			var controller = this;
			$.get(controller.api_path + 'getProgramParticipationStats.jssp?userId=' + controller.userId, function (results) {
				// NOTE: We may need to parse results.
				var json_results = JSON.parse(results);

				// Loop through the API result and find the program that matches program ID (DONE)
				$.each(json_results, function (i, result) {
					// Store the program data in controller.program
					if (result.id == programId) {
						controller.program = result;
					}
				});

				// fire the callback (DONE)
				if (typeof callback === 'function') {
					callback(controller.program);
				}
			});
		},
		/** API call to loadConfig.jssp
		 * @var {string} configId
		 * @var {string} userId
		 * @return callback
		 * Call https://adobe-uat-vioc.epsilon.com/jssp/vioc/loadConfig.jssp?userId=34567&configId=10
		 * Stick the data into controller.config
		 * Fire the callback
		 */
		GetConfigData: function (configId, callback) {
			var controller = this;

			$.get(controller.api_path + 'loadConfig.jssp?userId=' + controller.userId + '&configId=' + controller.configId, function (results) {
				// NOTE: We may need to parse results.
				var json_results = JSON.parse(results);
				controller.config = json_results;
				controller.configLoaded = true;
				console.log("Config Data: %O", controller.config);
				if (typeof callback === 'function') {
					callback(json_results);
				}
			});
		},
		UpdateUI: function () {
			var controller = this;
			controller.ShowPreSubmitIfNeeded();
			controller.UpdateTitle();
			controller.UpdateBreadCrumbs();
			controller.UpdateSettingName();
			controller.UpdateCreativeDropdowns();
			controller.UpdateDiscountCodes();
			controller.UpdateOfferExpiration();
			controller.UpdateButtons();
			controller.AttachEventListeners();
			controller.GeneratePreview();
		},
		ShowPreSubmitIfNeeded: function () {
			var controller = this;
			$(".pre-submit").toggle(!controller.configLoaded);
			$(".post-submit").toggle(controller.configLoaded);
		},
		UpdateTitle: function () {
			var controller = this;
			console.log("Title is: " + controller.config.content.label);
			$("h1.page-title").html((controller.configLoaded) ? controller.config.content.label : "Create Program Settings");
		},
		UpdateBreadCrumbs: function () {
			// body...
		},
		UpdateSettingName: function () {
			$(".settings-name").val(controller.config.content.label);
		},
		UpdateCreativeDropdowns: function () {
			var controller = this;
			// Pull the list of email creative from controller.config.uiLayout.emailCreativeChoices and populate .em-creative
			// Pull the list of DM creative from controller.config.uiLayout.dmCreativeChoices and populate .dm-creative
			// Hide or show .em-creative-row based on controller.config.uiLayout.hasEmail
			// Hide or show .dm-creative-row based on controller.config.uiLayout.hasDM
			// Select the email creative value that matches config.content.emailCreativeName
			// Select the DM creative value that matches config.content.dmCreativeName
		},
		UpdateDiscountCodes: function () {
			// Note: Your UI will already have all 9 permutations of inputs: Email/DM/SMS #1, Email/DM/SMS #2, Email/DM/SMS #3
			// Hide high risk if config.uiLayout.usesHighRisk = false   (Easily done via $(".high-risk").hide();
			// If config.uiLayout.touchpoints < 3, then hide all #3 related items via $("touchpoint-3").hide();
			// If config.uiLayout.touchpoints < 2, then hide all #2 related items via $("touchpoint-2").hide();
			// If config.uiLayout.hasEmail == false, then hide all email related items via $(".touchpoint-row.email").hide();
			// If config.uiLayout.hasDM == false, then hide all email related items via $(".touchpoint-row.dm").hide();
			// If config.uiLayout.hasSMS == false, then hide all email related items via $(".touchpoint-row.sms").hide();
			// To populate values, iterate through all values of $(".touchpoint-value").

			$.each($('.touchpoint-value'), function (i, e) {
				var value = controller.config.content[$(e).attr('name')];
				$(e).val(value);
			});
		},
		UpdateOfferExpiration: function () {
			// Select the expiration value that matches config.content.expiration
		},
		UpdateButtons: function () {
			// If controller.saveEnabled, enable the save button.  If not, disable it.
		},
		AttachEventListeners: function () {
			// Do $("input").on("keyup", DisableSaveButton);
			// Do $("select").on("change", DisableSaveButton);
			// When Preview is pressed, call OnPressPreview()
			// When Save is pressed, call OnPressSave()
		},
		GeneratePreview: function (callback) {
			// Call GetFormData()
			// Call a new preview API method, passing the form data
			// Hand that JSON object to a mustache template and render the preview pane.
			// Call callback()
		},
		DisableSaveButton: function () {
			controller.saveEnabled = false;
			UpdateButtons();
		},
		GetFormData: function () {
			// Grab all inputs by calling $("input,select") and move their values into a key/value object.
			// Returns all form data in an easy to POST format.
		},
		OnPressPreview: function () {
			// Call GeneratePreview()  When the callback returns:
			// Mark controller.saveEnabled = true;
			// Call UpdateButtons();
		},
		OnPressSave: function () {
			// Call GetFormData()
			// Save that data to the server.
		}
	};
	return {
		controller: controller
	};
})(jQuery);

programConfigController.controller.init();
