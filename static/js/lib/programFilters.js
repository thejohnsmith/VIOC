/** Program Filters
 * @file programFilters.js
 * @requires targetingCriteria.jssp
 * @NOTE ** In order for this script to run it needs to have markup from getStoreSummary.jssp API
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
  var $storeId = $(this).attr('data-storeId');
  init = function ($storeSummary) {
      if(!$programFiltersComponent.length) {
        return;
      }
      setFilterOptions($storeSummary);
    },
    handlers = function () {
      $('.select-option').on('change', function (event) {
        var $filter = $(this);
        /** Shows the next filter option
         *  Next element is required AND Next element must not visible
         */
        if($filter.next('.filter-select').length && $filter.next('.filter-select').hasClass('hidden')) {
          var $nextFilter = $filter.next('.filter-select');
          showNextFilter($nextFilter);
        }
        getStoreCount();
      });
    },
    getStoreCount = function () {
      var $storeCount = $('.program-settings-section .program-settings-store').length
      return $('.filter-results-value').text($storeCount)
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
    },
    setFilterOptions = function ($storeSummary) {
      var $filter1 = '{{#.}}{{#filter-type}}<div class="{{filter-type}} filter-select select-option">' + '<select class="selectbox">' + '{{#filter-type}}<option class="selectboxOption" selected>Select {{filter-type}}</option>' + '<option class="selectboxOption" value="{{text}}">{{text}}</option>{{/filter-type}}' + '</select>' + '</div>{{/filter-type}}' + '{{#children}}' + '{{#filter-type}}<div class="{{filter-type}} filter-select select-option hidden">' + '<select class="selectbox">' + '{{#filter-type}}<option class="selectboxOption" selected>Select {{filter-type}}</option>{{/filter-type}}' + '{{#children}}<option class="selectboxOption" value="{{text}}">{{text}}</option>{{/children}}' + '</select>' + '</div>{{/filter-type}}' + '{{/children}}' + '{{#children}}' + '<div class="area filter-select select-option hidden">' + '<select class="selectbox">' + '{{#children}}<option class="selectboxOption" selected>Select Area</option>' + '{{#children}}<option class="selectboxOption" value="{{text}}">{{text}}</option>{{/children}}{{/children}}' + '</select>' + '</div>' + '{{/children}}' + '{{/.}}'
      var filter1html = Mustache.to_html($filter1, $storeSummary);
      $(filter1html).appendTo('.filters-area-section');
      return handlers();
    }
  return {
    init: init,
    handlers: handlers,
    hideFilter: hideFilter,
    setFilterOptions: setFilterOptions
  };
}(jQuery);
