/**
 * Handles ajax GET and POST requests.
 * Returns (data).
 * @param type {string} GET or POST.
 * @param data {object} Optional.
 * @param url  {string} Source of json API.
 */

/** TO DO:
 * Built-in error handling
 * Test POST type
 * Built-in array parsing
 * Data checking for returning matched content
 */

/*jslint browser: true*/
/*global $, jQuery, alert*/
(function() {
  'use strict';

  var DataService = (function() {

    function init(requestSettings) {
      return jQuery.ajax({
        type: requestSettings.requestType,
        dataType: 'html json',
        data: requestSettings.requestData,
        url: requestSettings.requestLink
      }).done(function(response) {
        return response;
        // console.log('Request finished:');
        // console.log(response);
      });
    }

    function onFail() {
      // Debug only: remove from dist
      return console.log('Request Failed');
    }

    function onEnd(data) {
      // var parsedResponse = JSON.parse(data);
      // Debug only: remove from dist
      // console.log('Finished ajax call');
      // return JSON.parse(data);
    }

    return {
      createRequest: init
    }
  }());



  var RequestUser = (function() {
    /**
     * Queries DataService for firstName field.
     * @param type {string} GET or POST.
     * @param data {object} Optional.
     * @param requestLink  {string} Source of json API.
     */
    var requestSettings = {};
    requestSettings.requestType = 'GET';
    requestSettings.requestData = null;
    requestSettings.requestLink =
      'data/getUser.jssp';

    DataService.createRequest(requestSettings)
      .done(function(data) {
        setWelcomeMessage(data);
        getProgramParticipationStats();
        getLoginDays(data);
      }).error(function ajaxError(data) {
        // TO DO:
        // * Redirect to error page.
      }).then(function(data) {
        // TO DO:
        // * Determine chaining.
      });
  }());

  /*
    1. Check for existing cookie.
    2. If no cookie: create request, update UI, save name to new cookie.
    3. If request fails: Redirect to error page.
    4.
  */

  function setWelcomeMessage(data) {
    var $ui_element = $('.welcome-message-custom');
    if (!$ui_element) {
      return;
    }

    function applyName() {
      $ui_element.text(data.firstName + '!');
    }
    return applyName();
  }

  function getLoginDays(data) {
    var loginDays = {
      'x': data.firstPortalLogin,
      'y': data.lastPortalLogin
    };

    function getDateRange(loginDays) {
      /* Make sure the moment library has loaded */
      if (typeof moment === 'undefined') {
        return console.log('Error: moment.js was not loaded.');
      }

      var fistDay = moment(loginDays.x);
      var lastDay = moment(loginDays.y);
      var range = lastDay.diff(fistDay, 'days');

      if (range > 5) {
        console.log(
          'Greater than 5, show "Getting Started Now" version of the home page.'
        );
        return;
      } else {
        console.log(
          'Less than 5, show the "Programs" version of the home page.');
        return;
      }
    }
    return getDateRange(loginDays);
  }


  function getProgramParticipationStats() {
    // var $j = jQuery.noConflict();
    // $j(function() {
    //   var acUrl =
    //     'http://uc1wviocneo01.res.prod.global/jssp/vioc/getProgramParticipationStats.jssp';
    //   $j.ajax({
    //     url: acUrl,
    //     success: function(result) {
    //       upDateProgramsDashboard(result);
    //     }
    //   });
    //
    //   function upDateProgramsDashboard(result) {
    //     console.log(result);
    //     $j.each(result, function(index, obj) {
    //       $j('#store-' + obj.id + ' .checkbox-area').html(
    //         '<label>' +
    //         obj.programName +
    //         '</label>');
    //       $j('#store-' + obj.id + ' .storesParticipating')
    //         .text(obj.storesParticipating);
    //       $j('#store-' + obj.id + ' .storesEligible')
    //         .text(obj.storesEligible);
    //     });
    //   }
    // });
  }
})();
