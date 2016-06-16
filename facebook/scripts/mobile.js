(function($) {

    var $screenMask = $('#mobile-screen-mask');
    var $currentScreen = $('#screen_landing');

    $(document).ready(function () {

        setMaps();

        $('a.to-screen').on('click activate', function() {

            if ($(this).hasClass('backwards')) {



                var $newScreen = $('#screen_' + ($(this).attr('href')).replace('#',''));
                $currentScreen.addClass('animating-backwards').removeClass('current');
                $newScreen.addClass('current');

                $currentScreen.animate({

                    left : '0'

                }, function() {

                    $currentScreen.removeClass('animating-backwards').removeAttr('style');
                    $currentScreen = $newScreen;

                });
            }
            else {

                var temp = ($(this).attr('href')).replace('#', '');


                var $newScreen = $('#screen_' + ($(this).attr('href')).replace('#',''));
                $newScreen.addClass('animating');

                $newScreen.animate({

                    left : '-50%'

                }, function() {

                    $currentScreen.removeClass('current');
                    $newScreen.removeClass('animating').addClass('current').removeAttr('style');
                    $currentScreen = $newScreen;

                    if (temp == "location") {


                    }

                });
            }

            if ($(this).hasClass('mobile-coupon') && !$(this).hasClass('backwards')) {

                track('coupon', 'download', $(this).children('.coupon-desc').children('span').children('b').first().text());
            }

        });

        $('#form_find-location').on('submit', function(e) {
            e.preventDefault();

            track('Conversion', 'Location Query', 'Mobile', $(this).children('input[type="text"]').val());

            addressSearch($(this).children('input[type="text"]').val(), false, false, function () {

                $('a.to-screen[href="#location"]:not(.backwards)').addClass('notCurrent').trigger('click').removeClass('notCurrent');
                findLocation(Locations[0]);
                var t = setTimeout(function () {

                    google.maps.event.trigger(map3, "resize");
                    map3.panTo(new google.maps.LatLng(myLat, myLng));

                }, 50);
            });

        });

        $('#button_current-location').off('click').on('click', function() {
            if (geo_position_js.init() && !$(this).hasClass('notCurrent')) {

                geo_position_js.getCurrentPosition((function (p) {
                    p.callback = function () {
                        findLocation(Locations[0]);
                        $('#button_current-location').trigger('activate');
                        var t = setTimeout(function () {

                            google.maps.event.trigger(map3, "resize");
                            map3.panTo(new google.maps.LatLng(myLat, myLng));

                        }, 50);
                    };
                    success_callback(p);

                }), error_callback, { enableHighAccuracy: true, options: 5000 });
            }
            else {
                $('#button_current-location').trigger('activate');
            }

        });
    });

    var findLocation = function(_data) {
        $('#mobile-sem').find('h3.street').text(_data.address.address1);
        $('#mobile-sem').find('h4.city-state').text(_data.address.city + ', ' + _data.address.state);

        var d = new Date();
        var hours = "";

        switch(d.getDay()) {

            case 0:
                hours = _data.Hours.sun;
                break;
            case 1:
                hours = _data.Hours.mon;
                break;
            case 2:
                hours = _data.Hours.tue;
                break;
            case 3:
                hours = _data.Hours.wed;
                break;
            case 4:
                hours = _data.Hours.thu;
                break;
            case 5:
                hours = _data.Hours.fri;
                break;
            case 6:
                hours = _data.Hours.sat;
                break;
        }

        if (hours == "Closed")
            $('#mobile-sem').find('.store-hours').text(hours);
        else
            $('#mobile-sem').find('.store-hours').text('Open ' + hours.replace('-', ' - '));

        $('#mobile-sem').find('a.directions').attr('href', 'http://maps.google.com?q=' + _data.address.address1 + ' ' + _data.address.city + ' ' + _data.address.state);
        $('#mobile-sem').find('a.call').attr('href', 'tel:'+ _data.address.phone);
    }

})(jQuery);
