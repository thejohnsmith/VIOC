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
		activeStoreDataAdtlConfig: null,
		activeStoreMeta: null,
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

		},
		refresh: function (configId, callback) {

			var controller = this;

			if (!controller.initComplete) {
				return 0;
			}

			controller.hideUI();

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
			if (configId == 0)
			{
				controller.showUI();
				return false;
			}

			// Load the config ID;
			$.get(controller.apiPath + 'loadConfig.jssp?userId=' + encodeURIComponent(controller.userId) + '&configId=' + configId, function (results) {
				var json_results = DoNotParseData(results);
				controller.activeStoreDataConfig = json_results;

				var storeNumber = controller.activeStoreData.storeNumber;
				var programId = controller.programId;

				$.get(controller.apiPath + 'getContentPreviewMeta.jssp?storeNumber=' + encodeURIComponent(storeNumber) + '&programId=' + programId, function (results) {
					var json_results = DoNotParseData(results);
					controller.activeStoreMeta = json_results;
					controller.updateUI();
				});

			});
		},
		/**
		 * [updateUI Responsible for updating the UI using data available within the controller.]
		 */
		updateUI: function () {
			var controller = this;
			controller.updateStoreDetails();
			controller.updateGrid();
			controller.showAdditionalGridData();
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
		getPreviewPDFUrl: function(programId, channel, creativeTemplate, touchpoint) {

			creativeTemplate = creativeTemplate.replace(" ","");

			var matching_map =  null;

			var mapping = [
				{ "programId" : 1, "channel": "email", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_Reminder_Basic_Blue_EM.pdf"},
				{ "programId" : 1, "channel": "email", "creative": "BasicBlue", "touchpoint": 2, "file": "VIOC_Reminder_Basic_Blue_EM.pdf"},
				{ "programId" : 1, "channel": "email", "creative": "BasicBlue", "touchpoint": 3, "file": "VIOC_Reminder_Basic_Blue_EM.pdf"},
				{ "programId" : 1, "channel": "dm", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_DM_Reminder_Basic_Blue.pdf"},
				{ "programId" : 1, "channel": "dm", "creative": "BasicBlueMap", "touchpoint": 1, "file": "VIOC_DM_Reminder_Basic_Blue_Map.pdf"},
				{ "programId" : 1, "channel": "dm", "creative": "Generic", "touchpoint": 1, "file": "VIOC_DM_Reminder_Generic.pdf"},
				{ "programId" : 1, "channel": "dm", "creative": "Mural", "touchpoint": 1, "file": "VIOC_DM_Reminder_Mural.pdf"},
				{ "programId" : 1, "channel": "dm", "creative": "Stopwatch", "touchpoint": 1, "file": "VIOC_DM_Reminder_Stopwatch.pdf"},
				{ "programId" : 1, "channel": "dm", "creative": "WindowSticker", "touchpoint": 1, "file": "VIOC_DM_Reminder_Window_Sticker.pdf"},
				{ "programId" : 1, "channel": "sms", "creative": "Standard", "touchpoint": 1, "file": "SMS_Reminder.pdf"},

				{ "programId" : 2, "channel": "email", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_Lapsed_Basic_Blue_EM.pdf"},
				{ "programId" : 2, "channel": "email", "creative": "BasicBlue", "touchpoint": 2, "file": "VIOC_Lapsed_Basic_Blue_EM.pdf"},
				{ "programId" : 2, "channel": "dm", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_DM_Lapsed_Basic_Blue.pdf"},
				{ "programId" : 2, "channel": "dm", "creative": "BasicBlueMap", "touchpoint": 1, "file": "VIOC_DM_Lapsed_Basic_Blue_Map.pdf"},
				{ "programId" : 2, "channel": "dm", "creative": "Generic", "touchpoint": 1, "file": "VIOC_DM_Lapsed_Generic.pdf"},
				{ "programId" : 2, "channel": "dm", "creative": "Mural", "touchpoint": 1, "file": "VIOC_DM_Lapsed_Mural.pdf"},
				{ "programId" : 2, "channel": "dm", "creative": "Stopwatch", "touchpoint": 1, "file": "VIOC_DM_Lapsed_Stopwatch.pdf"},
				{ "programId" : 2, "channel": "dm", "creative": "WindowSticker", "touchpoint": 1, "file": "VIOC_DM_Lapsed_Window_Sticker.pdf"},
				{ "programId" : 2, "channel": "sms", "creative": "Standard", "touchpoint": 1, "file": "SMS_Lapsed.pdf"},

				{ "programId" : 3, "channel": "email", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_Relapsed_Basic_Blue_EM.pdf"},
				{ "programId" : 3, "channel": "dm", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_DM_Relapsed_Basic_Blue.pdf"},
				{ "programId" : 3, "channel": "dm", "creative": "Generic", "touchpoint": 1, "file": "VIOC_DM_Relapsed_Generic.pdf"},
				{ "programId" : 3, "channel": "dm", "creative": "Mural", "touchpoint": 1, "file": "VIOC_DM_Relapsed_Mural.pdf"},
				{ "programId" : 3, "channel": "dm", "creative": "Stopwatch", "touchpoint": 1, "file": "VIOC_DM_Relapsed_Stopwatch.pdf"},

				{ "programId" : 4, "channel": "email", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_Lost_Basic_Blue_EM.pdf"},
				{ "programId" : 4, "channel": "email", "creative": "BasicRed", "touchpoint": 1, "file": "VIOC_Lost_Basic_Red_EM.pdf"},
				{ "programId" : 4, "channel": "dm", "creative": "BasicRed", "touchpoint": 1, "file": "VIOC_DM_Lost_Basic_Red.pdf"},
				{ "programId" : 4, "channel": "dm", "creative": "Generic", "touchpoint": 1, "file": "VIOC_DM_Lost_Generic.pdf"},
				{ "programId" : 4, "channel": "dm", "creative": "Mural", "touchpoint": 1, "file": "VIOC_DM_Lost_Mural.pdf"},
				{ "programId" : 4, "channel": "dm", "creative": "Stopwatch", "touchpoint": 1, "file": "VIOC_DM_Lost_Stopwatch.pdf"},

				{ "programId" : 5, "channel": "email", "creative": "BasicBlueHero", "touchpoint": 1, "file": "VIOC_Reactivation_Basic_Blue_Hero_EM.pdf"},
				{ "programId" : 5, "channel": "email", "creative": "BasicBlueMap", "touchpoint": 1, "file": "VIOC_Reactivation_Map_EM.pdf"},
				{ "programId" : 5, "channel": "email", "creative": "Stopwatch", "touchpoint": 1, "file": "VIOC_Reactivation_Stopwatch_EM.pdf"},
				{ "programId" : 5, "channel": "dm", "creative": "BasicBlueHero", "touchpoint": 1, "file": "VIOC_DM_Reactivation_Basic_Blue_Hero.pdf"},
				{ "programId" : 5, "channel": "dm", "creative": "BasicBlueMap", "touchpoint": 1, "file": "VIOC_DM_Reactivation_Basic_Blue_Map.pdf"},
				{ "programId" : 5, "channel": "dm", "creative": "Stopwatch", "touchpoint": 1, "file": "VIOC_DM_Reactivation_Stopwatch.pdf"},

				{ "programId" : 10, "channel": "email", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_PostVisit_1_EM.pdf"},
				{ "programId" : 10, "channel": "email", "creative": "BasicBlue", "touchpoint": 2, "file": "VIOC_PostVisit_2_EM.pdf"},

				{ "programId" : 11, "channel": "email", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_PreReminder_Basic_Blue_EM.pdf"},

				{ "programId" : 13, "channel": "email", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_Fleet_Reminder_Lapsed_Driver_EM.pdf"},
				{ "programId" : 13, "channel": "dm", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_DM_Fleet_Driver_Reminder_Basic_Blue.pdf"},

				{ "programId" : 14, "channel": "email", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_Fleet_Reminder_Lapsed_Driver_EM.pdf"},

				{ "programId" : 15, "channel": "dm", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_DM_Inspection_Reminder_Basic_Blue.pdf"},
				{ "programId" : 15, "channel": "dm", "creative": "Generic", "touchpoint": 1, "file": "VIOC_DM_Inspection_Reminder_Generic.pdf"},

				{ "programId" : 1184396, "channel": "email", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_Fleet_Reminder_Owner_EM.pdf"},

				{ "programId" : 1186314, "channel": "dm", "creative": "BasicBlue", "touchpoint": 1, "file": "VIOC_DM_Inspection_Thank_you_Basic_Blue.pdf"},
				{ "programId" : 1186314, "channel": "dm", "creative": "Generic", "touchpoint": 1, "file": "VIOC_DM_Inspection_Thank_you_Generic.pdf"}
			];

			$.each(mapping, function(i,map)
			{
				if (map.programId == programId && map.channel == channel && map.creative == creativeTemplate && map.touchpoint == touchpoint)
				{
					matching_map = map;
				}
			});

			if (matching_map == null)
				return "javascript:{jAlert('Preview not available.')}";

			return controller.marcomFilePath + "../pdfs/" + matching_map.file;

		},
		showAdditionalGridData: function()
		{
			var controller = this;
			var store = controller.activeStoreData;
			var program = controller.activeStoreData;
			var config = controller.activeStoreDataConfig;

			// Show expiration dates
			$(".result-value").append("(Exp " + config.content.expiration + "d)");

			// Show creative types
			$(".creativeName .email.result-value").html( config.content.emailCreativeName );
			$(".creativeName .sms.result-value").html( "Standard" );
			$(".creativeName .dm.result-value").html( config.content.dmCreativeName );

			// Update preview links
			$.each(['email', 'dm', 'sms'], function (i, channel) {
				for (var touchpoint = 1; touchpoint <= 3; touchpoint++) {
					var programId = ContentPreviewController.controller.program.id;
					var creativeTemplate = "";
					if (channel == "email") creativeTemplate = config.content.emailCreativeName;
					if (channel == "sms") creativeTemplate = "Standard";
					if (channel == "dm") creativeTemplate = config.content.dmCreativeName;
					var url = controller.getPreviewPDFUrl(programId, channel, creativeTemplate, touchpoint);

					$("a.touchpoint-" + touchpoint + "." + channel + ".preview").attr('href', url);

					// Reset the active state to prevent multiple highlighted tabs.
					$('.content-preview-section .resp-tab-item.hor_2:not(.touchpoint-1)')
						.removeClass('resp-tab-active');

					// Debugging
					if (marcomUserData.environmentKind === 'UAT') {
						var debugGroup = 'color:purple;font-weight:bold;font-size:1em',
							debugItem = 'color:#f06;font-weight:bold;font-size:0.95em';
						console.groupCollapsed('%c **Preview Updated**', debugGroup);
							console.debug('URL set using: %c %s', debugItem, url);
							console.debug('programId: %c %i', debugItem, programId);
							console.debug('channel: %c %s', debugItem, channel);
							console.debug('creativeTemplate: %c %s', debugItem, creativeTemplate);
							console.debug('touchpoint: %c %i', debugItem, touchpoint);
						console.groupEnd();
					}
				}
			});

			// Load config for additional offer
			if (program.adtlConfigId >= 1) {
				$.get(controller.apiPath + 'loadConfig.jssp?userId=' + encodeURIComponent(controller.userId) + '&configId=' + program.adtlConfigId, function (results) {
					var cachedResults = DoNotParseData(results);
					controller.activeStoreDataAdtlConfig = cachedResults;

					// Add in additional offer data
					for (var i = 1; i <= 4; i++) {
						var cfg = controller.activeStoreDataAdtlConfig.content;
						var html = cfg['adtlSummary' + i] + "<hr>" + cfg['adtlCode' + i] + " (Exp " + cfg.expiration + "d)";

						if (cfg['adtlCode' + i].toString() == "") {
							$(".additional-offer.offer-" + i).addClass("none");
						} else {
							$(".additional-offer.offer-" + i).removeClass("none");
							$(".additional-offer.offer-" + i).show();
							$(".additional-offer.offer-" + i + " .result-value").html(html);
						}
					}
				});
			}
		},
		/**
		 * [updateStoreDetails Updates the store location, phone, hours, features, and disclaimers using controller.store]
		 * @return {[type]} [store]
		 */
		updateStoreDetails: function () {
			var controller = this;
			var store = controller.activeStoreData;
			// console.info('updateStoreDetails was called.');

			// Update address and phone data

			$(".company-address").html(store.storeAddressFull);
			$(".company-phone").html(store.storePhone);

			// Update hour data
			$.each(store.storeHours, function(i,e) {
				var day = i.toLowerCase();
				$("." + day + " .store-open").html(e.open);
				$("." + day + " .store-close").html(e.close);

				if (e.closed)
				{
					$("."+day+" .open-hours").addClass("none");
					$("."+day+" .store-closed").removeClass("none");
				}
				else
				{
					$("."+day+" .open-hours").removeClass("none");
					$("."+day+" .store-closed").addClass("none");
				}

			});

			// Update store features
			$(".features").html('');

			$.each(controller.activeStoreMeta.features, function(i,e) {

				var sample_feature = '<span class="feature">' +
					'<img class="feature-image" src="http://t.email.vioc.com/res/valvoline_t/' + e.image + '" alt="Feature Image">' +
					'<span class="feature-caption">' +
					  '<small>' +  e.text + '</small>' +
					'</span>' +
				  '</span>';

				$(".features").append(sample_feature);
			});

			// Update store disclaimer

			var disclaimer = [];

			if (controller.activeStoreMeta.disclaimer.couponDisclaimer != "")
				disclaimer.push(controller.activeStoreMeta.disclaimer.couponDisclaimer);

			if (controller.activeStoreMeta.disclaimer.adtlDisclaimer != "")
				disclaimer.push(controller.activeStoreMeta.disclaimer.adtlDisclaimer);

			$(".store-disclaimer").html(disclaimer.join("<br><br>"));

			controller.showUI();
		},
		showUI: function () {
				if (controller.activeStoreData.enrolled) {
					$('.content-preview-section .js-loading').hide();
					$('.content-preview-section .js-loading-is-done').show();
				} else {
					$('.content-preview-section .js-loading-is-done,.content-preview-section .js-loading').hide();
					$('.results-section .results-message').show();
				}
			},
			hideUI: function () {
				$('.results-section .results-message').hide();
				$('.content-preview-section .js-loading-is-done').hide();
				$('.content-preview-section .js-loading').fadeIn();
			}
  };
	return {
		controller: controller
	};
})(jQuery);
