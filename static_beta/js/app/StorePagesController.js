/* StorePages Controller
 * @NOTE - The Store Pages URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/CustomPage.aspx?uigroup_id=479602&page_id=10792
 *
 * @description - Loads Store Pages template markup
 * @filename - StorePagesController.js
 * @author - John Smith : Epsilon 2016
 */

var StorePagesController = StorePagesController || (function ($) {
	'use strict';
	var controller = {
		apiPath: marcomUserData.$constants.apiPath,
		user_id: marcomUserData.$user.externalId,
		store_data: [],
		intervalHandle: null,
		init: function () {
			var controller = this;
			programManagementFilters.controller.init();
			controller.ConfigureFilters();
			controller.AdjustUI(function () {
				controller.getStoreProgramData(function () {
					controller.ShowUI(function() {
						controller.TapIntoFilterChanges();
					});
				});
			});
		},
		ConfigureFilters: function () {
			if (!$('#sortable').length === 0) {
				console.debug('sortable will not configure filters');
				programManagementFilters.controller.init();
			}
		},
		AdjustUI: function (callback) {
			var controller = this;
			controller.SetNavigation();
			controller.InitializeTabs();

			if (typeof callback == 'function') {
				callback();
			}
		},
		
		TapIntoFilterChanges: function() {
			var controller = this;
			// This area gets a little magical.  programManagementFilter.js wasn't built with proper encapulation,
			// so I'm hacking it's onFilterChange function to notify us when things change.
			programManagementFilters.controller.onFilterChangeOriginal = programManagementFilters.controller.onFilterChange;
			programManagementFilters.controller.onFilterChange = controller.onFilterChange;
			controller.onFilterChange(programManagementFilters.controller.store_ids);
		},
		
		onFilterChange: function(storeIds) {
			// Call the original functionality of the store filter
			programManagementFilters.controller.onFilterChangeOriginal(storeIds);
			
			// Do our custom add-on
			controller.setOfferDetails();
		},
		
		setOfferDetails: function() {

			var tagTemplate = $('.offer-tag-template').html();
			var newTagTemplate = $('.new-offer-tag-template').html();
			
			$.each($j("tr.store-item"), function(i,tr) {
				if ($(tr).hasClass('hide')) return;
				
				var storeNumber = $(tr).attr('data-store-number');
				var storeIndex = null;
				$.each(siteCoreLibrary.stores, function(i,store) {
					if (store.storeNumber == storeNumber)
					{
						if (store.offers != undefined && store.offers.length > 0)
						{
							$(tr).find(".tag-container").html('');
							$.each(store.offers, function(i2, offer) {
								offer.tooltip = offer.offerType.name + " - " + offer.offerType.longText;
								offer.tooltip = $("<textarea/>").html(offer.tooltip).text(); // A little HTML entity decoding trick
								$(tr).find(".tag-container").append(Mustache.render(tagTemplate, offer));
							})
								$(tr).find(".tag-container").append(Mustache.render(newTagTemplate, {}));
						}
						else
						{
							$(tr).find(".tag-container").html('No Offers&nbsp;&nbsp;&nbsp;&nbsp;' + Mustache.render(newTagTemplate, {}));
						}
					}
				});
			});
			
			$.each($(".edit-offer-tag"), function(i,e)  {
				var offerId = $(e).attr('data-id');
				var storeNumber = $(e).closest("tr").attr('data-store-number');
				var url = marcomUserData.$constants.storePagesEditOfferUrl + "&storeNumber=" + storeNumber + "&offerId=" + offerId;
				$(e).attr('href', url)
			});
			
			$(".create-offer-tag").attr('href', marcomUserData.$constants.storePagesEditOfferUrl);
			
			$(".remove-offer-tag").click(controller.RemoveOffer);
			
			$j('[data-toggle="tooltip"]').tooltip();
		},
		
		/*RemoveOffer: function(e) {
			jConfirm("Remove this offer?", 'Please Confirm', function(r) {
				if (!r) return;
				var offerId = $(e.target).closest(".remove-offer-tag").attr('data-id');
				var storeNumber = $(e.target).closest('tr.store-item').attr('data-store-number');
				var targetStoreIndex = null;
				var targetOfferIndex = null;
				console.log("Removing offer " + offerId + " from store " + storeNumber);
				$.each(siteCoreLibrary.stores, function(i,store) {
					if (store.storeNumber == storeNumber)
					{
						if (store.offers != undefined)
						{
							$.each(store.offers, function(i2, offer) {
								if (offer.id == offerId)
								{
									targetStoreIndex = i;
									targetOfferIndex = i2;
								}
							})
						}
					}
				})

				if (targetStoreIndex != null && targetOfferIndex != null)
				{
					siteCoreLibrary.stores[targetStoreIndex].offers.splice(targetOfferIndex,1);
					$(e.target).closest(".remove-offer-tag").parent().remove();
					siteCoreLibrary.save();
					toastr.success("Offer removed!");
				}
			});
		},*/

		RemoveOffer: function(e) {
		    jConfirm("Remove this offer?", 'Please Confirm', function (r) {
		        if (!r) return;
		        var offerId = $(e.target).closest(".remove-offer-tag").attr('data-id');
		        var storeNumber = $(e.target).closest('tr.store-item').attr('data-store-number');

		        siteCoreLibrary.getOffer(offerId, function (err, data) {

		            for (var i = 0; i < data.results.stores.length; i++) {
		                if (data.results.stores[i].storeNumber === storeNumber) {
		                    data.results.stores.splice(i, 1);
		                    break;
		                }
		            }

		            siteCoreLibrary.modifyOffer(data.results, function (err, data) {

		                if (!err) {
		                    $(e.target).closest(".remove-offer-tag").parent().remove();
		                    toastr.success("Offer removed!");
		                }
		            });
		        });
		    });
		},
		
		InitializeTabs: function () {
			if ($('#parentHorizontalTab').length < -1) {
				return false;
			}
			$('#parentHorizontalTab').easyResponsiveTabs({
				type: 'default', // Types: default, vertical, accordion
				width: 'auto', // auto or any width like 600px
				fit: true, // 100% fit in a container
				tabidentify: 'hor_1', // The tab groups identifier
				activate: function (event) { // Callback function if tab is switched
					var $tab = $(this);
					var $info = $('#nested-tabInfo');
					var $name = $('span', $info);
					$name.text($tab.text());
					$info.show();
				}
			});
		},
		/**
		 * [SetNavigation Set navigation state]
		 */
		SetNavigation: function () {
			var controller = this;
			$('.navBarItem > a').filter(function () {
				return $(this).text() === 'STORE PAGES';
			}).addClass('navBarSelectedLinkColor, customColorOverridable').removeClass('navBarEnhancedLinkColor');
			return this;
		},

		ShowUI: function (cb) {
			var controller = this;
			var franchiseList = {};

			$('.js-content').fadeIn();
			$('.js-loading').hide();

			// Load a mustache template out of the DOM, fill it with data and put it back
			var template = $('.storePage-storeTable-template').html();
			if (template === null) {
				return false
			}
			var data = controller.store_data;
			$.each(data, function (i, e) {
				franchiseList[data[i].franchiseCode] = data[i].franchiseCode;
				data[i].href = marcomUserData.$constants.storeDetailsUrl + "&storeId=" + data[i].storeId + "&storeNumber=" + data[i].storeNumber;
			});
			var target_css_selector = "#storePage-storeTable-Section";

			$(target_css_selector).html(Mustache.render(template, data));
			
			// Now load in sitecore data
			var requestQueue = 0;
			for(var idx in franchiseList)
			{
				var code = franchiseList[idx];
				requestQueue++;
				siteCoreLibrary.loadStoresByFranchise(code, function() {
					requestQueue--;
					if (requestQueue == 0)
						controller.setOfferDetails();
				});
			}
			
			cb()

		},
		getMustacheTemplate: function (filename, extraction_css_selector, target_css_selector, data, callback) {
			var controller = this;
			var template_key = filename.replace(".", "");

			var fillContent = function (template, data) {
				// controller.timeDebug("Filling " + target_css_selector + ' with ' + data.length + ' data elements.')
				$(target_css_selector).html(Mustache.render(template, data));
				// controller.timeDebug("Done filling " + target_css_selector + ' with ' + data.length + ' data elements.')
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
		getStoreProgramData: function (callback) {
			var controller = this;
			$.get(controller.apiPath + 'getStoreProgramData.jssp?userId=' + encodeURIComponent(controller.user_id) + '&programId=1', function (results) {
				var json_results = DoNotParseData(results);
				controller.store_data = json_results;
				if (typeof callback == 'function') callback(json_results);
			});
		}
	};
	return {
		controller: controller,
		showUI: controller.ShowUI
	};
})(jQuery);
