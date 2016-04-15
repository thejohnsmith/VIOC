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

		if (document.cookie.replace(/(?:(?:^|.*;\s*)loginCount\s*\=\s*([^;]*).*$)|^.*$/, "$1") != "")
		{
			// We have a cookie containing:
			var results = {
				loginCount : document.cookie.replace(/(?:(?:^|.*;\s*)loginCount\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
				marcomReportingAccess : document.cookie.replace(/(?:(?:^|.*;\s*)marcomReportingAccess\s*\=\s*([^;]*).*$)|^.*$/, "$1")
			};
			setLandingPageType(results);
		}
		else
		{
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
		}
	};
	var setLandingPageType = function (results) {
		var $loginCount = results.loginCount;
		var $newUser = getParameterByName('newUser', window.location.href);
		var $reportingAccess = results.marcomReportingAccess;

		document.cookie = 'loginCount=' + $loginCount;
		document.cookie = 'reportingAccess=' + $reportingAccess;

		/* Show Reports main nav link if reportingAccess is 1 */
		$('.navBarItem > a').filter(function () {
			return $(this).text() === 'REPORTS';
		}).addClass('reports-link');

		if(!$reportingAccess) {
			console.warn('reportingAccess true');
		  $('.reports-link').addClass('hide');
		}
		if($reportingAccess) {
			console.warn('reportingAccess false');
			$('.reports-link').removeClass('hide');
		}

		if ($newUser > 0) {
			$loginCount = 1;
		}
		if ($loginCount < 3) {
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
