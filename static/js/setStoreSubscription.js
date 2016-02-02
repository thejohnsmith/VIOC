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
      type: 'post',
      data: {
        userId: 654321,
        programIds: 1
      },
      processData: true,
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
