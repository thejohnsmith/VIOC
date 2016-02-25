/** Set Program Defaults - Applies generalized defaults to specific programs
 * Usage: setProgramDefaults.makeRequest();
 * Functionality: 1. Find a vioc:user by userId 2. For each provided programId, enroll all of the user's stores and apply hard-coded defaults.
 * @param {object} data.userId The caller's unique Franchisee ID.
 * @param {object} data.programIds The IDs of the programs that should be set to default for all of the user's stores.
 * @return {string} TRUE
 */
var setProgramDefaults = (function ($) {
  var makeRequest = function ($selectedPrograms, $selectedProgramNames) {
    var localDevUrl = 'data/setProgramDefaults.jssp';
    var marcomDevUrl = 'https://files.marcomcentral.app.pti.com/epsilon/static/data/setProgramDefaults.jssp';
    var acUrl = 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/setProgramDefaults.jssp';
    $.ajax({
      url: acUrl,
      type: 'GET',
      contentType: 'application/json',
      processData: true,
      data: {
        userId: marcomUserData.$user.externalId,
        programIds: $selectedPrograms
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).done(function (result) {
      // Display the success message with the proper program names.
      toastr.success('Your stores have been enrolled in using corporate defaults for the selected program(s):<br><h4>'
      + $selectedProgramNames + '</h4>');

      // Refresh the API to display the updated Enrollment(s).
      getProgramParticipationStats.makeRequest();

      // Debugging
      // console.log('%c ** Request Success ** ', 'color: #0a9; font-weight: bold;', '\nprogramIdss sent to API:\n' + $selectedPrograms);
    }).fail(function () {
      // Display the error message.
      toastr.error('<strong>Internal error.</strong> Please contact an administrator.');

      // Debugging
      // console.log('%c ** Request failed ** ', 'color: #f10; font-weight: bold;', '\nprogramIds tried to send API:\n' + $selectedPrograms);
    });
  };
  return {
    makeRequest: makeRequest
  };
})(jQuery);
