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
					controller.ShowUI();
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

			controller.EventHandlers();
			if (typeof callback == 'function') {
				callback();
			}
		},
		EventHandlers: function () {
			var controller = this;
			// Show All News items
			$('.storeNewsEventsPromotionsShowAll').on('click', function () {
				$('.storeNewsEventsPromotionsShowAllItem').show();
				$('.storeNewsEventsPromotionsShowActive').css({
					'visibility': 'visible'
				});
			});
			$('.storeNewsEventsPromotionsShowActive').on('click', function () {
				$('.storeNewsEventsPromotionsShowAllItem').hide();
				$('.newsEventPromotionItem.storeNewsEventsPromotionsShowActiveItem').show();
				$(this).css({
					'visibility': 'hidden'
				});
			});

			$('.storeCareersShowAll').on('click', function () {
				$('.storeCareersShowAllItem').show();
			});

			// Text toggle, usefull for reuse
			// - John Smith
			// $(this).text(function (i, text) {
			// 	return text === "Show all" ? "Show scheduled/active only" : "Show all";
			// })

			$('.storePages.navBarSelectedLinkColor').show();
			// Delete Offer
			$('.deleteOffer > button, .delete-offer-btn').on('click', function (e) {
				e.preventDefault();
				var data = $(this).data();
				return controller.DeleteOffer(data);
			});

			// Select Date Radio
			$('.offer-form input[type=date]').on('click', function () {
				return $('#specificDate').attr('checked', true);
			});

			// Select All - Checkboxes
			$('.offer-form .select-all').on('click', function (e) {
				e.preventDefault();
				return $('.checkbox-default-input').attr('checked', true);
			});

			// Redirect Cancel Button
			$('.offer-form .cancel-btn').on('click', function (e) {
				e.preventDefault();
				var data = $(this).data();
				var pageurl = {};
				pageurl = data.pageurl;
				console.info('pageurl type %o, ', typeof pageurl); // string
				return window.location = marcomUserData.$constants.storePagesUrl;
			});

			// Save Button Handler
			$('.save-btn').on('click', function (e) {
				e.preventDefault();
				return;
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
		ShowUI: function () {
			var controller = this;

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
				data[i].href = marcomUserData.$constants.storeDetailsUrl + "&storeId=" + data[i].storeId;
			});
			var target_css_selector = "#storePage-storeTable-Section";

			$(target_css_selector).html(Mustache.render(template, data));

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
