/** Get User Configurations
 * Returns the configurations associated to a user's account
 * Usage: getUserConfigurations.makeRequest();
 * 1. Find a vioc:user by userId and verify they are legal.
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
    var localDevUrl =
      'data/getUserConfigurations.jssp';
    var marcomDevUrl =
      'https://files.marcomcentral.app.pti.com/epsilon/static/data/getUserConfigurations.jssp';
    var acUrl =
      'https://adobe-uat-vioc.epsilon.com/jssp/vioc/getUserConfigurations.jssp';
    $.ajax({
      url: localDevUrl,
      type: 'POST',
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
        'Enrollment preferences have been updated for the selected programs.'
      );
      // Get a new copy of data, populate the template and reinitialize the buttons.
      getProgramParticipationStats.makeRequest();
      customCheckAndRadioBoxes.customCheckbox();
    }).fail(function() {
      toastr.error('An internal error has occurred.');
      console.log(
        '%c ** Request failed ** ',
        'color: #f10; font-weight: bold;',
        '\nProgram ID not found.');
    });
  };

  return {
    makeRequest: makeRequest
  };
})(jQuery);
