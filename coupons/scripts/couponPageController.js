/* Coupon Page Controller
 * @filename couponPageController.js
 * @description Loads templates with data from custom Adobe API.
 * @author John Smith, Epsilon
 * @TODO Add if (typeof(value) !== "undefined" && value)
 */
couponPageController = (function ($) {
    'use strict';
    var controller = {
        features: {},
        stores: {},
        apiPath: 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/',
        init: function () {
            var controller = this;
            var rId = controller.getParameterByName('r', window.location.href);
            var blrId = controller.getParameterByName('blrid', window.location.href);
            controller.GetPageData(controller.rId, controller.blrId, function () {
                controller.buildUI();
            });
        },
        GetPageData: function (rId, blrId, callback) {
            var controller = this;
            $.get(controller.apiPath + 'getCouponPageData.jssp', function (results) {
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
        buildUI: function (result, callback) {
            var controller = this;
            /**
             * STORE dependent TEMPLATES
             * @uses {object} controller.stores
             *
             *
             **  Address */
            controller.getMustacheTemplate('../../templates/address.mustache.html', '.address-template', function (template) {
                $('.address-section').html(Mustache.render(template, controller.stores));
            });
            /** Store Hours */
            controller.getMustacheTemplate('../../templates/store-hours.mustache.html', '.store-hours-template', function (template) {
                $('.store-hours-section').html(Mustache.render(template, controller.stores));
            });
            /** Store Hours */
            controller.getMustacheTemplate('../../templates/mobile-store-hours.mustache.html', '.mobile-store-hours-template', function (template) {
                $('.mobile-store-hours-section').html(Mustache.render(template, controller.stores));
            });
            /** Coupons */
            controller.getMustacheTemplate('../../templates/coupons.mustache.html', '.coupons-template', function (template) {
                $('.coupons-section').html(Mustache.render(template, controller.stores));
            });
            /** Map Image */
            controller.getMustacheTemplate('../../templates/map.mustache.html', '.map-template', function (template) {
                $('.map-section').html(Mustache.render(template, controller.stores));
            });
            controller.getMustacheTemplate('../../templates/additionalOffer.mustache.html', '.additionalOffer-template', function (template) {
                $('.additionalOffer-section').html(Mustache.render(template, controller.stores));
            });
            controller.getMustacheTemplate('../../templates/services.mustache.html', '.services-template', function (template) {
                $('.services-section').html(Mustache.render(template, controller.stores));
            });
            /**
             * FEATURE dependent TEMPLATES
             * @uses {object} controller.features
             *
             *
             **  Features Section */
            controller.getMustacheTemplate('../../templates/features.mustache.html', '.features-template', function (template) {
                $('.features-section').html(Mustache.render(template, controller.features));
            });
        },
        getMustacheTemplate: function (filename, css_selector, callback) {
            var controller = this;
            var template_key = filename.replace('.', '');
            if(typeof controller[template_key] != 'undefined' && controller[template_key] != '') {
                console.log('Loading cached version of ' + template_key);
                callback(controller[template_key])
            } else {
                $.get(controller.filePath + filename, function (templates) {
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
        controller: controller,
        init: controller.init
    };
})(jQuery);
