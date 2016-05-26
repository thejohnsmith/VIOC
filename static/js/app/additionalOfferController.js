var additionalOfferController = (function ($) {

	var controller = {

		program: {},
		adtl_offers: [],
		config: {
			"content": {},
			"uiLayout": {},
			"preview": {}
		},
		configLoaded: false,
		saveEnabled: true,
		apiPath: marcomUserData.$constants.apiPath,
		userId: marcomUserData.$user.externalId,
		programId: getParameterByName('programId', window.location.href),
		configId: getParameterByName('configId', window.location.href),

		init: function (config) {
			var controller = this;
			controller.GetAdditionalOfferText(function (programId) {
				controller.GetProgramData(controller.programId, function (programId) {
					if (typeof controller.configId != "undefined") {
						controller.GetConfigData(controller.configId, function () {
							controller.UpdateUI()
						});
					} else {
						controller.UpdateUI();
					}

				});
			});
		},
		/** API call to getProgramParticipationStats.jssp
		 * @var {string} userId
		 * @return callback
		 */
		GetProgramData: function (programId, callback) {
			var controller = this;
			$.get(controller.apiPath + 'getProgramParticipationStats.jssp?userId=' + encodeURIComponent(controller.userId), function (results) {

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
		GetAdditionalOfferText: function (callback) {
			var controller = this;
			$.get(controller.apiPath + 'getAdtlProgramOptions.jssp', function (results) {

				var json_results = JSON.parse(results);
				controller.adtl_offers = json_results;

				if (typeof callback === 'function') {
					callback(json_results);
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
			controller.UpdateTitle();
			controller.UpdateBreadCrumbs();
			controller.ShowTabsAsAppropriate();
			controller.UpdateSettingName();
			controller.UpdateDiscountInfo();
			controller.UpdateOfferExpiration();
			controller.AttachEventListeners();
			controller.MinimizeUnusedCoupons();
			controller.UpdateSaveButton();
			controller.ShowUI();
		},
		UpdateTitle: function () {
			var controller = this;
			var title = (controller.configLoaded) ? "Edit " + controller.config.content.label : "Create Additional Offer";

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

			// Set navigation
			var target = (controller.program.isLifecycleCampaign) ? "LIFECYCLE PROGRAMS" : "SPECIALTY PROGRAMS";
			$("li.navBarItem a:contains('" + target + "')").addClass('navBarSelectedLinkColor').addClass('customColorOverridable').removeClass('navBarEnhancedLinkColor');
		},
		ShowTabsAsAppropriate: function () {
			var controller = this;
			var maxTabs = controller.program.maxAdtlOffers;
			if (maxTabs < 4) $(".adtl-offer-4").hide();
			if (maxTabs < 3) $(".adtl-offer-3").hide();
			if (maxTabs < 2) $(".adtl-offer-2").hide();
		},
		UpdateSettingName: function () {
			var controller = this;
			$(".settings-name").val(controller.config.content.label);
		},
		UpdateDiscountInfo: function () {
			var controller = this;
			// console.log(controller.config.content);
			for (var i = 1; i <= 4; i++) {
				// Update additional offer text dropdown
				$('[name=adtlText' + i + ']').html(''); // Clear old options
				$('[name=adtlText' + i + ']').prepend($("<option>").attr('value', 'none').html("Not Used"));
				for (var i2 = 0; i2 < controller.adtl_offers.length; i2++) {
					var item = controller.adtl_offers[i2];
					$('[name=adtlText' + i + ']').append($("<option>").attr('value', item.name).html(item.longText));
				}

				// And now everything else...
				$('[name=adtlCode' + i + ']').val(controller.config.content['adtlCode' + i]);
				$('[name=adtlText' + i + '] option[value="' + controller.config.content['adtlText' + i] + '"]').attr('selected', 'selected');
				$('[name=adtlApproach' + i + '] option[value="' + controller.config.content['adtlApproach' + i] + '"]').attr('selected', 'selected');
				$('[name=adtlValue' + i + ']').val(controller.config.content['adtlValue' + i]);
			}
		},
		UpdateOfferExpiration: function () {
			var controller = this;
			$('.expiration option[value="' + controller.config.content.expiration + '"]').attr('selected', 'selected');
		},
		AttachEventListeners: function () {
			var controller = this;
			$(".save-btn").on("click", function () {
				controller.OnPressSave()
			});
			$(".adtlText").on("change", function () {
				controller.MinimizeUnusedCoupons()
			});
		},
		MinimizeUnusedCoupons: function () {
			for (var i = 1; i <= 4; i++) {
				if ($('[name=adtlText' + i + ']').val() == "none") {
					$('[name=adtlText' + i + ']').closest("table").find("tr").hide(); // Hide all of my sibling rows (including myelf)
					$('[name=adtlText' + i + ']').closest("table").find("tr:first-child").show(); // Reshow myself, since I was hidden with the bulk of my siblings
				} else {
					$('[name=adtlText' + i + ']').closest("table").find("tr").show(); // Show me and all of my sibling rows
				}
			}

		},
		UpdateSaveButton: function () {
			var controller = this;
			if (controller.config.content.corpDefault == "1")
				$('.save-btn').val("Save as New");
		},
		GetFormData: function () {
			// Grab all inputs by calling $("input,select") and move their values into a key/value object.
			// Returns all form data in an easy to POST format.
		},
		ValidateForm: function (callback) {
			// TODO
			// Added alert prompt here for now. Can be moved to single function when validation rules are created.
			// Alert should always fire on save.
			jConfirm('Have you established this code in POS?', 'Please Confirm', function (r) {
				if (r) {

					if (controller.config.content.corpDefault == 0) {
						callback();
					} else {
						var new_label = ($('.settings-name').val() != controller.config.content.label) ? $('.settings-name').val() : ("Custom " + controller.config.content.label);

						jConfirm("This is a factory-defined setting and may not be changed.  Instead, the system will create a new setting named \"" + new_label + "\" which will contain your custom settings.  Proceed?", 'Create New Settings?', function (r) {
							if (r) {
								callback();
							}
						});
					}

				}
			});
		},
		OnPressSave: function () {
			var controller = this;

			// Make sure at least the first offer has been select.
			if ($('[name=adtlText1]').val() == "none") {
				jAlert('At least one offer is required.');
				console.warn('found first dropdown = none');
				return;
			}
			if ($('[name=adtlValue1]').val() == "none") {
				jAlert('Discount Amount is required.');
				console.warn('adtlValue = none');
				return;
			}
			if ($('[name=adtlCode1]').val() == "none") {
				jAlert('Additional code is required.');
				console.warn('adtlCode1 = none');
				return;
			}

			controller.ValidateForm(function () {
					saveData = {
						userId: controller.userId,
						configType: "adtl",
						programId: 0,
						label: $(".settings-name").val(),
						_expiration: $('.expiration').val()
					};

					for (var i = 1; i <= 4; i++) {
						// dropdown must has a selected offer
						if ($('.adtl-offer-1 [name=adtlText' + i + ']').val() != "none") {
							saveData["_adtlText" + i] = $('.adtl-offer-1 [name=adtlText' + i + ']').val();
							console.warn('adtlText: ' + $('.adtl-offer-1 [name=adtlText' + i + ']').val());

							saveData["_adtlApproach" + i] = $('.adtl-offer-1 .adtl-offer-1').val();
							console.warn('adtlApproach: ' + $('.adtl-offer-1 [name=adtlApproach' + i + ']').val());

							saveData["_adtlValue" + i] = $('.adtl-offer-1 .adtlValue').val();
							console.warn('adtlValue: ' + $('.adtl-offer-1 .adtlValue').val());

							saveData["_adtlCode" + i] = $('.adtl-offer-form-group-input:visible .adtlCode').val();
							console.warn('adtlCode: ' + $('.adtl-offer-form-group-input:visible .adtlCode').val());
						}
					}

					if (controller.configId > 0)
						saveData.configId = controller.configId;

					$.ajax({
						url: controller.apiPath + 'saveConfig.jssp',
						method: "GET",
						data: saveData,
						success: function (results) {
							console.log("Save was successful!");
							window.location.href = marcomUserData.$constants.programManagementUrl + "&programId=" + controller.programId + "&flashSuccessMsg=Additional%20Offer%20Saved!#parentHorizontalTab2";
						},
						dataType: "json"
					});

				})
				// console.log("Save pressed!", this);
		},
		ShowUI: function () {
			$(".js-content").show();
			$(".js-loading").hide();
		}
	};
	return {
		controller: controller
	};
})(jQuery);

if (window.location.href.indexOf(marcomUserData.$constants.additionalOfferPageUrl) > -1) {
	jQuery(".js-content").hide();
	jQuery(".js-loading").show();
	additionalOfferController.controller.init();
}
