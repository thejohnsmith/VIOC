var getStoreProgramData = (function ($) {
	/* Use getHashParams.js to get programId */
	var $programId = getParameterByName('programId', window.location.href);
	var makeRequest = function () {
			// Make sure there's a User ID loaded from Marcom before we Init this script.
			if (marcomUserData.$user.externalId === '%%User.ExternalId%%' || $programId === undefined || $programId === null) {
				return;
			}
			var localDevUrl = 'data/getStoreProgramData.jssp';
			var marcomDevUrl = 'https://files.marcomcentral.app.pti.com/epsilon/static/data/getStoreProgramData.jssp';
			var acUrl = 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/getStoreProgramData.jssp';
			$.ajax({
				url: acUrl,
				type: 'GET',
				dataType: 'json',
				processData: true,
				data: {
					userId: marcomUserData.$user.externalId,
					programId: $programId
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).done(function (result) {
				loadStoreProgramData(result);
			}).fail(function () {
				requestFailed();
			});
		},
		loadStoreProgramData = function (result) {
			if ($('.program-enrollment-section').length) {
				$.get('https://files.marcomcentral.app.pti.com/epsilon/static/program-enrollment.mustache.html', function (templates) {
					var template = $(templates).filter('.program-enrollment-template').html();
					$('.program-enrollment-section').html(Mustache.render(template, result));
				}).done(function () {
					return getTotals(result);
				});
			}
			if ($('.program-settings-section').length) {
				$.get('https://files.marcomcentral.app.pti.com/epsilon/static/program-settings.mustache.html', function (templates) {
					var template2 = $(templates).filter('.program-settings-template').html();
					$('.program-settings-section').html(Mustache.render(template2, result));
					return reloadCheckBoxes();
				}).done(function () {
					return setHashLinks(),
						programSettingsHandler();
				}).promise().done(function () {
					programManagementController.controller.init();
				});
			}
			if ($('.quantity-limit-tab-section').length) {
				$.get('https://files.marcomcentral.app.pti.com/epsilon/static/quantity-limit-tab.mustache.html', function (templates) {
					var template3 = $(templates).filter('.quantity-limit-tab-template').html();
					$('.quantity-limit-tab-section').html(Mustache.render(template3, result));
					return;
				}).done(function () {
					programSettingsHandler();
					return;
				});
			}
		},
		setHashLinks = function () {
			var currentProgramId = getParameterByName('programId', window.location.href);
			if ($('.js-create-program-hash').length) {
				$('.js-create-program-hash').each(function () {
					$(this).attr('href', $(this).attr('href') + '&programId=' + currentProgramId);
				});
			}
		},
		programSettingsHandler = function () {
			customCheckAndRadioBoxes.customCheckbox();
			// 			$('.programsummary-table .store-enroll .btn.btn-primary, .programsummary-table .customCheckbox').on('click', function (e) {
			// 				e.preventDefault();
			// 				var $checkboxtype = $(this).attr('data-checkboxtype');
			// 				var $jsAllSelectable = $('.' + $checkboxtype + '-section .js-all-selectable:not(.disabled-input)');
			// 				var $selectedStoreCount = $('.' + $checkboxtype + '-section .customCheckbox.checked').length;
			// 				var $selectedStoreFooter = $('.' + $checkboxtype + '-footer');
			// 				var $selectedStoreFooterText = $('.' + $checkboxtype + '-footer-selected-count');
			//
			// 				console.log('$selectedStoreFooterText ' + $selectedStoreCount);
			//
			// 				// Update the visible count of selected programs.
			// 				$selectedStoreFooterText.text($selectedStoreCount);
			// 				// Show the bulk selection footer
			// 				$selectedStoreFooter.toggle($selectedStoreCount > 1);
			// 				$jsAllSelectable.addClass('checked').find($('input')).prop('checked', 'checked').focus();
			//
			// 				// Hide Additional Offers I fNeeded
			// 				programManagementController.controller.hideAdditionalOffersIfNeeded();
			// 			});
			//
			//
			// // Working to update the footer count!!
			// 			$('.program-settings-section .customCheckbox').click(function () {
			// 				// Update the visible count of selected programs.
			// 				var $selectedStoreCount_program = $('.program-settings-footer-selected-count');
			// 				$selectedStoreCount_program.text($('.program-settings-section td .customCheckbox.checked').length);
			//
			// 				// Show the bulk selection footer
			// 				$('.program-settings-section .program-settings-footer').toggle($('.program-settings-section td .customCheckbox.checked').length > 1);
			// 				programManagementController.controller.hideAdditionalOffersIfNeeded();
			// 			});
			// Working to update the footer count!!
			// $('.quantity-limit-tab-section .customCheckbox').click(function () {
			// 	// Update the visible count of selected programs.
			// 	var $selectedStoreCount_quantity = $('.quantity-limit-footer-selected-count');
			// 	$selectedStoreCount_quantity.text($('.quantity-limit-tab-section td .customCheckbox.checked').length);
			//
			// 	// Show the bulk selection footer
			// 	$('.quantity-limit-footer').toggle($('.quantity-limit-tab-section td .customCheckbox.checked').length > 1);
			// 	programManagementController.controller.hideAdditionalOffersIfNeeded();
			// });
		},
		reloadCheckBoxes = function () {
			return customCheckAndRadioBoxes.customCheckbox();
		},
		getTotals = function (channel) {
			Array.prototype.sum = function (prop) {
				var total = 0;
				for (var i = 0, _len = this.length; i < _len; i++) {
					total += this[i][prop];
				}
				return total;
			};
			var channels = [{
				channel: 'costEstimateTotal'
			}, {
				channel: 'channelEmailTotal'
			}, {
				channel: 'channelDMTotal'
			}, {
				channel: 'channelSMSTotal'
			}];
			for (var i = 0; i < channels.length; i++) {
				(function (i) {
					this.output = function () {
						returnTotals(this.channel);
					};
					this.output();
				}).call(channels[i], i);
			}
		},
		returnTotals = function (e) {
			var newSum = 0;
			var newCostSum = 0;
			/**
			 * Added correct currecy decimal places.
			 **/
			$('.costEstimateTotal').each(function () {
				var num = Number($(this).text());
				var n = num.toFixed(2);
				$(this).text(n);
			});
			/**
			 * Calculate the grand total for Email, DM and SMS from all stores enrolled.
			 **/
			$('.store-item[data-enrolled="true"] .store-counts .' + e).each(function () {
				newSum += parseFloat($(this).text());
			}).promise().done(function () {
				$('.grand-total .' + e).text(newSum);
			});
			/**
			 * Calculate grand total for Estimated Monthly Cost.
			 * Adds currecy decimal places
			 **/
			$('.store-item[data-enrolled="true"] .store-cost .costEstimateTotal').each(function () {
				newCostSum += parseFloat($(this).text());
			}).promise().done(function () {
				$('.grand-total .costEstimateTotal').text(newCostSum.toFixed(2));
			});
		},
		requestFailed = function () {
			$('.program-select').html('There was a problem fetching your programs.' + 'Please check back again later.');
			$('.alert-container').html('<div class="alert-main alert-danger">Error: There was a problem loading the store data.</div>').fadeIn();
			return console.warn('An internal error has occurred.');
		};
	return {
		makeRequest: makeRequest,
		loadStoreProgramData: loadStoreProgramData,
		setHashLinks: setHashLinks,
		programSettingsHandler: programSettingsHandler,
		reloadCheckBoxes: reloadCheckBoxes,
		getTotals: getTotals,
		returnTotals: returnTotals,
		requestFailed: requestFailed
	};
})(jQuery);

getStoreProgramData.makeRequest();
