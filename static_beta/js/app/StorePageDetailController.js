/* StorePageDetail Controller
 * @NOTE - The Store Pages URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/CustomPage.aspx?uigroup_id=479602&page_id=10792
 *
 * @description - Loads Store Pages template markup
 * @filename - StorePagesController.js
 * @author - John Smith : Epsilon 2016
 */

// This is a hard-coded snapshot that overrides the <script> tag
// Remove this once https://adobe-prod-vioc.epsilon.com/jssp/vioc/siteCoreLibrary.jssp is stable.

// START SNAPSHOT
var SiteCoreLibrary = (function () {
    function SiteCoreLibrary($) {
        this.settings = {
            'Services': [],
            'Features': [],
            'Careers': [],
            'Holidays': [],
            'ExpirationTypes': [],
            'AmountTypes': [],
            'OfferTypes': [],
            'FeatureIcons': [],
            'Status': []
        };
        this.stores = [
            { 'AB0001': {} }
        ];
        this._storesOriginal = [
            { 'AB0001': {} }
        ];
        /**
         * Initializes the SiteCoreLibrary by contacting SiteCore.  During init, it will:
         * - Pull down all Settings from SiteCore.
         * - Call back upon completion.
         *
         * @param {requestCallback} cb - A callback that triggers upon completion.  Provides 1 parameter: "error" (false or string)
         */
        this.init = function (cb) {
            var self = this;
            // :TODO: Call SiteCore at ~/sitecore/services/Settings endpoint and store the results in this.settings.
            // Trigger the callback
            jQuery.get( "https://vioc.d.epsilon.com/storeapi/settings.ashx", function(data) {   // :FEEDBACK: Move this path to a global constant / property
                self.settings.Services = data.results.services;
                self.settings.Features = data.results.features;
                self.settings.Careers = data.results.careers;
                self.settings.Holidays = data.results.holidays;
                self.settings.ExpirationTypes = data.results.expirationtypes;
                self.settings.AmountTypes = data.results.amounttypes;
                self.settings.OfferTypes = data.results.offertypes;
                self.settings.FeatureIcons = data.results.featureicons;
                self.settings.Status = data.status;

                //console.log(data);
                //console.log(self.settings);
                console.log("Init complete!");
                cb(null);
            });
        };
        /**
         * Retrieves store information from the SiteCore API and stores it in memory.
         *
         * Developer Note: When pulling data, write it to both this.stores and this._storesOriginal;
         *
         * @param {array} stores - An array of store numbers.  e.g. ["AB001", "AB002"], etc.  See LU_STORE_LV.@STORE_NUMBER for examples.
         * @param {function} callback - A callback that triggers upon completion.  Provides 1 parameter: "error" (false or string)
         */
        this.loadStores = function (stores, cb)
        {
            var self = this;

            self.stores = [];
            self._storesOriginal = [];

            var ajajCallsRemaining  = stores.length;

            for (var i = 0; i < stores.length; i++) {
                jQuery.get( "https://vioc.d.epsilon.com/storeapi/storequery.ashx?Id=" + stores[i] + "&Fields=ALL", function(data) {

                  self.stores.push(data.results[0]);
                  self._storesOriginal.push(data.results[0]);

                  --ajajCallsRemaining;
                  if (ajajCallsRemaining <= 0) {
                    cb(null);
                  }
                });
            };
        };
        /**
        };
        /**
         * Retrieves store information from the SiteCore API and stores it in memory.
         *
         * @param {string} companyCode - A 3-4 character company code.  See LU_STORE_LV.@STORE_companyCode for examples.
         * @param {function} callback - A callback that triggers upon completion.  Provides 1 parameter: "error" (false or string)
         */
        this.loadStoresByFranchise = function (companyCode, cb)
        {
          var self = this;

          jQuery.get( "https://vioc.d.epsilon.com/storeapi/storequery.ashx?FranchiseId=" + companyCode + "&Fields=ALL", function(data) {

                self.stores = data.results;
                self._storesOriginal = data.results.slice(0);

                //console.log(self.stores);
                //console.log(self._storesOriginal);
                cb(null);
            });
        };
        /**
         * Triggers a form to post to the /imageUpload.jssp API within Campaign.  This API will store the image on the media server and return a unique file URL.
         * This method will then return the path to the image, which can then be set as necessary.
         *
         * @param {function} callback - A callback that triggers upon completion.  Provides 1 parameter: "error" (false or string)
         */
        /*this.uploadImage = function('myForm', function(error, fileUrl) {
         if (error == false) alert('The file was uploaded to ' + fileUrl);
         } );*/
        /*
         this.addFeature();
         this.removeFeature();

         this.addService();
         this.removeService();

         this.addHoliday();
         this.removeHoliday();

         this.featureMeta = {};
         this.createFeature();

         this.careerMeta = {}
         this.createCareer()
         this.deleteCareer()

         this.newsMeta = {};

         */

         this.createNews = function(newsItem, cb)
         {
            jQuery.ajax({
                  type: 'POST',
                  url: 'https://vioc.d.epsilon.com/storeapi/news.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(newsItem),
                  dataType: "json",
                  crossdomain: true,
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }

         this.modifyNews = function(newsItem, cb)
         {
            jQuery.ajax({
                  type: 'PUT',
                  url: 'https://vioc.d.epsilon.com/storeapi/news.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(newsItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }

         this.deleteNews = function(newsItem, cb)
         {
            jQuery.ajax({
                  type: 'DELETE',
                  url: 'https://vioc.d.epsilon.com/storeapi/news.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(newsItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }


         this.createOffer = function(newsItem, cb)
         {
            jQuery.ajax({
                  type: 'POST',
                  url: 'https://vioc.d.epsilon.com/sitecore/services/Offer',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(newsItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }

         this.modifyOffer = function(newsItem, cb)
         {
           jQuery.ajax({
                  type: 'PUT',
                  url: 'https://vioc.d.epsilon.com/sitecore/services/Offer',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(newsItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }

         this.deleteOffer = function(newsItem, cb)
         {
            jQuery.ajax({
                  type: 'DELETE',
                  url: 'https://vioc.d.epsilon.com/sitecore/services/Offer',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(newsItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
        /**
         * Pushes modified stores back to SiteCore.  If a store load is in progress,
         * this command will wait until the loading is complete before saving.
         *
         * @param {function} progress - A callback that triggers as progress is made.  Provides 1 parameter: "progress" (integer)
         * @param {function} complete - A callback that triggers upon completion.  Provides 1 parameter: "error" (false or string)
         */
        this.save = function (cbprogress, cbcomplete) {
            var self = this;

            var toModifyList = [];

            for (var i = 0; i < this.stores.length; i++){
              var storeID = this.stores[i].id;

              for (var t = 0; t < this._storesOriginal.length; t++) {
                var originalStoreID = this._storesOriginal[t].id;

                if (originalStoreID == storeID) {
                  var originalStoreJSON = JSON.stringify(this._storesOriginal[t]);
                  var storeJSON = JSON.stringify(this.stores[i]);

                  if (originalStoreJSON != storeJSON) {
                    console.log(originalStoreJSON + " --- " + storeJSON);
                    toModifyList.push(storeJSON);
                  }
                }
              }
            }

            var ajajCallsRemaining  = toModifyList.length;

            for (var i = 0; i < toModifyList.length; i++) {
                jQuery.ajax({
                        type: 'PUT',
                        url: 'https://vioc.d.epsilon.com/storeapi/storeupdate.ashx',
                        headers: {
                            "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                        },
                        data: toModifyList[i],
                        dataType: "json",
                        success: function (data)
                        {
                          --ajajCallsRemaining;
                          if (ajajCallsRemaining <= 0) {
                            cbcomplete(null, null);
                          }
                          cbprogress(ajajCallsRemaining);
                        },
                        error: function (jqXHR, textStatus, errorThrown)
                        {
                          --ajajCallsRemaining;
                          if (ajajCallsRemaining <= 0) {
                            cbcomplete(null, null);
                          }
                          cbprogress(errorThrown, null);
                        }
                    });
            }
        };
    }
    return SiteCoreLibrary;
}(jQuery));
// END SNAPSHOT

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
		previewMap: {
			// Source						// Variable
			"#storeDistMiles"				: "storeDistMiles",
			"#storeDistDirection"			: "storeDistDirection",
			"#storeLandmark"				: "storeLandmark",
			"#storeStreet"					: "storeStreet",
			"#storeCrossStreet"				: "storeCrossStreet",
			"input[name='storeNeighboringType']:checked"			: "storeNeighboringType",
			"#storeNeighboring"				: "storeNeighboring"
		},

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
			// Listen to Preview-area Inputs
			// -------------------------------------
			var targets = [];
			for (var key in controller.previewMap) {
				targets.push(key);
			}
			$("input[name='storeNeighboringType']").change(function() { controller.onChangePreviewInput() });
			$(targets.join(",")).change(function() { controller.onChangePreviewInput() });
			$(targets.join(",")).keyup(function() { controller.onChangePreviewInput() });

			// -------------------------------------
			// Listen for Photo Uploads
			// -------------------------------------

		},

		populateUI: function() {
			var controller = this;
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
			$(".store-services-list").html('');

			$.each(siteCoreLibrary.settings.Services, function(i, service) {
				var item = '<li class="list-item-default service-item col-sm-6">';
				item += '<label class="checkbox-default">';
				item += '<input class="checkbox-default-input" type="checkbox" data-id="' + service.id + '" name="' + service.name + '"/>' + service.name;
				console.log(service.webURL);
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
				item += '<input class="checkbox-default-input" type="checkbox" data-id="' + holiday.id + '" name="' + holiday.name + '"/>' + holiday.name;
				item += '<a style="margin-left: 8px" target="_blank" href="https://www.google.com/search?q=when+is+' + encodeURIComponent(holiday.name) + '"><span class="glyphicon glyphicon-info-sign"></span></a>';
				item += '</label></li>';

				var leading_zero = (holiday.month < 10) ? "0" : "";
				var leading_zero2 = (i < 10) ? "0" : "";
				items["seq_" + leading_zero + holiday.month.toString() + holiday.day.toString() + leading_zero2 + i.toString()] = item;
			});

			const ordered = {};
			Object.keys(items).sort().forEach(function(key) {
			  ordered[key] = items[key];
			});

			for (var idx in items)
			{
				$("ul.holidays").append(items[idx]);
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

			$.each(map, function(k,v) {
				$(k).val(siteCoreLibrary.stores[0][v]).change(function() {
					console.log("Setting " + v + " to " + $(this).val())
					siteCoreLibrary.stores[0][v] = $(this).val();
				});
			});
		},
		refreshLandmarkPreview: function() {

			var previewMap = controller.previewMap;
			var data = {};

			for (var key in previewMap) {
				var val = $(key).val();
				console.log("Retrieving value for " + key + " : " + val);
				if (val == undefined || val.trim() == "")
				{
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

					if (placeholder != "")
					$(key).val(placeholder);
				}

				data[previewMap[key]] = "<mark class='edit-" + previewMap[key] + "'>" + $(key).val() + "</mark>";
			}

			data["storeName"] = siteCoreLibrary.stores[0].name;
			$("#storeName").val(siteCoreLibrary.stores[0].name);


			$(".preview-content").html(Mustache.render($(".store-preview-template").html(), data));
			$(".preview-content").html($(".preview-content").html().replace(/&gt;/g,">").replace(/&lt;/g,"<"));

			for (var key in previewMap) {
				var name = previewMap[key];
				$(".edit-" + name).click(function() {
					var name = $(this).attr('class').replace("edit-", "");
					console.log("Clicked " + name);
					$j(".store-preview ~.form-item").addClass("none")
					$("." + name + "-container").removeClass("none");
				});
			}

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
