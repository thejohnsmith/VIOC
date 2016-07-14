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
			/* Only run console Debugging in UAT(Beta_Epsilon) Environment. */
			if (!fnRunning.environmentKind === 'UAT') {
				$('html').hasClass('Beta_Epsilon') ? $('html').removeClass('Beta_Epsilon') : $('html').addClass('Epsilon');
			}

			// Give the source a namespace
			$('html').hasClass('Beta_Epsilon') ? $('html').removeClass('Beta_Epsilon') : $('html').addClass('Epsilon');

			var domainLocation = window.location.href,
				debugHeader = 'color:#00bbfd;font-family:"HelveticaNeueLT-Condensed";font-weight:light;background:#000;' + 'font-size:1.6em;line-height:1;padding:0.08em 0.25em;margin:0',
				debugTitle = 'color:green;font-weight:bold;font-size:1em',
				debugGroup = 'color:purple;font-weight:bold;font-size:1em',
				debugItem = 'color:#f06;font-weight:bold;font-size:0.95em';

			console.group('%cWelcome to Beta_Epsilon', debugHeader);
				console.groupCollapsed('%c **CONSTANTS**', debugGroup);
					console.debug('ENV: %c %s', debugGroup, marcomUserData.environmentKind);
					console.debug('URL: %c %s', debugTitle, domainLocation);
				console.groupEnd();
				console.groupCollapsed('User %c%s', debugGroup, marcomUserData.$user);
					console.debug('Name: %c %s', debugItem, marcomUserData.$user.firstName + ' ' + marcomUserData.$user.lastName);
					console.debug('Email: %c %s', debugItem, marcomUserData.$user.email);
					console.debug('ID: %c %s', debugItem, marcomUserData.$user.externalId);
					console.debug('Agent: %c %s', debugItem, navigator.userAgent.toLowerCase());
					console.debug('Platform: %c %s', debugItem, navigator.platform.toLowerCase());
				console.groupEnd();
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
