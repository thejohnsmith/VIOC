// udpated on feb 2nd following issue #bg2015f2-9lwh
//  #bg2015f2-9lwh (check box value and radio box value not updating )
//  #bg2015m3-9lwh (issues fixed :: default selected, foucs and blur, add custom elemements in label text like in google privicy and policy )
$(document).ready(function(e) {
    $('input:radio').each(function() {
        $(this).wrap('<div class="customRadiobox"></div');
        $(this).parent().append('<label>' + $(this).data('radiobox-label') + '</label>');
        $(this).css('position', 'absolute').css('left', '-999999px')
    });
    $('input:checkbox').each(function() {
        $(this).wrap('<div class="customCheckbox"></div')
        $(this).parent().append('<label>' + $(this).data('checkbox-label') + '</label>');
        $(this).css('position', 'absolute').css('left', '-999999px')
    });

    $('input:checkbox').each(function() {
        if ($(this).attr('checked') == 'checked') {
            $(this).closest('.customCheckbox').addClass('checked');
        }
    });

    $('input:radio').each(function() {
        if ($(this).attr('checked') == 'checked') {
            $(this).closest('.customRadiobox').addClass('checked');
        }
    });

    $('input').on('blur', function() {
        $(this).closest('.customCheckbox').removeClass('focused');
        $(this).closest('.customRadiobox').removeClass('focused');
    }).on('focus', function() {

        $(this).closest('.customCheckbox').addClass('focused');
        $(this).closest('.customRadiobox').addClass('focused');
    });




    $('.customRadiobox').click(function() {
        if (!$(this).children("input[type='radio']").is('[readonly]')) {
            $(this).find("input").trigger("change");
            if ($(this).hasClass('checked')) {
                //$(this).find($('input[type="radio"]')).removeAttr('checked');
            } else {
                $('input[type="radio"][name="' + $(this).find('input:radio').prop('name') + '"]').not($(this)).parent().removeClass('checked');
                $('input[type="radio"][name="' + $(this).find('input:radio').prop('name') + '"]').not($(this)).prop('checked', '');
                $(this).addClass('checked');
                $(this).find($('input[type="radio"]')).prop('checked', 'checked').focus();
            }
        }
    });
    $('.customCheckbox').click(function() {
        if (!$(this).children("input[type='checkbox']").is('[readonly]')) {
            $(this).find("input").trigger("change");
            if ($(this).hasClass('checked')) {
                $(this).removeClass('checked');
                $(this).find($('input[type="checkbox"]')).prop('checked', '');
            } else {
                $(this).addClass('checked');
                $(this).find($('input[type="checkbox"]')).prop('checked', 'checked').focus();
            }
        }
    });

});
// JavaScript Document