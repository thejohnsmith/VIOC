(function(getStoreProgramData) {

  // The global jQuery object is passed as a parameter
  getStoreProgramData(window.jQuery, window, document);
}(function($, window, document) {
  // The $ is now locally scoped

  $(function() {
    var localDevUrl =
      'data/getStoreProgramData.jssp';
    var marcomDevUrl =
      'https://files.marcomcentral.app.pti.com/epsilon/static/data/getStoreProgramData.jssp';
    var acUrl =
      'https://adobe-uat-vioc.epsilon.com/jssp/vioc/getStoreProgramData.jssp';
    var programId = window.location.href.slice(-1);

    $.ajax({
      url: acUrl,
      dataType: 'json',
      data: {
        userId: marcomUserData.$user.externalId
      }
    }).done(function(result) {
      loadStoreProgramData(result);
      // Initialize the custom input skins after ajax loads.
      customCheckAndRadioBoxes.customCheckbox();
    }).fail(function() {
      ajaxclientFailed();
    });

    function loadStoreProgramData(result) {

      // TO TO: make sure the costEstimate var renderes as .00 if price is 23.00
      if ($('.storeProgramData').length) {
        var programDataTpl = $('#programDataTpl').html();
        var programDataRendered = Mustache.render(programDataTpl,
          result);
        Mustache.parse(programDataTpl); // optional, speeds up future uses
        $('.storeProgramData').html(programDataRendered);
        return calculateTotals(result);

      }
    }

    /**
     *
     *
     */
    function calculateTotals(result) {
      Array.prototype.sum = function(prop) {
        var total = 0
        for (var i = 0, _len = this.length; i < _len; i++) {
          total += this[i][prop]
        }
        return total;
      }

      $('.channelEmailTotal').text(result.sum('channelEmail'));
      $('.channelDMTotal').text(result.sum('channelDM'));
      $('.channelSMSTotal').text(result.sum('channelSMS'));
      $('.costEstimateTotal').text(result.sum('costEstimate').toFixed(2));
      $('.alert-container').html(
        '<div class="alert-main alert-success">SUCCESS: Programs have loaded.</div>'
      ).fadeIn();
      return formatCurrency();
    }

    /** Adds decimal places to cost numbers
     *
     *
     */
    function formatCurrency(argument) {
      return $('.js-format-currency').each(function(argument) {
        var $numberInput = parseFloat($(this).text());
        var $numberOutput = $(this).text($numberInput.toFixed(2));
      });
    }

    function ajaxclientFailed() {
      $('.program-select').html(
        'There was a problem fetching your programs.' +
        'Please check back again later.'
      );
      $('.alert-container').html(
        '<div class="alert-main alert-danger">Error: There was a problem loading the store data.</div>'
      ).fadeIn();
    }
  });
}));
