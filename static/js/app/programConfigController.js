var programConfigController = (function ($) {
	// var controller = {
	// 	storeIds: [],
	// 	cssFamily: '',
	// 	onChange: null,
	// 	init: function (cssFamily, onChange) {
	// 		var controller = this;
	// 		controller.onChange = onChange;
	// 		controller.cssFamily = cssFamily;
	// 		controller.attachEventHandlers();
	// 		controller.recalculateSelectedStores();
	// 	},
	// 	attachEventHandlers: function () {
	// 		var controller = this;
	// 		var $selectAll = $('.programsummary-table .' + controller.cssFamily + '.select-all');
	// 		var $checkBox = $('.programsummary-table .' + controller.cssFamily + '.customCheckbox:not(.disabled-input)').filter(":visible");
	//
	// 		/* Select All */
	// 		$selectAll.on('click', function (event) {
	// 			event.preventDefault();
	// 			if ($(this).is('.active')) {
	// 				// console.log("Button says Select All.  Checking " + $checkBox.length + " boxes.");
	// 				$checkBox.each(function () {
	// 					$(this).addClass('checked');
	// 				});
	// 			} else {
	// 				// console.log("Button says Unselect All.  Unchecking " + $checkBox.length + " boxes...");
	// 				$checkBox.each(function () {
	// 					$(this).removeClass('checked');
	// 				});
	// 			}
	// 			controller.recalculateSelectedStores();
	// 		});
	//
	// 		/* Checkbox Select */
	// 		$checkBox.on('click', function (e) {
	// 			setTimeout(function () {
	// 				controller.recalculateSelectedStores();
	// 			}, 100);
	// 			e.preventDefault();
	// 		});
	// 	},
	// 	recalculateSelectedStores: function () {
	// 		var controller = this;
	// 		controller.storeIds = [];
	// 		$.each($('.programsummary-table .' + controller.cssFamily + '.customCheckbox.checked'), function (i, e) {
	// 			var storeId = $(e).attr('data-storeid');
	// 			// console.log('Recalculating. Store selected: ' + storeId);
	// 			controller.storeIds.push(storeId);
	// 		});
	// 		// console.log('Changing store list for ' + controller.cssFamily);
	// 		if (typeof controller.onChange === 'function') {
	// 			controller.onChange(controller.storeIds);
	// 		}
	// 		controller.updateSelectAllButton();
	// 	},
	// 	updateSelectAllButton: function () {
	//
	// 		var controller = this;
	//
	// 		var $selectAll = $('.programsummary-table .' + controller.cssFamily + '.select-all');
	//
	// 		// Get the count of the visible store checkboxes
	// 		var visible_store_count = $("tr ." + controller.cssFamily + ".customCheckbox:not(.disabled-input)").filter(":visible").length;
	//
	// 		if (visible_store_count == 0) {
	// 			// console.log("Visible store count = 0.  Aborting");
	// 			return;
	// 		}
	//
	// 		// Determine if it should say "Select All" or "Unselect All"
	// 		var unselectAll = (controller.storeIds.length === visible_store_count);
	//
	// 		// Remove all of the classes from the Select All button
	// 		$selectAll.removeClass("not-active").removeClass("active");
	//
	// 		// Apply the appropriate class and text to the Select All button
	// 		if (unselectAll) {
	// 			$selectAll.addClass('not-active').text('Unselect All');
	// 			$($selectAll).addClass('not-active').text('Unselect All');
	// 		} else {
	// 			$selectAll.addClass('active').text('Select All');
	// 			$($selectAll).addClass('active').text('Select All');
	// 		}
	// 	}
	// };
	// return {
	// 	controller: controller
	// };
})(jQuery);
