var getStoreProgramData = (function ($) {
	/* Use getHashParams.js to get programId */
	var $programId = getParameterByName('programId', window.location.href);
	var marcomFilePath = marcomUserData.$constants.marcomFilePath;
	var storeProgramData = null;

	var makeRequest = function () {

			return false;

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
				buildUI(result);
			}).fail(function () {
				requestFailed();
			});
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
			var target = '.store-counts[data-enrolled="true"] .' + e + ':visible';
			console.log("Rows matching target of " + target  + " is " + $(target).length);
			$(target).each(function () {
				if ($(this).parent().not(".dim-mid") ) {
					var n = parseFloat($(this).text());
					n = (isNaN(n)) ? 0 : n;
					console.log(e + " field contains " + n);
					newSum += n;
				}
			}).promise().done(function () {
				newSum = (isNaN(newSum)) ? "Not Available" : newSum;
				console.log("Total for " + e + " is  " + newSum);
				$('.grand-total .' + e).text(newSum);
			});
			/**
			 * Calculate grand total for Estimated Monthly Cost.
			 * Adds currecy decimal places
			 **/
			$('.store-cost:visible').not('.dim-mid').each(function () {
				var $cost = $(this).find('.costEstimateTotal.js-format-currency');
				var n = parseFloat($($cost).text());

				n = (isNaN(n)) ? 0 : n;
				newCostSum += (isNaN(n)) ? 0 : n;
				console.log("newCostSum is " + newCostSum);
			}).promise().done(function () {
				var grandTotal = (isNaN(newCostSum)) ? "Not Available" : newCostSum.toFixed(2);
				console.log("grandTotal is " + grandTotal);
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
		setHashLinks: setHashLinks,
		programSettingsHandler: programSettingsHandler,
		reloadCheckBoxes: reloadCheckBoxes,
		getTotals: getTotals,
		returnTotals: returnTotals,
		requestFailed: requestFailed
	};
})(jQuery);

getStoreProgramData.makeRequest();
