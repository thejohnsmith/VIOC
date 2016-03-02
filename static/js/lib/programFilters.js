/** Program Filters
 *
 * @param {class} .filters-area Filter container.
 * @param {class} .filter-select.select-option Filter item, contains input.selectbox and .filter-reset.
 * @param {class} .selectbox Input type=select-option.
 * @param {class} .selectboxOption Option item, child of .selectBoxOption.
 * @param {property} selected Applies to .selectBoxOption for active Option item.
 * @param {class} .filter-reset Child of .filter-select, anchor tag for Edit option.
 * @param {class} .filter-results Displays the total # of stores, all initially. Updates when filters change.
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
  var $programFiltersComponent = $('.filter-select'),
    init = function () {
      if(!$programFiltersComponent.length) {
        return;
      }
      return handlers();
    },
    handlers = function clickHandlers() {
      $programFiltersComponent.find('.selectbox').on('click', function (event) {
        event.preventDefault();

      });
    };
  return {
    init: init
  };
}(jQuery);

programFilters.init();
