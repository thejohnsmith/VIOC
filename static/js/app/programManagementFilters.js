var programManagementFilters = (function ($) {
	var controller = {
		apiPath: marcomUserData.$constants.apiPath,
		store_tree: [],
		user_id: marcomUserData.$user.externalId,
		store_ids: [],
		onFilterChange: null,
		init: function () {
			var controller = this;
			if (!(controller.user_id > 0)) {
				console.error('Valid user ID not provided to controller.');
			}
			$('.filter-select').hide();
			$('.filter-reset').on('click', $.proxy(controller.resetFilters, controller));
			controller.getStoreTree(function (store_tree) {
				controller.setupFilters(store_tree);
				$('.filters-area').css('opacity', 1);
			});
		},
		setupFilters: function (store_tree) {
			var controller = this;
			controller.populateFilter('company', 'All Companies', store_tree,
				function (children) {
					controller.populateFilter('market', 'All Markets', children, function (
						children) {
						controller.populateFilter('area', 'All Areas', children, function (
							children) {
							// console.log("Stores to show:");
							// console.log(children);
						});
					});
				});
			controller.updateStoreList(store_tree);
		},
		resetFilters: function () {
			var controller = this;
			$('.filter-select').hide();
			controller.setupFilters(controller.store_tree);
		},
		populateFilter: function (dropdownKey, allLabel, values, onChange) {
			var controller = this;
			var $dd = $('.filter-select.' + dropdownKey + ' .selectbox');
			// Empty the dropdown and clear event listeners
			$dd.html('');
			$dd.off('change');
			// If I was provided null children, hide the dropdown and exit.
			if (values === null || ($.isArray(values) && values.length === 0)) {
				$dd.parent().hide();
				if (typeof onChange === 'function') onChange(null);
				return;
			}
			// Add the "All..." option
			$dd.append($('<option/>').attr('value', '*').text(allLabel));
			// Add the child elements
			for (var i = 0; i < values.length; i++) {
				$dd.append($('<option/>').attr('value', i).text(values[i].text));
			}
			// Attach an event listener.  When the selected item changes,
			// grab all of the children and pass them downstream.
			$dd.on('change', function () {
				var selected_index = $(this).find('option:selected').val();
				// If the user selected "all", tell the upstream dropdowns to hide
				if (selected_index === '*') {
					if (typeof onChange === 'function') onChange(null);
					controller.updateStoreList(values);
				} else {
					var value = values[selected_index];
					if (typeof onChange === 'function') onChange(value.children);
					controller.updateStoreList([value]);
				}
			});
			// Show the dropdown
			$dd.parent().show();
		},
		updateStoreList: function (tree_segment) {
			var controller = this;
			controller.store_ids = controller.findStoresRecursively(tree_segment);
			var plural = (controller.store_ids.length === 1) ? '' : 's';
			$('.filter-results-value').html(controller.store_ids.length + ' Result' + plural);
			if (typeof controller.onFilterChange === 'function') {
				controller.onFilterChange(controller.store_ids);
			}
		},
		findStoresRecursively: function (tree_segment) {
			var stores_found = [];
			// Check the current branch for stores and add them to an array
			for (var i = 0; i < tree_segment.length; i++) {
				if (tree_segment[i].id !== undefined && tree_segment[i].id !== '') {
					stores_found.push(tree_segment[i].id);
				}
				// Call this function with any 'children' and append the results to the array
				if (tree_segment[i].children !== undefined && typeof tree_segment[i].children === 'object') {
					var child_store_ids = controller.findStoresRecursively(tree_segment[i].children);
					stores_found = stores_found.concat(child_store_ids);
				}
			}
			// Return the array
			return stores_found;
		},
		/** Gets store program data
		 * @async getStoreTree.jssp
		 * @callback json_results
		 */
		getStoreTree: function (callback) {
			var controller = this;
			$.get(controller.apiPath + 'getStoreSummary.jssp?userId=' + controller.user_id,
				function (results) {
					var json_results = JSON.parse(results);
					controller.store_tree = json_results;
					if (typeof callback === 'function') {
						callback(json_results);
					}
				});
		}
	};
	return {
		controller: controller
	};
})(jQuery);

programManagementFilters.controller.init();

programManagementFilters.controller.onFilterChange = function (store_ids) {
	var $j = jQuery;
	$j('.filterable').addClass('hide');
	for (var i = 0; i < store_ids.length; i++) {
		var storeId = store_ids[i];
		$j('tr[data-filter-storeid=' + storeId + ']').removeClass('hide');
	}
};
