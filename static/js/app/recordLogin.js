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
		// Make sure there's a User ID loaded from Marcom before we Init this script.
		if (marcomUserData.$user.externalId === '%%User.ExternalId%%') {
			return;
		}
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
			var results = JSON.parse(data);
			if ($('#welcome').length) {
				setLandingPageType(results);
			}
		}).fail(function () {
			return;
		});
	};
	var setLandingPageType = function (results) {
		var $loginCount = results.loginCount;
		var $newUser = getParameterByName('newUser', window.location.href);
		if ($newUser > 0) {
			$loginCount = 1;
		}
		if ($loginCount < 5) {
			// Greater than 5, show "Getting Started Now" version of the home page.
			$('#welcome + #gettingStartedNow').fadeIn();
			$('#programSummary').hide();
		} else {
			// Less than 5, show the "Programs" version of the home page.
			$('#welcome + #gettingStartedNow').hide();
			$('#programSummary').fadeIn();
		}
	};
	return {
		makeRequest: makeRequest
	};
})(jQuery);

recordLogin.makeRequest();
