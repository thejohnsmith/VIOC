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
  };


  var enrollPrograms = function($activeBoxValues) {

  }

  // var selectAllCustomBoxes = function() {
  //   $('.js-trigger-enroll').on('click', function() {
  //     var $jsAllSelectable = $('.js-all-selectable');
  //     var $jsAllSelectableChecked = $(
  //       '.js-all-selectable.checked');
  //
  //     // Return if all are already selected.
  //     if ($jsAllSelectableChecked.length === $jsAllSelectable
  //       .length) {
  //       return;
  //     }
  //     $jsAllSelectable.addClass('checked').find($(
  //       'input')).prop(
  //       'checked',
  //       'checked').focus();
  //   });
  //   return;
  // };

  var handleActiveBoxes = function activeHandler() {
    var $activeBoxValues = $.map($('input:checkbox:checked'),
      function(e, i) {
        return Number(e.value);
      });
    console.log('the checked values are: ' + $activeBoxValues.join(
      ''));
    $('.js-trigger-enroll').on('click', function($activeBoxValues) {

      /** Call the Subscription Request
       *  TO DO: Collect the ID's of the selected programs.
       */
      return setStoreSubscription.makeRequest($activeBoxValues);
    });
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
        return handleActiveBoxes();
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
