/* Ajax handler */

/*jslint browser: true*/
/*global $, jQuery, alert*/

'use strict';
var ajaxService = new function() {
  var endpoint = 'data/mockData.json',
    getAccount = function(userID, callback) {
      $.getJSON(endpoint + 'GetAccount', {
        userID: userID
      }, function(data) {
        callback(data);
      });
    },

    getAllData = function(callback) {
      $.getJSON(endpoint, function(data) {
        return data;
      });
    },

    getDataWithParam = function(paramName, callback) {
      $.getJSON(endpoint + 'GetDataWithParam', {
        symbol: paramName
      }, function(data) {
        callback(data);
      });
    };

  return {
    getAccount: getAccount,
    getAllData: getAllData,
    getDataWithParam: getDataWithParam
  };

}();

var ajaxclient = (function() {

  function makeAjaxCall(type, url) {
    return $.ajax({
      url: url,
      type: type,
      dataType: 'json',
      beforeSend: onStartAjax
    }).fail(function ajaxclientFailed() {
      console.log("Ajax failed to fetch data");
    }).done(function(data) {
      // console.log(data);
      return data;
    }).always(onEndAjax);
  }

  function onStartAjax() {
    console.log('starting ajax call...');
  }

  function onEndAjax() {
    console.log('Finished ajax call!');
  }

  return {
    makeAjaxCall: makeAjaxCall
  }
}(this));

ajaxclient
  .makeAjaxCall('get', 'http://hipsterjesus.com/api/')
  .done(function(data) {
    console.log('new' + data.text);
    $('#welcome > *').append(data.text);
  });

/* Usage ex:

ajaxService.getAllData(data);

*/

// $.ajax({
//     url: 'data/mockData.json',
//   })
//   .done(function(data) {
//     console.log(data)
//   })
//   .fail(function() {
//     console.log("Ajax failed to fetch data")
//   })
//
//
// $.getJSON('data/mockData.json', {
//   get_param: 'value'
// }, function(data) {
//   $.each(data, function(index, element) {
//     $('#welcome').append($('<div>', {
//       text: element
//     }));
//   });
// });

window.app = window.app || {};
window.app.test = app.test || {};

window.app.test.ReadFile = (function($) {

  var getResult = function(result) {
    return result;
  };
  var handleError = function(result) {
    return result.responseText;
  };
  //data: "{ 'fileName':'"+ fileName +"' }",
  return function(fileName) {

    var FileContents = $.ajax({
      type: "GET",
      url: "data/mockData.json",
      data: JSON.stringify({
        fileName: fileName
      }),
      cache: false
    });

    FileContents.done(getResult).Fail(handleError);

  };
}(jQuery));
