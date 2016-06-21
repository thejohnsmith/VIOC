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
        templatePath: 'https://files.marcomcentral.app.pti.com/epsilon/facebook/templates',
        apiPath: 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/',
        couponData: {},
        /**
         * [init description]
         * @return {[type]} [description]
         */
        init: function () {
            var controller = this;
            // Ex. ?p=StdRem1
            var pfid = controller.getParameterByName('p', window.location.href) || null;
            controller.getCouponPageData(pfid, function () {
                controller.updateUI();
            });
            controller.attachEventListeners();
        },
        /**
         * [getCouponPageData Calls facebookSignupCoupons API, stores results in couponData.]
         * @param  {[type]}   pfid     [description]
         * @param  {[type]}   rid      [description]
         * @param  {Function} callback [description]
         * @return {[object]}           [couponData]
         */
        getCouponPageData: function (pfid, callback) {
            var controller = this;
            $.get(controller.apiPath + 'facebookSignupCoupons.jssp?p=' + encodeURIComponent(pfid), function (results) {
                var json_results = JSON.parse(results);
                controller.couponData = json_results;
                if(typeof callback === 'function') {
                    callback(json_results);
                }
                /*  try {
                    json_results = JSON.parse(results);
                  }
                  catch (e)
                  {
                    alert("Failed to parse JSON data");
                  }
                  */
            });
        },
        /**
         * [updateUI description]
         * @return {[type]} [description]
         */
        updateUI: function () {
            var controller = this;

            controller.getMustacheTemplate(controller.templatePath + '/coupons.mustache.html', '.coupons-template', function (template) {
                $('.coupons-section').html(Mustache.render(template, controller.couponData));
            });

            /**
             * 	@NOTE likely not going to use this approach
             * 	@NOTE IF MUSTACHE WILL BE USE -> LEVERAGE EXISTING WORK FROM COUPON LANDING PAGES.
             * [getMustacheTemplate description]
             * @param  {[type]} controller.templatePath +             '/coupons.mustache.html' [description]
             * @param  {[type]} '.coupons-template'     [description]
             * @param  {[type]} function                (template     [description]
             * @return {[type]}                         [description]
             */
            //  $.get(controller.templatePath + 'coupons.mustache.html', function (templates) {
            //    var template = $(templates).filter('.coupons-template').html();
             //
            //    $('.coupons-tpl').html(Mustache.render(template, result));
            //  });
            /** Coupons
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
            */
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
        },
        getMustacheTemplate: function (filename, css_selector, callback) {
            var controller = this;
            var template_key = filename.replace('.', '');
            if(typeof controller[template_key] != 'undefined' && controller[template_key] != '') {
                console.log('Loading cached version of ' + template_key);
                callback(controller[template_key])
            } else {
                $.get(filename, function (templates) {
                    controller[template_key] = $(templates).filter(css_selector).html();
                    callback(controller[template_key]);
                });
            }
        },
        getParameterByName: function (name, url) {
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
            var results = regex.exec(url);
            if(!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, '\\$&');
            if(!results) {
                return undefined;
            }
            if(!results[2]) {
                return '';
            }
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
