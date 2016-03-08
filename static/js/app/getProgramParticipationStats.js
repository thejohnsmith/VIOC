/** Get Program Participation Stats
 * Usage: getProgramParticipationStats.makeRequest();
 * @param {int} programId, this is taken from the location URL
 * @param {object} data.userId
 */
var getProgramParticipationStats = (function ($) {
  /* Use getHashParams.js to get programId */
  var programId = getHashParams.hashParams.programId;
  var makeRequest = function () {
      // Make sure there's a User ID loaded from Marcom before we Init this script.
      if(marcomUserData.$user.externalId === '%%User.ExternalId%%') {
        return
      }
      var localDevUrl = 'data/getProgramParticipationStats.jssp';
      var marcomDevUrl = 'https://files.marcomcentral.app.pti.com/epsilon/static/data/getProgramParticipationStats.jssp';
      var acUrl = 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/getProgramParticipationStats.jssp';
      $.ajax({
        url: acUrl,
        type: 'GET',
        dataType: 'json',
        processData: true,
        data: {
          userId: marcomUserData.$user.externalId
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }).done(function (result) {
        //upDateProgramsDashboard(result);
        getProgramTitle(result);
        loadProgramData(result);
        loadDashboardData(result);
      }).fail(function () {
        requestFailed();
      }).always(function (result) {
        $programParticipationStats = result;
      });
    },
    /** Get Program title
     * Gets the programTitle from API matched to the programID hash in the URL.
     * @param {object} result Json object from API request.
     * @return {string} programTitle
     */
    getProgramTitle = function (result) {
      if(!$('.h1.page-title').length) {
        return;
      }
      return result.map(function (obj) {
        var programTitle = getHashParams.hashParams.programId;
        if(JSON.stringify(obj.id) === programId) {
          programTitle = obj.programName;
          return setProgramTitle(programTitle);
        }
        if(programId === '#' || programId === 'l' || programId === '=' || programId < 1) {
          console.warn('Program ID was not found: %c Result is unknown', 'color: #f10; font-weight: bold;');
          programTitle = 'Unknown';
          return setProgramTitle(programTitle);
        }
      });
    },
    /** Set Program title
     * Sets the programTitle text for the page header.
     * Fades title in to prevent flashing of other text.
     * @param {object} result Json object from API request.
     * @return {string} programTitle found through getProgramTitle.
     */
    setProgramTitle = function (programTitle) {
      $('.h1.page-title > *').text(programTitle + ' Program').css({
        opacity: 0
      }).removeClass('hidden').animate({
        opacity: 1
      });
      return setBreadcrumbTitle(programTitle);
    },
    setBreadcrumbTitle = function (programTitle) {
      $('#breadcrumbs span').text(programTitle + ' Program');
    },
    loadDashboardData = function (result) {
      if($('.participation-dashboard-tpl').length) {
        $.get('https://files.marcomcentral.app.pti.com/epsilon/static/participation-dashboard.mustache.html', function (templates) {
          var template = $(templates).filter('.participation-dashboard-template').html();
          $('.participation-dashboard-tpl').html(Mustache.render(template, result));
          return loadProgramData(result);
        });
      }
    },
    /** Load Program Data
     * Updates the participation dashboard
     * @param {template} $programSelectTpl, Mustache template
     * @param {string} programDataRendered, html output of $programSelectTpl
     * @retrun {function} upDateProgramsDashboard
     */
    loadProgramData = function (result) {
      if($('.program-select').length) {
        $.get('https://files.marcomcentral.app.pti.com/epsilon/static/program-list.mustache.html', function (templates) {
          var template = $(templates).filter('.program-list-template').html();
          $('.program-select').html(Mustache.render(template, result));
          customCheckAndRadioBoxes.customCheckbox();
          return upDateProgramsDashboard(result), setProgramTabContent();
        });
      }
    },
    /**
     * Updates the .program-select properties.
     * @param {object} result Json object from API request.
     * @param {string} $programId Shorthand for items.
     * @return {string} outputs fill sections.
     */
    upDateProgramsDashboard = function (result) {
      // define colors
      var programStatus = {
        alert: ['status-red'],
        warning: ['status-yellow'],
        success: ['status-green'],
        error: ['status-error']
      };
      return $.each(result, function (index, obj) {
        var $programId = $('#program-' + obj.id);
        // Make sure to ommit non-lifecycle campaign entries.
        if(obj.isLifecycleCampaign) {
          // No stores participating : Red
          if(obj.storesParticipating === 0 || obj.storesParticipating === 0 && obj.storesEligible === 0) {
            $programId.attr('class', programStatus.alert);
          }
          // More than one store participating : Yellow
          if(obj.storesParticipating > 0 && obj.storesEligible > 0) {
            $programId.attr('class', programStatus.warning);
            // All stores participating : Green
            if(obj.storesParticipating === obj.storesEligible) {
              $programId.attr('class', programStatus.success);
            }
          }
        }
        // Check for errors:
        // If more stores participating than eligible display error state.
        if(obj.storesParticipating > obj.storesEligible || !$.isNumeric(obj.storesParticipating)) {
          handleDashboardError(obj);
        }
        // Handle errors
        // Color : Gray
        // Displays warning symbol '⚠'
        function handleDashboardError(obj) {
          return $programId.attr('class', programStatus.error).find('.program-status').html('&#9888;').attr('title', 'An error occurred');
        }
      });
    },
    setFirstProgramTabContent = function () {
      var $initialFirstTab = $('#programSummary .program-list:first .program-overview-tab-content').html();
      var $initialLastTab = $('#programSummary .program-list:first .program-touchpoints-tab-content').html();
      $('#programDetails .resp-tab-content:first').html($initialFirstTab);
      $('#programDetails .participation-table thead').next().html($initialLastTab);
      $('#programDetails .js-loading').fadeOut();
    },
    setProgramTabContent = function () {
      setFirstProgramTabContent();
      return $('.program-list').hover(function () {
        var $firstTab = $(this).find('.program-overview-tab-content').html();
        $('#programDetails .resp-tab-content:first').html($firstTab);
        var $lastTab = $(this).find('.program-touchpoints-tab-content').html();
        $('#programDetails .participation-table thead').next().html($lastTab);
      }, function () {
        return;
      });
    },
    requestFailed = function () {
      $('.program-select').html('There was a problem fetching your programs.' + 'Please check back again later.');
      $('.alert-container').html('<programss="alert-main alert-danger">DANGER: An error occured</div>').fadeIn();
      // Display a success toast, with a title
      return console.warn('An internal error has occurred.');
    }
  return {
    makeRequest: makeRequest,
    getProgramTitle: getProgramTitle,
    setProgramTitle: setProgramTitle,
    loadProgramData: loadProgramData,
    upDateProgramsDashboard: upDateProgramsDashboard,
    requestFailed: requestFailed
  };
})(jQuery);
getProgramParticipationStats.makeRequest()
