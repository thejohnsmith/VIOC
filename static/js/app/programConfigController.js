var programConfigController = (function ($) {

	var controller = {

		program: {},
		config: { "content" : {}, "uiLayout": {}, "preview": {} },
		configLoaded: false,
		saveEnabled: true,
		apiPath: marcomUserData.$constants.apiPath,
		userId: marcomUserData.$user.externalId,
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
			controller.UpdatePreSubmitSidebar();
			controller.AttachEventListeners();
			controller.GeneratePreview();
			controller.ShowUI();
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
			$(".breadcrumbs_current").html(title);
		},
		UpdateBreadCrumbs: function () {
			var controller = this;

			// Set 2nd Level Breadcrumb
			$(".breadcrumbs_previous:first a").html((controller.program.isSpecialtyProgram) ? "Specialty Programs" : "Lifecycle Programs");
			$(".breadcrumbs_previous:first a").attr("href", (controller.program.isSpecialtyProgram) ? marcomUserData.$constants.specialtyPageUrl : marcomUserData.$constants.lifecyclePageUrl);

			// Set 3rd Level Breadcrumb
			$(".breadcrumbs_previous:last a").html(controller.program.programName + " Program");
			$(".breadcrumbs_previous:last a").attr("href", marcomUserData.$constants.programManagementUrl + "&programId=" + controller.programId);
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

			if (!controller.program.uiLayout.usesHighRisk)		$(".high-risk").hide();
			if (controller.program.uiLayout.hasEmail != true)   $(".touchpoint-row.email,.results-section .email").hide();
			if (controller.program.uiLayout.hasDM != true) 		$(".touchpoint-row.dm,.results-section .dm").hide();
			if (controller.program.uiLayout.hasSMS != true)		$(".touchpoint-row.sms,.results-section .sms").hide();
			if (controller.program.uiLayout.touchpoints < 3)	$(".touchpoint-3").hide();
			if (controller.program.uiLayout.touchpoints < 2)	$(".touchpoint-2").hide();
			if (!controller.program.programUsesAdtl)			$(".results-section .additional-offer").hide();

			$.each($('.touchpoint-value'), function (i, e) {
				var value = controller.config.content[$(e).attr('name')];
				$(e).val(value);
			});
		},
		UpdateOfferExpiration: function () {
			var controller = this;
			$('.offer-exp option[value="' + controller.config.content.expiration + '"]').attr('selected', 'selected');
		},
		UpdateButtons: function () {
			var controller = this;
			$(".btn-save").removeClass('disabled');
			if (!controller.saveEnabled)
				$(".btn-save").addClass('disabled');
		},
		UpdatePreSubmitSidebar : function() {
			var controller = this;
			$(".program-overview-img img").attr("src", controller.program.programImg);
			$(".programDesc").html(controller.program.programDesc);
		},
		AttachEventListeners: function () {
			var controller = this;
			$("input").on("keyup", function() { controller.DisableSaveButton() });
			$("select").on("change", function() { controller.DisableSaveButton() });
			$(".btn-preview").on("click", function() { controller.OnPressPreview() });
			$(".btn-save").on("click", function() { controller.OnPressSave() });
		},
		GeneratePreview: function (callback) {
			// Call GetFormData()
			// Call a new preview API method, passing the form data
			// Hand that JSON object to a mustache template and render the preview pane.
			// Call callback()
		},
		DisableSaveButton: function () {
			console.log("Disabling save button...", this);
			var controller = this;
			controller.saveEnabled = false;
			controller.UpdateButtons();
		},
		GetFormData: function () {
			// Grab all inputs by calling $("input,select") and move their values into a key/value object.
			// Returns all form data in an easy to POST format.
		},
		OnPressPreview: function () {
			console.log("Preview pressed!", this);
			// Call GeneratePreview()  When the callback returns:
			// Mark controller.saveEnabled = true;
			// Call UpdateButtons();
		},
		OnPressSave: function () {
			console.log("Save pressed!", this);
			// Call GetFormData()
			// Save that data to the server.
		},
		ShowUI: function() {
			$(".js-content").show();
			$(".js-loading").hide();
		}
	};
	return {
		controller: controller
	};
})(jQuery);

if (window.location.href.indexOf(marcomUserData.$constants.configPageUrl) > -1)
{
	$j(".js-content").hide();
	$j(".js-loading").show();
	programConfigController.controller.init();
}
