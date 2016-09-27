/* StorePageDetail Controller
 * @NOTE - The Store Pages URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/CustomPage.aspx?uigroup_id=479602&page_id=10792
 *
 * @description - Loads Store Pages template markup
 * @filename - StorePagesController.js
 * @author - John Smith : Epsilon 2016
 */

// siteCoreLibrary: Loaded from https://adobe-prod-vioc.epsilon.com/jssp/vioc/siteCoreLibrary.jssp is stable.
siteCoreLibrary = new SiteCoreLibrary();

var StorePageDetailController = StorePageDetailController || (function ($) {
	'use strict';
	var controller = {

	    // ===========================================================================
	    // Variables
	    // ===========================================================================

	    storeNumber: '',
	    apiPath: marcomUserData.$constants.apiPath,
	    userId: marcomUserData.$user.externalId,
	    savenewStoreImageId: null,
	    savenewStoreImageUrl: null,
	    defaultStoreImageId: "put a string here for default",
	    defaultStoreImageUrl: "put default url string here for default",
	    savenewManagerImageId: null,
	    savenewManagerImageUrl: null,
	    defaultManagerImageId: "put a string here for default",
	    defaultManagerImageUrl: "put default url string here for default",
	    previewMap: {
	        // Source											// Variable
	        "#storeDistMiles"									: "storeDistMiles",
	        "#storeDistDirection"								: "storeDistDirection",
	        "#storeLandmark"									: "storeLandmark",
	        "#storeStreet"										: "storeStreet",
	        "#storeCrossStreet"									: "storeCrossStreet",
	        "input[name='storeNeighboringType']:checked"		: "storeNeighboringType",
	        "#storeNeighboring"									: "storeNeighboring"
	    },
	    serviceFilter: [  // Limit the display to these services
			"Full-Service Oil Change",
			"Transmission Service",
			"Radiator Service",
			"Air Filter Replacement",
			"Fuel System Cleaning Service",
			"Serpentine Belt Replacement",
			"Air Conditioning Service",
			"Tire Rotation",
			"Gearbox Fluid Replacement",
			"Headlight/Taillight Replacement",
			"Battery Replacement",
			"Windshield Wiper Replacement"
	    ],

	    // ===========================================================================
	    // Boot Methods
	    // ===========================================================================

	    init: function () {
	        var controller = this;
	        if (!controller.getStoreNumber()) return 0;
	        siteCoreLibrary.init(function (error) {
	            siteCoreLibrary.loadStores([controller.storeNumber], function (error) {
	                if (controller.validateStoreLoaded(controller.storeNumber)) {
	                    controller.loadSectionsFromMustache(function() { 
	                        controller.attachEventListeners();
	                        controller.populateUI();
	                        controller.refreshLandmarkPreview();
	                        controller.initCharacterLimits();
	                        customCheckAndRadioBoxes.customCheckbox();
	                        controller.showUI();
	                    });
	                };
	            });
	        });
	    },
	    getStoreNumber: function() {
	        var controller = this;
	        controller.storeNumber = getParameterByName('storeNumber', window.location.href);
			
	        if (controller.storeNumber == "501" || controller.storeNumber == "701" || controller.storeNumber == "941")
	        {
	            toastr.success('Store ' + controller.storeNumber + " is a test store.  Changing store number to 050002 for testing purposes.");
	            controller.storeNumber = "050002";
	        }
	        return true;
	    },
	    validateStoreLoaded: function(storeNumber)
	    {
	        var controller = this;
	        if (siteCoreLibrary.stores[0] == undefined ||
				siteCoreLibrary.stores[0]['storeNumber'] != storeNumber ||
				siteCoreLibrary.stores[0].length == 0)
	        {
	            jAlert("Unable to load data for store '" + storeNumber + "'.  Returning to home page.", function() {
	                window.location.href = marcomUserData.$constants.homePageGroupUrl;
	            });
	            return false;
	        }
	        return true;
	    },
	    loadSectionsFromMustache: function(cb) {
			
	        var prefix = "https://files.marcomcentral.app.pti.com/epsilon/static_beta/includes/"

	        var d1 = $.get(prefix + "store-landmark-info.mustache");
	        var d2 = $.get(prefix + "store-basic-details.mustache");
	        var d3 = $.get(prefix + "store-communities-served.mustache");
	        var d4 = $.get(prefix + "store-holidays.mustache");
	        var d5 = $.get(prefix + "store-manager-photo.mustache");
	        var d6 = $.get(prefix + "store-news-events-promotions.mustache");
	        var d7 = $.get(prefix + "store-photo.mustache");
	        var d8 = $.get(prefix + "store-services.mustache");
	        var d9 = $.get(prefix + "store-social.mustache");
	        var d10 = $.get(prefix + "store-careers.mustache");
	        var d11 = $.get(prefix + "store-features.mustache");

	        $.when(d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11).done(function( 
				d1res,d2res,d3res,d4res,d5res,d6res,d7res,d8res,d9res,d10res,d11res) {
					
	            $(".dropzone.dropzone-landmark-info").html($(d1res[0]).filter(".mustache-template").html());
	            $(".dropzone.dropzone-basic-details").html($(d2res[0]).filter(".mustache-template").html());
	            $(".dropzone.dropzone-communities-served").html($(d3res[0]).filter(".mustache-template").html());
	            $(".dropzone.dropzone-holidays").html($(d4res[0]).filter(".mustache-template").html());
	            $(".dropzone.dropzone-manager-photo").html($(d5res[0]).filter(".mustache-template").html());
	            $(".dropzone.dropzone-news-events-promotions").html($(d6res[0]).filter(".mustache-template").html());
	            $(".dropzone.dropzone-photo").html($(d7res[0]).filter(".mustache-template").html());
	            $(".dropzone.dropzone-services").html($(d8res[0]).filter(".mustache-template").html());
	            $(".dropzone.dropzone-social").html($(d9res[0]).filter(".mustache-template").html());
	            $(".dropzone.dropzone-careers").html($(d10res[0]).filter(".mustache-template").html());
	            $(".dropzone.dropzone-features").html($(d11res[0]).filter(".mustache-template").html());
	            cb();
	        });			
	    },
	    attachEventListeners: function() {
	        var controller = this;

	        // -------------------------------------
	        // Listen to Preview-area Actions
	        // -------------------------------------
	        var targets = [];
	        for (var key in controller.previewMap) {
	            targets.push(key);
	        }
	        $("input[name='storeNeighboringType']").change(function() { controller.onChangePreviewInput() });
	        $(targets.join(",")).change(function() { controller.onChangePreviewInput() });
	        $(targets.join(",")).keyup(function() { controller.onChangePreviewInput() });
			
	        // -------------------------------------
	        // Listen for Other Actions
	        // -------------------------------------
	        $(".btn-save").click(function() { controller.onSave() });
		
	        $('#newimage').change(function () { $('#uploader_form_1').submit(); });
	        $("#uploader_form_1").submit(function (event) { controller.onUploadStorePhoto(event); });

	        $('#newmanagerimage').change(function () { $('#uploader_form_3').submit(); });
	        $("#uploader_form_3").submit(function (event) { controller.onUploadManagerPhoto(event); });
	    },

		populateUI: function() {
			var controller = this;
			controller.setLandmarkInputFields();
			controller.populateBasicDetails();
			controller.populateStorePhoto();
			controller.populateManagerPhoto();
			controller.populateServices();
			controller.populateHolidays();
			controller.populateFeatures();
			controller.populateSocialAndCommunity();
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
		populateStorePhoto: function() {
			var controller = this;
			var storeData = siteCoreLibrary.stores[0];
			var imageUrl = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=No%20Store%20Image%20Available&w=350&h=150'

			if (storeData.storeImage != undefined && storeData.storeImage.url != undefined)
			{
				imageUrl = storeData.storeImage.url;
			}
			console.log("Store Photo URL is : " + imageUrl);
			$("#store-photo-item").attr("src", imageUrl);
		},
		populateManagerPhoto: function() {
			var controller = this;
			var storeData = siteCoreLibrary.stores[0];
			var imageUrl = 'https://files.marcomcentral.app.pti.com/epsilon/static_beta/images/ico-profile-default.png'

			if (storeData.managerImage != undefined && storeData.managerImage.url != undefined)
			{
				imageUrl = storeData.managerImage.url;
			}
			console.log("Manager Photo URL is : " + imageUrl);
			$("#manager-photo-item").attr("src", imageUrl);
		},
		populateServices: function() {
			var controller = this;
			$(".store-services-list").html('');

			$.each(siteCoreLibrary.settings.Services, function(i, service) {
				
				if ($.inArray(service.name, controller.serviceFilter) == -1) return;
				var item = '<li class="list-item-default service-item col-sm-6">';
				item += '<label class="checkbox-default">';
				item += '<input class="checkbox-default-input" type="checkbox" data-id="' + service.id + '" name="storeervice"/>' + service.name;
				if (service.webURL != undefined && service.webURL != "")
					item += '<a style="margin-left: 8px" target="_blank" href="' + service.webURL + '"><span class="glyphicon glyphicon-info-sign"></span></a>';
			    item += '</label></li>';

				$(".store-services-list").append(item);
			});
		},
		populateHolidays: function() {
			$("ul.holidays").html('');
			var items = {};

			$.each(siteCoreLibrary.settings.Holidays, function(i, holiday) {
				var item = '<li class="list-item-default holiday-item">';
				item += '<label class="checkbox-default">';
				item += '<input class="checkbox-default-input" type="checkbox" data-id="' + holiday.id + '" name="storeClosure"/>' + holiday.name;
				item += '</label></li>';
				
				var leading_zero = (holiday.month < 10) ? "0" : "";
				var leading_zero2 = (i < 10) ? "0" : "";
				items["seq_" + leading_zero + holiday.month.toString() + holiday.day.toString() + leading_zero2 + i.toString()] = item;
			});

			const ordered = {};
			Object.keys(items).sort().forEach(function(key) {
			  ordered[key] = items[key];
			});

			for (var idx in ordered)
			{
				$("ul.holidays").append(ordered[idx]);
			}
		},
		populateFeatures: function() {
			var controller = this;
			var template = $(".store-feature-template").html();
			var $target = $(".feature-container");
			
			$.each(siteCoreLibrary.settings.Features, function(i, feature) {
				var data = {
					"featureId" : feature.id,
					"featureName" : feature.name,
					"checkedState": false,
					"featureTitle": feature.name,
					"featureImgSource": ""
				};
				$target.append(Mustache.render(template, data));
			});
		},
		populateSocialAndCommunity : function() {
			var controller = this;
			var storeData = siteCoreLibrary.stores[0];
			var map = {
				"#socialFacebook" : "facebookURL",
				"#communitiesServed" : "communitiesServed",
			}

			$.each(map, function (k, v) {
			    $(k).val(siteCoreLibrary.stores[0][v]).change(function () {
			        console.log("Setting " + v + " to " + $(this).val())
			        siteCoreLibrary.stores[0][v] = $(this).val();
			    });
			});

			$('#socialFacebook').val(siteCoreLibrary.stores[0].facebookURL);
			$('#socialTwitter').val(siteCoreLibrary.stores[0].twitterURL);
			$('#socialGoogle').val(siteCoreLibrary.stores[0].googleURL);
			$('#socialGooglemyBusiness').val(siteCoreLibrary.stores[0].googleBusinessURL);
		},
		getLandmarkPlaceholder: function(key) {
			var placeholder = "";
			switch (key) {
				case "#storeStreet": placeholder = "[STREET]"; break;
				case "input[name='storeNeighboringType']:checked": 
					$("input[name='storeNeighboringType']:first").prop('checked', 'true');
				break;
				case "#storeNeighboring": placeholder = "[NEIGHBORING BUSINESS]"; break;
				case "#storeCrossStreet": placeholder = "[CROSS STREET]"; break;
				case "#storeLandmark": placeholder = "[POPULAR LANDMARK]"; break;
				case "#storeDistDirection": placeholder = "[DIRECTION]"; break;
				case "#storeDistMiles": placeholder = "[DISTANCE]"; break;
				case "#storeDistMiles": placeholder = "[DISTANCE]"; break;
				default: placeholder = "[EDIT]";
			}
			return placeholder;
		},
		setLandmarkInputFields: function() {
			var controller = this;
			var storeData = siteCoreLibrary.stores[0];
			// storeData.landmark = "Welcome. The CHAMBERS ROAD Valvoline Instant Oil Change is located approximately 55.5 Miles North-West of The Old Barn near the intersection of Ross Ave. and 151st St across from Macy's.";
			
			// Read the current landmark value from the store
			// If it's blank, set the input fields with default values.
			if (storeData.landmark == "")
			{
				// Loop through the map
				for (var key in controller.previewMap) {
					var placeholder = controller.getLandmarkPlaceholder(key);
					
					// Set the input
					if (placeholder != "")
						$(key).val(placeholder);
				}
			}
			// If it's not blank, do a regex to determine the values for each field.
			else
			{
				var regex = /Welcome. The (.*?) Valvoline Instant Oil Change is located approximately (.*?) Miles (.*?) of (.*?) near the intersection of (.*?) and (.*?) (across from|next to) (.*?)\./;
				
				var matches = storeData.landmark.replace(/\s+/g, ' ').trim().match(regex);
				
			    try {
			        $("#storeDistMiles").val(matches[2]);
			        $("#storeDistDirection").val(matches[3]);
			        $("#storeLandmark").val(matches[4]);
			        $("#storeStreet").val(matches[5]);
			        $("#storeCrossStreet").val(matches[6]);
			        if (matches[7] == 'across from')
			            $("input[name='storeNeighboringType']:first").prop('checked', 'true');
			        if (matches[7] == 'next to')
			            $("input[name='storeNeighboringType']:last").prop('checked', 'true');
			        $("#storeNeighboring").val(matches[8]);
			    }
			    catch (Err) { }
				
			};
			
			// Set the fields 
		},
		refreshLandmarkPreview: function() {

			var previewMap = controller.previewMap;
			var data = {};
			
			// Read the inputs and build the values for the mustache template.
			for (var key in previewMap) {
				var val = $(key).val();
				if (val == undefined || val.trim() == "")
				{
					var placeholder = controller.getLandmarkPlaceholder(key);
					
					if (placeholder != "")
					$(key).val(placeholder);
				}
				
				data[previewMap[key]] = "<mark class='edit-" + previewMap[key] + "'>" + $(key).val() + "</mark>";
			}

			// Update the display
			data["storeName"] = siteCoreLibrary.stores[0].name;
			$("#storeName").val(siteCoreLibrary.stores[0].name);

			$(".preview-content").html(Mustache.render($(".store-preview-template").html(), data));
			$(".preview-content").html($(".preview-content").html().replace(/&gt;/g,">").replace(/&lt;/g,"<"));

			// Add click handlers to the display
			for (var key in previewMap) {
				var name = previewMap[key];
				$(".edit-" + name).click(function() {
					var name = $(this).attr('class').replace("edit-", "");
					console.log("Clicked " + name);
					$j(".store-preview ~.form-item").addClass("none")
					$("." + name + "-container").removeClass("none");
				});
			}
			
			// Update the store's landmark info.
			siteCoreLibrary.stores[0].landmark = $(".preview-content:last").text().replace(/\s+/g, ' ').trim();
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
			this.refreshLandmarkPreview();
		},

		onUploadStorePhoto: function (event) {

		    event.preventDefault();

		    $('#storenumberhidden').val(controller.storeNumber);

		    siteCoreLibrary.addStoreImage(new FormData($('#uploader_form_1')[0]), function (err, data) {
		        controller.savenewStoreImageId = data.results.id;
		        controller.savenewStoreImageUrl = data.results.url;

		        $("#store-photo-item").attr("src", controller.savenewStoreImageUrl);
		    });

		},

		onRestoreStorePhoto: function () {

		    controller.savenewStoreImageId = controller.defaultStoreImageId;
		    controller.savenewStoreImageUrl = controller.defaultStoreImageUrl;

		    $("#store-photo-item").attr("src", defaultstoreImageUrl);

		},

		onUploadManagerPhoto: function(event) {

		    event.preventDefault();

		    $('#storenumberhidden').val(controller.storeNumber);

		    siteCoreLibrary.addStoreImage(new FormData($('#uploader_form_3')[0]), function (err, data) {
		        controller.savenewManagerImageId = data.results.id;
		        controller.savenewManagerImageUrl = data.results.url;

		        $("#manager-photo-item").attr("src", controller.savenewManagerImageUrl);
		    });

		},

		onRestoreManagerPhoto: function () {

		    controller.savenewManagerImageId = controller.defaultManagerImageId;
		    controller.savenewManagerImageUrl = controller.defaultManagerImageUrl;

		    $("#manager-photo-item").attr("src", defaultManagerImageUrl);

		},

		onChangeClosedOn: function() {

		},
		
		onSave: function () {

            // store image

		    if (controller.savenewStoreImageId != null) {
		        siteCoreLibrary.stores[0].storeImage.id = controller.savenewStoreImageId;
		    }

            // store manager image

		    if (controller.savenewManagerImageId != null) {
		        siteCoreLibrary.stores[0].managerImage.id = controller.savenewManagerImageId;
		    }

            // communities served

		    siteCoreLibrary.stores[0].communitiesServed = $('#communitiesServed').val();

		    // holidays

		    siteCoreLibrary.stores[0].holidays = [];

		    $("input:checkbox[name='storeClosure']:checked").each(function () {
		        var holiday = {};
		        holiday.id = $(this).attr('data-id');
		        siteCoreLibrary.stores[0].holidays.push(holiday);
		    });

		    // services

		    siteCoreLibrary.stores[0].services = [];

		    $('input:checkbox[name=storeService]:checked').each(function () {
		        var service = {};
		        service.id = $(this).attr('data-id');
		        siteCoreLibrary.stores[0].services.push(service);
		    });

		    // social media

		    siteCoreLibrary.stores[0].facebookURL = $('#socialFacebook').val();
		    siteCoreLibrary.stores[0].twitterURL = $('#socialTwitter').val();
		    siteCoreLibrary.stores[0].googleURL = $('#socialGoogle').val();
		    siteCoreLibrary.stores[0].googleBusinessURL = $('#socialGooglemyBusiness').val();

			siteCoreLibrary.save(function() {}, function(err) {
				if (err != "")
				{
					toastr.success("Changes Saved!");
				}
				else
				{
					toastr.error(err);
				}
			});
		}



	};
	return {
		controller: controller,
	};
})(jQuery);

/*
	To Do:
		- Add maxlength to Communities Served input
*/
