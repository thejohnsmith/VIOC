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
      return enrollPrograms($selectedPrograms);
    });
  };

  // TO DO: This should be moved to setStoreSubscription.js
  var enrollPrograms = function($selectedPrograms) {
    removeChecked();
    return setStoreSubscription.makeRequest($selectedPrograms);
  }

  var removeChecked = function() {
    return $('.js-all-selectable.checked')
      .removeClass('checked')
      .find($('input:checkbox')).prop('checked', '');
  }

  // TO DO: Updated storesParticipating values.
  // This would likely be easier to do by making an API request to get programParticipationStats
  // var $('.js-all-selectable.checked').parent().parent().find('.storesParticipating');

  // TO DO: Add a SelectALL function
  var selectAllCustomBoxes = function() {
    $('.js-select-all-boxes').on('click', function(e) {
      e.preventDefault();
      var $jsAllSelectable = $('.js-all-selectable');
      var $jsAllSelectableChecked = $(
        '.js-all-selectable.checked');

      // Return if all are already selected.
      if ($jsAllSelectableChecked.length === $jsAllSelectable
        .length) {
        return;
      }
      $jsAllSelectable.addClass('checked').find($(
        'input')).prop(
        'checked',
        'checked').focus();
    });
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
