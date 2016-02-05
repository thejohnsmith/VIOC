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
      data: {
        userId: marcomUserData.$user.externalId,
        subscription_id: $selectedPrograms
      },
      processData: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      contentType: 'application/json'
    }).done(function(result) {
      console.log('Data Loaded: ' + result);
      toastr.success('The stores were enrolled successfully.');
    }).fail(function() {
      console.log('setStoreSubscription failed ' + $selectedPrograms);
      // Display a success toast, with a title
      toastr.error('The stores were not enrolled.');
    });
  };

  return {
    makeRequest: makeRequest
  };
})(jQuery);
