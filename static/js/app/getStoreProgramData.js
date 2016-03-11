var getStoreProgramData = (function ($) {
  /* Use getHashParams.js to get programId */
  var $programId = getHashParams.hashParams.programId;
  var makeRequest = function () {
      // Make sure there's a User ID loaded from Marcom before we Init this script.
      if(marcomUserData.$user.externalId === '%%User.ExternalId%%' || $programId === undefined || $programId === null) {
        return
      }
      var localDevUrl = 'data/getStoreProgramData.jssp';
      var marcomDevUrl = 'https://files.marcomcentral.app.pti.com/epsilon/static/data/getStoreProgramData.jssp';
      var acUrl = 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/getStoreProgramData.jssp';
      $.ajax({
        url: acUrl,
        type: 'GET',
        dataType: 'json',
        processData: true,
        data: {
          userId: marcomUserData.$user.externalId,
          programId: $programId
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }).done(function (result) {
        loadStoreProgramData(result);
      }).fail(function () {
        requestFailed();
      });
    },
    loadStoreProgramData = function (result) {
      if($('.program-enrollment-section').length) {
        $.get('https://files.marcomcentral.app.pti.com/epsilon/static/program-enrollment.mustache.html', function (templates) {
          var template = $(templates).filter('.program-enrollment-template').html();
          $('.program-enrollment-section').html(Mustache.render(template, result));
        }).done(function () {
          return calculateTotals(result);
        });
      }
      if($('.program-settings-section').length) {
        $.get('https://files.marcomcentral.app.pti.com/epsilon/static/program-settings.mustache.html', function (templates) {
          var template2 = $(templates).filter('.program-settings-template').html();
          $('.program-settings-section').html(Mustache.render(template2, result));
          getUserConfigurations.makeRequest();
          programManagementController.controller.init();
          return reloadCheckBoxes();
        }).done(function () {
          return setHashLinks(),
            programSettingsHandler()
        });
      }
    },
    setHashLinks = function () {
      var currentProgramId = getHashParams.hashParams.programId;
      if($('.js-create-program-hash').length) {
        $('.js-create-program-hash').each(function () {
          $(this).attr('href', $(this).attr('href') + '#programId=' + currentProgramId);
        });
      }
    },
    programSettingsHandler = function () {
      if($('.program-settings-section .customCheckbox').length) {
        return $('.program-settings-section .customCheckbox, .store-enroll .btn.btn-primary').click(function () {
          $('.program-settings-footer').toggle($('.program-settings-section td .customCheckbox.checked').length > 1);
          $('.program-settings-footer-row td:first-child').html('Adjust ' + $('.program-settings-section td .customCheckbox.checked').length + ' selected store(s) to use:');
        })
      }
      // var $filter1 = '{{#.}}{{#filter-type}}<div class="{{filter-type}} filter-select select-option">' + '<select class="selectbox">' + '{{#filter-type}}<option class="selectboxOption" selected>Select {{filter-type}}</option>' + '<option class="selectboxOption" value="{{text}}">{{text}}</option>{{/filter-type}}' + '</select>' + '</div>{{/filter-type}}' + '{{#children}}' + '{{#filter-type}}<div class="{{filter-type}} filter-select select-option hidden">' + '<select class="selectbox">' + '{{#filter-type}}<option class="selectboxOption" selected>Select {{filter-type}}</option>{{/filter-type}}' + '{{#children}}<option class="selectboxOption" value="{{text}}">{{text}}</option>{{/children}}' + '</select>' + '</div>{{/filter-type}}' + '{{/children}}' + '{{#children}}' + '<div class="area filter-select select-option hidden">' + '<select class="selectbox">' + '{{#children}}<option class="selectboxOption" selected>Select Area</option>' + '{{#children}}<option class="selectboxOption" value="{{text}}">{{text}}</option>{{/children}}{{/children}}' + '</select>' + '</div>' + '{{/children}}' + '{{/.}}'
      // var filter1html = Mustache.to_html($filter1, $storeSummary);
      // $(filter1html).appendTo('.filters-area-section');
      // return handlers();

    },
    reloadCheckBoxes = function () {
      return customCheckAndRadioBoxes.customCheckbox();
    },
    calculateTotals = function (result) {
      Array.prototype.sum = function (prop) {
        var total = 0
        for(var i = 0, _len = this.length; i < _len; i++) {
          total += this[i][prop]
        }
        return total;
      }
      // $('.costEstimateTotal').text(result.sum('costEstimate').toFixed(2));
      return formatCurrency('costEstimateTotal'), calculateSum('channelEmailTotal'),
        calculateSum('channelDMTotal'),
        calculateSum('channelSMSTotal')
    },
    calculateSum = function (elementsToSum) {
      var newSum = 0;
      $('.store-item[data-enrolled="true"] .store-counts .' + elementsToSum).each(function () {
        newSum += parseFloat($(this).text());
      });
      if($('.grand-total').length) {
        return $('.grand-total .' + elementsToSum).text(newSum);
      }
    },
    /** Adds decimal places to cost numbers
     */
    formatCurrency = function (elementsToSum) {
      var newSum = 0;
      $('.store-item[data-enrolled="true"] .store-cost .costEstimateTotal').each(function () {
        newSum += parseFloat($(this).text());
      });
        $('.grand-total .costEstimateTotal').text(newSum);
      // return $('.js-format-currency').each(function (argument) {
      //   var $numberInput = parseFloat($(this).text());
      //   var $numberOutput = $(this).text($numberInput.toFixed(2));
      // });
    },
    requestFailed = function () {
      $('.program-select').html('There was a problem fetching your programs.' + 'Please check back again later.');
      $('.alert-container').html('<div class="alert-main alert-danger">Error: There was a problem loading the store data.</div>').fadeIn();
      return console.warn('An internal error has occurred.');
    }
  return {
    makeRequest: makeRequest,
    loadStoreProgramData: loadStoreProgramData,
    setHashLinks: setHashLinks,
    programSettingsHandler: programSettingsHandler,
    reloadCheckBoxes: reloadCheckBoxes,
    calculateTotals: calculateTotals,
    calculateSum: calculateSum,
    formatCurrency: formatCurrency,
    requestFailed: requestFailed
  };
})(jQuery);
getStoreProgramData.makeRequest()
