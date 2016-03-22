var checkboxController = (function ($) {
	var controller = {
		storeIds: [],
		cssFamily: "",
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
			$("." + controller.cssFamily + ".select-all").on("click", function (e) {
				$("." + controller.cssFamily + ".customCheckbox").addClass("checked");
				controller.recalculateSelectedStores();
				e.preventDefault();
			});

			$("." + controller.cssFamily + ".customCheckbox").on("click", function (e) {
				setTimeout(function () {
					controller.recalculateSelectedStores();
				}, 100);
				e.preventDefault();
			});
		},
		recalculateSelectedStores: function () {
			var controller = this;
			controller.storeIds = [];
			$.each($("." + controller.cssFamily + ".customCheckbox.checked"), function (i, e) {
				var storeId = $(e).attr('data-storeid');
				console.log("Recalculating.  Store selected: " + storeId);
				controller.storeIds.push(storeId);
			});
			console.log("Changing store list for " + controller.cssFamily);
			if (typeof controller.onChange == "function") {
				controller.onChange(controller.storeIds);
			}
		}
	};
	return {
		controller: controller
	};
})(jQuery);
