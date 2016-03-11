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
  #parentHorizontalTab2&programId=4
    or
  #parentHorizontalTab1|&programId=1
 */

var getUserConfigurations = (function($) {

  var makeRequest = function($programId) {
      if (marcomUserData.$user.externalId === '%%User.ExternalId%%') {
        return;
      }
      var $programId = getParameterByName('programId', window.location.href) ;
        if (!$programId) {
          return;
        }
      var localDevUrl =
        'data/getUserConfigurations.jssp';
      var marcomDevUrl =
        'https://files.marcomcentral.app.pti.com/epsilon/static/data/getUserConfigurations.jssp';
      var acUrl =
        'https://adobe-uat-vioc.epsilon.com/jssp/vioc/getUserConfigurations.jssp';
      $.ajax({
        url: acUrl,
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
        updateUI(result);
        // console.log('getUserConfigurations is: ' + result);
        // toastr.success('Programs were successfully fetched');

      }).fail(function() {
        toastr.error('An internal error has occurred.');
        console.log(
          '%c ** Request failed ** ',
          'color: #f10; font-weight: bold;',
          '\nProgram ID not found.');
      });
    },
    updateUI = function updateUI(result) {
      if ($('.program-enrollment-section').length) {

        /** Use programId as selected option
         *  Display all "configType": "program" as options
         */
        $.get(
          'https://files.marcomcentral.app.pti.com/epsilon/static/program-config-options.mustache.html',
          function(templates) {
            var template = $(templates).filter(
              '.program-config-options-template').html();
            $('.program-config-options-section').html(Mustache.render(
              template,
              result));
            // customCheckAndRadioBoxes.customCheckbox();
          });
      }
    }
  return {
    makeRequest: makeRequest,
    updateUI: updateUI
  }
})(jQuery);

getUserConfigurations.makeRequest()
