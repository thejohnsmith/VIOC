/* couponPageController.js
 *
 * Check: if (typeof(value) !== "undefined" && value)
 */
var couponPageController = (function ($) {
    var controller = {
        init: function () {
            var controller = this;
            controller.buildUI();
        },
        buildUI: function (result, callback) {
            var controller = this;

            controller.getMustacheTemplate('../../templates/coupons.mustache.html', '.coupons-template', function (template) {
                $('.coupons-section').html(Mustache.render(template, controller.mockCoupons));
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
        },
        mockCoupons: [{
            "amount": "$10 Off",
            "text": "Valvoline&trade; Full-Service Full Synthetic or Synthetic Blend Oil Change",
            "code": "NANA29A",
            "expiration": "3/4/2016",
            "disclaimer": "Plus Tax. Not valid with any other same-service offers/discounts. $$$Plus Tax. Not valid with any other same-service offers/discounts, including fleets. Good at participating locations. Includes up to 5 quarts of Synthetic Blend, Full Synthetic or Diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube and maintenance check."
        }, {
            "amount": "$9 Off",
            "text": "Valvoline&trade; Full-Service Full Synthetic or Synthetic Blend Oil Change",
            "code": "NANA29B",
            "expiration": "12/31/2016",
            "disclaimer": "Including fleets. Good at participating locations. Includes up to 5 quarts of Synthetic Blend, Full Synthetic or Diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube and maintenance check."
        }, {
            "amount": "$8 Off",
            "text": "Valvoline&trade; Full-Service Full Synthetic or Synthetic Blend Oil Change",
            "code": "NANA29C",
            "expiration": "3/4/2016",
            "disclaimer": "Plus Tax. Not valid with any other same-service offers/discounts, including fleets. Good at participating locations. Includes up to 5 quarts of Synthetic Blend, Full Synthetic or Diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube and maintenance check."
        }, {
            "amount": "$7 Off",
            "text": "Valvoline&trade; Full-Service Full Synthetic or Synthetic Blend Oil Change",
            "code": "NANA29C",
            "expiration": "3/4/2016",
            "disclaimer": "Plus Tax. Not valid with any other same-service offers/discounts, including fleets. Good at participating locations. Includes up to 5 quarts of Synthetic Blend, Full Synthetic or Diesel oil (diesel quarts may vary; see store for details), filter (prem. extra), lube and maintenance check."
        }]
    };
    return {
        controller: controller
    };

})(jQuery);
