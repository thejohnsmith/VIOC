(function (getStoreProgramData) {
  // The global jQuery object is passed as a parameter
  getStoreProgramData(window.jQuery, window, document);
}(function ($, window, document) {
  // The $ is now locally scoped
  $(function () {
    var localDevUrl = 'data/getStoreProgramData.jssp';
    var marcomDevUrl = 'https://files.marcomcentral.app.pti.com/epsilon/static/data/getStoreProgramData.jssp';
    var acUrl = 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/getStoreProgramData.jssp';
    var programId = window.location.href.slice(-1);
    $.ajax({
      url: acUrl,
      dataType: 'json',
      data: {
        userId: marcomUserData.$user.externalId,
        programId: programId
      }
    }).done(function (result) {
      loadStoreProgramData(result);
    }).fail(function () {
      ajaxclientFailed();
    });

    function loadStoreProgramData(result) {
      if($('.program-enrollment-section').length) {
        $.get('https://files.marcomcentral.app.pti.com/epsilon/static/program-enrollment.mustache.html', function (templates) {
          var template = $(templates).filter('.program-enrollment-template').html();
          $('.program-enrollment-section').html(Mustache.render(template, result));
          // customCheckAndRadioBoxes.customCheckbox();
          calculateTotals(result);
        });
      }
      if($('.program-settings-section').length) {
        $.get('https://files.marcomcentral.app.pti.com/epsilon/static/program-settings.mustache.html', function (templates) {
          var template2 = $(templates).filter('.program-settings-template').html();
          $('.program-settings-section').html(Mustache.render(template2, result));
          // customCheckAndRadioBoxes.customCheckbox();
          // return calculateTotals(result);
          getUserConfigurations.makeRequest();
          return reloadCheckBoxes();
        }).done(function () {
          return setHashLinks(),
            programSettingsHandler()
        });
      }
    }

    function setHashLinks() {
      var currentProgramId = getHashParams.hashParams.programId;
      if($('.js-create-program-hash').length) {
        $('.js-create-program-hash').each(function () {
          $(this).attr('href', $(this).attr('href') + '#programId=' + currentProgramId);
        });
      }
    }

    function programSettingsHandler() {
      if($('.program-settings-section .customCheckbox').length) {
        return $('.program-settings-section .customCheckbox, .store-enroll .js-select-all-boxes').click(function () {
          $('.program-settings-footer').toggle($('.program-settings-section td .customCheckbox.checked').length > 1);
          $('.program-settings-footer-row td:first-child').html('Adjust ' + $('.program-settings-section td .customCheckbox.checked').length + ' selected store(s) to use:');
        })
      }
    }

    function reloadCheckBoxes() {
      return customCheckAndRadioBoxes.customCheckbox();
    }

    function calculateTotals(result) {
      Array.prototype.sum = function (prop) {
        var total = 0
        for(var i = 0, _len = this.length; i < _len; i++) {
          total += this[i][prop]
        }
        return total;
      }

      $('.toggle-btn.active .channelEmailTotal').text(result.sum('channelEmail'));
      $('.channelDMTotal').text(result.sum('channelDM'));
      $('.channelSMSTotal').text(result.sum('channelSMS'));
      $('.costEstimateTotal').text(result.sum('costEstimate').toFixed(2));
      $('.alert-container').html('<div class="alert-main alert-success">SUCCESS: Programs have loaded.</div>').fadeIn();
      return formatCurrency();
    }
    /** Adds decimal places to cost numbers
     */
    function formatCurrency(argument) {
      return $('.js-format-currency').each(function (argument) {
        var $numberInput = parseFloat($(this).text());
        var $numberOutput = $(this).text($numberInput.toFixed(2));
      });
    }

    function ajaxclientFailed() {
      $('.program-select').html('There was a problem fetching your programs.' + 'Please check back again later.');
      $('.alert-container').html('<div class="alert-main alert-danger">Error: There was a problem loading the store data.</div>').fadeIn();
    }
  });
}));
