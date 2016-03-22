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
			var $checkBox = $('.programsummary-table .' + controller.cssFamily + '.customCheckbox:not(.disabled-input)');

			/* Select All */
			$selectAll.on('click', function (event) {
				event.preventDefault();
				if ($(this).is('.not-active')) {
					$checkBox.each(function () {
						$(this).addClass('checked');
					});
				} else {
					$checkBox.each(function () {
						$(this).removeClass('checked');
					});
				}
				$(this).toggleClass('not-active active').text(function (i, text) {
					return text === 'Select All' ? 'Unselect All' : 'Select All';
				});
				controller.recalculateSelectedStores();
			});

			/* Checkbox Select */
			$checkBox.on('click', function (e) {
				setTimeout(function () {
					controller.recalculateSelectedStores();
				}, 100);
				e.preventDefault();
			});
		},
		recalculateSelectedStores: function () {
			var controller = this;
			controller.storeIds = [];
			$.each($('.programsummary-table .' + controller.cssFamily + '.customCheckbox.checked'), function (i, e) {
				var storeId = $(e).attr('data-storeid');
				console.log('Recalculating. Store selected: ' + storeId);
				controller.storeIds.push(storeId);
			});
			console.log('Changing store list for ' + controller.cssFamily);
			if (typeof controller.onChange === 'function') {
				controller.onChange(controller.storeIds);
			}
		}
	};
	return {
		controller: controller
	};
})(jQuery);
