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
        userId: marcomUserData.$user.externalId || ''
      },
      processData: true,
      contentType: 'application/json'
    }).done(function(data) {
      getLoginDays(data);
    }).fail(function() {
      return;
    });
  };

  var getLoginDays = function(data) {
    var loginDays = {
      'x': data.firstPortalLogin,
      'y': data.lastPortalLogin
    };

    var getDateRange = function(loginDays) {
      var fistDay = moment(loginDays.x);
      var lastDay = moment(loginDays.y);
      var range = lastDay.diff(fistDay, 'days');

      /* Make sure the moment library has loaded */
      if (typeof moment === 'undefined') {
        return console.log('Error: moment.js was not loaded.');
      }

      /* To Do:
       * Switch versions of home page
       */
      if (range > 5) {
        // console.log('Greater than 5, show "Getting Started Now" version of the home page.');
        return;
      } else {
        // console.log('Less than 5, show the "Programs" version of the home page.');
        return;
      }
    }
    return getDateRange(loginDays);
  }

  return {
    makeRequest: makeRequest
  };
})(jQuery);

recordLogin.makeRequest();
