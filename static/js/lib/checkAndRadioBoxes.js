/* Usage */
// customCheckAndRadioBoxes.check();
// customCheckAndRadioBoxes.radio();
var customCheckAndRadioBoxes = (function ($) {
  var combinedHandlers = function () {
    $('.customCheckbox, .customRadiobox').each(function () {
      $(this).addClass('js-custom');
    });
    $('input').on('blur', function () {
      $(this).closest('.customCheckbox').removeClass('focused');
      $(this).closest('.customRadiobox').removeClass('focused');
    }).on('focus', function () {
      $(this).closest('.customCheckbox').addClass('focused');
      $(this).closest('.customRadiobox').addClass('focused');
    });
    selectedPrograms();
    selectAllCustomBoxes();
    activeChecked();
  };
  /** Call the Subscription Request
   * @param {array} $selectedPrograms
   * @return {string} $selectedPrograms
   */
  var selectedPrograms = function () {
    if(!$('.js-trigger-enroll').length) {
      return
    }
    $('.js-trigger-enroll').on('click', function () {
      if(!$('input:checkbox:checked').length) {
        return
      }
      var $selectedPrograms = $('input:checkbox:checked').map(function () {
        return $(this).val();
      }).get().join();
      var $selectedProgramNames = $('input:checkbox:checked + label').map(function () {
        return $(this).text();
      }).get().join();
      return enrollPrograms($selectedPrograms, $selectedProgramNames);
    });
  };
  // TO DO: This should be moved to setStoreSubscription.js
  var enrollPrograms = function ($selectedPrograms, $selectedProgramNames) {
    removeChecked();
    return setProgramDefaults.makeRequest($selectedPrograms, $selectedProgramNames);
  }
  var activeChecked = function () {
    $('.checkbox-area[data-enrolled="true"] > .js-all-selectable').addClass('checked');
  }
  var removeChecked = function () {
      return $('#programSummary .customCheckbox.checked').removeClass('checked').find($('input:checkbox')).prop('checked', '');
    }
    // TO DO: Updated storesParticipating values.
    // This would likely be easier to do by making an API request to get programParticipationStats
    // var $('.js-all-selectable.checked').parent().parent().find('.storesParticipating');
  var selectAllCustomBoxes = function () {
    var $jsAllSelectable = $('.programsummary-table .js-all-selectable:not(".disabled-input")');

    $('.store-enroll .btn.btn-primary').on('click', function (e) {
      e.preventDefault();
      $jsAllSelectable.addClass('checked').find($('input')).prop('checked', 'checked').focus();
    });
    /** Toggle Buttons
     * @todo API request to enroll ALL stores.
     * @todo API request to enroll & unenroll INDIVIDUAL stores.
     * @overview Creates custom toggle buttons over input type=[checkbox]
     * @see {@link http://codepen.io/nikhil8krishnan/pen/eNVZgB}
     * @author Nikhil Krishnan, Twitter @nikhil8krishnan
     * @param {class} .toggle-btn wrapper
     * @param {class) .cb-value input type=[checkbox]
     * @return {function} toggleBtns();
     */
    function toggleBtns() {
      var $programId = getHashParams.hashParams.programId;
      var $userId = marcomUserData.$user.externalId || {};
      $('[data-enrolled="true"] .toggle-btn').addClass('active').prop('checked', 'checked');
      
      $('.cb-value').on('click', function () {
        var $mainParent = $(this).parent('.toggle-btn');
        var $storeId = $(this).attr('data-storeId');
        if($(this).is(':checked')) {
          $($mainParent).addClass('active');
          $(this).prop('checked', 'checked')

          return setStoreSubscription.makeRequest($userId, $storeId, $programId, 1);
        } else if($($mainParent).hasClass('active')) {
          $($mainParent).removeClass('active');
          $(this).prop('checked', '')

          return setStoreSubscription.makeRequest($userId, $storeId, $programId, 0);
        }
      });
      $('.enroll-all-stores').on('click', function (e) {
        e.preventDefault();
        return $('[data-enrolled="false"] .cb-value').click();
      });
    }
    if($('.toggle-btn').length) {
      return toggleBtns();
    }
    return;
  };
  var enrollStores = function ($selectedPrograms) {
    removeChecked();
    return setStoreSubscription.makeRequest($selectedPrograms);
  }
  var customCheckbox = function () {
    $('.customCheckbox input:checkbox').each(function () {
      $(this).parent().addClass('js-custom');
      if($(this).attr('checked') === 'checked') {
        $(this).closest('.customCheckbox').addClass('checked');
      }
    });
    $('.customCheckbox').click(function () {
      if(!$(this).children('input[type="checkbox"]').is('[readonly]')) {
        $(this).find('input').trigger('change');
        if($(this).hasClass('checked')) {
          $(this).removeClass('checked');
          $(this).find($('input[type="checkbox"]')).prop('checked', '');
        } else {
          $(this).addClass('checked');
          $(this).find($('input[type="checkbox"]')).prop('checked', 'checked').focus();
        }
        // return selectedPrograms();
      }
    });
    combinedHandlers();
  };
  var customRadiobox = function () {
    $('input:radio').each(function () {
      $(this).wrap('<div class="customRadiobox"></div>');
      $(this).parent().append('<label>' + $(this).data('radiobox-label') + '</label>');
      $(this).css('position', 'absolute').css('left', '-999999px');
    });
    $('input:radio').each(function () {
      if($(this).attr('checked') === 'checked') {
        $(this).closest('.customRadiobox').addClass('checked');
      }
    });
    $('.customRadiobox').click(function () {
      if(!$(this).children('input[type="radio"]').is('[readonly]')) {
        $(this).find('input').trigger('change');
        if($(this).hasClass('checked')) {
          // (this).find($('input[type="radio"]')).removeAttr('checked');
        } else {
          $('input[type="radio"][name="' + $(this).find('input:radio').prop('name') + '"]').not($(this)).parent().removeClass('checked');
          $('input[type="radio"][name="' + $(this).find('input:radio').prop('name') + '"]').not($(this)).prop('checked', '');
          $(this).addClass('checked');
          $(this).find($('input[type="radio"]')).prop('checked', 'checked').focus();
        }
      }
    });
    combinedHandlers();
  };
  return {
    customCheckbox: customCheckbox,
    customRadiobox: customRadiobox
  };
})(jQuery);
