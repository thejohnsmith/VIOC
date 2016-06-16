var timeout = 2000;
var geoTimer;
var start = 0;
var resultLimit = 75;
var listLength = 20;
var lastCheck = '';
var lastSearch = '';
var mapSwitched = false;
var mapState = 'big';
var pOpts = {
    rateMin: 2,
    radius: 1
};
var popupSent = false;
var isTest = false;
var myLat = defLat = 39.8;
var myLng = defLng = -98.5;
var geocoder;
var myZoom = 3;
var markers = [];
var markers2 = [];
var markers3 = [];
var markerIds = [];
var map = null;
var markerCluster, infoWindow, map2, markerCluster2, places, map3;
var processed = false;
var loaded = false;
var Locations = [];
var groupCount = 20;
var loadTime = 3;
var groupCur = 1;
var myScroll;
var callAfterSearch = '';
var chosenVariation;

function is_touch_device() {
    return !!('ontouchstart' in window) // works on most browsers
        || !!('onmsgesturechange' in window); // works on ie10
};

function track() {
    trackGA = [];
    trackBing = {};
    trackGA.push('_trackEvent');
    for(var i = 0; i < arguments.length; i++) {
        trackGA.push(arguments[i]);
        switch(i) {
        case 0:
            trackBing.ec = arguments[i];
            break;
        case 1:
            trackBing.ea = arguments[i];
            break;
        case 2:
            trackBing.el = arguments[i];
            break;
        case 3:
            if(arguments[i] % 1 === 0) {
                trackBing.ev = arguments[i];
            }
            break;
        }
    }
    _gaq.push(trackGA);
    window.uetq.push(trackBing);
}
$(document).ready(function () {
    if(!isMobile()) {
        loadDesktop();
    }
    $('.row').each(function () {
        if($(this).find('.v_middle').length > 0) {
            var rowHeight = $(this).height();
            $(this).find('.v_middle').each(function () {
                $(this).css('margin-top', (rowHeight - $(this).outerHeight()) / 2);
            })
        }
    });
    $('#ctl00_FooterContent2_connect1_btnSignUp').on('click', function (e) {
        validateConnectForm(e);
    });
});

function couponTest(coupon) {
    var num = parseInt(coupon.slice(-1)) + 1;
    return(coupon.substring(0, coupon.length - 1) + num);
}

function processTest(_experiment) {
    isTest = true;
    try {
        chosenVariation = cxApi.chooseVariation();
    } catch(e) {}
    if(typeof chosenVariation == 'undefined') {
        chosenVariation = 0;
    }
    if(window.location.search.indexOf('alternate') >= 0) {
        chosenVariation = 1;
    }
    switch(_experiment) {
        // Mobile Test
    case 'YbheppyFRwibkmYeoflKjA':
        switch(chosenVariation) {
        case 1:
            var coupon1 = couponTest($('.coupon1').first().text());
            var coupon2 = couponTest($('.coupon2').first().text());
            $('.coupon1').text(coupon1);
            $('.coupon2').text(coupon2);
            $('.click_coupon1').html('<b>' + coupon1 + '</b><b>Tap here to get your code</b>');
            $('.click_coupon2').html('<b>' + coupon2 + '</b><b>Tap here to get your code</b>');
            $('.click_coupon1 b:first-child, .click_coupon2 b:first-child').hide();
            break;
        case 0:
        default:
            break;
        }
        break;
        // OCH Test
    case 'WrUMdT0HSV6KOaZbOcVg_g':
        switch(chosenVariation) {
        case 0:
            Cookies.remove('och'); //only for testing
            if(Cookies.get('och') == undefined) {
                Cookies.set('och', 'seen', {
                    expires: 60
                });
                var initialPopup = $('\
<div class="row a_center m_bottom-lg">\
	<div class="col-2 a_right"><img src="./images/och_logo-large.png"/></div>\
	<div class="col-8 a_center v_middle"><h1 class="a_center m_bottom-no"><span class="nowrap">Oil Can Henry\'s</span> is now <span class="nowrap">Valvoline Instant Oil Change</span></h1></div>\
	<div class="col-2 a_left"><img src="./images/vioc_logo-large.png"/></div>\
</div>\
<div class="row a_center">\
	<h2 class="text_blue">Our Name Has Changed, Our Trusted Service Remains the Same</h2>\
	<div class="font_large m_top-sm">\
		Same Fast Service&nbsp;&nbsp;<span class="text_red">&#9679;</span>&nbsp;&nbsp;\
		Same Friendly, Trained Technicians&nbsp;&nbsp;<span class="text_red">&#9679;</span>&nbsp;&nbsp;\
		Same Great Value\
	</div>\
</div>');
                var buttons = $('<div class="row a_center m_top-lg"/>');
                var btnCoupon = $('<a class="btn">Get a Coupon</a>');
                var btnFind = $('<a class="btn">Find a Location</a>');
                buttons.append(btnCoupon);
                buttons.append(btnFind);
                var popup = displayPopup(initialPopup);
                popup.modal.append(buttons);
                popup.modal.addClass('wide');
                $([btnFind, btnCoupon]).each(function () {
                    this.on('click', function (e) {
                        e.preventDefault();
                        popup.close();
                    });
                });
                popup.open(function () {
                    popup.modal.find('.v_middle').css('margin-top', (popup.modal.find('.v_middle').parents('.row').outerHeight() - popup.modal.find('.v_middle').outerHeight()) / 2);
                });
            }
            break;
        case 1:
        default:
            var headline = $('#headline');
            headline.find('[id$="headlineMain"]').text("Oil Can Henry's is now Valvoline Instant Oil Change!");
            headline.find('[id$="headlineMain"]').addClass('m_bottom-no');
            headline.find('[id$="headlineSub"]').text("Our Name Has Changed, Our Trusted Service Remains the Same");
            headline.find('[id$="headlineSub"]').addClass('m_top-no');
            headline.find('[id$="headlineText"]').html('Same Fast Service&nbsp;&nbsp;<span class="text_red font">&#9679;</span>&nbsp;&nbsp;Same Friendly, Trained Technicians&nbsp;&nbsp;<span class="text_red font">&#9679;</span>&nbsp;&nbsp;Same Great Value')
            headline.find('[id$="headlineImg"]').attr('src', './images/och_logo-large.png');
            break;
        }
        break;
    }
}

function validateConnectForm(e) {
    e.preventDefault();
    var $cwuEmailField = $('#ctl00_FooterContent2_connect1_txtEmail');
    var $cwuZipField = $('#ctl00_FooterContent2_connect1_txtZip');
    var badCWUForm = false;
    var errorMessage = "";
    if(($cwuEmailField.val()).search('@') == -1 || ($cwuEmailField.val()).indexOf('.') == -1) {
        badCWUForm = true;
        errorMessage = errorMessage + "You must enter a valid email.\n";
    }
    if(parseInt($cwuZipField.val()) < 10000 || parseInt($cwuZipField.val()) > 99999 || isNaN(parseInt($cwuZipField.val()))) {
        badCWUForm = true;
        errorMessage = errorMessage + "You must enter a valid zip code.\n";
    }
    if(!badCWUForm) {
        __doPostBack('ctl00$FooterContent2$connect1$btnSignUp', '');
    } else {
        alert(errorMessage);
    }
    //__doPostBack('ctl00$FooterContent2$connect1$btnSignUp','')
}

function checkPopup() {
    if(!popupSent) {
        setTimeout(checkPopup, 150);
    } else {
        var popup = displayPopup('<iframe src="http://www.surveygizmo.com/s3/2573201/Exit-Survey" frameborder="0" width="100%" height="800" style="overflow:hidden"></iframe>');
        popup.open();
    }
}

function displayPopup(_content) {
    var popup = {};
    var modalBG = $('<div id="modal-bg"></div>');
    var modal = $('<div id="modal"></div>');
    var modalClose = $('<a class="close-button" href="#"></a>');
    modalBG.append(modal);
    modal.append(_content);
    modal.append(modalClose);
    modalClose.bind('click', function (e) {
        e.preventDefault();
        popup.close();
    });
    popup.close = function () {
        $('html, body').removeClass('noscroll');
        modalBG.removeClass('show');
        setTimeout(function () {
            modalBG.remove();
        }, 1000);
    };
    popup.open = function (_callback) {
        $(document.body).prepend(modalBG);
        $('html, body').addClass('noscroll');
        setTimeout(function () {
            modal.css('margin-top', Math.floor(modal.outerHeight() / -2));
            modalBG.addClass('show');
            if(typeof _callback == 'function') {
                _callback();
            }
        }, 50);
    };
    $(window).on('resize', function () {
        modal.css('margin-top', Math.floor(modal.outerHeight() / -2));
    });
    popup.modal = modal;
    return popup;
}

function loadDesktop() {
    if(!isTest && Cookies.get('exitSurvey') == undefined) {
        /*
        Cookies.set('exitSurvey', 'received', { expires: 60 });

        var initialPopup = $('<h1>We\'d like your feedback!</h1><p>We\'re trying to understand our customers better so we can offer them the best experience. Would you like to complete a survey after you are done on our page?</p>');
        var buttons = $('<div class="buttons"/>');
        initialPopup.append(buttons);
        var buttonYes = $('<a class="accept">Yes</a>');
        var buttonNo = $('<a class="decline close">No</a>');
        buttons.append(buttonYes);
        buttons.append(buttonNo);

        var popup = displayPopup(initialPopup);
        popup.open();

        buttonNo.bind('click', function(e){
        	e.preventDefault();
        	popup.close();
        });

        buttonYes.bind('click', function(e){
        	e.preventDefault();
        	popup.close();
        	$('body').mouseleave(function(e) {
        		if(e.clientY < 0){
        			popupSent = true;
        		}
        	});
        	$(window).bind('beforeunload', function(e){
        		if(!popupSent){
        			popupSent = true;
        			return 'If you still would like to complete the exit survey, please select either "Stay on this Page" or "Don\'t Reload" to return and do so.';
        		}
        	});
        	checkPopup();
        });
        */
    }
    if(isTest) {}
    setMaps();
    $('#cities li a').each(function () {
        var temp = $(this).text().split(',');
        var city = $.trim(temp[0]);
        var state = $.trim(temp[1]);
        $(this).attr('href', '#' + state + '/' + city);
    });
    $('#cities ul').each(function (index, el) {
        count = 0;
        temp = 0;
        $(this).find('li').each(function (index1, el1) {
            count++;
            if(count >= 20) {
                $('<li class="blank">&nbsp;</li>').insertAfter(el1);
                count = 0;
                temp++;
            }
        });
        pages = Math.ceil($(el).find('li').length / 21) - 1;
        $(el).attr('pages', pages);
    });
    var contentHeight = 355,
        location_column = $("#location_column"),
        searchInput = $("#location_textinput"),
        sidebarWrap = $("#sidebar_wrap");
    searchInput.on('focus', function () {
        //fade the "find a location" prompt if it still exists
        //clear input default value
        $("#search_prompt").fadeOut(400);
        searchInput.val("");
    });
    searchInput.keypress(function (e) {
        if(e.keyCode == 13) {
            e.stopPropagation();
            e.preventDefault();
            $('#submit').trigger('click');
        }
    });
    if(!geo_position_js.init()) {
        $('#detect').hide();
    }
    $('#detect').click(function () {
        track('Conversion', 'Location Query', 'Desktop', 'Auto detect');
    });
    $('#submit').click(function (e) {
        if($.trim($('#location_textinput').val()) != '' && $.trim($('#location_textinput').val()) != "Enter your address or ZIP code") {
            var tempVal = $.trim($('#location_textinput').val());
            if(tempVal.search(/ USA/i) == -1) tempVal = tempVal + " USA";
            if(tempVal.search(',') != -1) tempVal = tempVal.replace(/,/g, '');
            track('Conversion', 'Location Query', 'Desktop', tempVal);
            location.hash = tempVal;
        }
        e.preventDefault();
    });
    $("#view_on_map").click(function (e) {
        location.hash = lastSearch.split(', ').reverse().join('/');
    });
    $('#email, .email-input').each(function () {
        $(this).attr('default', $(this).val());
        $(this).blur(function () {
            myIn = $(this);
            setTimeout(function () {
                if(myIn.attr('default') != myIn.val()) {
                    track('aspnetform', 'change', 'ctl00$tbEmail');
                    _gaq.push(['b._trackEvent', 'aspnetform', 'change', 'ctl00$tbEmail']);
                }
            }, 10);
        })
    });
    $('.zip-input').each(function () {
        $(this).attr('default', $(this).val());
        $(this).blur(function () {
            myIn = $(this);
            setTimeout(function () {
                if(myIn.attr('default') != myIn.val()) {
                    track('aspnetform', 'change', 'ctl00$tbZip');
                    _gaq.push(['b._trackEvent', 'aspnetform', 'change', 'ctl00$tbZip']);
                }
            }, 10);
        })
    });
    $('.print').click(function () {
        var codes = [];
        $('.coupon_couponCode').each(function () {
            codes.push($(this).text());
        });
        track('Coupon', 'print', codes.join('/'));
        _gaq.push(['b._trackEvent', 'Coupon', 'print', codes.join('/')]);
    });
    $('#coupon_primary, #coupon_secondary').click(function () {
        var codes = [];
        $('.coupon_couponCode').each(function () {
            codes.push($(this).text());
        });
        track('Coupon', 'print', codes.join('/'));
        _gaq.push(['b._trackEvent', 'Coupon', 'print', codes.join('/')]);
        print();
    });
    if(IEversion !== false && IEversion == '7.0') {
        $.ajaxSetup({
            xhr: function () {
                return XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
            }
        });
    }
    $.ajaxTransport("+*", function (options, originalOptions, jqXHR) {
        if(IEversion !== false && window.XDomainRequest) {
            var xdr;
            return {
                send: function (headers, completeCallback) {
                    // Use Microsoft XDR
                    xdr = new XDomainRequest();
                    if(options.url.substring(0, window.location.protocol.length) != window.location.protocol) {
                        var temp = options.url.split(':');
                        if(temp[0].substring(0, 4) == 'http') {
                            temp.shift();
                            options.url = window.location.protocol + temp.join(':');
                        } else {
                            options.url = window.location.protocol + '//' + temp.join(':');
                        }
                    }
                    xdr.open("get", options.url);
                    xdr.onload = function () {
                        if(this.contentType.match(/\/xml/)) {
                            var dom = new ActiveXObject("Microsoft.XMLDOM");
                            dom.async = false;
                            dom.loadXML(this.responseText);
                            completeCallback(200, "success", [dom]);
                        } else {
                            completeCallback(200, "success", [this.responseText]);
                        }
                    };
                    xdr.ontimeout = function () {
                        completeCallback(408, "error", ["The request timed out."]);
                    };
                    xdr.onerror = function () {
                        completeCallback(404, "error", ["The requested resource could not be found."]);
                    };
                    xdr.onprogress = function () {};
                    xdr.send();
                },
                abort: function () {
                    if(xdr) xdr.abort();
                }
            };
        }
    });
    $('#footer .button').click(function (e) {
        e.preventDefault();
        var myAction = $(this).attr('href');
        myAction = myAction.replace("javascript:", '');
        track('Conversion', 'sign-up', 'email');
        _gaq.push(['b._trackEvent', 'Conversion', 'sign-up', 'email']);
        setTimeout(function () {
            eval(myAction);
        }, 1000);
    });
    $('#submit-sms-footer').click(function () {
        submitSMS('#smsForm-footer');
    });
    if($.trim($('.myLocation').val()) != '') {
        var myLoc = $('.myLocation').val();
        $('#location_textinput').val(myLoc);
        setTimeout("$('#submit').trigger('click');", 10);
    }
}
$(window).load(function () {
    $(window).trigger('scroll');
    $(window).trigger('hashchange');
    if(is_touch_device()) {
        $('#with-us .email .close').click(function () {
            $('#email-form').toggleClass('show');
        });
    }
    if($('#ctl00_FooterContent2_connect1_pnlEmailError').size() > 0 || $('#ctl00_FooterContent2_connect1_pnlEmailThankYou').size() > 0) {
        $(document).scrollTop(1000);
    }
});

function isMobile() {
    return($(window).outerWidth() <= 640);
}
$(window).scroll(function () {
    if(!isMobile()) {
        var myTop = (typeof $('#footer').offset().top == 'number') ? $('#footer').offset().top : $('#footer')[0].offsetTop;
        if((myTop) < ((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + $(window).innerHeight())) {
            $('#connect_bar, #footer').addClass('normal');
        } else {
            $('#connect_bar, #footer').removeClass('normal');
        }
        if(map == null) {
            loadDesktop();
        }
    }
});
$(window).resize(function () {
    setTimeout("$(window).trigger('scroll');", 50);
});

function showLocalImage() {
    var options = {}
    if(arguments.length > 0) {
        options = arguments[0];
    }
    var onComplete = function () {}
    if(typeof options.onComplete == 'function') {
        onComplete = options.onComplete;
    }
    //$("#location_sidebar_localimage>img").animate({left: "175px"}, 400, onComplete);
    onComplete();
}

function resetMapInterface() {
    $("#location_column").animate({
        top: '0px'
    }, 400);
    showBigMap();
    showLocalImage({
        onComplete: function () {
            $("#sidebar_wrap").animate({
                left: '0px'
            }, 400);
        }
    });
    $("#content_wrap").animate({
        left: '0%'
    }, 400);
}

function showStateList() {
    $("#location_column").animate({
        top: '-355px'
    }, 400);
}

function showCitiesList(state) {
    var page = 0;
    if(arguments.length > 1) {
        page = parseInt(arguments[1]) - 1;
    }
    var state2 = state.attr('id').replace('state_', '');
    var hash = window.location.hash.replace(/^#/, '');
    var temp = hash.split('/');
    $('.cities').css('display', 'none');
    state.css('display', 'block');
    $('#state_pagenumber .state').html($('#location_states a[href="#' + state2 + '"]').text());
    if(parseInt(state.attr('pages')) > 0) {
        if(page > 1) {
            $('#back_state').attr('href', '#' + state2 + '/' + (page));
        }
        if(page == 1) {
            $('#back_state').attr('href', '#' + state2);
        }
        if(page == 0) {
            $('#back_state').attr('href', '#states');
        }
        if($('#cities .more').length == 0) {
            $('#cities').append('<a class="more" href="#">More Locations <img src="images/down_arrow_red.png"></a>');
        }
        var more = $('#cities .more');
        more.attr('href', '#' + state2 + '/' + (page + 2));
        $('#state_pagenumber .page').html((page + 1) + ' of ' + (parseInt(state.attr('pages')) + 1));
        if(page >= (parseInt(state.attr('pages')))) {
            more.remove();
        }
    } else {
        $('#back_state').attr('href', '#states');
        var more = $('#cities .more');
        more.remove();
        $('#state_pagenumber .page').html('');
    }
    $("#location_column").animate({
        top: '-710px'
    }, 400);
    state.animate({
        'top': -1 * (page) * parseInt($('#cities').height())
    }, 400);
}

function searchFor(options) {
    if(typeof options.val == 'string') {
        if(options.val != lastSearch) {
            $("#location_textinput").val(options.val);
            $('#sidebar_search_location').text($.trim($('#location_textinput').val()));
            addressSearch($.trim($('#location_textinput').val()), false, false, function () {
                $("#location_column").animate({
                    top: '0px'
                }, 400);
                $("#sidebar_wrap").animate({
                    left: '-100%'
                }, 400, function () {
                    if(typeof options.goTo == 'string') {
                        openLocation(options.goTo);
                    }
                    showLocalImage();
                });
                $("#search_prompt").fadeOut(400);
            });
        } else {
            if(typeof options.goTo == 'string') {
                openLocation(options.goTo);
            } else {
                showBigMap();
            }
        }
    }
}

function showBigMap() {
    if(mapState != 'big') {
        myLat = $('#location_sidebar_results').attr('lat');
        myLng = $('#location_sidebar_results').attr('lng');
        $('#view_on_map').css("display", "none");
        $("#back_search").css("display", "inline-block");
        if($("#sidebar_search_results>li").hasClass("selected")) {
            $("#sidebar_search_results>li.selected").removeClass("selected");
        }
        $("#location_map").animate({
            width: '100%',
            height: 355
        }, 400, function () {
            myZoom = parseInt($('#location_sidebar_results').attr('map_zoom'));
            mapPan(false, myZoom);
        });
        mapState = 'big';
    }
}

function showSmallMap() {
    if(mapState != 'small') {
        $("#sidebar_wrap").animate({
            left: '-100%'
        }, 400);
        if($('.forSMG').size() == 0) {
            $("#location_map").animate({
                width: '40%',
                height: '50%'
            }, 400, function () {
                mapPan(true);
            });
        } else {
            $("#location_map").animate({
                'width': '60%',
                'height': '60%'
            }, 400, function () {
                mapPan(true);
            });
        }
        mapState = 'small';
    }
}

function openLocation(searchAddress) {
    var noneFound = true;
    $('#sidebar_search_results .address').each(function (index, el) {
        if($(el).text() == searchAddress) {
            noneFound = false;
            var myLi = $(el).parents('li');
            myLat = myLi.attr('lat');
            myLng = myLi.attr('lng');
            var resultNum = myLi.attr("data-resultid");
            var searchWrapper = $("#search_results");
            resultSetNumber(Math.floor(index / 5));
            showSmallMap();
            if($("#sidebar_search_results>li").hasClass("selected")) {
                $("#sidebar_search_results>li.selected").removeClass("selected");
                myLi.addClass("selected");
                searchWrapper.animate({
                    left: '0%',
                    top: -(resultNum * parseInt($('#location_search').height()))
                }, 400, function () {
                    loadReviews(resultNum);
                });
            } else {
                myLi.addClass("selected");
                searchWrapper.css("top", -(resultNum * parseInt($('#location_search').height())));
                showSmallMap();
                searchWrapper.animate({
                    left: '0%'
                }, 400, function () {
                    loadReviews(resultNum);
                });
                $("#view_on_map").css("display", "inline-block");
                $("#back_search").css("display", "none");
            }
            myLat = myLi.attr('lat');
            myLng = myLi.attr('lng');
            mapPan(true);
        }
    });
    if(noneFound) {
        var hash = window.location.hash.replace(/^#/, '');
        var temp = hash.split('/');
        if(temp[temp.length - 1] == "") {
            temp.pop();
        }
        location.hash = temp.join('/');
    }
}
$(window).bind('hashchange', function (e) {
    if(!isMobile()) {
        var hash = window.location.hash.replace(/^#/, '');

        function escapeRegExp(str) {
            return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }
        hash = hash.replace(new RegExp(escapeRegExp('%20'), 'g'), ' ');
        switch(hash) {
        case '':
        case 'home':
            resetMapInterface();
            break;
        case 'states':
            showStateList();
            break;
        case 'location':
            if(lastSearch == 'location') {
                $("#sidebar_wrap").animate({
                    left: '-100%'
                }, 400);
                showBigMap();
            } else {
                if(geo_position_js.init()) {
                    geo_position_js.getCurrentPosition(success_callback, error_callback, {
                        enableHighAccuracy: true,
                        options: 5000
                    });
                }
            }
            break;
        default:
            var temp = hash.split('/');
            var state = $('#state_' + temp[0]);
            if(state.length > 0) {
                switch(temp.length) {
                case 2:
                    if(parseInt(temp[1]) + '' == temp[1]) {
                        showCitiesList(state, temp[1]);
                    } else {
                        searchFor({
                            val: temp[1] + ', ' + temp[0]
                        });
                    }
                    break;
                case 3:
                    searchFor({
                        val: temp[1] + ', ' + temp[0],
                        goTo: temp[2]
                    });
                    break;
                default:
                    showCitiesList(state);
                    break;
                }
            } else {
                if(temp[0] == 'location') {
                    if(lastSearch == 'location') {
                        openLocation(temp[1]);
                    } else {
                        if(geo_position_js.init()) {
                            geo_position_js.getCurrentPosition(success_callback, error_callback, {
                                enableHighAccuracy: true,
                                options: 5000
                            });
                            if(temp.length > 1) {
                                callAfterSearch = function () {
                                    openLocation(temp[1]);
                                }
                            }
                        }
                    }
                } else {
                    var opts = {
                        val: hash
                    }
                    var temp = hash.split('/');
                    if(temp.length > 1) {
                        opts.val = temp[0];
                        opts.goTo = temp[1];
                    }
                    searchFor(opts);
                }
            }
            break;
        }
    }
});

function success_callback(p) {
    myLat = p.coords.latitude.toFixed(2);
    myLng = p.coords.longitude.toFixed(2);
    myZoom = 11;
    $('#sidebar_search_location').text('Locations near you');
    var _callback = function () {
        $("#location_column").animate({
            top: '0px'
        }, 400);
        $("#sidebar_wrap").animate({
            left: '-100%'
        }, 400, function () {
            showLocalImage();
            if(typeof callAfterSearch == 'function') {
                callAfterSearch();
                callAfterSearch = '';
            }
        });
        $("#search_prompt").fadeOut(400);
    };
    if(typeof p.callback == 'function') {
        _callback = p.callback;
    }
    addressSearch(new google.maps.LatLng(myLat, myLng), true, false, _callback);
}

function error_callback(p) {}
var listClick = function (e) {
    var temp = lastSearch.split(', ');
    //    var temp = lastSearch;
    temp = temp.reverse().join('/');
    location.hash = temp + '/' + $(this).find('.address').text();
    track('Conversion', 'Location Link Click', $(this).find('.address').text());
    // SMG Widget
    if($('#smgReviews').size() > 0) {
        $('#smgReviews').html('');
        SMGWidgetApi.embed({
            clientid: 'VAL_CSI',
            locationid: $(this).attr('data-storenum'),
            numberofitems: '1',
            plugin: 'all',
            target: 'smgReviews'
        });
    }
}

function loadReviews(resultNum) {
    var searchWrapper = $("#search_results");
    var myItem = $(searchWrapper.find('[data-resultid=' + resultNum + ']').first());
    if(myItem.find('.google_review').length == 0) {
        var request = {
            location: new google.maps.LatLng(myLat, myLng),
            radius: pOpts.radius,
            name: 'Valvoline'
        };
        var myReview = $('<div class="google_review"/>');
        places.nearbySearch(request, function (results, status, pagination) {
            if(results.length > 0) {
                var myLoc = results[0];
                places.getDetails({
                    reference: myLoc.reference
                }, function (place, status) {
                    if(typeof place.reviews == 'object' && place.reviews.length > 0) {
                        var useReview = -1;
                        $.each(place.reviews, function (index, el) {
                            if(parseInt(el.aspects[0].rating) >= pOpts.rateMin && el.text != '') {
                                useReview = index;
                            }
                        });
                        if(useReview >= 0) {
                            var el = place.reviews[useReview];
                            if(el.text.length > 160) {
                                el.text = el.text.substr(0, 160);
                                el.text += '...';
                            }
                            var ratingAmount = 'Excellent';
                            switch(el.aspects[0].rating) {
                            case '0':
                                ratingAmount = 'Poor-Fair';
                                break;
                            case '1':
                                ratingAmount = 'Good';
                                break;
                            case '2':
                                ratingAmount = 'Very Good';
                                break;
                            case '3':
                                ratingAmount = 'Excellent';
                                break;
                            }
                            myReview.append('<h3>Google Places Review:</h3><p><strong>' + el.author_name + '</strong><br/><strong>' + el.aspects[0].type + ':</strong> ' + ratingAmount + '</p><p>' + el.text + '<br/><a href="' + place.url + '">more</a></p>');
                            myItem.find('.left_column').find('.google_review').remove();
                            myItem.find('.left_column').append(myReview);
                        }
                    }
                });
            }
        });
    } else {
        myItem.find('.google_review').each(function (index, el) {
            if(index > 0) {
                $(this).remove();
            }
        });
    }
}

function mapPan() {
    setCenter = false;
    if(arguments.length > 0) {
        setCenter = arguments[0];
    }
    if(arguments.length > 1) {
        map.setZoom(arguments[1]);
    }
    google.maps.event.trigger(map, 'resize');
    if(setCenter) {
        map.setCenter(new google.maps.LatLng(myLat, myLng));
    } else {
        map.panTo(new google.maps.LatLng(myLat, myLng));
    }
}

function setMaps() {
    var myLatlng = new google.maps.LatLng(myLat, myLng);
    var myOptions = {
        zoom: myZoom,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var myOptions2 = myOptions;
    myOptions2.zoom = myOptions2.zoom - 1;
    var myOptions3 = myOptions;
    myOptions3.disableDefaultUI = true;
    map = new google.maps.Map(document.getElementById("location_map"), myOptions);
    map2 = new google.maps.Map(document.getElementById("map_print_container"), myOptions2);
    map3 = new google.maps.Map(document.getElementById("map-for-mobile"), myOptions3);
    places = new google.maps.places.PlacesService(map);
    geocoder = new google.maps.Geocoder();
    google.maps.event.addListener(map, 'idle', function () {
        var myCenter = map.center;
        myLat = myCenter.lat();
        myLng = myCenter.lng();
        myZoom = map.getZoom();
        map2.setZoom(myZoom);
        map2.setCenter(myCenter);
    });
    /*
    if($.trim($('.myLocation').val()) != ''){
		setTimeout(function(){addressSearch($.trim($('.myLocation').val()));}, 100);
	}*/
}

function addressSearch(address) {
    lastSearch = address;
    $('#preload').animate({
        opacity: 0
    }, 500, function () {
        $('#preload').remove();
    });
    $('#sidebar_search_results').empty();
    $('#sidebar_search_list .more, #sidebar_search_list .back').remove();
    $('#sidebar_search_results').css('margin-top', 0);
    loaded = true;
    var options = {};
    var latlng = false;
    if(arguments.length > 1) {
        latlng = arguments[1];
    }
    var panned = false;
    if(arguments.length > 2) {
        panned = arguments[2];
    }
    var onComplete = function () {}
    if(arguments.length > 3) {
        onComplete = arguments[3];
    }
    if(latlng) {
        options.location = address;
        lastSearch = 'location';
    } else {
        options.address = address;
    }
    geocoder.geocode(options, function (results, status) {
        if(status == 'OK') {
            var result = results[0];
            myLat = result.geometry.location.lat();
            myLng = result.geometry.location.lng();
            $('#location_sidebar_results').attr('lat', myLat);
            $('#location_sidebar_results').attr('lng', myLng);
            map.panTo(result.geometry.location);
            map2.panTo(result.geometry.location);
            map3.panTo(result.geometry.location);
            if(!panned) {
                map.setZoom(11);
                map2.setZoom(10);
                map3.setZoom(10);
            }
            $('#location_sidebar_results').attr('map_zoom', map.getZoom());
            lastCheck = {
                'lat': myLat,
                'lng': myLng
            };
            var doSomething = function (results) {
                Locations = new Array();
                if(arguments.length > 1) {
                    if(arguments[1] == 'json') {
                        results = results;
                        Locations = results.location;
                    } else {
                        if(results !== null) {
                            if(typeof results.locations == 'object') {
                                Locations = results.locations;
                            } else if(typeof results.Locations == 'object') {
                                Locations = results.Locations;
                            } else if(typeof results.Location == 'object') {
                                Locations = results.Location;
                            } else if(typeof results.location == 'object') {
                                Locations = results.location;
                            }
                        }
                    }
                } else {
                    if(results !== null) {
                        if(typeof results.locations == 'object') {
                            Locations = results.locations;
                        }
                        if(typeof results.Locations == 'object') {
                            Locations = results.Locations;
                        } else if(typeof results.Location == 'object') {
                            Locations = results.Location;
                        } else if(typeof results.location == 'object') {
                            Locations = results.location;
                        }
                    }
                }
                if((typeof Locations !== 'undefined') && Locations.length > 0) {
                    Locations = Locations;
                } else if(typeof Locations == 'object' && Locations.ID !== undefined) {
                    temp = new Array();
                    temp.push(Locations);
                    Locations = Locations;
                } else if(typeof Locations == 'object' && typeof Locations.location == 'object') {
                    temp = new Array();
                    temp.push(Locations.location);
                    Locations = temp;
                } else if(typeof Locations == 'object' && typeof Locations.Location == 'object') {
                    temp = new Array();
                    temp.push(Locations.Location);
                    Locations = temp;
                }

                function sortByKey(array, key) {
                    return array.sort(function (a, b) {
                        var x = a[key];
                        var y = b[key];
                        return((x < y) ? -1 : ((x > y) ? 1 : 0));
                    });
                }
                Locations = sortByKey(Locations, 'distance');
                makeMarkers(Locations, true);
                setTimeout(onComplete, 1000);
            }

            function filterData(data) {
                // filter all the nasties out
                // no body tags
                data = data.replace("<body>", '');
                data = data.replace("</body>", '');
                data = data.replace("<p>", '');
                data = data.replace("</p>", '');
                // no linebreaks
                data = data.replace(/[\r|\n]+/g, '');
                // no comments
                data = data.replace(/<--[\S\s]*?-->/g, '');
                // no noscript blocks
                data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g, '');
                // no script blocks
                data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g, '');
                // no self closing scripts
                data = data.replace(/<script.*\/>/, '');
                // [... add as needed ...]
                return $.trim(data);
            }
            var thisOptions = {
                return_address: 'y',
                return_hours: 'y',
                filter_lat: myLat,
                filter_lng: myLng,
                filter_radius: 30,
                filter_count: 100,
                return_storeOffers: 'n',
                return_services: 'n',
                return_features: 'n',
                return_promotions: 'n',
                return_careers: 'n',
                return_events: 'n',
                return_social: 'n',
                filter_state: '',
                filter_city: ''
            }
            $.ajax({
                url: locatorAPI,
                type: "GET",
                data: thisOptions,
                cache: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + locatorAuth);
                    xhr.setRequestHeader("Accept", "application/json");
                },
                success: function (response) {
                    var _stores = [];
                    if(typeof response == 'string') {
                        response = $.parseJSON(response);
                    }
                    if(response.stores != undefined) {
                        _stores = response.stores.store;
                    }
                    doSomething({
                        Locations: _stores
                    });
                    //loadMyXML(response);
                },
                error: function (msg) {
                    //alert("We're sorry. We are having some difficulty accessing our data.");
                }
            });

            function loadMyXML(myObj) {
                var myString = $(myObj).find('string');
                if($.trim(myString.text()) == '""') {
                    myString.text('');
                }
                if($.trim(myString.text()).length > 0) {
                    data = $.evalJSON($.evalJSON(filterData(myString.text())));
                    doSomething(data);
                }
            }
        }
    });
}

function refreshMarkers(newMarkers, newMarkers2, newMarkers3) {
    $.each(newMarkers, function (index, value) {
        var marker = newMarkers[index];
        //console.log(marker);
        markers.push(marker);
        marker.setMap(map);
    });
    $.each(newMarkers2, function (index, value) {
        var marker2 = newMarkers2[index];
        markers2.push(marker2);
        marker2.setMap(map2);
    });
    //$.each(newMarkers3, function (index, value) {
    var marker3 = newMarkers3[0];
    markers3.push(marker3);
    marker3.setMap(map3);
    //console.log(marker3.getPosition());
    map3.panTo(marker3.getPosition());
    //});
}

function resultSetNumber(setNumber) {
    if(setNumber < 0) {
        setNumber = 0;
    }
    $('#sidebar_search_results').attr('setNumber', setNumber);
    $('#sidebar_search_results').stop(true, true);
    $('#sidebar_search_results').animate({
        'margin-top': -1 * (setNumber * parseInt($('#sidebar_search_list_inside').height()))
    }, 500, function () {
        if((parseInt($('#sidebar_search_results').attr('setNumber')) + 1) * 5 >= $('#sidebar_search_list li').length) {
            $('#sidebar_search_list .more').hide();
            //$('#sidebar_search_list .back').addClass('full');
        }
        if((parseInt($('#sidebar_search_results').attr('setNumber')) + 1) * 5 <= $('#sidebar_search_list li').length) {
            $('#sidebar_search_list .back').removeClass('full');
            $('#sidebar_search_list .more').show();
        }
        if(setNumber == 0) {
            $('#sidebar_search_list .back').hide();
        }
    });
    if(setNumber > 0) {
        $('#sidebar_search_list .back').show();
        if($('#sidebar_search_list .more').css('display') == 'none') {
            //$('#sidebar_search_list .back').addClass('full');
        } else {
            $('#sidebar_search_list .back').removeClass('full');
        }
    }
}
var lastMarkers = new Array();
var lastMarkers2 = new Array();
var lastMarkers3 = new Array();

function makeMarkers(list) {
    var renderList = false;
    var count = 0;
    var newMarkers = [];
    var newMarkers2 = [];
    var newMarkers3 = [];
    if(arguments.length > 1) {
        renderList = arguments[1];
    }
    list = $.makeArray(list);
    if(list.length > 0) {
        $('#search_results').empty();
        $('#sidebar_search_results').empty();
        $('#sidebar_search_results').attr('setNumber', '0');
        var more;
        if($('#sidebar_search_list .more').length == 0) {
            more = $('<a class="more"><img src="images/down_arrow_red.png"> MORE</a>');
            $('#sidebar_search_list').append(more);
        } else {
            more = $('#sidebar_search_list .more');
        }
        more.click(function (e) {
            e.preventDefault();
            var setNumber = parseInt($('#sidebar_search_results').attr('setNumber'));
            setNumber++;
            resultSetNumber(setNumber);
        });
        if(list.length <= 5) {
            more.hide();
        }
        var back;
        if($('#sidebar_search_list .back').length == 0) {
            back = $('<a class="back"><img src="images/up_arrow.png"> BACK</a>');
            $('#sidebar_search_list').append(back);
        } else {
            back = $('#sidebar_search_list .back');
        }
        back.hide();
        back.click(function (e) {
            e.preventDefault();
            var setNumber = parseInt($('#sidebar_search_results').attr('setNumber'));
            setNumber--;
            resultSetNumber(setNumber);
        });
        $(list).each(function (num, el) {
            $('#sidebar_search_results').attr('maxSet', (count + 1));
            var icon = new google.maps.MarkerImage();
            icon.url = './images/markerVIOC.png';
            var shadow = new google.maps.MarkerImage();
            shadow.url = './images/markerShadow.png';
            var myDiv = $('<div class="store_result" data-resultid="' + count + '"/>');
            var myLeft = $('<div class="left_column"/>');
            myDiv.append(myLeft);
            var myRight = $('<div class="right_column"/>');
            myDiv.append(myRight);
            var myLi = $('<li data-resultid="' + count + '" data-storenum="' + this.name + '"><span class="address">' + this.address.address1 + '</span><br/>' + this.address.city + ', ' + this.address.state + ' ' + this.address.zip + '</li>');
            myLi.attr('lat', this.latitude);
            myLi.attr('lng', this.longitude);
            $('#search_results').append(myDiv);
            myLi.on('click', listClick);
            $('#sidebar_search_results').append(myLi);
            myLeft.append('<h1>Valvoline Instant Oil Change</h1><h2>' + this.address.address1 + '</h2><h4>' + this.address.city + ', ' + this.address.state + ' ' + this.address.zip + '</h4>');
            var opened = true;
            var hours = new Object();
            if(typeof this.OperatingHours == 'object') {
                hours = {
                    mon: this.OperatingHours.mon_hours.replace('am', '').replace('pm', ''),
                    tue: this.OperatingHours.tue_hours.replace('am', '').replace('pm', ''),
                    wed: this.OperatingHours.wed_hours.replace('am', '').replace('pm', ''),
                    thu: this.OperatingHours.thu_hours.replace('am', '').replace('pm', ''),
                    fri: this.OperatingHours.fri_hours.replace('am', '').replace('pm', ''),
                    sat: this.OperatingHours.sat_hours.replace('am', '').replace('pm', ''),
                    sun: this.OperatingHours.sun_hours.replace('am', '').replace('pm', '')
                }
            }
            this.Hours = hours;
            if(opened) {
                myLeft.append('<table cellspacing="0" cellpadding="0" class="hours"><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr><tr><td>' + this.Hours.mon + '</td><td>' + this.Hours.tue + '</td><td>' + this.Hours.wed + '</td><td>' + this.Hours.thu + '</td><td>' + this.Hours.fri + '</td><td>' + this.Hours.sat + '</td><td>' + this.Hours.sun + '</td></tr></table>');
            }
            if($.trim(this.address.phone).length > 0) {
                myPhone = this.address.phone;
            }
            myRight.append('<a href="' + drivingLink({
                lat: myLat,
                lng: myLng
            }, this.address.address1 + ' ' + this.address.city + ', ' + this.address.state + ' ' + this.address.zip) + '" id="driving_directions" target="_blank">GET DRIVING DIRECTIONS</a>');
            myRight.append('<h1>' + myPhone + '</h1>');
            if(lastMarkers.length != 0) {
                $.each(lastMarkers, function (index, value) {
                    var marker = lastMarkers[index];
                    //console.log(marker);
                    markers.push(marker);
                    marker.setMap(null);
                });
            }
            if(lastMarkers2.length != 0) {
                $.each(lastMarkers2, function (index, value) {
                    var marker = lastMarkers2[index];
                    //console.log(marker);
                    markers2.push(marker);
                    marker.setMap(null);
                });
            }
            if(lastMarkers3.length != 0) {
                var marker = lastMarkers3[0];
                markers3.push(marker);
                marker.setMap(null);
            }
            lastMarkers = newMarkers;
            lastMarkers2 = newMarkers2;
            lastMarkers3 = newMarkers3;
            // if (markerIds[this.ID] == undefined) {
            var marker = new google.maps.Marker({
                position: (new google.maps.LatLng(this.latitude, this.longitude)),
                icon: icon,
                shadow: shadow
            });
            marker.myId = count;
            var marker2 = new google.maps.Marker({
                position: (new google.maps.LatLng(this.latitude, this.longitude)),
                icon: icon,
                shadow: shadow
            });
            var marker3 = new google.maps.Marker({
                position: (new google.maps.LatLng(this.latitude, this.longitude)),
                icon: icon,
                shadow: shadow
            });
            newMarkers.push(marker);
            newMarkers2.push(marker2);
            newMarkers3.push(marker3);
            markerIds[this.ID] = marker;
            google.maps.event.addListener(marker, 'click', function () {
                $('#sidebar_search_results li[data-resultid=' + this.myId + ']').trigger('click');
            });
            // }
            count++;
        });
    }
    refreshMarkers(newMarkers, newMarkers2, newMarkers3);
}

function drivingLink(dirFrom, dirTo) {
    var myHome = dirFrom.lat + ',' + dirFrom.lng;
    return "http://maps.google.com/maps/dir/?pw=2&saddr=" + myHome + "&daddr=" + encodeURI(dirTo);
}

function submitSMS(formID) {
    var $id = $(formID);
    alert(formID);
    if(arguments.length > 1) {
        $mySMS = arguments[1];
    } else {
        var $mySMS1 = $id.find('input[name="sms1"]').val();
        var $mySMS2 = $id.find('input[name="sms2"]').val();
        var $mySMS3 = $id.find('input[name="sms3"]').val();
        var $mySMS = $mySMS1 + $mySMS2 + $mySMS3;
    }
    var $myMSISDN = '1' + $mySMS;
    var $smsError = false;
    var $phoneTest = /[0-9]{10}/;
    if($mySMS.length < 10) {
        $smsError = true;
        alert('You must use a valid, 10 digit phone number');
    } else if(!$phoneTest.test($mySMS)) {
        $smsError = true;
        alert('You must use a valid, 10 digit phone number');
    }
    var $shortCode = "58720";
    var $message = "VIOC7";
    var $userToken = "9E0823AFE59B586F71188836408191D8";
    $smsError = false;
    var $mySend = $('<iframe class="iframe" src="http://webapi.iloopmobile.com/saturn/gateway/webin/https?shortCode=' + $shortCode + '&message=' + $message + '&userToken=' + $userToken + '&msisdn=' + $myMSISDN + '" frameborder="0"></iframe>');
    $(document.body).append($mySend);
    if($id.attr('id') == "smsForm-right") $('#enter-mobile').html("<p class=\"enter bold\">Thanks for entering</p><p>You should receive a message shortly with your coupon code.</p>");
    else if($id.attr('id') == "smsForm-footer") $('#phone-form').html("<p class=\"enter bold\">Thanks for entering</p><p>You should receive a message shortly with your coupon code.</p>");
    $(".iframe").hide();
}
var VIOC_17432 = function () {
    // Closed Variables
    var api = '';
    var cookie = '';
    var data = {};
    // Accessors/Mutators
    VAPI_getAPI = function () {
        return api;
    }
    VAPI_setAPI = function (_api) {
        api = _api;
    }
    VAPI_getCookie = function () {
        return cookie;
    }
    VAPI_setCookie = function (_cookie) {
        cookie = _cookie;
    }
    VAPI_getData = function () {
        return data;
    }
    VAPI_addData = function (_name, _data) {
        switch(_name) {
        case "vehicle":
            data.vehicle = _data.vehicle;
            break;
        case "person":
            data.person = _data.person;
            break;
        case "store":
            data.store = _data.store;
            break;
        }
    }
    VAPI_resetData = function () {
        data = {};
    }
    VAPI_setAddress = function (_address, _street) {
            if(_address != null && _address != "" && _street != null && _street != "") {
                window.location.hash = _address + '/' + _street;
            } else {
                if(window.location.hash == "#print") {
                    window.print();
                }
                window.location.hash = "location";
            }
        }
        // Methods
    VAPI_call = function (_api, _path, _params, _data, _for) {
        if(VAPI_getCookie() != "") {
            $.ajax({
                url: _api + _path + _params,
                dataType: 'json',
                async: false,
                crossDomain: true,
                data: _data,
                success: function (json) {
                    //console.log(json);
                    //if (json == {}) {
                    //
                    //  console.log('here');
                    //}
                    VAPI_addData(_for, $.parseJSON(json));
                },
                error: function () {
                    if(_for == "vehicle") {
                        VAPI_call(VAPI_getAPI(), 'stores/trackingID/', VAPI_getCookie(), {
                            'return_address': 'y',
                            'return_hours': 'n',
                            'return_storeOffers': 'n'
                        }, 'store');
                        if(VAPI_getData().store.id != undefined) {
                            window.location.hash = VAPI_getData().store.address.address1 + ' ' + VAPI_getData().store.address.city + ' ' + VAPI_getData().store.address.state + '/' + (VAPI_getData().store.address.address1).toUpperCase();
                        }
                    } else {
                        VAPI_failure();
                    }
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic Y2F0YWx5c3QtYXBpOmNAdEBseXN0");
                }
            });
        } else {
            VAPI_resetData();
            window.location.hash = "location";
        }
    }
    VAPI_failure = function (_e) {
        //throw new Error('API Call Failed: ' + _e);
        window.location.hash = "location";
    }
}();
var VIOC_useParams = function () {
    $(document).ready(function () {
        var url = window.location.href;
        var params;
        if(url.indexOf('?') != -1) {
            params = url.split('?');
            if(params.length > 1) {
                $('#top_actions').find('a').each(function () {
                    if(($(this).attr('href')).indexOf("print()") == -1) {
                        $(this).attr('href', $(this).attr('href') + '?' + params[1]);
                    }
                });
                var subparams = params[1].split('#');
                $('a.print-icon, a.sl-coupon-link, .disc-footer a.print').each(function () {
                    $(this).attr('href', $(this).attr('href') + '?' + subparams[0] + '#print');
                });
            }
        } else {
            $('a.print-icon, a.sl-coupon-link, .disc-footer a.print').each(function () {
                $(this).attr('href', $(this).attr('href') + '#print');
            });
        }
    });
}();
