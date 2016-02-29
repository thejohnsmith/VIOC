/** Record Login
 * Usage: recordLogin.makeRequest();
 * @param {object} userObj : Values pulled from .user-related data attributes - ex
     data-user-external-id="%%User.ExternalId%%"
     data-user-login-id="%%User.LoginId%%"
     data-user-first-name="%%User.FirstName%%"
     data-user-last-name="%%User.LastName%%"
     data-user-email="%%User.Email%%"
 */
var recordLogin = (function($) {

  var makeRequest = function() {
    // Make sure there's a User ID loaded from Marcom before we Init this script.
    if (marcomUserData.$user.externalId === '%%User.ExternalId%%') {
      return
    }
    var localDevUrl =
      'data/recordLogin.jssp';
    var marcomDevUrl =
      'https://files.marcomcentral.app.pti.com/epsilon/static/data/recordLogin.jssp';
    var acUrl =
      'https://adobe-uat-vioc.epsilon.com/jssp/vioc/recordLogin.jssp';
    $.ajax({
      url: acUrl,
      type: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        userId: marcomUserData.$user.externalId
      },
      processData: true,
      contentType: 'application/json'
    }).done(function(data) {
      results = JSON.parse(data);
      getLoginDays(results);
    }).fail(function() {
      return;
    });
  };

  var getLoginDays = function(results) {
    var loginDays = {
      'x': results.firstPortalLogin,
      'y': results.lastPortalLogin
    };

    var getDateRange = function(loginDays) {
        var fistDay = moment(loginDays.x);
        var lastDay = moment(loginDays.y);
        var range = lastDay.diff(fistDay, 'days');

        /* Make sure the moment library has loaded */
        if (typeof moment === 'undefined') {
          console.log('%c ** Error ** ',
            'color: #f10; font-weight: bold;',
            '\nmoment.js was not loaded.');
          return showGettingStarted();
        }

        /* Switch sections of home page depending on login times.
         * If time between last login and first login is greater than 5 days: show Getting Started section.
         * If time is less then show the Program Summary section.
         */
        if (range > 5 && $('.storeProgramData').length) {
          // Greater than 5, show "Getting Started Now" version of the home page.
          return showGettingStarted();
        } else {
          // Less than 5, show the "Programs" version of the home page.
          return showPrograms();
        }
      },
      showGettingStarted = function() {
        $('#welcome + #gettingStartedNow').fadeIn();
        $('#programSummary').hide();
      },
      showPrograms = function() {
        $('#welcome + #gettingStartedNow').hide();
        $('#programSummary').fadeIn();
      }

    return getDateRange(loginDays);
  }

  return {
    makeRequest: makeRequest
  };
})(jQuery);


recordLogin.makeRequest();
