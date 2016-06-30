var ContentPreviewController = (function ($) {
	var controller = {
		storeIds: [],
		storeData: [],
		storeDropdown: $('.content-preview-store-dropdown'),
		init: function (storeIds, store_data) {
			var controller = this;
			controller.storeIds = storeIds;
			controller.storeData = store_data;
      console.warn('storeIds:', typeof storeIds);

			controller.attachEventHandlers();
			controller.updateStoreDropdown(storeIds);
		},
		attachEventHandlers: function (callback) {
			var controller = this;
			// Whenever the store dropdown changes, call refresh();
			$('.content-preview-store-dropdown').on('change', function () {
				controller.refresh();
			});
			if (typeof callback === 'function') {
				callback();
			}
		},
		/**
		 * [updateStoreDropdown When provided a list of store IDs, this will update the store dropdown and then call refresh()]
		 * @param  {[type]} storeIds [description]
		 * 1)  Empty the dropdown via $(dropdown).html();
		 * 2)  Loop through controller.store_ids
		 * 3)  While looping through store ids, loop through controller.store_data
		 * 4)  If a store data entry matches a store ID, pull out the name, build an <option> and inject it into $(dropdown)
		 */
		updateStoreDropdown: function (storeIds) {
			var controller = this;

			// Empty the dropdown
			console.warn('storeIds: ', storeIds);
			$('.content-preview-store-dropdown').html();
			// Testing only.
			for (var i = 0; i < storeIds.length; i++) {
				// console.warn('storeIds: ', storeIds);
				// console.warn('store_data: ', controller.store_data);
			}

			// Loop through controller.store_ids
			// for (var i = 0; i < storeIds.length; i++) {
			// 	var storeId = store_ids[i];
			// 	for (var j = 0; j < controller.store_data.length; j++) {
			// 		var storeData = controller.store_data[idx];
			//     if (storeId == storeData){
			//       // If a store data entry matches a store ID, pull out the name, build an <option> and inject it into $(dropdown)
			//     }
			// 	}
			// }
		},
		refresh: function () {
			var controller = this;
			console.warn('refresh');
		},
		updateUI: function () {
			var controller = this;
			console.warn('updateUI');
		},
		updateStoreDetails: function () {
			var controller = this;
			console.warn('updateStoreDetails');
		}
	};
	return {
		controller: controller
	};
})(jQuery);
