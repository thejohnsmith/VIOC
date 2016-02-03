/** Set Store Subscription
 * Usage: setStoreSubscription.makeRequest();
 * @param {object} data.userId
 * @param {object} data.programIds
 */
var setStoreSubscription = (function($) {

  var makeRequest = function() {
    // var userId =
    var localDevUrl =
      'data/setStoreSubscription.jssp';
    var marcomDevUrl =
      'https://files.marcomcentral.app.pti.com/epsilon/static/data/setStoreSubscription.jssp';
    var acUrl =
      'https://adobe-uat-vioc.epsilon.com/jssp/vioc/setStoreSubscription.jssp';
    $.ajax({
      url: localDevUrl,
      type: 'POST',
      data: {
        userId: marcomUserData.$user.externalId || '',
        programIds: 1
      },
      processData: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      contentType: 'application/json'
    }).done(function(result) {
      console.log('Data Loaded: ' + result);
      $('.alert-container').html('<div class="alert-main alert-success">SUCCESS: Programs have loaded.</div>').fadeIn();
    }).fail(function() {
      console.log('setStoreSubscription failed');
    });
  };

  return {
    makeRequest: makeRequest
  };
})(jQuery);
