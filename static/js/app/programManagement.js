/** Program Management
 * @file programManagement.js
 * @requires getStoreProgramData.jssp
 * @NOTE ** In order for this script to run it needs to have markup from program-settings.mustache.html
 * @todo Add overview in this documentation.
 * @example programManagementController.controller.init(user_id);
 * @return {object} controller
 */
var programManagementController = (function ($) {
	var controller = {
		apiPath: marcomUserData.$constants.apiPath,
		user_configs: [],
		store_data: [],
		program: {},
		user_id: marcomUserData.$user.externalId,
		program_id: getParameterByName('programId', window.location.href),
		init: function () {
			var controller = this;
			/* If this program doesn't use Additional Offers (aka Adtl), hide
			the Additional Offer column and management controls */
			controller.retrieveUserConfigs(function (configs) {
				/* Populate the dropdowns with all possible values */
				controller.populateConfigDropdowns();
				/* Retrieve the store program data */
				controller.getStoreProgramData(function (store_data) {
					/* Now that the dropdowns are populated with all possible choices,
             determine which one should be selected for each store. */
					controller.highlightSelectedStoreConfiguration();
					/* Listen for dropdown changes and other events */
					controller.attachEventListeners();
					/* Refresh the bottom section of the page */
					controller.refreshManagementControls();
					controller.refreshProofControls();
				});
			});
		},
		/** Gets a user config
		 * @async getUserConfigurations.jssp
		 * @callback json_results
		 */
		retrieveUserConfigs: function (callback) {
			var controller = this;
			$.get(controller.apiPath + 'getUserConfigurations.jssp?userId=' + controller.user_id + '&programId=' + controller.program_id, function (results) {
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
			$.get(controller.apiPath + 'getStoreProgramData.jssp?userId=' + controller.user_id + '&programId=' + controller.program_id, function (results) {
				var json_results = JSON.parse(results);
				controller.store_data = json_results;
				if (typeof callback == 'function') callback(json_results);
			}).promise().done(function () {
				controller.getProgramData();

			});
		},
		/** API call to getProgramParticipationStats.jssp
		 * @var {string} userId
		 * @return callback
		 */
		getProgramData: function (program_id, callback) {
			var controller = this;
			$.get(controller.apiPath + 'getProgramParticipationStats.jssp?userId=' + controller.user_id, function (results) {
				var json_results = JSON.parse(results);
				controller.hideAdditionalOffersIfNeeded();
				controller.showQuantityLimitTabIfNeeded();
				controller.hideStandardOffersIfNeeded();

				// Loop through the API result and find the program that matches program ID (DONE)
				$.each(json_results, function (i, result) {
					// Store the program data in controller.program
					if (result.id == program_id) {
						controller.program = result;
					}
				});

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
		refreshManagementControls: function () {
			var controller = this;
			$('.management-dropdown').each(function () {
				var $selectedMgmg = $(this).find(':selected');
				var configId = $selectedMgmg.val();
				var $selectedMgmgText = $selectedMgmg.text();
				var $editLink = $(this).parent().next().find('.program-edit-link');
				var $deleteLink = $(this).parent().next().find('.program-delete-link');
				var $baseUrl = $editLink.attr('data-baseUrl');
				var defaultMgmg = /Default/.test($selectedMgmgText);

				$deleteLink.off().on('click', function () {
					var selectedConfigId = $selectedMgmg.val();
					var isProgram = $selectedMgmg.parent().hasClass('program-dropdown');
					var targetClass = (isProgram) ? '.program-dropdown' : '.adtl-dropdown';
					var storeCount = 0;
					$.each($('.store-level-dropdown' + targetClass), function (i, e) {
						if ($(e).val() == selectedConfigId) storeCount++;
					});

					// console.log("Clicked delete on config " + $selectedMgmg.val() + ".  Stores using this config: " + storeCount);

					if (confirm('Are you sure you want to delete these settings?')) {
						// Do AJAX
						$.get(controller.apiPath + 'deleteConfig.jssp?userId=' + controller.user_id + '&configId=' + selectedConfigId, function (results) {
							try {
								var json_results = JSON.parse(results);
								controller.store_data = json_results;
								if (typeof callback == 'function') callback(json_results);
							} catch (e) {
								toastr.error('Failed to parse JSON:' + e);
							}
						}).error(function (data) {
							toastr.error('Failed to delete settings.');
						});
					}
					/**
						If 0 stores, just prompt "Are you sure you want to delete these settings?"
						If 1+ stores, prompt "<x> store(s) are using these settings and will be adjusted to use corporate defaults.
						Are you sure you want to delete these settings?".
						Once deletion is confirmed, call /deleteConfig.jssp?userId=Zz0fUjXHHr66NXRFDs&configId=<x>
					*/

				});

				// Update the Edit/View links
				$editLink.attr('href', $baseUrl + '&configId=' + configId + '&programId=' + controller.program_id);

				// Corporate Default configs are read-only - swap View and Edit links.
				if (defaultMgmg) {
					//$deleteLink.addClass('hidden');
					$editLink.text('View');
				} else {
					// Show Delete link
					$deleteLink.removeClass('hidden');
					$editLink.text('Edit');
				}
			});
		},
		showSuccessToast: function () {},
		showFailToast: function () {},
		attachEventListeners: function () {
			// Attach events
			var controller = this;

			$('.program-delete-link').on('click', function (e) {
				e.preventDefault;
				console.warn('program-delete-link clicked');
				// get target config ID from selected dropdown.
				// Get number of programs using target config ID.
				// Show modal window
			});

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
				$.each($('.customCheckbox.checked'), function (i, obj) {
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
					if ($(obj).attr('data-storeid'), selectedStores) {
						// Update their data-proofSelectedValue
						$(obj).attr('data-proofSelected', bulkProofVal);

						// Store their storeId in an array
						storeIds.push($(obj).attr('data-storeid'));
					}
				});

				$('.proof-settings.select-all').click(this.selectMultipleProofSettings);

				// Send API Request
				controller.saveProofMeta([storeIds], bulkProofType, bulkProofVal, function () {
					toastr.success('Bulk Proof settings saved!');
					controller.refreshProofControls();
				});
			});

			// Quantity Limit Handlers
			$('.apply-quantity-limit').click(this.setSingleQuantityLimit);
			$('.bulk-apply-quantity-limit').click(this.setBulkQuantityLimit);

		},
		selectMultipleProofSettings(e) {
			e.preventDefault();
		},
		setSingleQuantityLimit(e) {
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
		setBulkQuantityLimit(e) {
			e.preventDefault();
			var storeIds = [];
			var bulkQuantityLimit = $('.bulk-apply-quantity-limit-input').val();

			// Collect storeIds from selected stores
			$.each($('.quantity-limit.customCheckbox.checked'), function (i, obj) {
				storeIds.push($(obj).attr('data-storeid'));
			});

			if (bulkQuantityLimit.length < 1) {
				bulkQuantityLimit = 0;
				$('.bulk-apply-quantity-limit-input').val(0);
			}

			// Send API Request
			controller.saveQuantityMeta([storeIds], bulkQuantityLimit, function () {
				toastr.success('All quantity limits were changed to ' + bulkQuantityLimit);
			});
		},
		saveStoreSubscription(selectedStores, configId, callback) {
			var controller = this;
			var stringStoreIds = selectedStores.join(',');
			$.get(controller.apiPath + 'setStoreConfig.jssp?userId=' + controller.user_id + '&configId=' + configId + '&programId=' + controller.program_id + '&storeIds=' + stringStoreIds, function (results) {
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
		saveQuantityMeta(selectedStores, quantityLimit, callback) {
			/**
			 * @example API CALL https://adobe-uat-vioc.epsilon.com/jssp/vioc/setStoreMeta.jssp?userId=Zz0fUjXHHr66NXRFDs&storeIds=1,2,3&quantity_limit=1000
			 */
			var controller = this;
			var stringStoreIds = selectedStores.join(',');
			var quantityLimit;
			$.get(controller.apiPath + 'setStoreMeta.jssp?userId=' + controller.user_id + '&storeIds=' + stringStoreIds + '&quantity_limit=' + quantityLimit, function (results) {
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
		refreshProofControls() {
			$('.link-proof-single').each(function () {
				var proofSelected = $(this).attr('data-proofSelected');
				$(this).val(proofSelected).attr('selected', 'selected');
			});
		},
		saveProofMeta(selectedStores, proofType, proofVal, callback) {
			/**
			 * @example API CALL https://adobe-uat-vioc.epsilon.com/jssp/vioc/setStoreMeta.jssp?userId=Zz0fUjXHHr66NXRFDs&storeIds=1,2,3&proofSettings=1
			 */
			var controller = this;
			var stringStoreIds = selectedStores.join(',');
			$.get(controller.apiPath + 'setStoreMeta.jssp?userId=' + controller.user_id + '&storeIds=' + stringStoreIds + '&' + proofType + '=' + proofVal, function (results) {
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
		}
	};
	return {
		controller: controller
	};
})(jQuery);
