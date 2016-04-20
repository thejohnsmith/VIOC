var programConfigController = (function ($) {

	var controller = {

		program: {},
		marcomFilePath: marcomUserData.$constants.marcomFilePath,
		config: {
			"content": {},
			"uiLayout": {},
			"preview": {}
		},
		configLoaded: false,
		apiPath: marcomUserData.$constants.apiPath,
		userId: marcomUserData.$user.externalId,
		programId: getParameterByName('programId', window.location.href),
		configId: getParameterByName('configId', window.location.href),

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
			$.get(controller.apiPath + 'getProgramParticipationStats.jssp?userId=' + encodeURIComponent(controller.userId), function (results) {
				// NOTE: We may need to parse results.
				var json_results = JSON.parse(results);

				// Loop through the API result and find the program that matches program ID (DONE)
				$.each(json_results, function (i, result) {
					// Store the program data in controller.program
					if (result.id == programId) {
						controller.program = result;
					}
					if (!controller.program.programUsesOffers) {
						console.warn('does not use offers');
						$('.standard-offer').hide();
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
		 * Call https://adobe-uat-vioc.epsilon.com/jssp/vioc/loadConfig.jssp?userId=Zz0fUjXHHr66NXRFDs&configId=10
		 * Stick the data into controller.config
		 * Fire the callback
		 */
		GetConfigData: function (configId, callback) {
			var controller = this;

			$.get(controller.apiPath + 'loadConfig.jssp?userId=' + encodeURIComponent(controller.userId) + '&configId=' + controller.configId, function (results) {

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
			controller.UpdatePreSubmitSidebar();
			controller.AttachEventListeners();
			controller.GeneratePreview();
			controller.ShowUI();
		},
		ShowPreSubmitIfNeeded: function () {
			var controller = this;
			$('.pre-submit').toggle(!controller.configLoaded);
			$('.post-submit').toggle(controller.configLoaded);
		},
		UpdateTitle: function () {
			var controller = this;
			var title = (controller.configLoaded) ? 'Edit ' + controller.config.content.label : ('Create ' + controller.program.programName + ' Settings');

			// Set title
			$('h1.page-title').html(title);

			// Set 4th Level Breadcrumb
			$('.breadcrumbs_current').html(title);
		},
		UpdateBreadCrumbs: function () {
			var controller = this;

			// Set 2nd Level Breadcrumb
			$('.breadcrumbs_previous:first a').html((controller.program.isSpecialtyProgram) ? 'Specialty Programs' : 'Lifecycle Programs');
			$('.breadcrumbs_previous:first a').attr('href', (controller.program.isSpecialtyProgram) ? marcomUserData.$constants.specialtyPageUrl : marcomUserData.$constants.lifecyclePageUrl);

			// Set 3rd Level Breadcrumb
			$('.breadcrumbs_previous:last a').html(controller.program.programName + ' Program');
			$('.breadcrumbs_previous:last a').attr('href', marcomUserData.$constants.programManagementUrl + '&programId=' + controller.programId);

			// Set navigation
			var target = (controller.program.isLifecycleCampaign) ? "LIFECYCLE PROGRAMS" : "SPECIALTY PROGRAMS";
			$("li.navBarItem a:contains('" + target + "')").addClass('navBarSelectedLinkColor').addClass('customColorOverridable').removeClass('navBarEnhancedLinkColor');
		},
		UpdateSettingName: function () {
			$('.settings-name').val(controller.config.content.label);
		},
		UpdateCreativeDropdowns: function () {
			var controller = this;
			console.log('Config: %o', controller.config);
			console.log('Program: %o', controller.program);

			// Pull the list of email creative from controller.program.uiLayout.emailCreativeChoices and populate .em-creative
			console.log('Options: %o', controller.program.uiLayout.emailCreativeChoices);
			for (var value in controller.program.uiLayout.emailCreativeChoices) {
				$('.em-creative')
					.append($('<option>', {
							value: value
						})
						.text(controller.program.uiLayout.emailCreativeChoices[value]));
			}

			// Pull the list of DM creative from controller.program.uiLayout.dmCreativeChoices and populate .dm-creative
			for (var value in controller.program.uiLayout.dmCreativeChoices) {
				$('.dm-creative')
					.append($('<option>', {
							value: value
						})
						.text(controller.program.uiLayout.dmCreativeChoices[value]));
			}

			// Hide or show .em-creative-row based on controller.program.uiLayout.hasEmail
			if (controller.program.hasEmail == 0) $('.em-creative-row').hide();

			// Hide or show .dm-creative-row based on controller.program.uiLayout.hasDM
			if (controller.program.hasDM == 0) $('.dm-creative-row').hide();

			// Select the email creative value that matches config.content.emailCreativeName
			$('.em-creative option[value="' + controller.config.content.emailCreativeName + '"]').attr('selected', 'selected');

			// Select the DM creative value that matches config.content.dmCreativeName
			$('.dm-creative option[value="' + controller.config.content.dmCreativeName + '"]').attr('selected', 'selected');
		},
		UpdateDiscountCodes: function () {
			var controller = this;
			if (!controller.program.uiLayout.usesHighRisk) {
				$('.high-risk:not(.standard-risk)').hide();
				$('.standard-risk.high-risk').css({'opacity': 0});
				// $('.discount-code-table td.touchpoint-col.high-risk').show().addClass('hidden');
				console.warn($('.touchpoint-col.high-risk'));
				$.each($(".result-label"),function(i,e) {
					$(e).html($(e).html().replace('- Standard',''));
				});
			}
			if (!controller.program.uiLayout.usesOffer2) {
				$('.offer-2').hide();
			}

			var firstActiveTab = null;

			for (var i = 1; i <= 3; i++) {
				var touchpointIsUsed = false;

				if (controller.program.uiLayout['usesEmail' + i] != true) {
					$('.touchpoint-' + i + '.email,.touchpoint-' + i + '.results-table .email').hide();
				} else { touchpointIsUsed = true }

				if (controller.program.uiLayout['usesDM' + i] != true) {
					$('.touchpoint-' + i + '.dm,.touchpoint-' + i + '.results-table .dm').hide();
				} else { touchpointIsUsed = true }

				if (controller.program.uiLayout['usesSMS' + i] != true) {
					$('.touchpoint-' + i + '.sms,.touchpoint-' + i + '.results-table .sms').hide();
				} else { touchpointIsUsed = true }

				if (!touchpointIsUsed)
				{
					$('.touchpoint-' + i).hide();
				}
				else
				{
					if (firstActiveTab == null)
						firstActiveTab = i;
				}
			}

			$('.touchpoint-' + firstActiveTab + '.resp-tab-item').addClass('resp-tab-active');
			$('.touchpoint-' + firstActiveTab + '.resp-tab-content').addClass('resp-tab-content-active');

			if (!controller.program.programUsesAdtl) {
				$('.results-section .additional-offer').hide();
			}

			$.each($('.touchpoint-value'), function (i, e) {
				var value = controller.config.content[$(e).attr('name').replace('sms','ph')];
				$(e).val(value);

				if (value != '' && typeof value != 'undefined') {
					$(e).val(value).addClass('input-success');
				}
			});

			for (var i = 0; i < controller.program.programMeta.touchpoints.length; i++) {
				var meta = controller.program.programMeta.touchpoints[i];
				var channelCode = '';
				if (meta.channel == 'Email') {
					channelCode = 'email';
				}
				if (meta.channel == 'Direct Mail') {
					channelCode = 'dm';
				}
				if (meta.channel == 'SMS') {
					channelCode = 'sms';
				}
				$('.touchpoint-' + meta.touchpoint + '.' + channelCode + '.preview-img').attr('src', meta.previewThumbnail);
				$('.touchpoint-' + meta.touchpoint + '.' + channelCode + '.timing').html(meta.timing);
				$('.touchpoint-' + meta.touchpoint + '.' + channelCode + '.preview').attr('href', meta.previewUrl);
			}

			for (var tp = 1; tp <= 3; tp++)
			{
				if (typeof controller.config.preview['touchpoint'+tp] != 'undefined')
				{
					var data = controller.config.preview['touchpoint'+tp].data;
					for (var cssSelector in data)
					{
						$(cssSelector).html(data[cssSelector] + "&nbsp;");
					}
				}
			}

		},
		UpdateOfferExpiration: function () {
			var controller = this;
			$('.offer-exp option[value="' + controller.config.content.expiration + '"]').attr('selected', 'selected');
		},
		UpdatePreSubmitSidebar: function () {
			var controller = this;
			$('.program-overview-img img').attr('src', controller.program.programImg);
			$('.programDesc').html(controller.program.programDesc);
		},
		AttachEventListeners: function () {
			var controller = this;
			$('input.touchpoint-value').on('blur', function () {
				$(this).val($(this).val().toUpperCase());
				controller.ValidateDiscountCode(this);
			});
			$('.btn-save').on('click', function (e) {
				controller.OnPressSave(e);
			});
		},
		GeneratePreview: function (callback) {
			var controller = this;
			controller.UpdateDiscountCodes();
		},
		ValidateDiscountCode: function (input) {
			console.log('Validating %o', input);
			var discountCode = $(input).val();
			var discountCodeName = $(input).attr('name').replace('sms','ph');

			if (discountCode == '')
			{
				$(input).removeClass('input-success');
				$(input).addClass('input-error');
			};

			$.get(controller.apiPath + 'validateDiscountCode.jssp?userId=' + encodeURIComponent(controller.userId) + '&code=' + discountCode + "&codeName=" + discountCodeName, function (results) {
				console.log('validateDiscountCode.jssp returned: ' + results + ' (' + typeof results + ')');
				$('.pre-submit').hide();
				$('.post-submit').show();
				var json_results = JSON.parse(results);
				if (json_results.valid && !json_results.damaged) {
					$(input).removeClass('input-error');
					$(input).addClass('input-success');
				} else {
					$(input).removeClass('input-success');
					$(input).addClass('input-error');

					var msg = (json_results.valid)
						? 'The discount code "' + discountCode + '" is valid in POS, however, it is not a valid discount code for Lifecycle Programs. Please contact Derick Brumbaugh (dnbrumbaugh@ashland.com / 859-357-7268) for assistance.'
						: 'The discount code "' + discountCode + '" does not exist.  Please contact Derick Brumbaugh (dnbrumbaugh@ashland.com / 859-357-7268) for assistance.';
					toastr.error(msg);
				}
				for (var cssSelector in json_results.preview)
				{
					$(cssSelector).html(json_results.preview[cssSelector] + "&nbsp;");
				}
			});
		},
		GetFormData: function () {
			// Grab all inputs by calling $("input,select") and move their values into a key/value object.
			// Returns all form data in an easy to POST format.
		},
		CheckVisibleDiscountCodeValidity: function () {
			return ($('.touchpoint-value.input-success').filter(':visible').length == $('.touchpoint-value').filter(':visible').length);
		},
		OnPressSave: function (e) {
			e.preventDefault();
			var controller = this;
			if (!controller.CheckVisibleDiscountCodeValidity()) {
				toastr.error('One or more discount codes are not valid.  Please correct and resubmit.');
				return;
			}
			if ($('.settings-name').val() == '') {
				toastr.error('Please specify a name for your settings.');
				return;
			}
			var saveData = {
				'userId': controller.userId,
				'configType': 'program',
				'programId': controller.programId,
				'emCreativeName': $('.em-creative').val(),
				'dmCreativeName': $('.dm-creative').val(),
				'label': $('.settings-name').val(),
				'_expiration': $('.offer-exp').val()
			};

			$.each($('.touchpoint-value').filter(':visible'), function (i, obj) {
				saveData['_' + $(obj).attr('name').replace('sms','ph')] = $(obj).val();
			});

			if (typeof controller.configId != "undefined" && controller.configId > 0)
				saveData['configId'] = controller.configId;

			// Save that data to the server.
			$.ajax({
				url: controller.apiPath + 'saveConfig.jssp',
				method: 'GET',
				data: saveData,
				success: function (results) {
					console.log('Save was successful!');
					window.location.href = marcomUserData.$constants.programManagementUrl + '&programId=' + controller.programId + '&flashSuccessMsg=Settings%20Saved!#parentHorizontalTab2';
				},
				dataType: 'json'
			});
		},
		ShowUI: function () {
			$('.js-content').show();
			$('.js-loading').hide();
		}
	};
	return {
		controller: controller
	};
})(jQuery);

if (window.location.href.indexOf(marcomUserData.$constants.configPageUrl) > -1) {
	var $j = jQuery;
	$j('.js-content').hide();
	$j('.js-loading').show();
	programConfigController.controller.init();
}
