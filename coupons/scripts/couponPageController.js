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
		offerCode: "",
		templatePath: 'https://files.marcomcentral.app.pti.com/epsilon/coupons/templates',
        apiPath: 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/',
        init: function () {
            var controller = this;
            var pfid = controller.getParameterByName('pfid', window.location.href);
            var rid = controller.getParameterByName('rid', window.location.href);
            var h  = controller.getParameterByName('h', window.location.href);
			if (h == "" || typeof h == "undefined" || h == undefined) h = "";

            controller.GetPageData(pfid, rid, h, function () {
				controller.getCodes();
                controller.buildUI();
            });
        },
        GetPageData: function (pfid, rid, h, callback) {
            var controller = this;
            $.get(controller.apiPath + 'getCouponPageData.jssp?pfid=' + encodeURIComponent(pfid) + '&rid=' + encodeURIComponent(rid) + '&h=' + encodeURIComponent(h), function (results) {
                $.each(results, function (i, result) {
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
		getCodes: function() {
			var controller = this;
			for (var i = 0; i < controller.stores.coupons.length; i++)
			{
				var coupon = controller.stores.coupons[i];

				if (!coupon.isAdtlOffer)
					controller.offerCode = coupon.code;
			}
		},
        buildUI: function (result, callback) {
            var controller = this;
            /**
             * STORE dependent TEMPLATES
             * @uses {object} controller.stores
             *
             *
             **  Address */
            controller.getMustacheTemplate(controller.templatePath + '/address.mustache.html', '.address-template', function (template) {
                $('.address-section').html(Mustache.render(template, controller.stores));
            });
            /** Store Hours */
            if($('.type-desktop').length) {
                controller.getMustacheTemplate(controller.templatePath + '/store-hours.mustache.html', '.store-hours-template', function (template) {
                    $('.store-hours-section').html(Mustache.render(template, controller.stores));
                });
            }
            /** MOBILE Store Hours */
            if($('.type-mobile').length) {
                controller.getMustacheTemplate(controller.templatePath + '/mobile-store-hours.mustache.html', '.mobile-store-hours-template', function (template) {
                    $('.mobile-store-hours-section').html(Mustache.render(template, controller.stores));
                });
            }
            /** Coupons */
            controller.getMustacheTemplate(controller.templatePath + '/coupons.mustache.html', '.coupons-template', function (template) {
                $('.coupons-section').html(Mustache.render(template, controller.stores));
				console.log("Set barcode");
				$('#coupon-barcode img').attr('src', 'https://web02.vioc.epsilon.com/' + controller.offerCode + '.png');

				$.each($(".coupon h2.hidden-desktop"), function(i,e) {
					var content = $(e).html().replace("*","");
					$(e).html(content);
				}); // Remove "*"  from mobile version

				$.each($("#disclaimers.hidden-desktop p"), function(i,e) {
					var content = $(e).html().replace("*","");
					$(e).html(content);
				}); // Remove "*"  from mobile version
            });
            /** Map Image */
            controller.getMustacheTemplate(controller.templatePath + '/map.mustache.html', '.map-template', function (template) {
                $('.map-section').html(Mustache.render(template, controller.stores));
            });
			if (controller.additionalCode != "")
			{
				controller.getMustacheTemplate(controller.templatePath + '/additionalOffer.mustache.html', '.additionalOffer-template', function (template) {
					$('.additionalOffer-section').html(Mustache.render(template, controller.stores));
				});
			}
			else
			{
				$("#additionalOffer-barcode").hide();
				$("#additionalOffer").hide();
			}
			if (controller.stores.services.length > 0)
			{
				controller.getMustacheTemplate(controller.templatePath + '/services.mustache.html', '.services-template', function (template) {
					$('.services-section').html(Mustache.render(template, controller.stores));
				});
			}
			else
			{
				$("#services").hide()
			}
            /**
             * FEATURE dependent TEMPLATES
             * @uses {object} controller.features
             *
             *
             **  Features Section */
            controller.getMustacheTemplate(controller.templatePath + '/features.mustache.html', '.features-template', function (template) {
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
        controller: controller,
        init: controller.init
    };
})(jQuery);

function hideMap()
{
	jQuery('#MapImage').parent().parent().parent().hide()
}
