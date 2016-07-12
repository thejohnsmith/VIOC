/* This is meant to run in Marcom only, hence the renaming of jQuery */
var $j = jQuery;

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
	var results = regex.exec(url);
	if (!results) {
		return undefined;
	}
	if (!results[2]) {
		return '';
	}
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var appUtilities = (function ($) {
	var controller = {
		init: function () {
			controller.setBrowserTitle();
			// controller.changeNavBarLink();
			controller.setFavicon();
			controller.setPrettyPhone();
		},
		setBrowserTitle: function () {
			var $pageTitle = '' || $j('.wrapper h1').first().text();
			return $('title').html('VIOC Warp Drive' + ' - ' + $pageTitle);
		},
		changeNavBarLink: function () {
			$('.navBarItem > a').filter(function () {
				return $(this).text() === 'REPORTS';
			}).attr('href', 'https://bo-vioc.epsilon.com').attr('target', '_blank');

			$('.navBarItem > a').filter(function () {
				return $(this).text() === 'ON DEMAND MARKETING';
			}).attr('href', marcomUserData.$constants.onDemandUrl);

			$('.header-right .btnHelp, .header-right .btnContactUs').attr('href', marcomUserData.$constants.helpPageUrl);
		},
		setFavicon: function () {
			return $j('head').append('<link rel="icon" href="https://files.marcomcentral.app.pti.com/epsilon/static/images/favicon.ico" type="image/x-icon">');
		},
/** Phone Number Formatting
 *  Used by calling appUtilities.setPrettyPhone();
 *  @param {class} .prettyPhone class needed for phone formatting.
 *  @returns {string} Formats phone to xxx-xxx-xxxx
 */
setPrettyPhone: function () {
	$('.prettyPhone').text(function (i, text) {
		text = text.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
		return text;
	});
},
		routeEnterKeyToNext: function (inputItem) {
			inputItem.keypress(function (event) {
				if (event.keyCode === 13) {
					event.preventDefault();
					var storeId = $(this).attr('data-storeid');
					if (storeId) {
						$('.btn[data-storeid="' + storeId + '"]').click();
						console.warn('Form Submission needs to occur using the Submit button.');
					}
				}
			});
		},
		/**
		 * [runtimeDebugging Debugging for Beta]
		 */
		runtimeDebugging: function (fnRunning) {
			console.group('Beta_Epsilon Debugging - ');
			console.info('Env: ', marcomUserData.environmentKind);
			console.info('Host: ', window.location.host);
			console.info('Path: ', window.location.pathname);
			console.debug('URL: ', window.location.href);
			console.groupEnd();
		}
	};
	return {
		controller: controller,
		changeNavBarLink: controller.changeNavBarLink,
		runtimeDebugging: controller.runtimeDebugging,
		setPrettyPhone: controller.setPrettyPhone,
		routeEnterKeyToNext: controller.routeEnterKeyToNext
	};
})(jQuery);

appUtilities.controller.init();
