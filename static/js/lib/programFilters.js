/** Program Filters
 *
 * @param {class} .filters-area Filter container.
 * @param {class} .filter-select.select-option Filter item, contains input.selectbox and .filter-reset.
 * @param {class} .selectbox Input type=select-option.
 * @param {class} .selectboxOption Option item, child of .selectBoxOption.
 * @param {property} selected Applies to .selectBoxOption for active Option item.
 * @param {class} .filter-reset Child of .filter-select, anchor tag for Edit option.
 * @param {class} .filter-results Displays the total # of stores, all initially. Updates when filters change.
 * @param {class} .filter-results-value Span element containing the numarical value of results.
 *
 * ** NOTES **
 * Functions -
 * Calculate TOTAL results
 * Populate first .selectbox options using "filter-type" from getStoreSummary.jssp
 * Show 2ND filter on 1st filter update
 * Show 3RD filter on 2nd filter update
 * On first filter change -
 * - call getStoreSummary.jssp
 * - update store list by program-settings-template.mustache.html program-settings-section programsummary-table
 * - recalculate TOTAL results
 * - show 2ND filter
 */
var programFilters = new function ($) {
  var $programFiltersComponent = $('.filter-select');
  var $selectOption = $('.select-option');
  init = function () {
      if(!$programFiltersComponent.length) {
        return;
      }
      return handlers();
    },
    handlers = function clickHandlers() {
      $selectOption.on('change', function (event) {
        var $filter = $(this);
        /** Shows the next filter option
         *  Next element is required AND Next element must not visible
         */
        if($filter.next('.filter-select').length && $filter.next('.filter-select').hasClass('hidden')) {
          var $nextFilter = $filter.next('.filter-select');
          showNextFilter($nextFilter);
        }
      });
    },
    showFilter = function ($filter) {
      return $filter
        // Show Filter
        .removeClass('hidden')
        // Find [select] element
        .find('select')
        // Focus on Next Filter
        .focus();
    },
    hideFilter = function ($filter) {
      return $filter
        // Hide Filter
        .addClass('hidden')
    },
    showNextFilter = function ($nextFilter) {
      // Get next filter element.
      return showFilter($nextFilter);
    }
  return {
    init: init,
    hideFilter: hideFilter
  };
}(jQuery);
programFilters.init();
