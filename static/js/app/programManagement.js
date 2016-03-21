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
		api_path: 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/',
		user_configs: [],
		store_data: [],
		user_id: marcomUserData.$user.externalId,
		program_id: getParameterByName('programId', window.location.href),
		init: function () {
			var controller = this;
			if (!(controller.user_id > 0)) {
				console.log('Valid user ID not provided to controller.');
			}
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
				});
			});
		},
		/** Gets a user config
		 * @async getUserConfigurations.jssp
		 * @callback json_results
		 */
		retrieveUserConfigs: function (callback) {
			var controller = this;
			$.get(controller.api_path + 'getUserConfigurations.jssp?userId=' + controller.user_id + '&programId=' + controller.program_id, function (results) {
				var json_results = JSON.parse(results);
				controller.user_configs = json_results;
				if (typeof callback === 'function') {
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
			$.get(controller.api_path + 'getStoreProgramData.jssp?userId=' + controller.user_id + '&programId=' + controller.program_id, function (results) {
				var json_results = JSON.parse(results);
				controller.store_data = json_results;
				if (typeof callback === 'function') callback(json_results);
			}).promise().done(function () {
				controller.hideAdditionalOffersIfNeeded();
			});
		},
		hideAdditionalOffersIfNeeded: function () {
			var controller = this;
			for (var i = 0; i < $programParticipationStats.length; i++) {
				if ($programParticipationStats[i].id === controller.program_id) {
					if ($programParticipationStats[i].programUsesAdtl === 0) {
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
		refreshManagementControls: function () {
			$('.management-dropdown').each(function () {
				var $selectedMgmg = $(this).find(':selected');
				var configId = $selectedMgmg.val();
				var $selectedMgmgText = $selectedMgmg.text();
				var $newProgramConfigLink = $(this).parent().next().find('.btn.btn-link');
				var $baseUrl = $newProgramConfigLink.attr('data-baseUrl');
				// Update the Edit/View links
				$newProgramConfigLink.attr('href', $baseUrl + '&configId=' + configId + '&programId=' + controller.program_id);
				// Corporate Default configs are read-only.
				if ($selectedMgmgText === 'Corporate Default') {
					return $newProgramConfigLink.text('View');
				} else {
					return $newProgramConfigLink.text('Edit');
				}
			});
		},
		showSuccessToast: function () {},
		showFailToast: function () {},
		attachEventListeners: function () {
			// Attach events
			var controller = this;
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
		},
		saveStoreSubscription (selectedStores, configId, callback) {
			var controller = this;
			var stringStoreIds = selectedStores.join(',');
			$.get(controller.api_path + 'setStoreConfig.jssp?userId=' + controller.user_id + '&configId=' + configId + '&programId=' + controller.program_id + '&storeIds=' + stringStoreIds, function (results) {
				var json_results = JSON.parse(results);
				controller.store_data = json_results;
				if (typeof callback === 'function') callback(json_results);
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
				var target = (config.configType === 'program') ? '.program-dropdown' : '.adtl-dropdown';
				$(target)
					.append($('<option>')
						.val(config.id)
						.html(config.label));
			}
		}
	};
	return {
		controller: controller
	};
})(jQuery);
