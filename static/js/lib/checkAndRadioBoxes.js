/* Usage */
// customCheckAndRadioBoxes.check();
// customCheckAndRadioBoxes.radio();
var customCheckAndRadioBoxes = (function ($) {
	var combinedHandlers = function () {
		// console.log("Firing combinedHandlers");
		$('.customCheckbox, .customRadiobox').each(function () {
			$(this).addClass('js-custom');
		});
		$('input').on('blur', function () {
			$(this).closest('.customCheckbox').removeClass('focused');
			$(this).closest('.customRadiobox').removeClass('focused');
		}).on('focus', function () {
			$(this).closest('.customCheckbox').addClass('focused');
			$(this).closest('.customRadiobox').addClass('focused');
		});
		selectedPrograms();
		selectAllCustomBoxes();
		activeChecked();
	};
	/** Call the Subscription Request
	 * @param {array} $selectedPrograms
	 * @return {string} $selectedPrograms
	 */
	var selectedPrograms = function () {

		$('.js-trigger-enroll').on('click', function () {
			if (!$('input:checkbox:checked').length) {
				toastr.warning('Please select at least one program to auto-enroll.');
				return;
			}
			if (confirm("Unenrolled stores will be opted-in to the selected programs using default settings.  Continue?")) {
				var $selectedPrograms = $('input:checkbox:checked').map(function () {
					return $(this).val();
				}).get().join();
				var $selectedProgramNames = $('input:checkbox:checked + label').map(function () {
					return $(this).text();
				}).get().join();
				return enrollPrograms($selectedPrograms, $selectedProgramNames);
			}
		});
	};
	// TO DO: This should be moved to setStoreSubscription.js
	var enrollPrograms = function ($selectedPrograms, $selectedProgramNames) {
		removeChecked();
		return setProgramDefaults.makeRequest($selectedPrograms, $selectedProgramNames);
	};
	var activeChecked = function () {
		$('.checkbox-area[data-enrolled="true"] > .js-all-selectable').addClass('checked');
	};
	var removeChecked = function () {
		return $('#programSummary .customCheckbox.checked').removeClass('checked').find($('input:checkbox')).prop('checked', '');
	};
	// TO DO: Updated storesParticipating values.
	// This would likely be easier to do by making an API request to get programParticipationStats
	var selectAllCustomBoxes = function () {

		// ====================================================================================
		// DISABLED!!!  Functionality moved to programManagement.js
		// ====================================================================================
		return false;
		// ====================================================================================

		/** Toggle Buttons
		 * @todo API request to enroll ALL stores.
		 * @todo API request to enroll & unenroll INDIVIDUAL stores.
		 * @overview Creates custom toggle buttons over input type=[checkbox]
		 * @see {@link http://codepen.io/nikhil8krishnan/pen/eNVZgB}
		 * @author Nikhil Krishnan, Twitter @nikhil8krishnan
		 * @param {class} .toggle-btn wrapper
		 * @return {function} toggleBtns();
		 */
		function toggleBtns() {
			// console.log("Running toggleBtns");

			var $programId = getParameterByName('programId', window.location.href);
			var $userId = marcomUserData.$user.externalId || {};
			// console.warn('number of $stores ' + visible_store_count);

			refreshSelectAllButton();

			$('.toggle-btn').off('click.vioc').on('click.vioc', function (e) {
				// console.log("Firing checkbox click...");
				var $storeId = $(this).attr('data-storeid');
				if ($(this).attr('data-enrolled') == "true") {
					var $storeId = $(this).attr('data-storeid');
					$(this).attr('data-enrolled', "false");
					unsubscribeStore($userId, $storeId, $programId, 1);
				} else if ($(this).attr('data-enrolled') == "false") {
					var $storeId = $(this).attr('data-storeid');
					$(this).attr('data-enrolled', "true");
					subscribeStore($userId, $storeId, $programId, 1);
				}
				refreshSelectAllButton();
				refreshStoreRowEnrollment();
			});


			$('.enroll-all-stores').off('click.vioc').on('click.vioc', function (e) {
				e.preventDefault();
				e.stopPropagation();
				var storeIds = [];

				if(!$(this).hasClass('activate')) {
					$('.toggle-btn[data-enrolled="true"]').each(function () {
						console.log('all true ones block....');
						var $storeId = $(this).attr('data-storeid');
						$(this).attr('data-enrolled', "false");
						storeIds.push($storeId);
					});
					subscribeStore($userId, storeIds.join(","), $programId, 1);
					$(this).addClass('activate');
				} else if($(this).hasClass('activate')) {
					$('.toggle-btn[data-enrolled="false"]').each(function () {
						var $storeId = $(this).attr('data-storeid');
						$(this).attr('data-enrolled', "true");
						storeIds.push($storeId);
					});
					subscribeStore($userId, storeIds.join(","), $programId, 1);
				}
				refreshSelectAllButton();
				refreshStoreRowEnrollment();
			});
		}

		function refreshStoreRowEnrollment()
		{
			$('.toggle-btn').each(function () {
				var enabled = $(this).attr('data-enrolled') == 'true';
				var storeId = $(this).attr('data-storeid');

				if (enabled) {
					$(this).addClass('active');
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable").removeClass('dim-mid').attr('data-enrolled', "true");
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable input").removeClass('input-disabled').removeAttr("disabled");
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable select").removeClass('input-disabled').removeAttr("disabled");
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable .apply-quantity-limit").removeClass('disabled').removeAttr("disabled");
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable .vioc-checkbox").removeClass('disabled');
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable small.not-enrolled").addClass('none');
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable .store-level-dropdown").removeClass('none');
				} else {
					$(this).removeClass('active');
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable").addClass('dim-mid').attr('data-enrolled', "false");
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable input").addClass('input-disabled').attr("disabled", true);
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable select").addClass('input-disabled').attr("disabled", true);
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable .apply-quantity-limit").addClass('disabled').attr("disabled", true);
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable .vioc-checkbox").addClass('disabled');
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable small.not-enrolled").addClass('none');
					$(".store-item[data-storeid="+storeId+"] .store-item-dimable .store-level-dropdown").removeClass('none');
				}
			});
			getStoreProgramData.getTotals();
		}

		function toggleStoreRows(storeId, active)
		{
			if (active)
			{
				$(".store-item[data-storeid="+storeId+"] .store-item-dimable").removeClass('dim-mid').attr('data-enrolled', "true");
			}
			else
			{

			}
		}

		function refreshSelectAllButton() {

			// Get the count of the visible store checkboxes
			var visible_store_count = $('.program-enrollment-section .toggle-btn').length;
			var enrolled_store_count = $('.program-enrollment-section [data-enrolled="true"].toggle-btn').length;

			if(visible_store_count === enrolled_store_count) {
				$('.enroll-all-stores.btn').removeClass('activate').text('Unenroll All');
			} else {
				$('.enroll-all-stores.btn').addClass('activate').text('Enroll All');
			}
		}

		function subscribeStore($userId, $storeId, $programId) {
			return setStoreSubscription.makeRequest($userId, $storeId, $programId, 1);
		}

		function unsubscribeStore($userId, $storeId, $programId) {
			return setStoreSubscription.makeRequest($userId, $storeId, $programId, 0);
		}

		return toggleBtns();
	};
	var customCheckbox = function () {
		$('.customCheckbox:not(".disabled") input:checkbox').each(function () {
			$(this).parent().addClass('js-custom');
			if ($(this).attr('checked') === 'checked') {
				$(this).closest('.customCheckbox').addClass('checked');
			}
		});
		$('.customCheckbox:not(".disabled")').click(function () {
			if ($(this).hasClass('disabled-checked')) {
				return;
			}
			if (!$(this).children('input[type="checkbox"]').is('[readonly]')) {
				$(this).find('input').trigger('change');
				if ($(this).hasClass('checked')) {
					$(this).removeClass('checked');
					$(this).find($('input[type="checkbox"]')).prop('checked', '');
					$('.program-select .js-trigger-enroll').addClass('input-disabled').attr('title', 'All Stores are Enrolled.');
					if ($('.program-select .checked:not(".disabled")').length >= 1) {
						$('.program-select .js-trigger-enroll').removeClass('input-disabled').attr('title', 'Clicking the Auto-Enroll button will result in all offers being set at the default settings');
					}
				} else {
					$(this).addClass('checked');
					$(this).find($('input[type="checkbox"]')).prop('checked', 'checked').focus();
					$('.program-select .js-trigger-enroll').removeClass('input-disabled').attr('title', 'Clicking the Auto-Enroll button will result in all offers being set at the default settings');
				}
			}
		});
		combinedHandlers();
	};
	var customRadiobox = function () {
		// console.log("Firing customRadiobox");
		$('input:radio').each(function () {
			$(this).wrap('<div class="customRadiobox"></div>');
			$(this).parent().append('<label>' + $(this).data('radiobox-label') + '</label>');
			$(this).css('position', 'absolute').css('left', '-999999px');
		});
		$('input:radio').each(function () {
			if ($(this).attr('checked') === 'checked') {
				$(this).closest('.customRadiobox').addClass('checked');
			}
		});
		$('.customRadiobox').click(function () {
			if (!$(this).children('input[type="radio"]').is('[readonly]')) {
				$(this).find('input').trigger('change');
				if ($(this).hasClass('checked')) {
					// (this).find($('input[type="radio"]')).removeAttr('checked');
				} else {
					$('input[type="radio"][name="' + $(this).find('input:radio').prop('name') + '"]').not($(this)).parent().removeClass('checked');
					$('input[type="radio"][name="' + $(this).find('input:radio').prop('name') + '"]').not($(this)).prop('checked', '');
					$(this).addClass('checked');
					$(this).find($('input[type="radio"]')).prop('checked', 'checked').focus();
				}
			}
		});
		combinedHandlers();
	};
	return {
		customCheckbox: customCheckbox,
		customRadiobox: customRadiobox
	};
})(jQuery);
