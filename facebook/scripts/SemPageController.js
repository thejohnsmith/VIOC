/* SEM_Coupon Controller
 * @URL
 * 	- Dev http://files.marcomcentral.app.pti.com/epsilon/facebook/
 *  - Staging
 *  - Production
 *
 * @description - Loads coupon data from custom Adobe API.
 * @filename - SemPageController.js
 * @authors - Anthony Gill, John Smith : Epsilon 2016
 */
SemPageController = (function ($) {
    'use strict';
    /**
     * [controller description]
     * @type {Object}
     */
    var controller = {
        templatePath: 'https://files.marcomcentral.app.pti.com/epsilon/coupons/templates',
        apiPath: 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/',
        userData: {},
        /**
         * [init description]
         * @return {[type]} [description]
         */
        init: function () {
            var controller = this;
            // var pfid = '20160128HTG';
            // var rid = 'MXqC_GLSj';
            // controller.getCouponPageData(pfid, rid, function () {
            //     controller.updateUI();
            // });
            controller.attachEventListeners();
        },
        /**
         * [getCouponPageData description]
         * @param  {[type]}   pfid     [description]
         * @param  {[type]}   rid      [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        getCouponPageData: function (pfid, rid, callback) {
            var controller = this;
            $.get(controller.apiPath + 'getCouponPageData.jssp?pfid=' + encodeURIComponent(pfid) + '&rid=' + encodeURIComponent(rid), function (results) {
                var json_results = JSON.parse(results);
                $.each(json_results, function (i, result) {
                    // Store the page content data in controller.stores
                    if(i === 'features') {
                        controller.features = result;
                    } else {
                        controller.stores = result;
                    }
                });
                // fire the callback (DONE)
                if(typeof callback === 'function') {
                    callback(controller.program);
                }
            });
        },
        /**
         * [updateUI description]
         * @return {[type]} [description]
         */
        updateUI: function () {
            console.warn('Adjusting UI...');
            /**  IF MUSTACHE WILL BE USE -> LEVERAGE EXISTING WORK FROM COUPON LANDING PAGES.
             * 	@NOTE likely not going to use this approach
             * [getMustacheTemplate description]
             * @param  {[type]} controller.templatePath +             '/coupons.mustache.html' [description]
             * @param  {[type]} '.coupons-template'     [description]
             * @param  {[type]} function                (template     [description]
             * @return {[type]}                         [description]
             */
            /** Coupons */
            controller.getMustacheTemplate(controller.templatePath + '/coupons.mustache.html', '.coupons-template', function (template) {
                $('.coupons-section').html(Mustache.render(template, controller.stores));
                console.log("Set barcode");
                $('#coupon-barcode img').attr('src', 'https://web02.vioc.epsilon.com/' + controller.offerCode + '.png');
                $.each($(".coupon h2.hidden-desktop"), function (i, e) {
                    var content = $(e).html().replace("*", "");
                    $(e).html(content);
                }); // Remove "*"  from mobile version
                $.each($("#disclaimers.hidden-desktop p"), function (i, e) {
                    var content = $(e).html().replace("*", "");
                    $(e).html(content);
                }); // Remove "*"  from mobile version
            });
        },
        attachEventListeners: function () {
            /** CONNECT WITH US
             * Email sign-up form
             */
            var controller = this;
            var $connect_email_elm = $('#carecare-optin .email-box');
            var $connect_email_input = $('#carecare-optin .email-box input');
            var $connect_email_value = $connect_email_input.val();
            var $connect_zipcode_value = '';
            var $connect_validation_wrap = $('#optin-message');
            var $connect_validation_message = $('#optin-message > p');
            var $connect_submit = $('#carecare-optin .submit');

            $('#connect_bar_submit').on('click', function (callback) {
                // Validate 'Email'
                if(($('#email').val()).search('@') === -1 || ($('#email').val()).indexOf('.') === -1) {
                    // Show error container and message
                    $connect_validation_wrap.css('display', 'block');
                    $connect_email_elm.addClass('input-error');
                    $connect_validation_message.html('Please enter a valid email address.<br>');
                    // Put focus on Input field
                    $('#email').focus();
                    // Show the rest
                    $connect_submit.css('display', 'block');
                    $connect_email_elm.css('display', 'block');
                    return;
                } else {
                    // Add a loding indicator
                    $connect_validation_message.html('Submitting...<br />');
                    submitEmail($connect_email_value);

                    function submitEmail($connect_email_value) {
                        // @Example
                        // https://adobe-prod-vioc.epsilon.com/jssp/vioc/facebookSignUp.jssp?email=foo&zip=01234
                        // Get newest value of input
                        $connect_email_value = $connect_email_input.val();
                        var apiPath = controller.apiPath + 'facebookSignUp.jssp';
                        $.ajax({
                            url: apiPath,
                            type: 'GET',
                            contentType: 'application/json',
                            processData: true,
                            data: {
                                email: $connect_email_value,
                                zip: $connect_zipcode_value
                            },
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                            success: function (data) {
                                $connect_email_elm.css('display', 'block').removeClass('input-error').addClass('hidevioc');
                                $connect_submit.css('display', 'none');
                                $connect_validation_wrap.css('display', 'block');
                                $connect_validation_message.html('Thank You! Your address has been submitted.');
                                return;
                            },
                            error: function (c, e, d) {
                                console.error('Save failed.');
                                return;
                            }
                        });
                    }
                }
                //  TESTS
                // console.warn('$connect_email_value: ' + $connect_email_value);
                // console.warn('$connect_validation_wrap: ' + $connect_validation_wrap);
                // console.warn('$connect_validation_message: ' + $connect_validation_message);
                // console.warn('$connect_submit: ' + $connect_submit);
            });
        }
    };
    return {
        controller: controller
    };
})(jQuery);
// Only execute this controller on a certain page
// if (window.location.href.indexOf(pageKey) > -1) {
//
SemPageController.controller.init();
// }
