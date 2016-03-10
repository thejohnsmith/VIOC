/** Set Store Subscription
 * @overview Subscribes or unsubscribes a store to/from a program
 * Usage: setStoreSubscription.makeRequest(34567, 1, 1, 1);
 * example: https://adobe-uat-vioc.epsilon.com/jssp/vioc/setStoreSubscription.jssp?userId=34567&storeIds=1&programId=1&subscribe=1
 * Find a vioc:user by userId
 * Insert or delete a vioc:programSubscription entry.
 * @param {object} data.userId	098f6bcd4621d373cade4e832627b4f6	The caller's unique Franchisee ID.
 * @param {object} data.storeIds	1,2,3	The IDs of the store being subscribed/unsubscribed, comma separated
 * @param {object} data.programId	1	The ID of the program being subscribed/unsubscribed
 * @param {string} data.subscribe	1	Whether to subscribe or unsubscribe.  Either 0 or 1.
 * @return {string} TRUE or FALSE
 */
var setStoreSubscription = (function ($) {
  var makeRequest = function ($userId, $storeIds, $programId, $subscribe) {
    var localDevUrl = 'data/setStoreSubscription.jssp';
    var marcomDevUrl = 'https://files.marcomcentral.app.pti.com/epsilon/static/data/setStoreSubscription.jssp';
    var acUrl = 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/setStoreSubscription.jssp';
    $.ajax({
      url: acUrl,
      type: 'GET',
      contentType: 'application/json',
      processData: true,
      data: {
        userId: marcomUserData.$user.externalId,
        storeIds: $storeIds,
        programId: $programId,
        subscribe: $subscribe
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).done(function (result) {
      /** Toast Messages
       * @todo Display the success message with the proper program names.
       * @param {boolean} API returns 0 or 1
       * @returns {message} Toastr plugin messages.
       **/
      if(!$subscribe) {
        // Unenrolled
        return new toastr.error('Store no longer enrolled.');
      }
      if($subscribe) {
        // Enrolled
        return new toastr.success('Your store has been enrolled.');
      }
      // Debugging
      console.log('%c ** Program Success ** ', 'color: #0a9; font-weight: bold;', '\nProgram Id sent to API:\n' + $programId);
      console.log('%c ** Store Success ** ', 'color: #8a7; font-weight: bold;', '\nStore ID sent to API:\n' + $storeIds);
    }).fail(function () {
      return new toastr.error('An error occurred while attempting to set a store\'s subscription. ' + 'Please try again later or let us know about the issue by sending a message using the form on the ' + '<a href="CustomPage.aspx?uigroup_id=479602&page_id=10798"> "<u>Contact Us</u>" <a/> page.');
      // Debugging
      console.log('%c ** Request failed ** ', 'color: #f10; font-weight: bold;', '\nStore IDs sent to API:\n' + $storeIds);
    }).always(function () {
      // Updates grand-total values in .program-enrollment-section
      getStoreProgramData.makeRequest();
    });
};
return {
  makeRequest: makeRequest
};
})(jQuery);
