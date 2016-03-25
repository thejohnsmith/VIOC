var constants = {
	lifecyclePageUrl : "CustomPage.aspx?uigroup_id=479602&page_id=10792",
	specialtyPageUrl : "CustomPage.aspx?uigroup_id=479602&page_id=10793",
	configPageUrl: "CustomPage.aspx?uigroup_id=479602&page_id=11225",
	programManagementUrl : "",
	apiPath: "https://adobe-uat-vioc.epsilon.com/jssp/vioc/",
	userId: marcomUserData.$user.externalId
};

var programConfigController = (function ($) {

	var controller = {

		program: {},
		config: { "content" : {}, "uiLayout": {}, "preview": {} },
		configLoaded: false,
		saveEnabled: true,
		apiPath: constants.apiPath,
		userId: constants.userId,
		programId: getParameterByName('programId', window.location.href),
		configId: getParameterByName('configId', window.location.href),

		init: function (config) {
			var controller = this;
			controller.GetProgramData(controller.programId, function (programId) {
				if(typeof controller.configId != "undefined"){
					controller.GetConfigData(controller.configId, function() { controller.UpdateUI() } );
				}
				else
				{
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
			$.get(controller.apiPath + 'getProgramParticipationStats.jssp?userId=' + controller.userId, function (results) {
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

			$.get(controller.apiPath + 'loadConfig.jssp?userId=' + controller.userId + '&configId=' + controller.configId, function (results) {

				var json_results = JSON.parse(results);
				controller.config = json_results;
				controller.configLoaded = true;

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
		ShowPreSubmitIfNeeded: function() {
			var controller = this;
			$(".pre-submit").toggle(!controller.configLoaded);
			$(".post-submit").toggle(controller.configLoaded);
		},
		UpdateTitle: function () {
			var controller = this;
			var title = (controller.configLoaded) ? "Edit " + controller.config.content.label : "Create Program Settings";

			// Set title
			$("h1.page-title").html(title);

			// Set 4th Level Breadcrumb
			$(".breadcrumbs_current a").html(title);
		},
		UpdateBreadCrumbs: function () {
			var controller = this;

			// Set 2nd Level Breadcrumb
			$(".breadcrumbs_previous:first a").html((controller.program.isSpecialtyProgram) ? "Specialty Programs" : "Lifecycle Programs");
			$(".breadcrumbs_previous:first a").attr("href", (controller.program.isSpecialtyProgram) ? constants.specialtyPageUrl : constants.lifecyclePageUrl);

			// Set 3rd Level Breadcrumb
			// :TOOD: Other JS code is messing with this.  Please remove it.
			$(".breadcrumbs_previous:last a").html(controller.program.programName + " Program");
			$(".breadcrumbs_previous:last a").attr("href", "javascript:history.go(-1)");
		},
		UpdateSettingName: function () {
			$(".settings-name").val(controller.config.content.label);
		},
		UpdateCreativeDropdowns: function () {
			var controller = this;
			console.log("Config: %o", controller.config);
			console.log("Program: %o", controller.program);

			// Pull the list of email creative from controller.program.uiLayout.emailCreativeChoices and populate .em-creative
			console.log("Options: %o", controller.program.uiLayout.emailCreativeChoices);
			for (var value in controller.program.uiLayout.emailCreativeChoices) {
				 $('.em-creative')
					  .append($('<option>', { value : value })
					  .text(controller.program.uiLayout.emailCreativeChoices[value]));
			}

			// Pull the list of DM creative from controller.program.uiLayout.dmCreativeChoices and populate .dm-creative
			for (var value in controller.program.uiLayout.dmCreativeChoices) {
				 $('.dm-creative')
					  .append($('<option>', { value : value })
					  .text(controller.program.uiLayout.dmCreativeChoices[value]));
			}

			// Hide or show .em-creative-row based on controller.program.uiLayout.hasEmail
			$(".em-creative-row").toggle(controller.program.uiLayout.hasEmail);

			// Hide or show .dm-creative-row based on controller.program.uiLayout.hasDM
			$(".dm-creative-row").toggle(controller.program.uiLayout.hasDM);

			// Select the email creative value that matches config.content.emailCreativeName
			$('.em-creative option[value="' + controller.config.content.emailCreativeName + '"]').attr('selected', 'selected');

			// Select the DM creative value that matches config.content.dmCreativeName
			$('.dm-creative option[value="' + controller.config.content.dmCreativeName + '"]').attr('selected', 'selected');
		},
		UpdateDiscountCodes: function () {
			var controller = this;

			$(".high-risk").toggle(controller.program.uiLayout.usesHighRisk);
			$("touchpoint-3").toggle((controller.program.uiLayout.touchpoints >= 3));
			$("touchpoint-2").toggle((controller.program.uiLayout.touchpoints >= 2));
			$(".touchpoint-row.email").toggle(controller.program.uiLayout.hasEmail);
			$(".touchpoint-row.dm").toggle(controller.program.uiLayout.hasDM);
			$(".touchpoint-row.sms").toggle(controller.program.uiLayout.hasSMS);

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

if (window.location.href.indexOf(constants.configPageUrl) > -1)
	programConfigController.controller.init();
