/* couponPageController.js
 *
 * Check: if (typeof(value) !== "undefined" && value)
 */
var couponPageController = (function ($) {
    var controller = {
        features: {},
        stores: {},
        rId: getParameterByName('r', window.location.href),
        blrId: getParameterByName('blrid', window.location.href),
        apiPath: 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/',
        init: function () {
            var controller = this;
            controller.GetPageData(controller.rId, controller.blrId, function (rId, blrId) {
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
            controller.getMustacheTemplate('../../templates/features.mustache.html', '.features-template', function (template1) {
                console.warn('features...');
                $('.features-section').html(Mustache.render(template1, controller.features));
            });
            controller.getMustacheTemplate('../../templates/coupons.mustache.html', '.coupons-template', function (template) {
                $('.coupons-section').html(Mustache.render(template, controller.stores));
            });
            controller.getMustacheTemplate('../../templates/map.mustache.html', '.map-template', function (template) {
                $('.map-section').html(Mustache.render(template, result));
            });
            controller.getMustacheTemplate('../../templates/services.mustache.html', '.services-template', function (template) {
                $('.services-section').html(Mustache.render(template, result));
            });
            controller.getMustacheTemplate('../../templates/additionalOffer.mustache.html', '.additionalOffer-template', function (template) {
                $('.additionalOffer-section').html(Mustache.render(template, result));
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
        }
    };
    return {
        controller: controller
    };
})(jQuery);

function getParameterByName(name, url) {
    if(!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if(!results) {
        return undefined;
    }
    if(!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
