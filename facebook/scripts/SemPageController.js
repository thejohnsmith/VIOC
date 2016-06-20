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
var SemPageController = (function ($) {
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
            var controller = this;
            /**
             * 	@NOTE likely not going to use this approach
             * 	@NOTE IF MUSTACHE WILL BE USE -> LEVERAGE EXISTING WORK FROM COUPON LANDING PAGES.
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
            var controller = this;
            $('#connect_bar_submit').on('click', function (e) {
                controller.validateConnectForm(e);
            });
            $('#ctl00_FooterContent2_connect1_btnSignUp').on('click', function (e) {
                controller.validateOffersForm(e);
            });
        },
        validateOffersForm: function (e) {
            e.preventDefault();
            var controller = this;
            var $cwuEmailField = $('#ctl00_FooterContent2_connect1_txtEmail');
            var $cwuZipField = $('#ctl00_FooterContent2_connect1_txtZip');
            var badCWUForm = false;
            var errorMessage = '';
            if(($cwuEmailField.val()).search('@') == -1 || ($cwuEmailField.val()).indexOf('.') == -1) {
                badCWUForm = true;
                errorMessage = errorMessage + 'You must enter a valid email.\n';
            }
            if(parseInt($cwuZipField.val()) < 10000 || parseInt($cwuZipField.val()) > 99999 || isNaN(parseInt($cwuZipField.val()))) {
                badCWUForm = true;
                errorMessage = errorMessage + 'You must enter a valid zip code.\n';
            }
            if(!badCWUForm) {
                var email_value = encodeURIComponent($cwuEmailField.val());
                var zipcode_value = encodeURIComponent($cwuZipField.val());
                var apiPath = controller.apiPath + 'facebookSignUp.jssp';
                $.ajax({
                    url: apiPath,
                    type: 'GET',
                    contentType: 'application/json',
                    processData: true,
                    data: {
                        email: email_value,
                        zip: zipcode_value
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    success: function (data) {
                        alert('Thank You! Your address has been submitted.');
                        return;
                    },
                    error: function () {
                        alert('Save failed. Please try again at a later time.');
                        return;
                    }
                });
            } else {
                alert(errorMessage);
            }
        },
        /**
         * @description Tese are Fields pulled from default.js
         */
        validateConnectForm: function (e) {
            e.preventDefault();
            var controller = this;
            var email_elm = $('#carecare-optin .email-box');
            var email_input = $('#carecare-optin .email-box input');
            var email_value = email_input.val();
            var zipcode_value = '';
            var validation_elm = $('#optin-message');
            var validation_message = $('#optin-message > p');
            var submit_elm = $('#carecare-optin .submit');
            // Validate 'Email'
            if(($('#email').val()).search('@') === -1 || ($('#email').val()).indexOf('.') === -1) {
                // Show error container and message
                validation_elm.css('display', 'block');
                email_elm.addClass('input-error');
                validation_message.html('<strong class="text-default">Please enter a valid email address.</strong><br>');
                $('#email').focus(); // Put focus on Input field
                // Show the rest
                submit_elm.css('display', 'block');
                email_elm.css('display', 'block');
                return;
            } else {
                // Add a loding indicator
                validation_message.html('Submitting...<br />');
                submitEmail(email_value);

                function submitEmail(email_value) {
                    // @Example
                    // https://adobe-prod-vioc.epsilon.com/jssp/vioc/facebookSignUp.jssp?email=foo&zip=01234
                    // Get newest value of input
                    email_value = email_input.val();
                    var apiPath = controller.apiPath + 'facebookSignUp.jssp';
                    $.ajax({
                        url: apiPath,
                        type: 'GET',
                        contentType: 'application/json',
                        processData: true,
                        data: {
                            email: email_value,
                            zip: zipcode_value
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        success: function (data) {
                            // Remove error and bring the automatic toggling back
                            email_elm.css('display', 'block').removeClass('input-error').addClass('hidevioc');
                            submit_elm.css('display', 'none');
                            validation_elm.css('display', 'block');
                            validation_message.html('<strong>Thank You! Your address has been submitted.</strong>');
                            return;
                        },
                        error: function () {
                            console.error('Save failed.');
                            return;
                        }
                    });
                }
            }
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
