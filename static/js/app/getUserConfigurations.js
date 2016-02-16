/** Get User Configurations
 * Returns the configurations associated to a user's account
 * Usage: getUserConfigurations.makeRequest();
 * 1. Find a vioc: user by userId and verify they are legal.
 * 2. Query all configs that (belong to this user ID) or
 *    (have a null user ID and corporate defaults) or
 *    (belongs to no user (0) and belongs to that program ID)
 * @param {object} userId The caller's unique Franchisee ID
 * @param {object} programId The ID of the program you're retrieving configs for
 * @param {object} data.programIds
 */



/* NOTE
  To get the 2nd tab to auto open the hash needs to be before the programID in the query string.

  ex.
  http://localhost:8888/valvoline-vioc/static/program-management.html?uigroup_id...
  #parentHorizontalTab2#programId=4
    or
  #parentHorizontalTab1|#programId=1
 */

var getUserConfigurations = (function($) {

  var makeRequest = function($programId) {
    if (marcomUserData.$user.externalId === '%%User.ExternalId%%') {
      return;
    }
    var $programId = getProgramParticipationStats.programId ||
      window.location.href.slice(-1) || 0;
    var localDevUrl =
      'data/getUserConfigurations.jssp';
    var marcomDevUrl =
      'https://files.marcomcentral.app.pti.com/epsilon/static/data/getUserConfigurations.jssp';
    var acUrl =
      'https://adobe-uat-vioc.epsilon.com/jssp/vioc/getUserConfigurations.jssp';
    $.ajax({
      url: localDevUrl,
      type: 'GET',
      contentType: 'application/json',
      processData: true,
      data: {
        userId: marcomUserData.$user.externalId,
        programId: $programId
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).done(function(result) {
      toastr.success(
        'Programs were successfully fetched'
      );
      getProgramParticipationStats.makeRequest();

    }).fail(function() {
      toastr.error('An internal error has occurred.');
      console.log(
        '%c ** Request failed ** ',
        'color: #f10; font-weight: bold;',
        '\nProgram ID not found.');
    });
    var updateUI = function updateUI() {

      return;
    }
  };

  return {
    makeRequest: makeRequest
  };
})(jQuery);
