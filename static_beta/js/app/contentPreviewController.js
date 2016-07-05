var ContentPreviewController = (function ($) {
	var controller = {
		apiPath: marcomUserData.$constants.apiPath,
		userId: marcomUserData.$user.externalId,
		programId: getParameterByName('programId', window.location.href),
		marcomFilePath: marcomUserData.$constants.marcomFilePath,
		programData: null,
		storeIds: null,
		storeData: null,
		activeStoreData: null,
		activeStoreDataConfig: null,
		activeConfigId: 0,
		store: {},
		storeDropdown: $('.content-preview-store-dropdown'),
		initComplete: false,

		init: function (storeIds, storeData, program) {
			var controller = this;

			// Store the storeIds and storeData in controller variables
			controller.storeIds = storeIds;
			controller.storeData = storeData;
			controller.program = program;

			// Note: The Content Preview mustache template will fire .refresh() when it loads, kicking off the rendering.
		},
		start: function () {
			var controller = this;
			controller.initComplete = true;
			controller.updateStoreDropdown();
			controller.attachEventHandlers();
			controller.refresh();
		},
		attachEventHandlers: function () {
			var controller = this;

			// Whenever the store dropdown changes, call refresh();
			$('.content-preview-store-dropdown').on('change', function () {
				controller.refresh();
			});
		},
		/**
		 * [updateStoreDropdown When provided a list of store IDs, this will update the store dropdown and then call refresh()]
		 * @param  {[type]} storeIds [description]
		 * 1)  Empty the dropdown via $(dropdown).html();
		 * 2)  Loop through controller.store_ids
		 * 3)  While looping through store ids, loop through controller.storeData
		 * 4)  If a store data entry matches a store ID, pull out the name, build an <option> and inject it into $(dropdown)
		 */
		updateStoreDropdown: function () {
			var controller = this;
			var storeName;

			if (!controller.initComplete) {
				return 0;
			}

			// Empty the Store dropdown
			$('.content-preview-store-dropdown').html('');

			// Loop through controller.store_ids
			// If a store data entry matches a store ID, pull out the name, build an <option> and inject it into $(dropdown)
			var dropdownOptions = {};

			// Build a list of stores to display
			for (var i = 0; i < controller.storeIds.length; i++) {
				var storeId = controller.storeIds[i];
				for (var j = 0; j < controller.storeData.length; j++) {
					var storeData = controller.storeData[j];
					if (storeId == storeData.storeId) {
						// Get Store Name
						storeName = storeData.storeName;
						dropdownOptions[storeName] = storeData.storeId;
					}
				}
			}

			// Order the list
			var orderedDropdownOptions = {};

			Object.keys(dropdownOptions).sort().forEach(function (key) {
				orderedDropdownOptions[key] = dropdownOptions[key];
			});

			// Fill the dropdown with items
			for (var name in orderedDropdownOptions) {
				var option = $("<option>").attr("value", orderedDropdownOptions[name]).html(name);
				$('.content-preview-store-dropdown').append(option);
			}

			// Testing
			/* for (var i = 0; i < storeIds.length; i++) {
			  console.warn('storeIds: ', storeIds);
			  console.warn('storeData: ', controller.storeData);
			} */
		},
		refresh: function (configId, callback) {

			var controller = this;

			if (!controller.initComplete) {
				return 0;
			}

			// Get the selected store
			var activeStoreDataId = $('.content-preview-store-dropdown').find('option:selected').val();

			// Look through the store data and retrieve the store's config ID
			var configId = 0;

			for (var index in controller.storeData) {
				var store = controller.storeData[index];

				if (store.storeId == activeStoreDataId) {
					configId = store.programConfigId;
					controller.activeStoreData = store;
					controller.activeConfigId = configId;
				}
			}

			if (configId == 0) return false;

			// Load the config ID;
			$.get(controller.apiPath + 'loadConfig.jssp?userId=' + encodeURIComponent(controller.userId) + '&configId=' + configId, function (results) {

				var json_results = JSON.parse(results);
				controller.activeStoreDataConfig = json_results;

				controller.updateUI();
			});
		},
		/**
		 * [updateUI Responsible for updating the UI using data available within the controller.]
		 */
		updateUI: function () {
			var controller = this;
			console.warn('Running update UI using data:', controller.activeStoreDataConfig);
			/*
				updateUI should call helper functions designed to update the screen.
				They should only have to use data found in controller.activeStoreData or controller.activeStoreDataConfig;
			*/
			controller.updateStoreDetails();
			controller.updateGrid();
			programConfigController.controller.UpdateDiscountCodes();
			programConfigController.controller.ShowUI();
		},
		updateGrid: function () {
			var controller = this;

			// Reuse the existing programConfigController class to fill the grid.

			programConfigController.controller.program = controller.program;
			programConfigController.controller.config = controller.activeStoreDataConfig;
			programConfigController.controller.configLoaded = true;
			programConfigController.controller.programId = controller.programId;
			programConfigController.controller.configId = controller.activeConfigId;
			programConfigController.controller.UpdateDiscountCodes();
			programConfigController.controller.ShowUI();
		},
		/**
		 * [updateStoreDetails Updates the store location, phone, hours, features, and disclaimers using controller.store]
		 * @return {[type]} [store]
		 */
		updateStoreDetails: function () {
			var controller = this;
			var store = controller.activeStoreData;
			console.info('updateStoreDetails was called.');

			// Update address and phone data

			$(".company-address").html(store.storeAddressFull);
			$(".company-phone").html(store.storePhone);

			// Update hour data
			$.each(store.storeHours, function(i,e) {
				var day = i.toLowerCase();
				$("." + day + " .store-open").html(e.open);
				$("." + day + " .store-close").html(e.close);

				if (!e.closed)
				{
					$("."+day+" .open-hours").addClass("none");
					$("."+day+" .store-closed").removeClass("none");
				}
			});


			// Update store features
			$(".features").html('');

			$.each(store.storeFeatures, function(i,e) {

				var sample_feature = '<span class="feature">' +
					'<img class="feature-image" src="' + e.image + '" alt="Feature Image">' +
					'<span class="feature-caption">' +
					  '<small>' +  e.text + '</small>' +
					'</span>' +
				  '</span>';

				$(".features").append(sample_feature);
			});

			// Update store disclaimer

			$(".store-disclaimer").html(store.storeDisclaimer);

		}
	};
	return {
		controller: controller
	};
})(jQuery);
