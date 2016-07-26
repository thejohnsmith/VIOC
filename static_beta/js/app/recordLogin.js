/** Record Login
 * Usage: recordLogin.makeRequest();
 * @param {object} userObj : Values pulled from .user-related data attributes - ex
     data-user-external-id="%%User.ExternalId%%"
     data-user-login-id="%%User.LoginId%%"
     data-user-first-name="%%User.FirstName%%"
     data-user-last-name="%%User.LastName%%"
     data-user-email="%%User.Email%%"
 */
var recordLogin = (function ($) {
	var makeRequest = function () {
		var useCookie = false;
		// Abort if login is current page.
		if (window.location.href.indexOf(marcomUserData.$constants.loginPageUrl) > -1 || window.location.href.indexOf(marcomUserData.$constants.loginPage2Url) > -1 || window.location.href.indexOf(marcomUserData.$constants.forgotPassPageUrl) > -1) {
			return false;
		}

		if (document.cookie.replace(/(?:(?:^|.*;\s*)marcomUserId\s*\=\s*([^;]*).*$)|^.*$/, '$1') != '') {
			cookie_user_id = document.cookie.replace(/(?:(?:^|.*;\s*)marcomUserId\s*\=\s*([^;]*).*$)|^.*$/, '$1');
			useCookie = (cookie_user_id == marcomUserData.$user.externalId);
			// console.log((useCookie) ? "Cookie matches active user" : "Cookie doesn't match active user");
		};

		if (useCookie) {
			// We have a cookie containing:
			var results = {
				marcomUserId: document.cookie.replace(/(?:(?:^|.*;\s*)marcomUserId\s*\=\s*([^;]*).*$)|^.*$/, '$1'),
				loginCount: document.cookie.replace(/(?:(?:^|.*;\s*)loginCount\s*\=\s*([^;]*).*$)|^.*$/, '$1'),
				marcomReportingAccess: document.cookie.replace(/(?:(?:^|.*;\s*)marcomReportingAccess\s*\=\s*([^;]*).*$)|^.*$/, '$1')
			};
			setLandingPageType(results);
		} else {
			// var localDevUrl = 'data/recordLogin.jssp';
			// var marcomDevUrl = 'https://files.marcomcentral.app.pti.com/epsilon/static/data/recordLogin.jssp';
			var apiPath = marcomUserData.$constants.apiPath + 'recordLogin.jssp';
			$.ajax({
				url: apiPath,
				type: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				data: {
					userId: marcomUserData.$user.externalId
				},
				processData: true,
				contentType: 'application/json'
			}).done(function (data) {
				var results = DoNotParseData(data);
				if ($('#welcome').length) {
					setLandingPageType(results);
				}
			}).fail(function () {
				toastr.error('An internal error has occurred.');
				return;
			});
		}
	};
	var setLandingPageType = function (results) {
		var $loginCount = results.loginCount;
		var $newUser = getParameterByName('newUser', window.location.href);
		var $reportingAccess = results.marcomReportingAccess;

		/* Dubugging */
		// console.warn('Login Count is ' + $loginCount);
		// console.log("results.marcomReportingAccess = " + results.marcomReportingAccess);

		document.cookie = 'loginCount=' + $loginCount;
		document.cookie = 'marcomReportingAccess=' + $reportingAccess;
		document.cookie = 'marcomUserId=' + marcomUserData.$user.externalId;

		/* Show Reports main nav link if reportingAccess is 1 */
		$('.navBarItem > a').filter(function () {
			return $(this).text() === 'REPORTS';
		}).addClass('reports-link');

		// if ($reportingAccess == 0) {
		// 	$('.reports-link').addClass('hide');
		// }
		// if ($reportingAccess == 1) {
		// 	$('.reports-link').removeClass('hide');
		// }

		if ($newUser > 0) {
			$loginCount = 1;
		}
		if ($loginCount < 3) {
			// Greater than 5, show "Getting Started Now" version of the home page.
			$('#welcome + #gettingStartedNow.landing-page-only').fadeIn();
			$('#programSummary.landing-page-only').hide();
		} else {
			// Less than 5, show the "Programs" version of the home page.
			$('#welcome + #gettingStartedNow.landing-page-only').hide();
			$('#programSummary.landing-page-only').fadeIn();
		}
	};
	return {
		makeRequest: makeRequest
	};
})(jQuery);
