// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

  // The global jQuery object is passed as a parameter
  yourcode(window.jQuery, window, document);

}(function($, window, document) {

  // The $ is now locally scoped

  $(function() {
    getName('aaaabcd4621d373cade4e832627b4f6').done(function(data) {
      // Updates the UI based the ajax result
      console.log('test ' + data.firstName);
      $('.welcome-message-custom').text('test all: ' + data.lastName);
    });
  });

  function getName(userId) {
    var dynamicData = {};
    dynamicData['franchiseeId'] = userId;
    console.log(dynamicData);
    return $.ajax({
      url: 'data/getUser.jssp',
      type: 'get',
      data: dynamicData
    });
  }

}));

/**
 * Queries DataService for firstName field.
 * @param type {string} GET or POST.
 * @param data {object} Optional.
 * @param url  {string} Source of json API.
 */

var $ui_element = $('.welcome-message-custom'),
  aJaxCall_type = 'GET',
  ajaxCall_data,
  aJaxCall_url = 'data/getUser.jssp',
  ajaxCall_response;


/*
  1. Check for existing cookie.
  2. If no cookie: create request, update UI, save name to new cookie.
  3. If request fails: Redirect to error page.
  4.
*/
DataService.makeAjaxCall(aJaxCall_type, ajaxCall_data, aJaxCall_url)
  .error(function ajaxError(data) {
    // TO DO:
    // * Redirect to error page.
  })
  .done(function(data) {
    $ui_element.text(data.firstName + '!');
    storeInCookie(data);
  }).then(function testingThen(argument) {
    console.log('testing......');
  });
