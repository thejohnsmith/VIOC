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
			$('.programsummary-table .' + controller.cssFamily + '.select-all').on('click', function (e) {
				$('.programsummary-table .' + controller.cssFamily + '.customCheckbox:not(.disabled-input)').addClass('checked');
				controller.recalculateSelectedStores();
				e.preventDefault();
			});

			$('.programsummary-table .' + controller.cssFamily + '.customCheckbox:not(.disabled-input)').on('click', function (e) {
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
