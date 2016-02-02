(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {
        exports: {}
      };
      t[o][0].call(l.exports, function(e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s
})({
  1: [function(require, module, exports) {
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
              'Less than 5, show the "Programs" version of the home page.'
            );
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

  }, {}]
}, {}, [1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvanMvZGF0YVNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEhhbmRsZXMgYWpheCBHRVQgYW5kIFBPU1QgcmVxdWVzdHMuXG4gKiBSZXR1cm5zIChkYXRhKS5cbiAqIEBwYXJhbSB0eXBlIHtzdHJpbmd9IEdFVCBvciBQT1NULlxuICogQHBhcmFtIGRhdGEge29iamVjdH0gT3B0aW9uYWwuXG4gKiBAcGFyYW0gdXJsICB7c3RyaW5nfSBTb3VyY2Ugb2YganNvbiBBUEkuXG4gKi9cblxuLyoqIFRPIERPOlxuICogQnVpbHQtaW4gZXJyb3IgaGFuZGxpbmdcbiAqIFRlc3QgUE9TVCB0eXBlXG4gKiBCdWlsdC1pbiBhcnJheSBwYXJzaW5nXG4gKiBEYXRhIGNoZWNraW5nIGZvciByZXR1cm5pbmcgbWF0Y2hlZCBjb250ZW50XG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcjogdHJ1ZSovXG4vKmdsb2JhbCAkLCBqUXVlcnksIGFsZXJ0Ki9cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBEYXRhU2VydmljZSA9IChmdW5jdGlvbigpIHtcblxuICAgIGZ1bmN0aW9uIGluaXQocmVxdWVzdFNldHRpbmdzKSB7XG4gICAgICByZXR1cm4galF1ZXJ5LmFqYXgoe1xuICAgICAgICB0eXBlOiByZXF1ZXN0U2V0dGluZ3MucmVxdWVzdFR5cGUsXG4gICAgICAgIGRhdGFUeXBlOiAnaHRtbCBqc29uJyxcbiAgICAgICAgZGF0YTogcmVxdWVzdFNldHRpbmdzLnJlcXVlc3REYXRhLFxuICAgICAgICB1cmw6IHJlcXVlc3RTZXR0aW5ncy5yZXF1ZXN0TGlua1xuICAgICAgfSkuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdSZXF1ZXN0IGZpbmlzaGVkOicpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbkZhaWwoKSB7XG4gICAgICAvLyBEZWJ1ZyBvbmx5OiByZW1vdmUgZnJvbSBkaXN0XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ1JlcXVlc3QgRmFpbGVkJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25FbmQoZGF0YSkge1xuICAgICAgLy8gdmFyIHBhcnNlZFJlc3BvbnNlID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIC8vIERlYnVnIG9ubHk6IHJlbW92ZSBmcm9tIGRpc3RcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdGaW5pc2hlZCBhamF4IGNhbGwnKTtcbiAgICAgIC8vIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjcmVhdGVSZXF1ZXN0OiBpbml0XG4gICAgfVxuICB9KCkpO1xuXG5cblxuICB2YXIgUmVxdWVzdFVzZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogUXVlcmllcyBEYXRhU2VydmljZSBmb3IgZmlyc3ROYW1lIGZpZWxkLlxuICAgICAqIEBwYXJhbSB0eXBlIHtzdHJpbmd9IEdFVCBvciBQT1NULlxuICAgICAqIEBwYXJhbSBkYXRhIHtvYmplY3R9IE9wdGlvbmFsLlxuICAgICAqIEBwYXJhbSByZXF1ZXN0TGluayAge3N0cmluZ30gU291cmNlIG9mIGpzb24gQVBJLlxuICAgICAqL1xuICAgIHZhciByZXF1ZXN0U2V0dGluZ3MgPSB7fTtcbiAgICByZXF1ZXN0U2V0dGluZ3MucmVxdWVzdFR5cGUgPSAnR0VUJztcbiAgICByZXF1ZXN0U2V0dGluZ3MucmVxdWVzdERhdGEgPSBudWxsO1xuICAgIHJlcXVlc3RTZXR0aW5ncy5yZXF1ZXN0TGluayA9XG4gICAgICAnZGF0YS9nZXRVc2VyLmpzc3AnO1xuXG4gICAgRGF0YVNlcnZpY2UuY3JlYXRlUmVxdWVzdChyZXF1ZXN0U2V0dGluZ3MpXG4gICAgICAuZG9uZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHNldFdlbGNvbWVNZXNzYWdlKGRhdGEpO1xuICAgICAgICBnZXRQcm9ncmFtUGFydGljaXBhdGlvblN0YXRzKCk7XG4gICAgICAgIGdldExvZ2luRGF5cyhkYXRhKTtcbiAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIGFqYXhFcnJvcihkYXRhKSB7XG4gICAgICAgIC8vIFRPIERPOlxuICAgICAgICAvLyAqIFJlZGlyZWN0IHRvIGVycm9yIHBhZ2UuXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgLy8gVE8gRE86XG4gICAgICAgIC8vICogRGV0ZXJtaW5lIGNoYWluaW5nLlxuICAgICAgfSk7XG4gIH0oKSk7XG5cbiAgLypcbiAgICAxLiBDaGVjayBmb3IgZXhpc3RpbmcgY29va2llLlxuICAgIDIuIElmIG5vIGNvb2tpZTogY3JlYXRlIHJlcXVlc3QsIHVwZGF0ZSBVSSwgc2F2ZSBuYW1lIHRvIG5ldyBjb29raWUuXG4gICAgMy4gSWYgcmVxdWVzdCBmYWlsczogUmVkaXJlY3QgdG8gZXJyb3IgcGFnZS5cbiAgICA0LlxuICAqL1xuXG4gIGZ1bmN0aW9uIHNldFdlbGNvbWVNZXNzYWdlKGRhdGEpIHtcbiAgICB2YXIgJHVpX2VsZW1lbnQgPSAkKCcud2VsY29tZS1tZXNzYWdlLWN1c3RvbScpO1xuICAgIGlmICghJHVpX2VsZW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBseU5hbWUoKSB7XG4gICAgICAkdWlfZWxlbWVudC50ZXh0KGRhdGEuZmlyc3ROYW1lICsgJyEnKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcGx5TmFtZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TG9naW5EYXlzKGRhdGEpIHtcbiAgICB2YXIgbG9naW5EYXlzID0ge1xuICAgICAgJ3gnOiBkYXRhLmZpcnN0UG9ydGFsTG9naW4sXG4gICAgICAneSc6IGRhdGEubGFzdFBvcnRhbExvZ2luXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldERhdGVSYW5nZShsb2dpbkRheXMpIHtcbiAgICAgIC8qIE1ha2Ugc3VyZSB0aGUgbW9tZW50IGxpYnJhcnkgaGFzIGxvYWRlZCAqL1xuICAgICAgaWYgKHR5cGVvZiBtb21lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmxvZygnRXJyb3I6IG1vbWVudC5qcyB3YXMgbm90IGxvYWRlZC4nKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZpc3REYXkgPSBtb21lbnQobG9naW5EYXlzLngpO1xuICAgICAgdmFyIGxhc3REYXkgPSBtb21lbnQobG9naW5EYXlzLnkpO1xuICAgICAgdmFyIHJhbmdlID0gbGFzdERheS5kaWZmKGZpc3REYXksICdkYXlzJyk7XG5cbiAgICAgIGlmIChyYW5nZSA+IDUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgJ0dyZWF0ZXIgdGhhbiA1LCBzaG93IFwiR2V0dGluZyBTdGFydGVkIE5vd1wiIHZlcnNpb24gb2YgdGhlIGhvbWUgcGFnZS4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICdMZXNzIHRoYW4gNSwgc2hvdyB0aGUgXCJQcm9ncmFtc1wiIHZlcnNpb24gb2YgdGhlIGhvbWUgcGFnZS4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2V0RGF0ZVJhbmdlKGxvZ2luRGF5cyk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGdldFByb2dyYW1QYXJ0aWNpcGF0aW9uU3RhdHMoKSB7XG4gICAgLy8gdmFyICRqID0galF1ZXJ5Lm5vQ29uZmxpY3QoKTtcbiAgICAvLyAkaihmdW5jdGlvbigpIHtcbiAgICAvLyAgIHZhciBhY1VybCA9XG4gICAgLy8gICAgICdodHRwOi8vdWMxd3Zpb2NuZW8wMS5yZXMucHJvZC5nbG9iYWwvanNzcC92aW9jL2dldFByb2dyYW1QYXJ0aWNpcGF0aW9uU3RhdHMuanNzcCc7XG4gICAgLy8gICAkai5hamF4KHtcbiAgICAvLyAgICAgdXJsOiBhY1VybCxcbiAgICAvLyAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgLy8gICAgICAgdXBEYXRlUHJvZ3JhbXNEYXNoYm9hcmQocmVzdWx0KTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSk7XG4gICAgLy9cbiAgICAvLyAgIGZ1bmN0aW9uIHVwRGF0ZVByb2dyYW1zRGFzaGJvYXJkKHJlc3VsdCkge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgIC8vICAgICAkai5lYWNoKHJlc3VsdCwgZnVuY3Rpb24oaW5kZXgsIG9iaikge1xuICAgIC8vICAgICAgICRqKCcjc3RvcmUtJyArIG9iai5pZCArICcgLmNoZWNrYm94LWFyZWEnKS5odG1sKFxuICAgIC8vICAgICAgICAgJzxsYWJlbD4nICtcbiAgICAvLyAgICAgICAgIG9iai5wcm9ncmFtTmFtZSArXG4gICAgLy8gICAgICAgICAnPC9sYWJlbD4nKTtcbiAgICAvLyAgICAgICAkaignI3N0b3JlLScgKyBvYmouaWQgKyAnIC5zdG9yZXNQYXJ0aWNpcGF0aW5nJylcbiAgICAvLyAgICAgICAgIC50ZXh0KG9iai5zdG9yZXNQYXJ0aWNpcGF0aW5nKTtcbiAgICAvLyAgICAgICAkaignI3N0b3JlLScgKyBvYmouaWQgKyAnIC5zdG9yZXNFbGlnaWJsZScpXG4gICAgLy8gICAgICAgICAudGV4dChvYmouc3RvcmVzRWxpZ2libGUpO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyAgIH1cbiAgICAvLyB9KTtcbiAgfVxufSkoKTtcbiJdfQ==
