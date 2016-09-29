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
						controller.EventHandlers();
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
			controller.UpdateBreadCrumbs();
			controller.InitializeTabs();
			controller.SetupSortable();
			// controller.CountChar();

			if (typeof callback == 'function') {
				callback();
			}
		},
		EventHandlers: function () {
			var controller = this;
	
			// Offer Tag Handler
			$('.offer-tag').on('click', function (e) {
				var id = $(this).attr('data-id');
				window.location.href = "CustomPage.aspx?uigroup_id=479602&page_id=13095&offerId=" + id;
				e.preventDefault();
				return;
			});
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
			console.log("Filter changed")
			// Call the original functionality of the store filter
			programManagementFilters.controller.onFilterChangeOriginal(storeIds);
			
			// Do our custom add-on
			controller.setOfferDetails();
		},
		
		setOfferDetails: function() {

			var tagTemplate = $('.offer-tag-template').html();
			
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
								$(tr).find(".tag-container").append(Mustache.render(tagTemplate, offer));
							})
						}
						else
						{
							$(tr).find(".tag-container").html('No Offers');
						}
					}
				});
			});
			
			$(".tag").click(function(e) {
				var offerId = $(e.target).attr('data-id');
				var storeNumber = $(e.target).closest("tr").attr('data-store-number');
				window.location.href = marcomUserData.$constants.storePagesEditOfferUrl + "&storeNumber=" + storeNumber + "&offerId=" + offerId;
			});
		},
		
		CountChar: function (e, maxLength) {
			var controller = this;
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

			// try {
			// 	e.val().length
			// } catch (e) {
			// 	console.info('An error in CountChar occured.');
			// } finally {
			// 	if (e.val().length >= maxLength) {
			// 		e.val(e.val().substr(0, maxLength));
			// 		console.info('...e.val - %O', e.val);
			// 	} else {
			// 		$('.characterLimitText').text(maxLength - e.val().length);
			// 	}
			// }
			// @OLD CODE
			// $('.characterLimitInput').keyup(function (e) {
			// 	e = $(this);
			// 	var maxLength = e.attr('maxlength');
			// 	return controller.CountChar(e, maxLength)
			// });
		},
		EditOffer: function () {
			var controller = this;
		},
		DeleteOffer: function (data) {
			var controller = this;
			var offerId = {};
			var storeId = {};
			offerId = data.offerid;
			storeId = data.storeid;

			jConfirm('Are you sure you want to delete these settings?', 'Please Confirm', function (r) {
				if (r) {
					$('#sortable .store-item[data-storeid="' + offerId + '"]').hide();

					// TODO this is temp and only for UI checking.
					// We will incorporate actual deletion in the next sprint.
					controller.HandleEmptyTable();
					toastr.success('Store no longer enrolled.');
					return window.location = marcomUserData.$constants.storePagesUrl;

					// STUB
					//  controller.deleteSettings(selectedConfigId, function () {
					// 	controller.hardUIRefresh();
					// 	controller.buildUI(controller.store_data);
				}

			});
		},
		HandleEmptyTable: function () {
			var sortable = $('#sortable');
			var visibleOffers = sortable.find('.store-item:visible');

			visibleOffers = visibleOffers.length;
			if (typeof visibleOffers === 'number' && visibleOffers === 0) {
				sortable.find('.error').fadeIn('slow');
			}
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
		SetupSortable: function () {
			if ($('#sortable').length < 1) {
				return false;
			}
			try {
				Sortable.create(sortable, {
					handle: '.handle',
					ghostClass: 'ghost',
					draggable: '.store-item',
					sort: true
				});
			} catch (e) {
				console.error('error=' + e);
				if (typeof (console) != 'undefined') {
					console.log(e);
				}
				return false;
			}
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
		/**
		 * [UpdateBreadCrumbs Custom breadcumb handler]
		 */
		UpdateBreadCrumbs: function () {
			// var controller = this;

			// Set 1st Level Breadcrumb

			// Set 2nd Level Breadcrumb
			// $('.breadcrumbs_previous:first a').html();
			// $('.breadcrumbs_previous:first a').attr('href', '');

			// Set 3rd Level Breadcrumb
			// $('.breadcrumbs_previous:last a').html();
			// $('.breadcrumbs_previous:last a').attr('href', '');

		},
		ShowUI: function (cb) {
			var controller = this;
			var franchiseList = {};

			$('.js-content').fadeIn();
			$('.js-loading').hide();

			// Load a mustache template out of the DOM, fill it with data and put it back
			var template = $('.storePage-storeTable-template').html();
			console.log("Template is: %O", template);
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
				console.log("Loading Franchise " + code);
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
