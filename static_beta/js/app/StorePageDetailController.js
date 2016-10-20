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
		postInitCallbacks: [],
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
	    previewMapState : {
	        // Source											// Variable
	        "#storeDistMiles"									: false,
	        "#storeDistDirection"								: false,
	        "#storeLandmark"									: false,
	        "#storeStreet"										: false,
	        "#storeCrossStreet"									: false,
	        "input[name='storeNeighboringType']:checked"		: false,
	        "#storeNeighboring"									: false,
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
	                        controller.populateUI(function () {
	                            controller.attachEventListeners();
	                            controller.refreshLandmarkPreview();
	                            controller.initCharacterLimits();
	                            customCheckAndRadioBoxes.customCheckbox();
	                            controller.performInitCallbacks();
	                            controller.showUI();
	                        });
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
	        $(".btn-save").click(function () { controller.onSave() });
	        $("#buttoncancel").click(function () { controller.onCancel() });
		
	        $('#newimage').change(function () {
	            var selected_file_name = $(this).val();
	            if (selected_file_name.length > 0) {
	                $('#uploader_form_1').submit();
	            }
	            else {
	                /* No file selected or cancel/close
                       dialog button clicked */
	                /* If user has select a file before,
                       when they submit, it will treated as
                       no file selected */
	            }
	        });
	        $("#uploader_form_1").submit(function (event) { controller.onUploadStorePhoto(event); });
			$(".btn-store.btn-restore-default").click(function(event) { controller.onRestoreStorePhoto(event) });
			$(".btn-manager.btn-restore-default").click(function(event) { controller.onRestoreManagerPhoto(event) });

			$('#newmanagerimage').change(function () {
			    var selected_file_name = $(this).val();
			    if (selected_file_name.length > 0) {
			        $('#uploader_form_3').submit();
			    }
			    else {
			        /* No file selected or cancel/close
                       dialog button clicked */
			        /* If user has select a file before,
                       when they submit, it will treated as
                       no file selected */
			    }
			});
	        $("#uploader_form_3").submit(function (event) { controller.onUploadManagerPhoto(event); });
			
	        // -------------------------------------
	        // Listen for failed image loads
	        // -------------------------------------
			$("#store-photo-item").on('error', function() {controller.onRestoreStorePhoto({})} );
			$("#manager-photo-item").on('error', function () { controller.onRestoreManagerPhoto({}) });

			$('.select-all-services').click(function () { controller.onSelectAllServices(); });
			
	    },

		populateUI: function(cb) {
			var controller = this;
			controller.setTitle();
			controller.setBreadcrumbs();
			controller.setLandmarkInputFields();
			controller.populateBasicDetails();
			controller.populateStorePhoto();
			controller.populateManagerPhoto();
			controller.populateServices();
			controller.populateHolidays();
			controller.populateSocialAndCommunity();
			controller.checkRestoreButtonVisibility();
			cb();
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
			var imageUrl = marcomUserData.$constants.defaultStorePhotoUrl;

			if (storeData.storeImage != undefined && storeData.storeImage.url != undefined)
			{
				imageUrl = storeData.storeImage.url;
			}

			$("#store-photo-item").attr("src", imageUrl);
		},
		populateManagerPhoto: function() {
			var controller = this;
			var storeData = siteCoreLibrary.stores[0];
			var imageUrl = marcomUserData.$constants.defaultManagerPhotoUrl;

			if (storeData.managerImage != undefined && storeData.managerImage.url != undefined)
			{
				imageUrl = storeData.managerImage.url;
			}

			$("#manager-photo-item").attr("src", imageUrl);
		},
		populateServices: function() {
			var controller = this;
			$(".store-services-list").html('');
			$(".store-services-list").append('<a class="select-all-services">(Select All)</a>');
			$(".store-services-list").append('<div style="height: 10px"></div>');

			$.each(siteCoreLibrary.settings.Services, function(i, service) {
				
				if ($.inArray(service.name, controller.serviceFilter) == -1) return;
				var item = '<li class="list-item-default service-item col-sm-12">';
				item += '<label class="checkbox-default">';

				var isChecked = false;

				$.each(siteCoreLibrary.stores[0].services, function (i, servicelocal) {
				    if (servicelocal.id === service.id) {
				        isChecked = true;
				    }
				});

				var checked = '';

				if (isChecked === true) {
				    checked = 'checked';
				}

				item += '<input class="checkbox-default-input" type="checkbox" data-id="' + service.id + '" name="storeService" ' + checked + '/>' + service.name;
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

				var isChecked = false;

				$.each(siteCoreLibrary.stores[0].holidays, function (i, holidaylocal) {
				    if (holidaylocal.id === holiday.id) {
				        isChecked = true;
				    }
				});

				var checked = '';
                 
				if (isChecked === true) {
				    checked = 'checked';
				}

				item += '<input class="checkbox-default-input" type="checkbox" data-id="' + holiday.id + '" name="storeClosure" ' + checked + '/>' + holiday.name;
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
		setTitle: function() {
			var controller = this;
			$(".page-title span").html("Store Details - " + siteCoreLibrary.stores[0].name);
		},
		setBreadcrumbs: function() {
			var controller = this;
			$(".breadcrumb-current").html("Store Details - " + siteCoreLibrary.stores[0].name);
			$(".breadcrumb-current").prev().find("a").attr('href', marcomUserData.$constants.storePagesUrl);
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
			
			var controller = this;
			
			controller.getLandmarkDataFromTokens();

			var previewMap = controller.previewMap;
			var data = {};
			
			// Read the inputs and build the values for the mustache template.
			for (var key in previewMap) {
				var val = $(key).val();
				if (val == undefined || val.trim() == "")
				{
					var placeholder = controller.getLandmarkPlaceholder(key);
					
					if (placeholder != "") {
					    if (controller.previewMapState[key] == false) {
					        $(key).val(placeholder);
					        controller.previewMapState[key] = true;
					    }
					}
				}
				
				data[previewMap[key]] = "<mark style=\"color: red; font-size: 14px; font-weight: bold;\" class='edit-" + previewMap[key] + "'>" + $(key).val() + "</mark>";
			}

			// Update the display
			data["storeName"] = siteCoreLibrary.stores[0].name;
			$("#storeName").val(siteCoreLibrary.stores[0].name);

			$(".preview-content").html(Mustache.render($(".store-preview-template").html(), data));
			$(".preview-content").html($(".preview-content").html().replace(/&gt;/g,">").replace(/&lt;/g,"<"));

			// Add click handlers to the display
			for (var key in previewMap) {
				var name = previewMap[key];
				$(".edit-" + name).unbind('click').click(function () {
				    var name = $(this).attr('class').replace("edit-", "");
				    console.log("Clicked " + name);
				    $j(".store-preview ~.form-item").addClass("none")
				    $("." + name + "-container").removeClass("none");
				});

				$(key).unbind('blur').blur(function (event) {

				    console.log("Blue " + event.target);

				    if (event.target.id == 'storeLandmark' ||
                        event.target.id == 'storeStreet' ||
                        event.target.id == 'storeCrossStreet' ||
                        event.target.id == 'storeNeighboring') {
				        if ($('#' + event.target.id).val() == '') {
				            $('#' + event.target.id).val(controller.getLandmarkPlaceholder('#' + event.target.id));
				        }

				        controller.storeLandmarkDataInTokens();
				        controller.previewMapState[event.target.id] = false;
				        controller.refreshLandmarkPreview();
				    }
				});
			}
			
			// Update the store's landmark info.
			siteCoreLibrary.stores[0].landmark = $(".preview-content:last").text().replace(/\s+/g, ' ').trim();
		},

		storeDistMilesValid : false,
		storeDistDirectionValid : false,
	    storeLandmarkValid : false,
	    storeStreetValid : false,
	    storeCrossStreetValid : false,
	    storeNeighboringTypeValid: false,
	    storeNeighboringValid : false,

		getLandmarkDataFromTokens: function()
		{
			// Parse Token #2
				// Split the token into elements by space
				// Check if the first element is numeric
					// If so, set the value of $('#storeDistMiles')
					// If not, show an error and set $('#storeDistMiles') to 0.
				// Check if the 3rd+ element contains a cardinal direction
					// Example: var element3plus = token1.splice(2,99).toLowerCase();
					// If so, set the value of $('#storeDistDirection').val()
		    // If not, show an error and set $('#storeDistDirection').val() to "north";

		    if (siteCoreLibrary.stores[0].landmarkToken2 != '') {

		        var tokentwo = siteCoreLibrary.stores[0].landmarkToken2.split(' ');

		        if (tokentwo.length > 1) {
		            if ($.isNumeric(tokentwo[0]) == true ||
                        tokentwo[0] == '.' ||
                        tokentwo[0] == '') {
		                $('#storeDistMiles').val(tokentwo[0]);
		                controller.storeDistMilesValid = true;
		            }
		            /*else {
		                $('#storeDistMiles').val('0');
		                controller.storeDistMilesValid = false;
		            }*/
		        }
		        else {
		            controller.storeDistMilesValid = false;
		        }

		        if (tokentwo.length > 2) {
		            if (tokentwo[2].toLowerCase() == 'north' ||
                        tokentwo[2].toLowerCase() == 'south' ||
                        tokentwo[2].toLowerCase() == 'east' ||
                        tokentwo[2].toLowerCase() == 'west' ||
                        tokentwo[2].toLowerCase() == 'northwest' ||
                        tokentwo[2].toLowerCase() == 'northeast' ||
                        tokentwo[2].toLowerCase() == 'southwest' ||
                        tokentwo[2].toLowerCase() == 'southeast' ||
                        tokentwo[2].toLowerCase() == 'north-west' ||
                        tokentwo[2].toLowerCase() == 'north-east' ||
                        tokentwo[2].toLowerCase() == 'south-west' ||
                        tokentwo[2].toLowerCase() == 'south-east') {

		                tokentwo[2] = tokentwo[2].replace('-', '');

		                $('#storeDistDirection').val(tokentwo[2]);
		                controller.storeDistDirectionValid = true;
		            }
		            else {
		                $('#storeDistDirection').val('north');
		                controller.storeDistDirectionValid = true;
		            }
		        }
		    }
		    else {
		        controller.storeDistMilesValid = false;
		    }

			// Parse Token #3 (Column D)
				// Check if token 3 is empty
					// If so, show an error and set $('#storeLandmark').val() to ""
		    // If not, fill $('#storeLandmark').val() with token 3 

		    if (siteCoreLibrary.stores[0].landmarkToken3 === '') {
		        $('#storeLandmark').val('');
		        controller.storeLandmarkValid = false;
		    }
		    else {
		        $('#storeLandmark').val(siteCoreLibrary.stores[0].landmarkToken3);

		        if (siteCoreLibrary.stores[0].landmarkToken3 != controller.getLandmarkPlaceholder('#storeLandmark')) {
		            controller.storeLandmarkValid = true;
		        }
		        else {
		            controller.storeLandmarkValid = false;
		        }
		    }
					
			// Parse Token #4 (Column E)
				// Check if token 4 is empty
					// If so, show an error and set $('#storeStreet').val() to ""
		    // If not, fill $('#storeStreet').val() with token 4

		    if (siteCoreLibrary.stores[0].landmarkToken4 === '') {
		        $('#storeStreet').val('');
		        controller.storeStreetValid = false;
		    }
		    else {
		        $('#storeStreet').val(siteCoreLibrary.stores[0].landmarkToken4);

		        if (siteCoreLibrary.stores[0].landmarkToken4 != controller.getLandmarkPlaceholder('#storeStreet')) {
		            controller.storeStreetValid = true;
		        }
		        else {
		            controller.storeStreetValid = false;
		        }
		    }
				
			// Parse Token #5 (Column F)
				// Check if token 5 is empty
					// If so, show an error and set $('#storeCrossStreet').val() to ""
		    // If not, fill $('#storeCrossStreet').val() with token 5

		    if (siteCoreLibrary.stores[0].landmarkToken5 === '') {
		        $('#storeCrossStreet').val('');
		        controller.storeCrossStreetValid = false;
		    }
		    else {
		        $('#storeCrossStreet').val(siteCoreLibrary.stores[0].landmarkToken5);

		        if (siteCoreLibrary.stores[0].landmarkToken5 != controller.getLandmarkPlaceholder('#storeCrossStreet')) {
		            controller.storeCrossStreetValid = true;
		        }
		        else {
		            controller.storeCrossStreetValid = false;
		        }
		    }

			// Parse Toke #6 (Column G)
				// Split the token into elements
				// Combine element #1 and element #2 concatenated by a space.
					// If equals "across from"...
						// Set $('#storeNeighboringType').val() to "across from";
					// If equals "next to"...
						// Set $('#storeNeighboringType').val() to "next to";
					// Otherwise:
						// If not, show an error and set $('#storeNeighboringType').val() to "across from";
				
		    if (siteCoreLibrary.stores[0].landmarkToken6 != '') {
		        var tokensix = siteCoreLibrary.stores[0].landmarkToken6.split(' ');

		        if (tokensix.length > 0) {

		            if (tokensix[0] === 'next' ||
                        tokensix[0] === 'across') {

		                if (tokensix.length > 1) {
		                    var combined = tokensix[0] + ' ' + tokensix[1];

		                    if (combined == 'across from') {
		                        $("input[name='storeNeighboringType']:first").prop('checked', 'true');
		                    }
		                    else {
		                        $("input[name='storeNeighboringType']:nth-child(1)").prop('checked', 'true');
		                    }

		                    controller.storeNeighboringTypeValid = true;
		                }

		                // Combine elements 3+ into a string concateted by a space.
		                // Is it empty?
		                // If so, show an error and set $('#storeNeighboring').val() to ""
		                // If not, fill $('#storeNeighboring').val() with the value

		                if (tokensix.length > 2) {

		                    var finaltokens = '';

		                    for (var j = 2; j < tokensix.length; j++) {
		                        finaltokens += tokensix[j];

		                        if (tokensix.length - 1 > j) {
		                            finaltokens += ' ';
		                        }
		                    }

		                    $('#storeNeighboring').val(finaltokens);

		                    if (finaltokens != controller.getLandmarkPlaceholder('#storeNeighboring') &&
                                finaltokens != '') {
		                        controller.storeNeighboringValid = true;
		                    }
		                    else {
		                        controller.storeNeighboringValid = false;
		                    }
		                }
		                else {

		                    var finaltokens = '';

		                    for (var j = 0; j < tokensix.length; j++) {
		                        finaltokens += tokensix[j];

		                        if (tokensix.length - 1 > j) {
		                            finaltokens += ' ';
		                        }
		                    }

		                    $('#storeNeighboring').val(finaltokens);

		                    if (finaltokens != controller.getLandmarkPlaceholder('#storeNeighboring') &&
                                finaltokens != '') {
		                        controller.storeNeighboringValid = true;
		                    }
		                    else {
		                        controller.storeNeighboringValid = false;
		                    }
		                }
		            }
		            else {

		                var finaltokens = '';

		                for (var j = 0; j < tokensix.length; j++) {
		                    finaltokens += tokensix[j];

		                    if (tokensix.length - 1 > j) {
		                        finaltokens += ' ';
		                    }
		                }

		                $('#storeNeighboring').val(finaltokens);
		                controller.storeNeighboringTypeValid = false;

		                if (finaltokens != '') {
		                    controller.storeNeighboringValid = true;
		                }
		                else {
		                    controller.storeNeighboringValid = false;
		                }
		            }
		        }
		        else {
		            controller.storeNeighboringTypeValid = false;
		            controller.storeNeighboringValid = false;
		        }
		    }
		},
		
		storeLandmarkDataInTokens: function() 
		{
		 

		    // now save stuff
            ////////////////////////////////////////////////////////////

			// :TODO: Refactor and store back in semi-normalized fashion
		
			// Specifically, create each token by concatenating the various inputs in different ways.
				
		    // e.g. landmarkToken1 = $('#storeDistMiles').val() + " miles " + $('#storeDistDirection').val();
			
			//siteCoreLibrary.stores[0].landmarkToken1 = $('#storeDistMiles').val();

		    var token2 = $('#storeDistMiles').val();

		    if (token2 > 1) {
		        token2 += ' miles ';
		    }
		    else {
		        token2 += " mile ";
		    }

		    token2 += $('#storeDistDirection').val();

		    siteCoreLibrary.stores[0].landmarkToken2 = token2;

			siteCoreLibrary.stores[0].landmarkToken3 = $('#storeLandmark').val();
			siteCoreLibrary.stores[0].landmarkToken4 = $('#storeStreet').val();
			siteCoreLibrary.stores[0].landmarkToken5 = $('#storeCrossStreet').val();

			var token6 = '';

			var radioval = $('input[name="storeNeighboringType"]:checked').val();

			token6 = radioval;
			token6 += ' ';

			token6 += $('#storeNeighboring').val();

			siteCoreLibrary.stores[0].landmarkToken6 = token6;
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
		
		performInitCallbacks: function() {
			var controller = this;
			$.each(controller.postInitCallbacks, function(i,callback) {
				if (typeof callback == "function")
					callback();
			});
		},
		
		checkRestoreButtonVisibility: function() {
			
			var controller = this;
			
			if ($("#store-photo-item").attr("src") != marcomUserData.$constants.defaultStorePhotoUrl)
			{
				$(".btn-store.btn-restore-default").removeClass('none');
			}
			else
			{
				$(".btn-store.btn-restore-default").addClass('none');
			}
			
			if ($("#manager-photo-item").attr("src") != marcomUserData.$constants.defaultManagerPhotoUrl)
			{
				$(".btn-manager.btn-restore-default").removeClass('none');
			}
			else
			{
				$(".btn-manager.btn-restore-default").addClass('none');
			}
		     
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

		onSelectAllServices: function() {
		    //$('input[name="storeService"]').prop('checked', true);
		    var visible_count = $('input[name="storeService"]').length;
		    var checked_count = $('input[name="storeService"]:checked').length;
		    $('input[name="storeService"]:visible').prop('checked', (visible_count != checked_count));
		},

		onChangePreviewInput: function() {
			var controller = this;
			controller.storeLandmarkDataInTokens();
			controller.refreshLandmarkPreview();
		},

		onUploadStorePhoto: function (event) {

			var controller = this;
			event.preventDefault();

		    $('#storenumberhidden').val(controller.storeNumber);
			$("#uploader_form_1 input[name='ImageType']").val("store_" + siteCoreLibrary.stores[0].storeNumber + "_" + Date.now().toString());
			
			$("#store-photo-item").attr("src","https://placeholdit.imgix.net/~text?txtsize=24&txt=Loading...&w=150&h=150");

		    siteCoreLibrary.addStoreImage(new FormData($('#uploader_form_1')[0]), function (err, data) {
		        controller.savenewStoreImageId = data.results.id;
		        controller.savenewStoreImageUrl = data.results.url;
		        $("#store-photo-item").attr("src", controller.savenewStoreImageUrl);
				controller.checkRestoreButtonVisibility();
		    });

		},

		onRestoreStorePhoto: function (event) {

			var controller = this;

		    controller.savenewStoreImageId = marcomUserData.$constants.defaultStorePhotoId;
		    controller.savenewStoreImageUrl = marcomUserData.$constants.defaultStorePhotoUrl;

		    $("#store-photo-item").attr("src", marcomUserData.$constants.defaultStorePhotoUrl);

			controller.checkRestoreButtonVisibility();
		},

		onUploadManagerPhoto: function(event) {

			var controller = this;

		    event.preventDefault();

		    $('#storenumberhidden').val(controller.storeNumber);

			$("#uploader_form_3 input[name='ImageType']").val("manager_" + siteCoreLibrary.stores[0].storeNumber + "_" + Date.now().toString());

			$("#manager-photo-item").attr("src","https://placeholdit.imgix.net/~text?txtsize=24&txt=Loading...&w=150&h=150");

		    siteCoreLibrary.addStoreImage(new FormData($('#uploader_form_3')[0]), function (err, data) {
		        controller.savenewManagerImageId = data.results.id;
		        controller.savenewManagerImageUrl = data.results.url;
		        $("#manager-photo-item").attr("src", controller.savenewManagerImageUrl);
				controller.checkRestoreButtonVisibility();
		    });

		},

		onRestoreManagerPhoto: function (event) {

			var controller = this;

		    controller.savenewManagerImageId = marcomUserData.$constants.defaultManagerPhotoId;
		    controller.savenewManagerImageUrl = marcomUserData.$constants.defaultManagerPhotoUrl;

		    $("#manager-photo-item").attr("src", marcomUserData.$constants.defaultManagerPhotoUrl);

			controller.checkRestoreButtonVisibility();
		},

		onChangeClosedOn: function() {

		},
		
		onSave: function () {

		    // landmark

		    /*storeDistMilesValid : false,
		    storeDistDirectionValid : false,
		    storeLandmarkValid : false,
		    storeStreetValid : false,
		    storeCrossStreetValid : false,
		    storeNeighboringTypeValid: false,
		    storeNeighboringValid : false,*/

		    if (controller.storeDistMilesValid == false ||
                controller.storeDistDirectionValid == false ||
                controller.storeLandmarkValid == false ||
                controller.storeStreetValid == false ||
                controller.storeCrossStreetValid ==  false ||
                controller.storeNeighboringTypeValid == false ||
                controller.storeNeighboringValid == false) {

		        toastr.error("Unable to save store, you need to correct your landmark information before saving!");
		        return;
		    }

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
		},

		onCancel: function () {
		    window.location.href = marcomUserData.$constants.storePagesUrl;
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
