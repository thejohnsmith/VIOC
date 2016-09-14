/* StorePageDetail Controller
 * @NOTE - The Store Pages URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/CustomPage.aspx?uigroup_id=479602&page_id=10792
 *
 * @description - Loads Store Pages template markup
 * @filename - StorePagesController.js
 * @author - John Smith : Epsilon 2016
 */
 
var siteCoreLibrary = {
	
	stores : [{
			"id": "838d6492-4d71-4179-8051-61ffbacaa931",
			"storeNumber": "080011",
			"franchiseId": "VAL",
			"franchiseName": "VALVOLINE",
			"name": "OUTER LOOP",
			"managerName": "JAMES FARRIS",
			"managerImage": {},
			"isActive": false,
			"latitude": 38.1266,
			"longitude": -85.77896,
			"storeImage": {},
			"communitiesServed": "",
			"landmark": "",
			"webURL": "",
			"address": "175 OUTER LOOP",
			"city": "LOUISVILLE",
			"state": "KY",
			"zip": "40214",
			"phone": "502-361-3092",
			"sundayHours": "9:00am - 5:00pm",
			"mondayHours": "8:00am - 6:00pm",
			"tuesdayHours": "8:00am - 6:00pm",
			"wednesdayHours": "8:00am - 6:00pm",
			"thursdayHours": "8:00am - 6:00pm",
			"fridayHours": "8:00am - 6:00pm",
			"saturdayHours": "8:00am - 6:00pm",
			"facebookURL": "",
			"twitterURL": "",
			"googleURL": "",
			"googleBusinessURL": "",
			"services": [],
			"features": [],
			"careers": [],
			"news": [{
				"id": "37e37dd0-d84b-432e-9df4-efc530bdf629",
				"type": "1911fd9d-64cb-4795-870d-3ccb912cd2fb",
				"shortTitle": "Short Title",
				"longTitle": "Long Title",
				"description": "",
				"image": {},
				"externalURL": "",
				"postOnDate": "0001-01-01T00:00:00",
				"removeOnDate": "0001-01-01T00:00:00",
				"eventStartDate": "2016-09-07T00:00:00",
				"eventEndDate": "2016-09-08T00:00:00"
			}],
			"holidays": []
		}],
	loadStores : function(storeNumbers, cb) {
		cb();
	}
}

var StorePageDetailController = StorePageDetailController || (function ($) {
	'use strict';
	var controller = {

		// ===========================================================================
		// Variables
		// ===========================================================================
		
		storeNumber: '',
		apiPath: marcomUserData.$constants.apiPath,
		userId: marcomUserData.$user.externalId,
		preview_map: {
			// Source						// Variable
			"#storeName"					: "storeName",
			"#storeDistMiles"				: "storeDistMiles",
			"#storeDistDirection"			: "storeDistDirection",
			"#storeLandmark"				: "storeLandmark",
			"#storeStreet"					: "storeStreet",
			"#storeCrossStreet"				: "storeCrossStreet",
			"[name=storeNeighboringType]"	: "storeNeighboringType",
			"#storeNeighboring"				: "storeNeighboring"
		},
				
		// ===========================================================================
		// Boot Methods
		// ===========================================================================

		init: function () {
			var controller = this;
			controller.storeNumber = getParameterByName('storeNumber', window.location.href);
			siteCoreLibrary.loadStores(['ABC123'], function (error) {
				controller.attachEventListeners();
				controller.populateUI();
				controller.refreshPreview();
				controller.initCharacterLimits();
				customCheckAndRadioBoxes.customCheckbox();
				controller.showUI();
			});
		},
		attachEventListeners: function() {
			var controller = this;

			// -------------------------------------
			// Listen to Preview-area Inputs
			// -------------------------------------
			var targets = [];
			for (var key in controller.preview_map) {
				targets.push(key);
			}
			$(targets.join(",")).change(function() { controller.onChangePreviewInput() });
			$(targets.join(",")).keyup(function() { controller.onChangePreviewInput() });
			
			// -------------------------------------
			// Listen for Photo Uploads
			// -------------------------------------
			
		},
		
		populateUI: function() {
			var controller = this;
			controller.populateBasicDetails();
		},
		
		populateBasicDetails: function() {
			var daysOfWeek = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
			var storeData = siteCoreLibrary.stores[0];
			var address = storeData.address + " " + storeData.city + " " + storeData.state + " " + storeData.zip;

			$(".company-address").html(address);
			$(".company-phone").html(storeData.phone);
			$(".company-manager").html(storeData.managerName);

			$.each(daysOfWeek, function(i,day) { 
				var hours = storeData[day + "Hours"];
				var isClosed = hours.length < 8;
				if (isClosed) {
					$("." + day + " .open-hours").addClass('none');
					$("." + day + " .store-closed").removeClass('none');
				}
				else {
					$("." + day + " .open-hours").removeClass('none').html(hours.replace(" - ", "<br>"));
					$("." + day + " .store-closed").addClass('none');
				}
			});
		},
		refreshPreview: function() {
			
			var preview_map = controller.preview_map;
			var data = {};
			
			for (var key in preview_map) {
				data[preview_map[key]] = $(key).val();
			}

			$(".preview-content").html(Mustache.render($(".store-preview-template").html(), data));
		},
		initCharacterLimits: function() {
			$('.characterLimitInput').each(function () {
				$(this).characterCounter({
					maxCharStatic: true,
					counterNeeded: true,
					remainingNeeded: true,
					chopText: true,
					shortFormat: true,
					shortFormatSeparator: ' ',
					positionBefore: false
				});
			});
		},
		showUI: function() {
			var controller = this;

			$('.js-content').fadeIn();
			$('.js-loading').hide();
		},
		
		// ===========================================================================
		// Event Handlers
		// ===========================================================================
		
		onChangeCommunitiesServed: function()
		{
			
		},
		
		onChangePreviewInput: function() {
			this.refreshPreview();
		},
		
		onUploadStorePhoto: function() {
			
		},
		
		onRestoreStorePhoto: function() {
			
		},
		
		onUploadManagerPhoto: function() {
			
		},
		
		onRestoreManagerPhoto: function() {
			
		},
		
		onChangeClosedOn: function() {
			
		},
		
		
		
	};
	return {
		controller: controller,
	};
})(jQuery);

/*
	To Do:
		- Add maxlength to Communities Served input
*/