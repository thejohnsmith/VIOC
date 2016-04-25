var programManagementFilters = (function ($) {
	var controller = {
		apiPath: marcomUserData.$constants.apiPath,
		store_tree: [],
		user_id: marcomUserData.$user.externalId,
		store_ids: [],
		onFilterChange: null,
		init: function () {
			var controller = this;
			$('.filter-select').hide();
			$('.filter-reset').on('click', $.proxy(controller.resetFilters, controller));
			controller.getStoreTree(function (store_tree) {
				controller.setupFilters(store_tree, function() {
					$('.filters-area').css('opacity', 1);
					controller.reloadDefaultsFromCookie();
					programManagementController.controller.init()
				});
			});
		},
		setupFilters: function (store_tree, callback) {
			var controller = this;
			controller.populateFilter('company', 'All Companies', store_tree, function (children) {
					controller.populateFilter('market', 'All Marketing Areas', children, function (children) {
						controller.populateFilter('area', 'All Stores', children, function() {
						});
					});
				});
			if (typeof callback == "function")
				callback();
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
			/* E-80
				1)  Grab the cookie for this filter   (i.e. "filter_" + name)  filter_company = 2
				2)  Select the option index that matches the value
				3)  If the index is greater than 0, show the filter
				4)  Do we need to somehow fire the onChange() event so the stores are output?
			*/
			// Attach an event listener.  When the selected item changes,
			// grab all of the children and pass them downstream.
			$dd.on('change', function () {
				var selected_index = $(this).find('option:selected').val();

				var dd_type = "";
				if ($(this).parent().attr("class").indexOf("company") > -1) dd_type = "company";
				if ($(this).parent().attr("class").indexOf("market") > -1) 	dd_type = "market";    // Name is out of date.  Is really "marketing area";
				if ($(this).parent().attr("class").indexOf("area") > -1) 	dd_type = "area";  // Name is out of date.  Is really "store"

				if (dd_type == "company")
				{
					document.cookie = "filter_company=" + selected_index;
					document.cookie = "filter_market=*";
					document.cookie = "filter_area=*";
				}
				else if (dd_type == "market")
				{
					document.cookie = "filter_market=" + selected_index;
					document.cookie = "filter_area=*";
				}
				else {
					document.cookie = "filter_area=" + selected_index;
				}



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
			if (dropdownKey != 'area') // Hack.  David wants the area dropdown hidden since we reorganized the filters per VIOC's request.  I don't want to rip it out, so I'm just suppressing it.
				$dd.parent().show();
		},
		updateStoreList: function (tree_segment) {
			var controller = this;
			$('.area.filter-select').hide(); // Hack - Always hide this, per David.

			controller.store_ids = controller.findStoresRecursively(tree_segment);
			var plural = (controller.store_ids.length === 1) ? '' : 's';
			$('.filter-results-value').html(controller.store_ids.length + ' Result' + plural);
			if (typeof controller.onFilterChange === 'function') {
				controller.onFilterChange(controller.store_ids);
			}
		},
		reloadDefaultsFromCookie: function() {
			// These values contain the index of the last item we selected.
			var company_filter = document.cookie.replace(/(?:(?:^|.*;\s*)filter_company\s*\=\s*([^;]*).*$)|^.*$/, '$1');
			var market_filter = document.cookie.replace(/(?:(?:^|.*;\s*)filter_market\s*\=\s*([^;]*).*$)|^.*$/, '$1');
			var area_filter = document.cookie.replace(/(?:(?:^|.*;\s*)filter_area\s*\=\s*([^;]*).*$)|^.*$/, '$1');

			console.log("Running reloadDefaultsFromCookie : %s, %s, %s", company_filter, market_filter, area_filter);

			if (company_filter != "")
				$j(".company.filter-select select option[value='" + company_filter + "']").prop("selected", "selected")

			$(".company.filter-select select").trigger("change");

			if ($(".company.filter-select select").val() != "*")
			{
				$(".company.filter-select").show();
			}
			else
			{
				return;
			}

			if (market_filter != "")
				$j(".market.filter-select select option[value='" + market_filter + "']").prop("selected", "selected")

			$(".market.filter-select select").trigger("change");

			if ($(".market.filter-select select").val() != "*")
			{
				$(".market.filter-select").show();
			}
			else
			{
				return;
			}

			if (area_filter != "")
				$j(".area.filter-select select option[value='" + area_filter + "']").prop("selected", "selected")

			$(".area.filter-select select").trigger("change");

			if ($(".area.filter-select select").val() != "*")
			{
				$(".area.filter-select").show();
			}
			else
			{
				return;
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
			$.get(controller.apiPath + 'getStoreSummary.jssp?test=1&userId=' + encodeURIComponent(marcomUserData.$user.externalId),
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

	// Hide all rows and then reshow the ones matching the filter
	$j('.filterable').addClass('hide');
	for (var i = 0; i < store_ids.length; i++) {
		var storeId = store_ids[i];
		$j('tr[data-filter-storeid=' + storeId + ']').removeClass('hide');
	}

	// See if any checkboxes need to be unchecked
	var class_checklist = [];

	$j.each($j(".vioc-checkbox"),function(i,e) {

		if (!$j(e).is(":visible") && $j(e).hasClass('checked'))
		{
			$j(e).removeClass('checked');
		}

		// Click the first checkbox in each family of checkboxes to trigger their store recalculation,
		// which may hide/show/update footers.

		// See what classes are on our current checkbox and tokenize them
		// This is a pattern to only trigger a refresh on certain checkbox families
		var ok_to_update = false;

		$j.each($j(e).attr('class').split(" "), function(i,class_name) {
			if ($j.inArray(class_name, class_checklist) == -1)
					ok_to_update = true;
			// Add the classes used to our checklist.  If we find a new class, it's ok to use it.
			class_checklist.push(class_name);
		});

		// If the button has a class that is new to us, trigger an update. (A special event the checkbox listens for)
		if (ok_to_update)
		{
			console.log("Triggering an update on %o", e);
			$j(e).trigger('update');
		}
	});

	// Recalculate stuff
	getStoreProgramData.getTotals(getStoreProgramData.storeProgramData);
	programManagementController.controller.refreshSelectAllButton();
	programManagementController.controller.refreshStoreRowEnrollment();

	var targetStores = [];

	if (programManagementController.controller.store_data.length > 0)
	{
		var lastStoreChecksum = "";

		$j.each(programManagementController.controller.store_data, function(idx, store)
		{
			if ($j.inArray(store.storeId.toString(), store_ids) > -1)
			{
				targetStores.push(store);
				lastStoreChecksum += store.storeId.toString() + "|";
			}
		});

		if (typeof programManagementController.controller.lastStoreChecksum == "undefined" || programManagementController.controller.lastStoreChecksum != lastStoreChecksum)
		{
			programManagementController.controller.lastStoreChecksum = lastStoreChecksum;
			console.log("Calling buildUI(targetStores) on ", targetStores);
			programManagementController.controller.buildUI(targetStores);
		}
	}

};
