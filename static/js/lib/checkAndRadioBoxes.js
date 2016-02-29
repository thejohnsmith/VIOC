/* Usage */
// customCheckAndRadioBoxes.check();
// customCheckAndRadioBoxes.radio();

var customCheckAndRadioBoxes = (function($) {
  var combinedHandlers = function() {
    $('.customCheckbox, .customRadiobox').each(function() {
      $(this).addClass('js-custom');
    });
    $('input').on('blur', function() {
      $(this).closest('.customCheckbox').removeClass('focused');
      $(this).closest('.customRadiobox').removeClass('focused');
    }).on('focus', function() {
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
  var selectedPrograms = function() {
    if (!$('.js-trigger-enroll').length) {
      return
    }
    $('.js-trigger-enroll').on('click', function() {
      if (!$('input:checkbox:checked').length) {
        return
      }
      var $selectedPrograms = $('input:checkbox:checked')
        .map(function() {
          return $(this).val();
        }).get().join();
        var $selectedProgramNames = $('input:checkbox:checked + label')
          .map(function() {
            return $(this).text();
          }).get().join();
      return enrollPrograms($selectedPrograms, $selectedProgramNames);
    });
  };

  // TO DO: This should be moved to setStoreSubscription.js
  var enrollPrograms = function($selectedPrograms, $selectedProgramNames) {
    removeChecked();
    return setProgramDefaults.makeRequest($selectedPrograms, $selectedProgramNames);
  }

  var enrollStores = function($selectedPrograms) {
    removeChecked();
    return setStoreSubscription.makeRequest($selectedPrograms);
  }

  var activeChecked = function() {
    $('.checkbox-area[data-enrolled="true"] > .js-all-selectable').addClass(
      'checked');
  }

  var removeChecked = function() {
    return $('#programSummary .customCheckbox.checked')
      .removeClass('checked')
      .find($('input:checkbox')).prop('checked', '');
  }

  // TO DO: Updated storesParticipating values.
  // This would likely be easier to do by making an API request to get programParticipationStats
  // var $('.js-all-selectable.checked').parent().parent().find('.storesParticipating');

  var selectAllCustomBoxes = function() {
    $('.js-select-all-boxes').on('click', function(e) {
      e.preventDefault();
      var $jsAllSelectable = $('.js-all-selectable');
      var $jsAllSelectableChecked = $('.js-all-selectable.checked');

      // Return if all are already selected.
      if ($jsAllSelectableChecked.length === $jsAllSelectable
        .length) {
        return;
      }
      $jsAllSelectable.addClass('checked').find($(
        'input')).prop(
        'checked',
        'checked').focus();

      $('.js-select-all-boxes').on('click', function() {
        if (!$('.store-enroll input:checkbox:checked').length) {
          return
        }
        var $selectedPrograms = $(
            '.store-enroll .js-all-selectable.checked')
          .map(function() {
            return $(this).val();
          }).get().join();
        return setStoreSubscription.makeRequest($selectedPrograms);
      });
    });

    $('.enroll-all-stores').on('click', function(e) {
      $('.toggle-btn').each(function() {
        $(this).addClass('active');
        toggleBtns();
      });
    });

    function toggleBtns() {
      $('.cb-value').on('click', function(e) {
        var mainParent = $(this).parent('.toggle-btn');
        if ($(mainParent).find('input.cb-value').is(':checked')) {
          $(mainParent).addClass('active');
        } else {
          $(mainParent).removeClass('active');
        }
      });
    }
    if ($('.toggle-btn').length) {
      return toggleBtns();
    }
    return;
  };

  var customCheckbox = function() {
    $('.customCheckbox input:checkbox').each(function() {
      $(this).parent().addClass('js-custom');
      if ($(this).attr('checked') === 'checked') {
        $(this).closest('.customCheckbox').addClass('checked');
      }
    });
    $('.customCheckbox').click(function() {
      if (!$(this).children('input[type="checkbox"]').is(
          '[readonly]')) {
        $(this).find('input').trigger('change');
        if ($(this).hasClass('checked')) {
          $(this).removeClass('checked');
          $(this).find($('input[type="checkbox"]')).prop(
            'checked',
            '');
        } else {
          $(this).addClass('checked');
          $(this).find($('input[type="checkbox"]')).prop(
            'checked',
            'checked').focus();

        }
        // return selectedPrograms();
      }
    });

    combinedHandlers();
  };
  var customRadiobox = function() {
    $('input:radio').each(function() {
      $(this).wrap('<div class="customRadiobox"></div>');
      $(this).parent().append('<label>' + $(this).data(
          'radiobox-label') +
        '</label>');
      $(this).css('position', 'absolute').css('left',
        '-999999px');
    });
    $('input:radio').each(function() {
      if ($(this).attr('checked') === 'checked') {
        $(this).closest('.customRadiobox').addClass('checked');
      }
    });
    $('.customRadiobox').click(function() {
      if (!$(this).children('input[type="radio"]').is(
          '[readonly]')) {
        $(this).find('input').trigger('change');
        if ($(this).hasClass('checked')) {
          // (this).find($('input[type="radio"]')).removeAttr('checked');
        } else {
          $('input[type="radio"][name="' + $(this).find(
            'input:radio').prop(
            'name') + '"]').not($(this)).parent().removeClass(
            'checked');
          $('input[type="radio"][name="' + $(this).find(
            'input:radio').prop(
            'name') + '"]').not($(this)).prop('checked', '');
          $(this).addClass('checked');
          $(this).find($('input[type="radio"]')).prop(
            'checked',
            'checked').focus();
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
