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
		intervalHandle: null,
		init: function () {
			var controller = this;
			programManagementFilters.controller.init();
			controller.AdjustUI(function () {
				controller.ShowUI();
			});
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

			// Character Limits
			// $('.characterLimitInput').keyup(function (e) {
			// 	e = $(this);
			// 	var maxLength = e.attr('maxlength');
			// 	return controller.CountChar(e, maxLength)
			// });

			$('.characterLimitInput').each(function characterLimit() {
				$(this).characterCounter({
					maxChars: $(this).attr('maxlength'),
					maxCharStatic: true,
					counterNeeded: true,
					remainingNeeded: true,
					chopText: true,
					shortFormat: true,
					shortFormatSeparator: ' ',
					positionBefore: false,
				});
			});
		},
		CountChar: function (e, maxLength) {
			var controller = this;
			try {
				e.val().length
			} catch (e) {
				console.info('An error in CountChar occured.');
			} finally {
				if (e.val().length >= maxLength) {
					e.val(e.val().substr(0, maxLength));
					console.info('...e.val - %O', e.val);
				} else {
					$('.characterLimitText').text(maxLength - e.val().length);
				}
			}
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
			controller.CallNg();
		},
		CallNg: function () {
			// console.info('CallNg %o ', this);
			// var app = angular.module('masterApp', []);
			// app.controller('myCtrl', function($scope) {
			// 	$scope.firstName= "John";
			// 	$scope.lastName= "Doe";
			// });

		}
	};
	return {
		controller: controller,
		showUI: controller.ShowUI
	};
})(jQuery);
