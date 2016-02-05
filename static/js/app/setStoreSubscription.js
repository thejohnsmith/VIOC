/** Set Store Subscription
 * Usage: setStoreSubscription.makeRequest();
 * @param {object} data.userId
 * @param {object} data.programIds
 */
var setStoreSubscription = (function($) {

  var makeRequest = function($selectedPrograms) {
    // var userId =
    var localDevUrl =
      'data/setStoreSubscription.jssp';
    var marcomDevUrl =
      'https://files.marcomcentral.app.pti.com/epsilon/static/data/setStoreSubscription.jssp';
    var acUrl =
      'https://adobe-uat-vioc.epsilon.com/jssp/vioc/setStoreSubscription.jssp';
    $.ajax({
      url: acUrl,
      type: 'POST',
      contentType: 'application/json',
      processData: true,
      data: {
        userId: marcomUserData.$user.externalId,
        subscription_id: $selectedPrograms
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).done(function(result) {
      toastr.success(
        'Enrollment preferences have been updated for the selected programs.'
      );
    }).fail(function() {
      // Display a success toast, with a title
      toastr.error('An internal error has occurred.');
      console.log(
        '** Request failed **\nProgram IDs sent to API:\n' +
        $selectedPrograms);
    });
  };

  return {
    makeRequest: makeRequest
  };
})(jQuery);
