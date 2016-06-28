/** Program Management
 * @file programManagement.js
 * @requires getStoreProgramData.jssp
 * @example programManagementController.controller.init(user_id);
 * @return {object} controller
 */

var programManagementController = (function ($) {
	var controller = {
		apiPath: marcomUserData.$constants.apiPath,
		filePath: marcomUserData.$constants.marcomFilePath,
		user_configs: [],
		store_data: [],
		program: {},
		configUrl: marcomUserData.$constants.configPageUrl,
		adtlUrl: marcomUserData.$constants.additionalOfferPageUrl,
		user_id: marcomUserData.$user.externalId,
		program_id: getParameterByName('programId', window.location.href),
		start_time: null,
		init: function () {
			var controller = this;
			controller.start_time = Math.floor(Date.now() / 1000);
			controller.timeDebug("Starting PMC.  Getting user configs...");
			controller.retrieveUserConfigs(function (configs) {
				controller.timeDebug("Getting store program data...");
				controller.getStoreProgramData(function (store_data) {
					// Trigger a filter change, which will triger a UI refresh
					programManagementFilters.controller.onFilterChange(programManagementFilters.controller.store_ids);
					controller.timeDebug("PMC Init Complete.");
				});
			});
		},
		initBuiltUI: function () {
			controller.populateConfigDropdowns();
			controller.highlightNavSection();
			controller.highlightSelectedStoreConfiguration();
			controller.showQuantityLimitTabIfNeeded();
			controller.hideProgramSettingsIfNeeded();
			controller.attachEventListeners();
			controller.refreshManagementControls();
			controller.refreshProofControls();
			controller.refreshSelectAllButton();
			controller.refreshStoreRowEnrollment();
			controller.hideStandardOffersIfNeeded();
			controller.hideAdditionalOffersIfNeeded();
			controller.showDisclaimers();
			controller.ShowUI();
		},
		showDisclaimers: function () {
			var controller = this;
			var currentProgramName = controller.program.programName;
			if (currentProgramName === 'Reactivation') {
				/**
				 * Hard-code in the disclaimer container with text for now.
				 * @TODO this needs to be revisited, reworked to use dynamic content.
				 */
				$('.programSummary-disclaimer')
					.text('* Estimated cost is for your total population of Reactivation customers.' +
						' Your actual cost will likely be lower based on the maximum mail quantity you set for this touchpoint.');
				/** Reveal:
				 * 1. disclaimer container w/ injected text
				 * 2. asterisk(s) associated with this disclaimer
				 * 3. disclaimer to screen-readers
				 */
				$('.store-cost .disclaimer-asterisk, .programSummary-disclaimer')
					.attr('aria-hidden', 'false')
					.removeClass('none');
			}
		},
		highlightNavSection: function () {
			var controller = this;
			var target = (controller.program.isLifecycleCampaign) ? "LIFECYCLE PROGRAMS" : "SPECIALTY PROGRAMS";
			$("li.navBarItem a:contains('" + target + "')").addClass('navBarSelectedLinkColor').addClass('customColorOverridable').removeClass('navBarEnhancedLinkColor');
		},
		/** Gets a user config
		 * @async getUserConfigurations.jssp
		 * @callback json_results
		 */
		retrieveUserConfigs: function (callback) {
			var controller = this;
			if (!controller.program_id) {
				console.warn('No program Id found,');
				return;
			}
			$.get(controller.apiPath + 'getUserConfigurations.jssp?userId=' + encodeURIComponent(controller.user_id) + '&programId=' + encodeURIComponent(controller.program_id), function (results) {
				var json_results = JSON.parse(results);
				controller.user_configs = json_results;
				if (typeof callback == 'function') {
					callback(json_results);
				}
			});
		},
		/** Gets store program data
		 * @async getStoreProgramData.jssp
		 * @callback json_results
		 */
		getStoreProgramData: function (callback) {
			var controller = this;
			controller.timeDebug("Triggering getStoreProgramData API call..");
			$.get(controller.apiPath + 'getStoreProgramData.jssp?userId=' + encodeURIComponent(controller.user_id) + '&programId=' + controller.program_id, function (results) {
				controller.timeDebug("API call complete.");
				var json_results = JSON.parse(results);
				controller.store_data = json_results;
				controller.getProgramData(controller.program_id, function () {
					if (typeof callback == 'function') callback(json_results);
				});
			});
		},
		/** API call to getProgramParticipationStats.jssp
		 * @var {string} userId
		 * @return callback
		 */
		getProgramData: function (program_id, callback) {
			var controller = this;
			controller.timeDebug("Triggering getProgramData API call..");
			$.get(controller.apiPath + 'getProgramParticipationStats.jssp?userId=' + encodeURIComponent(controller.user_id), function (results) {
				controller.timeDebug("getProgramData API call complete!");
				var json_results = JSON.parse(results);
				//controller.refreshSelectAllButton();
				//controller.refreshStoreRowEnrollment();

				// Loop through the API result and find the program that matches program ID (DONE)
				$.each(json_results, function (i, result) {
					// Store the program data in controller.program
					if (result.id == program_id) {
						controller.program = result;
					}
				});

				controller.timeDebug("getProgramData firing callback...");
				// fire the callback (DONE)
				if (typeof callback == 'function') {
					callback(controller.program);
				}
			});
		},
		hideAdditionalOffersIfNeeded: function () {
			var controller = this;
			for (var i = 0; i < $programParticipationStats.length; i++) {
				if ($programParticipationStats[i].id == controller.program_id) {
					if ($programParticipationStats[i].programUsesAdtl == 0) {
						$('.additional-offer').hide();
					}
				}
			}
		},
		highlightSelectedStoreConfiguration: function () {
			/* Loop through all stores and select each store's active program */
			var controller = this;
			for (var idx = 0; idx < controller.store_data.length; idx++) {
				var store = controller.store_data[idx];
				$('.dropdown-' + store.storeId + '-program option[value="' + store.programConfigId + '"], .dropdown-' + store.storeId + '-adtl  option[value="' + store.adtlConfigId + '"]')
					.attr('selected', 'selected');
			}
		},
		hideStandardOffersIfNeeded: function () {
			var controller = this;
			for (var i = 0; i < $programParticipationStats.length; i++) {
				if ($programParticipationStats[i].id == controller.program_id) {
					if ($programParticipationStats[i].programUsesOffers == 0) {
						$('.standard-offer').hide();
					}
				}
			}
		},

		/* @TODO Use proper default management value!!! */

		refreshManagementControls: function () {
			var controller = this;
			$('.configPageUrl').attr('href', controller.configUrl);
			$('.additionalOfferPageUrl').attr('href', controller.adtlUrl);
			controller.setHashLinks();
			$('.management-dropdown').each(function () {
				var $selectedMgmg = $(this).find(':selected');
				var configId = $selectedMgmg.val();
				var $selectedMgmgText = $selectedMgmg.text();
				var $editLink = $(this).parent().next().find('.program-edit-link');
				var $deleteLink = $(this).parent().next().find('.program-delete-link');
				var $baseUrl = $editLink.attr('href');
				var defaultMgmg = false;
				var isEditable = false;
				$.each(controller.user_configs, function (i, config) {
					if (config.corpDefault == 1 && config.id == configId) {
						defaultMgmg = true;
						// This allows an Admin to edit default configs.
						if (config.editable) {
							isEditable = true;
						}
					}
				});

				// console.warn('controller.user_configs[0].corpDefault: ' + controller.user_configs[0].corpDefault);

				$deleteLink.off().on('click', function (e) {
					e.preventDefault();
					var selectedConfigId = $selectedMgmg.val();
					var isProgram = $selectedMgmg.parent().hasClass('program-dropdown');
					var targetClass = (isProgram) ? '.program-dropdown' : '.adtl-dropdown';
					var storeCount = 0;

					$.each($('.store-level-dropdown' + targetClass), function (i, e) {
						if ($(e).val() == selectedConfigId) storeCount++;
					});
					// console.log("Clicked delete on config " + $selectedMgmg.val() + ".  Stores using this config: " + storeCount);
					var message = (storeCount == 0) ? 'Are you sure you want to delete these settings?' : storeCount + ' store(s) are using these settings and will be adjusted to use default settings.' + ' Are you sure you want to delete these settings?';

					jConfirm(message, 'Please Confirm', function (r) {
						if (r) {
							controller.deleteSettings(selectedConfigId, function () {
								controller.hardUIRefresh();
								controller.buildUI(controller.store_data);
							});
						}
					});
				});

				/** Update the Edit/View links
				 * @ex: (prod)
				 * programManagementUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12300',
				 * additionalOfferPageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12302',
				 */
				$editLink.attr('href', $baseUrl + '&configId=' + configId + '&programId=' + controller.program_id);

				// Corporate Default configs are read-only - swap View and Edit links.
				if (defaultMgmg) {
					$editLink.text('View');
					$deleteLink.hide();
					// Show the Edit link to allow Admin users the ability to change default configs.
					if (isEditable) {
						$deleteLink.show();
						$editLink.text('Edit');
					}
				} else {
					// Show Delete link for everything else.
					$deleteLink.show();
					$editLink.text('Edit');
				}
			});
		},
		deleteSettings: function (selectedConfigId, callback) {
			$.get(controller.apiPath + 'deleteConfig.jssp?userId=' + encodeURIComponent(controller.user_id) + '&configId=' + encodeURIComponent(selectedConfigId), function (results) {}).error(function (data) {
				toastr.error('Failed to delete settings.');
			}).done(function (data) {
				console.warn('About to delete selectedConfig: ' + selectedConfigId);
				toastr.success('Settings deleted!');
				if (typeof callback == 'function') {
					$('option[value="' + selectedConfigId + '"]').remove();
					console.warn('removing selectedConfig: ' + selectedConfigId);
					callback();
				}
			});
		},
		buildUI: function (result, callback) {
			var controller = this;
			controller.templatesLoaded = 0;
			var allTemplateLoaded = function () {
				// console.log("Firing initBuildUI()");
				if ($('[data-enrolled="true"] .toggle-btn')) {
					$('[data-enrolled="true"] .toggle-btn').addClass('active').prop('checked', 'checked');
				}
				controller.setHashLinks();
				controller.initBuiltUI();
				controller.getTotals();
			};

			controller.getMustacheTemplate(
				'program-enrollment.mustache.html',
				'.program-enrollment-template',
				'.program-enrollment-section',
				result,
				function (template) {
					if (++controller.templatesLoaded == 4) {
						allTemplateLoaded()
					} else {
						// console.log("Loaded " + controller.templatesLoaded + " /4 templates");
					};
				});

			controller.getMustacheTemplate(
				'program-settings.mustache.html',
				'.program-settings-template',
				'.program-settings-section',
				result,
				function (template) {
					if (++controller.templatesLoaded == 4) {
						allTemplateLoaded()
					} else {
						// console.log("Loaded " + controller.templatesLoaded + " /4 templates");
					};
				});

			controller.getMustacheTemplate(
				'proof-settings-tab.mustache.html',
				'.proof-settings-tab-template',
				'.proof-settings-tab-section',
				result,
				function (template) {
					if (++controller.templatesLoaded == 4) {
						allTemplateLoaded()
					} else {
						// console.log("Loaded " + controller.templatesLoaded + " /4 templates");
					};
				});

			if ($('.quantity-limit-tab-section').length) {
				controller.getMustacheTemplate(
					'quantity-limit-tab.mustache.html',
					'.quantity-limit-tab-template',
					'.quantity-limit-tab-section',
					result,
					function (template) {
						if (++controller.templatesLoaded == 4) {
							allTemplateLoaded()
						} else {
							// console.log("Loaded " + controller.templatesLoaded + " /4 templates");
						};
					});
			}
		},

		getMustacheTemplate: function (filename, extraction_css_selector, target_css_selector, data, callback) {
			var controller = this;
			var template_key = filename.replace(".", "");

			var fillContent = function (template, data) {
				controller.timeDebug("Filling " + target_css_selector + ' with ' + data.length + ' data elements.')
				$(target_css_selector).html(Mustache.render(template, data));
				controller.timeDebug("Done filling " + target_css_selector + ' with ' + data.length + ' data elements.')
			}

			if (typeof controller[template_key] != 'undefined' && controller[template_key] != "") {
				// console.log("Loading cached version of " + template_key);
				fillContent(controller[template_key], data);
				callback(controller[template_key]);
			} else {

				$.get(controller.filePath + filename, function (templates) {
					controller[template_key] = $(templates).filter(extraction_css_selector).html();
					fillContent(controller[template_key], data);
					callback(controller[template_key]);
				});
			}

		},

		setHashLinks: function () {
			var currentProgramId = getParameterByName('programId', window.location.href);
			if ($('.js-create-program-hash').length) {
				$('.js-create-program-hash').each(function () {
					$(this).attr('href', $(this).attr('href') + '&programId=' + currentProgramId);
				});
			}
		},
		programSettingsHandler: function () {
			customCheckAndRadioBoxes.customCheckbox();
		},
		reloadCheckBoxes: function () {
			return customCheckAndRadioBoxes.customCheckbox();
		},
		getTotals: function (channel) {
			var controller = this;

			Array.prototype.sum = function (prop) {
				var total = 0;
				for (var i = 0, _len = this.length; i < _len; i++) {
					total += this[i][prop];
				}
				return total;
			};
			var channels = [{
				channel: 'costEstimateTotal'
			}, {
				channel: 'channelEmailTotal'
			}, {
				channel: 'channelDMTotal'
			}, {
				channel: 'channelSMSTotal'
			}];
			for (var i = 0; i < channels.length; i++) {
				(function (i) {
					this.output = function () {
						controller.returnTotals(this.channel);
					};
					this.output();
				}).call(channels[i], i);
			}
		},
		returnTotals: function (e) {
			var newSum = 0;
			var newCostSum = 0;
			/**
			 * Added correct currecy decimal places.
			 **/
			$('.costEstimateTotal').each(function () {
				var num = Number($(this).text());
				var n = num.toFixed(2);
				$(this).text(n);
			});
			/**
			 * Calculate the grand total for Email, DM and SMS from all stores enrolled.
			 **/
			var target = '.store-counts[data-enrolled="true"] .' + e + ':visible';
			// console.log("Rows matching target of " + target  + " is " + $(target).length);
			$(target).each(function () {
				if ($(this).parent().not(".dim-mid")) {
					var n = parseFloat($(this).text());
					n = (isNaN(n)) ? 0 : n;
					// console.log(e + " field contains " + n);
					newSum += n;
				}
			}).promise().done(function () {
				newSum = (isNaN(newSum)) ? "Not Available" : newSum;
				// console.log("Total for " + e + " is  " + newSum);
				$('.grand-total .' + e).text(newSum);
			});
			/**
			 * Calculate grand total for Estimated Monthly Cost.
			 * Adds currecy decimal places
			 **/
			$('.store-cost:visible').not('.dim-mid').each(function () {
				var $cost = $(this).find('.costEstimateTotal.js-format-currency');
				var n = parseFloat($($cost).text());

				n = (isNaN(n)) ? 0 : n;
				newCostSum += (isNaN(n)) ? 0 : n;
				// console.log("newCostSum is " + newCostSum);
			}).promise().done(function () {
				var grandTotal = (isNaN(newCostSum)) ? "Not Available" : newCostSum.toFixed(2);
				// console.log("grandTotal is " + grandTotal);
				$('.grand-total .costEstimateTotal').text(grandTotal);
			});
		},

		showSuccessToast: function () {},
		showFailToast: function () {},
		attachEventListeners: function () {
			// Attach events
			var controller = this;
			$('.view-program-summary').on('click', this.onClickProgramSummary);
			$('.store-level-dropdown').on('change', function () {
				var storeId = $(this).attr('data-storeid');
				var configId = $(this).val();
				controller.saveStoreSubscription([storeId], configId, function () {
					toastr.success('Setting changes saved!');
					controller.getStoreProgramData(function (store_data) {
						controller.highlightSelectedStoreConfiguration();
					});
				});
			});
			$('.bulk-apply-program, .bulk-apply-adtl').on('click', function (e) {
				e.preventDefault();
				var storeIds = [];
				$.each($('.vioc-checkbox.checked'), function (i, obj) {
					storeIds.push($(obj).attr('data-storeid'));
				});
				var configId = 0;
				if ($(this).hasClass('bulk-apply-program')) {
					configId = $('.program-dropdown.bulk-level-dropdown').val();
				}
				if ($(this).hasClass('bulk-apply-adtl')) {
					configId = $('.adtl-dropdown.bulk-level-dropdown').val();
				}
				controller.saveStoreSubscription([storeIds], configId, function () {
					toastr.success('Setting changes saved!');
					controller.getStoreProgramData(function (store_data) {
						controller.highlightSelectedStoreConfiguration();
					});
				});
			});

			$('.management-dropdown').on('change', function () {
				controller.refreshManagementControls();
			});

			// Proof Settings Handler
			// data-prooftype="emProofSettings", data-prooftype="dmProofSettings", data-prooftype="smsProofSettings
			$('.link-proof-single').on('change', function () {
				var storeId = $(this).attr('data-storeid');
				var proofType = $(this).attr('data-prooftype');
				var proofVal = $(this).val();

				// Update data-proofSelected to new proofVal
				$(this).attr('data-proofSelected', proofVal);

				controller.saveProofMeta([storeId], proofType, proofVal, function () {
					toastr.success('Proof settings saved!');
					controller.refreshProofControls();
				});
			});

			$('.link-proof-bulk').on('change', function (e) {
				e.preventDefault();
				// Make sure a store is selected (checked) firstly.
				if (!$('.proof-settings').hasClass('checked')) {
					toastr.warning('No stores are selected so changes were not saved.');
					return;
				}

				var storeIds = [];
				var bulkProofType = $(this).attr('data-prooftype');
				var bulkProofVal = $(this).val();

				// console.warn('bulkProofType: ' + bulkProofType);
				// console.warn('bulkProofVal: ' + bulkProofVal);

				// Build a list of selected stores
				// @TODO This is not working, not respecting .checked class.
				var selectedStores = [];
				$.each($('.proof-settings-tab-section .store-item').find('.proof-settings.checked'), function (i, obj) {
					selectedStores.push($(obj).attr('data-storeid'));
				});

				// Get all single dropdowns matching the bulk proof type selected
				// Loop through them
				$.each($('.link-proof-single[data-prooftype="' + bulkProofType + '"]'), function (i, obj) {
					// If the dropdown's store ID matches a selected store...
					if ($.inArray($(obj).attr('data-storeid'), selectedStores) > -1) {
						// Update their data-proofSelectedValue
						$(obj).attr('data-proofSelected', bulkProofVal);

						// Store their storeId in an array
						storeIds.push($(obj).attr('data-storeid'));
					}
				});

				//$('.proof-settings.select-all').click(this.selectMultipleProofSettings);

				// Send API Request
				controller.saveProofMeta([storeIds], bulkProofType, bulkProofVal, function () {
					toastr.success('Bulk Proof settings saved!');
					controller.refreshProofControls();
				});
			});

			// Quantity Limit Handlers
			$('.apply-quantity-limit').click(this.setSingleQuantityLimit);
			$('.bulk-apply-quantity-limit').click(this.setBulkQuantityLimit);

			$('.toggle-btn').off('click.vioc').on('click.vioc', function (e) {

				var $programId = getParameterByName('programId', window.location.href);
				var $userId = marcomUserData.$user.externalId || {};
				var $storeId = $(this).attr('data-storeid');

				if ($(this).attr('data-enrolled') == "true") {
					var $storeId = $(this).attr('data-storeid');
					$(this).attr('data-enrolled', "false");
					setStoreSubscription.makeRequest($userId, $storeId, $programId, 0);
				} else if ($(this).attr('data-enrolled') == "false") {
					var $storeId = $(this).attr('data-storeid');
					$(this).attr('data-enrolled', "true");
					setStoreSubscription.makeRequest($userId, $storeId, $programId, 1)
				}
				controller.refreshSelectAllButton();
				controller.refreshStoreRowEnrollment();
			});

			$('.enroll-all-stores').off('click.vioc').on('click.vioc', function (e) {
				e.preventDefault();
				e.stopPropagation();
				var storeIds = [];
				var $userId = marcomUserData.$user.externalId || {};
				var $programId = getParameterByName('programId', window.location.href);

				if (!$(this).hasClass('activate')) {
					$('.toggle-btn[data-enrolled="true"]:visible').each(function () {
						// console.log('all true ones block....');
						var $storeId = $(this).attr('data-storeid');
						$(this).attr('data-enrolled', "false");
						storeIds.push($storeId);
					});
					// console.log("Unsubscribing stores " + storeIds.join(","));
					setStoreSubscription.makeRequest($userId, storeIds.join(","), $programId, 0);
					$(this).addClass('activate');
				} else if ($(this).hasClass('activate')) {
					$('.toggle-btn[data-enrolled="false"]:visible').each(function () {
						var $storeId = $(this).attr('data-storeid');
						$(this).attr('data-enrolled', "true");
						storeIds.push($storeId);
					});
					// console.log("Subscribing stores " + storeIds.join(","));
					setStoreSubscription.makeRequest($userId, storeIds.join(","), $programId, 1);
					$(this).removeClass('activate');
				}
				controller.refreshSelectAllButton();
				controller.refreshStoreRowEnrollment();
			});

			$('.quantity-limit-input').on('blur', function (e) {
				$(this).val(parseFloat($(this).val()));
			});
		},
		onClickProgramSummary: function (e) {
			var input;
			jPrompt('Please specify an email address to deliver the report to:', '', 'Enter your email', function (r) {
				try {
					input = r;
					if (input != '' && typeof input != 'undefined' && input != false && input.length >= 5) {
						$.get(controller.apiPath + 'sendProgramSummaryCSV.jssp?userId=' + encodeURIComponent(controller.user_id) + '&email=' + encodeURIComponent(input), function (results) {
							toastr.success('Your request has been received and will deliver to ' + input + '.  The report may take several minutes to arrive.');
						}).error(function (data) {
							toastr.error('Error requesting summary report.');
						});
					} else {
						toastr.warning('Please enter a valid email address.');
					}
				} catch (r) {
					console.warn('The user left the input blank.');
				}
			});
		},
		selectMultipleProofSettings: function (e) {
			e.preventDefault();
		},
		setSingleQuantityLimit: function (e) {
			e.preventDefault();
			var storeId = $(this).attr('data-storeid');
			var quantityLimit = $('.quantity-limit-input[data-storeId="' + storeId + '"]').val();

			// Set value and quantityLimit var to zero if input is blank
			if (quantityLimit.length < 1) {
				quantityLimit = 0;
				$('.quantity-limit-input[data-storeId="' + storeId + '"]').val(0);
			}

			// Send API Request
			controller.saveQuantityMeta([storeId], quantityLimit, function () {
				toastr.success('Quantity changed to ' + quantityLimit);
			});
		},
		setBulkQuantityLimit: function (e) {
			e.preventDefault();
			var storeIds = [];
			var bulkQuantityLimit = $('.bulk-apply-quantity-limit-input').val();

			if (bulkQuantityLimit.length < 1) {
				bulkQuantityLimit = 0;
				$('.bulk-apply-quantity-limit-input').val(0);
			}

			// Collect storeIds from selected stores
			$.each($('.quantity-limit.vioc-checkbox.checked'), function (i, obj) {
				var sid = $(obj).attr('data-storeid');
				storeIds.push(sid);
				$(".quantity-limit-input[data-storeid='" + sid + "']").val(bulkQuantityLimit);
				console.warn('quantity_limit checked storeId: ' + $(obj));
			});

			// Send API Request
			controller.saveQuantityMeta([storeIds], bulkQuantityLimit, function () {
				toastr.success('All quantity limits were changed to ' + bulkQuantityLimit);
			});
		},
		saveStoreSubscription: function (selectedStores, configId, callback) {
			var controller = this;
			var stringStoreIds = selectedStores.join(',');
			$.get(controller.apiPath + 'setStoreConfig.jssp?userId=' + encodeURIComponent(controller.user_id) + '&configId=' + configId + '&programId=' + controller.program_id + '&storeIds=' + stringStoreIds, function (results) {
				var json_results = JSON.parse(results);
				controller.store_data = json_results;
				if (typeof callback == 'function') callback(json_results);
			});
		},
		onSelectAll: function () {},
		onToggleCheckbox: function () {},
		populateConfigDropdowns: function () {
			var controller = this;
			// Clear all .program-dropdown selects
			$('.program-dropdown, .adtl-dropdown').html('');
			// Loop through the config data
			for (var i = 0; i < controller.user_configs.length; i++) {
				var config = controller.user_configs[i];
				var target = (config.configType == 'program') ? '.program-dropdown' : '.adtl-dropdown';
				$(target)
					.append($('<option>')
						.val(config.id)
						.html(config.label));
			}
		},
		showQuantityLimitTabIfNeeded: function () {
			var controller = this;
			for (var i = 0; i < $programParticipationStats.length; i++) {
				if ($programParticipationStats[i].id == controller.program_id) {
					if ($programParticipationStats[i].showQuantityLimitTab == 1) {
						$('#programManagementTabs .optional-tab').css('visibility', 'visible');
					}
				}
			}
		},
		hideProgramSettingsIfNeeded: function () {
			var controller = this;
			for (var i = 0; i < $programParticipationStats.length; i++) {
				if ($programParticipationStats[i].id == controller.program_id) {
					if ($programParticipationStats[i].programUsesOffers == 0 && $programParticipationStats[i].programUsesAdtl == 0) {
						$('[aria-controls="hor_1_tab_item-1"], [aria-labelledby="hor_1_tab_item-1"]').hide();
						window.location.hash = '#parentHorizontalTab1';
					}
				}
			}
		},
		saveQuantityMeta: function (selectedStores, quantityLimit, callback) {
			/**
			 * @example API CALL https://adobe-uat-vioc.epsilon.com/jssp/vioc/setStoreMeta.jssp?userId=Zz0fUjXHHr66NXRFDs&storeIds=1,2,3&quantity_limit=1000
			 */
			var controller = this;
			var stringStoreIds = selectedStores.join(',');
			var quantityLimit;
			$.get(controller.apiPath + 'setStoreMeta.jssp?userId=' + encodeURIComponent(controller.user_id) + '&storeIds=' + stringStoreIds + '&quantity_limit=' + quantityLimit, function (results) {
				try {
					var json_results = JSON.parse(results);
					controller.store_data = json_results;
					if (typeof callback == 'function') callback(json_results);
				} catch (e) {
					toastr.error('Failed to parse JSON:' + e);
				}
			}).error(function (data) {
				toastr.error('Saving quantity limit failed.');
			});
		},
		refreshProofControls: function () {
			$('.link-proof-single').each(function () {
				var proofSelected = $(this).attr('data-proofSelected');
				$(this).val(proofSelected).attr('selected', 'selected');
			});
		},
		/** Save Proof Meta
		 * @example API CALL https://adobe-uat-vioc.epsilon.com/jssp/vioc/setProofPreferences?userId=foo&storeIds=1,2,3&programId=bah&em=1&dm=1&sms=1
		 */
		saveProofMeta: function (selectedStores, proofType, proofVal, callback) {
			var controller = this;
			var stringStoreIds = selectedStores.join(',');
			$.get(controller.apiPath + 'setProofPreferences.jssp?userId=' + encodeURIComponent(controller.user_id) + '&storeIds=' + stringStoreIds + '&programId=' + controller.program_id + '&' + proofType + '=' + proofVal, function (results) {
				try {
					var json_results = JSON.parse(results);
					controller.store_data = json_results;
					if (typeof callback == 'function') callback(json_results);
				} catch (e) {
					toastr.error('Failed to parse JSON:' + e);
				}
			}).error(function (data) {
				toastr.error('Something bad happened');
			});
		},
		refreshSelectAllButton: function () {
			// Get the count of the visible store checkboxes
			var visible_store_count = $('.program-enrollment-section .toggle-btn:visible').length;
			var enrolled_store_count = $('.program-enrollment-section [data-enrolled="true"].toggle-btn:visible').length;

			if (visible_store_count === enrolled_store_count) {
				$('.enroll-all-stores.btn').removeClass('activate').text('Unenroll All');
			} else {
				$('.enroll-all-stores.btn').addClass('activate').text('Enroll All');
			}
		},
		refreshStoreRowEnrollment: function () {
			/**
			 * @TODO REFACTOR FOR PERFORMANCE!!
			 */
			$('div.toggle-btn').each(function () {
				var enabled = $(this).attr('data-enrolled') == 'true';
				var storeId = $(this).attr('data-storeid');

				if (enabled) {
					$(this).addClass('active');
					$("tr.store-item[data-storeid=" + storeId + "]").each(function () {
						$(this).find(".store-item-dimable").removeClass('dim-mid').attr('data-enrolled', "true");
						$(this).find(".store-item-dimable input").removeClass('input-disabled').removeAttr("disabled");
						$(this).find(".store-item-dimable select").removeClass('input-disabled').removeAttr("disabled");
						$(this).find(".store-item-dimable .apply-quantity-limit").removeClass('disabled').removeAttr("disabled");
						$(this).find(".store-item-dimable .vioc-checkbox").removeClass('disabled');
						$(this).find(".store-item-dimable small.not-enrolled").addClass('none');
						$(this).find(".store-item-dimable .store-level-dropdown").removeClass('none');

					});
				} else {
					$(this).removeClass('active');
					$("tr.store-item[data-storeid=" + storeId + "]").each(function () {
						$(this).find(".store-item-dimable").addClass('dim-mid').attr('data-enrolled', "false");
						$(this).find(".store-item-dimable input").addClass('input-disabled').attr("disabled", true);
						$(this).find(".store-item-dimable select").addClass('input-disabled').attr("disabled", true);
						$(this).find(".store-item-dimable .apply-quantity-limit").addClass('disabled').attr("disabled", true);
						$(this).find(".store-item-dimable .vioc-checkbox").addClass('disabled');
						$(this).find(".store-item-dimable small.not-enrolled").addClass('none');
						$(this).find(".store-item-dimable .store-level-dropdown").removeClass('none');
					});
				}
			});
			controller.getTotals();
			controller.timeDebug("Finished refreshStoreRowEnrollment.")
		},

		hardUIRefresh: function () {
			var controller = this;
			controller.getStoreProgramData(function () {
				controller.retrieveUserConfigs(function () {
					var targetStores = [];
					var store_ids = programManagementFilters.controller.store_ids;

					$j.each(controller.store_data, function (idx, store) {
						if ($j.inArray(store.storeId.toString(), store_ids) > -1) {
							targetStores.push(store);
						}
					});
					controller.buildUI(targetStores);
				});
			});
		},

		ShowUI: function () {
			$('.js-content').show();
			$('.js-loading').hide();
		},
		timeDebug: function (message) {
			// console.warn("[TimeDebug] " + message + " : " + (Math.floor(Date.now() / 1000) - controller.start_time).toString() + " seconds");
		}
	};
	return {
		controller: controller
	};
})(jQuery);
