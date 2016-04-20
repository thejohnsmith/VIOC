// Example usage: checkboxController.controller.init('program-settings', function(storeIds) { console.log(storeIds) });
var checkboxController = (function ($) {
	var controller = {
		storeIds: [],
		cssFamily: '',
		onChange: null,
		init: function (cssFamily, onChange) {
			var controller = this;
			controller.onChange = onChange;
			controller.cssFamily = cssFamily;
			controller.attachEventHandlers();
			controller.recalculateSelectedStores();
		},
		attachEventHandlers: function () {
			var controller = this;
			var $selectAll = $('.programsummary-table .' + controller.cssFamily + '.select-all');
			var $checkBox = $('.programsummary-table .' + controller.cssFamily + '.vioc-checkbox');

			/* Select All */
			$selectAll.on('click', function (event) {
				event.preventDefault();
				if ($(this).hasClass('activate')) {
					console.log('Button says Select All.  Checking ' + $checkBox.length + ' boxes.');
					$checkBox.each(function () {
						if (!$(this).hasClass('disabled') && $(this).is(':visible'))
							$(this).addClass('checked');
					});
				} else {
					console.log('Button says Unselect All.  Unchecking ' + $checkBox.length + ' boxes...');
					$checkBox.each(function () {
						$(this).removeClass('checked');
					});
				}
				controller.recalculateSelectedStores();
			});

			/* Checkbox Update
				This is a custom action the filter controller can call to force the checkbox family to refresh.
			*/
			$checkBox.off('update').on('update', function (e) {
				controller.recalculateSelectedStores();
			});

			/* Checkbox Select */
			$checkBox.off('click').on('click', function (e) {

				// If the clicked item is not disable and not visible, go ahead and toggle states
				if (!$(e.target).hasClass("disabled") && $(e.target).is(":visible"))
				{
					if ($(e.target).hasClass("checked"))
					{
						$(e.target).removeClass("checked"); // Toggle off
					}
					else
					{
						$(e.target).addClass("checked"); // Toggle on
					}
				};

				setTimeout(function () {
					controller.recalculateSelectedStores();
				}, 100);
				e.preventDefault();
			});
		},
		recalculateSelectedStores: function () {
			var controller = this;
			controller.storeIds = [];
			$.each($('.programsummary-table .' + controller.cssFamily + '.vioc-checkbox.checked'), function (i, e) {
				if ($(e).is(":visible"))
				{
					var storeId = $(e).attr('data-storeid');
					// console.log('Recalculating. Store selected: ' + storeId);
					controller.storeIds.push(storeId);
				}
			});
			// console.log('Changing store list for ' + controller.cssFamily);
			if (typeof controller.onChange === 'function') {
				console.log(controller.storeIds);
				controller.onChange(controller.storeIds);
			}
			controller.updateSelectAllButton();
		},
		updateSelectAllButton: function () {

			var controller = this;
			var $selectAll = $('.programsummary-table .' + controller.cssFamily + '.select-all');
			// Get the count of the visible store checkboxes
			var visible_store_count = $('.programsummary-table .' + controller.cssFamily + '.vioc-checkbox:not(.disabled):visible').length;
			// Determine if it should say 'Select All' or 'Unselect All'
			var unselectAll = (controller.storeIds.length === visible_store_count);

			if (visible_store_count === 0) {
				// console.log('Visible store count = 0.  Aborting');
				return;
			}

			// Remove all of the classes from the Select All button
			$selectAll.removeClass('not-active activate');

			// Apply the appropriate class and text to the Select All button
			if (unselectAll) {
				$selectAll.addClass('not-active').text('Unselect All');
				$($selectAll).addClass('not-active').text('Unselect All');
			} else {
				$selectAll.addClass('activate').text('Select All');
				$($selectAll).addClass('activate').text('Select All');
			}
		}
	};
	return {
		controller: controller
	};
})(jQuery);
