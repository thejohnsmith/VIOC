var getStoreProgramData = (function ($) {
	/* Use getHashParams.js to get programId */
	var $programId = getParameterByName('programId', window.location.href);
	var marcomFilePath = marcomUserData.$constants.marcomFilePath;
	var storeProgramData = null;

	var makeRequest = function () {
			var controller = this;
			// Make sure there's a User ID loaded from Marcom before we Init this script.
			if (marcomUserData.$user.externalId === '%%User.ExternalId%%' || $programId === undefined || $programId === null) {
				return;
			}
			var apiPath = marcomUserData.$constants.apiPath + 'getStoreProgramData.jssp';
			$.ajax({
				url: apiPath,
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
				controller.storeProgramData = result;
				loadStoreProgramData(result);
			}).fail(function () {
				requestFailed();
			});
		},
		loadStoreProgramData = function (result) {
			$.get(marcomFilePath + 'program-enrollment.mustache.html', function (templates) {
				var template = $(templates).filter('.program-enrollment-template').html();
				$('.program-enrollment-section').html(Mustache.render(template, result));

				// Set the initial state of the toggle buttons.
				if ($('[data-enrolled="true"] .toggle-btn')) {
					$('[data-enrolled="true"] .toggle-btn').addClass('active').prop('checked', 'checked');
				}
			}).done(function () {
				getTotals(result);
			});
			$.get(marcomFilePath + 'program-settings.mustache.html', function (templates) {
				var template2 = $(templates).filter('.program-settings-template').html();
				$('.program-settings-section').html(Mustache.render(template2, result));
				reloadCheckBoxes();
			}).done(function () {
				setHashLinks(),
					programSettingsHandler();
			}).promise().done(function () {
				programManagementController.controller.init();
				programManagementFilters.controller.onFilterChange(programManagementFilters.controller.store_ids)
			});
			$.get(marcomFilePath + 'proof-settings-tab.mustache.html', function (templates) {
				var template3 = $(templates).filter('.proof-settings-tab-template').html();
				$('.proof-settings-tab-section').html(Mustache.render(template3, result));
			}).done(function () {
				programSettingsHandler();
			});
			if ($('.quantity-limit-tab-section').length) {
				$.get(marcomFilePath + 'quantity-limit-tab.mustache.html', function (templates) {
					var template4 = $(templates).filter('.quantity-limit-tab-template').html();
					$('.quantity-limit-tab-section').html(Mustache.render(template4, result));
				}).done(function () {
					programSettingsHandler();
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
			$('.filterable:visible .store-item[data-enrolled="true"] .store-counts .' + e).each(function () {
				var n = parseFloat($(this).text());
				n = (isNaN(n)) ? 0 : n;
				newSum += n;
			}).promise().done(function () {
				newSum = (isNaN(newSum)) ? "Not Available" : newSum;
				$('.grand-total .' + e).text(newSum);
			});
			/**
			 * Calculate grand total for Estimated Monthly Cost.
			 * Adds currecy decimal places
			 **/
			$('.filterable:visible .store-item[data-enrolled="true"] .store-cost .costEstimateTotal').each(function () {
				var n = parseFloat($(this).text());
				// console.log("Found Total : " + n + " (" + typeof n + ")");
				newCostSum += (isNaN(n)) ? 0 : n;
			}).promise().done(function () {
				// console.log("grandTotal is " + newCostSum + " (" + typeof newCostSum + ")");
				var grandTotal = (isNaN(newCostSum)) ? "Not Available" : newCostSum.toFixed(2);
				$('.grand-total .costEstimateTotal').text(grandTotal);
			});
		},
		requestFailed = function () {
			$('.program-select').html('There was a problem fetching your programs.' + 'Please check back again later.');
			$('.alert-container').html('<div class="alert-main alert-danger">Error: There was a problem loading the store data.</div>').fadeIn();
			return toastr.warning('An internal error has occurred.');
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
