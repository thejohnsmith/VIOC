(function(getProgramParticipationStats) {

  // The global jQuery object is passed as a parameter
  getProgramParticipationStats(window.jQuery, window, document);
}(function($, window, document) {
  // The $ is now locally scoped

  $(function() {
    var localDevUrl =
      'data/getProgramParticipationStats.jssp';
    var marcomDevUrl =
      'https://files.marcomcentral.app.pti.com/epsilon/static/data/getProgramParticipationStats.jssp';
    var acUrl =
      'https://adobe-uat-vioc.epsilon.com/jssp/vioc/getProgramParticipationStats.jssp';
    var programId = window.location.href.slice(-1);
    $.ajax({
      url: localDevUrl,
      type: 'GET',
      dataType: 'json',
      processData: true,
      data: {
        userId: marcomUserData.$user.externalId
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).done(function(result) {
      //upDateProgramsDashboard(result);
      getProgramTitle(result);
      loadProgramData(result);
    }).fail(function() {
      ajaxclientFailed();
    });

    /** Get Program title
     * Gets the programTitle from API matched to the programID hash in the URL.
     * @param {object} result Json object from API request.
     * @return {string} programTitle
     */
    function getProgramTitle(result) {
      return result.map(function(obj) {
        var programTitle;
        if (programId === '#' || programId < 1) {
          programTitle = 'Unknown';
          return setProgramTitle(programTitle);
        } else if (JSON.stringify(obj.id) === programId) {
          programTitle = obj.programName;
          return setProgramTitle(programTitle);
        }
      });
    }

    /** Set Program title
     * Sets the programTitle text for the page header.
     * Fades title in to prevent flashing of other text.
     * @param {object} result Json object from API request.
     * @return {string} programTitle found through getProgramTitle.
     */
    function setProgramTitle(programTitle) {
      $('.h1.page-title > *').text(programTitle + ' Program').css({
        opacity: 0
      }).removeClass('hidden').animate({
        opacity: 1
      });
    }

    function loadProgramData(result) {
      if ($('.program-list').length) {
        var programSelectTpl = $('.program-list-template').html();
        var programDataRendered = Mustache.render(programSelectTpl,
          result);
        Mustache.parse(programSelectTpl);
        $('.program-list').html(programDataRendered);
        return upDateProgramsDashboard(result);

      }
    }

    /**
     * Updates the .program-select properties.
     * @param {object} result Json object from API request.
     * @param {string} $programId Shorthand for items.
     * @return {string} outputs fill sections.
     */
    function upDateProgramsDashboard(result) {
      // define colors
      var programStatusClasses = {
        reminder: ['status-red'],
        relapsed: ['status-yellow'],
        lapsed: ['status-green'],
        error: ['status-error']
      };
      return $.each(result, function(index, obj) {
        var $programId = $('#program-' + obj.id);
        // console.log(Number(obj.storesEnrolled));
        // No stores participating : Red
        if (obj.storesEnrolled === 0) {
          $programId.attr('class', programStatusClasses.reminder);
        }
        // More than one store participating : Yellow
        if (obj.storesEnrolled > 0) {
          $programId.attr('class', programStatusClasses.relapsed);
          updateParticipationDashboard();
        }
        // All stores participating : Green
        if (obj.storesEnrolled === obj.storesEligible) {
          $programId.attr('class', programStatusClasses.lapsed);
        }
        // Check for errors:
        // If more stores participating than eligible display error state.
        if (obj.storesEnrolled > obj.storesEligible || !$.isNumeric(
            obj.storesEnrolled)) {
          handleError(obj);
        }
        // Handle errors
        // Color : Gray
        // Displays warning symbol '⚠'
        function handleError(obj) {
          $programId.attr('class', programStatusClasses.error).find(
            '.program-status').html('&#9888;').attr('title',
            'An error occured');
        }
      });
    }

    function updateParticipationDashboard() {
      $('.program-name-lifecycle > [data-enrolled]')
        .attr('data-enrolled', true);
      return;
    }

    function ajaxclientFailed() {
      $('.program-select').html(
        'There was a problem fetching your programs.' +
        'Please check back again later.'
      );
      $('.alert-container').html(
        '<programss="alert-main alert-danger">DANGER: An error occured</div>'
      ).fadeIn();
    }
  });
}));

/* Tests */
// var result = [{
//   "id": 1,
//   "programName": "Reminder",
//   "storesEnrolled": 0,
//   "storesEligible": 3
// }, {
//   "id": 2,
//   "programName": "Lapsed",
//   "storesEnrolled": 3,
//   "storesEligible": 3
// }, {
//   "id": 3,
//   "programName": "Relapsed",
//   "storesEnrolled": 3,
//   "storesEligible": 3
// }, {
//   "id": 4,
//   "programName": "Lost",
//   "storesEnrolled": 1,
//   "storesEligible": 3
// }, {
//   "id": 5,
//   "programName": "Reactivation",
//   "storesEnrolled": 3,
//   "storesEligible": 3
// }];
// upDateProgramsDashboard(result);
