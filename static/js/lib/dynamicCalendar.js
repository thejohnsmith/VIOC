/* dynamicCalendar.js
  * Dynamically determine the two Month / Years shown.
  * Move the calendar images under a /calendars folder on Marcom's FTP and name them in "calendar-MM-YYYY.jpg format".
  * Copy one of the calendars to be calendar-03-2016.jpg,  calendar-04-2016.jpg  and calendar-05-2016.jpg
  * @param {class} .calendar-paceholder Holds the calendar images.

  * @param {class} .nav-tabs Child of .tab-links, this is the ul that contains triggers for changing out images.
  * @param {class} .active applied to three places: .nav-tabs > li, .nav-tabs > li a, .calendar-paceholder > a
 */
var dynamicCalendar = (function ($) {
  if(!$('#calendar').length) {
    return
  }
  var $calendar = $('#calendar'),
    $calendarTabs = $calendar.find('.nav-tabs'),
    init = function () {
      getCurrentMonth();
      getNextMonth();
      setDateLabel()
    },
    getCurrentMonth = function () {
      // Use moment to get months
      // var currentMonth = new moment().format('MMMM');
      var currentMonth = new moment();
      console.log('current month is: ' + currentMonth);
      setDateLabel(currentMonth);
      return currentMonth;
    },
    getNextMonth = function () {
      // var nextMonth = new moment().subtract(1, 'months').format('MMMM')
      // TO DO: output just unformatted data.
      // then have renderer format it in the right functions!
      var nextMonth = new moment().add(1, 'months');
      console.log('last month is : ' + nextMonth);
      setDateLabel(nextMonth);
      return nextMonth;
    },
    getMonthAndYear = function (currentMonth) {
      var currentMonthLabel = getCurrentMonth().format('MMMM YYYY');
      var nextMonthLabel = getNextMonth().format('MMMM YYYY');
      console.log('year added: ' + currentMonthLabel);

    },
    setDateLabel = function (rawDate) {
      // var nextMonthLabel = getNextMonth().format('MMMM YYYY');
      // '#tab1 points to .calendar-paceholder > a ID'
      var dateLabel = new moment(rawDate).format('MMMM YYYY');
      console.log('tabs: ' + dateLabel);
      $calendarTabs.find('.active a').attr('title', dateLabel).text(dateLabel);
    }
  return {
    init: init,
    $calendar: $calendar,
    getCurrentMonth: getCurrentMonth,
    getNextMonth: getNextMonth
  };
})(jQuery);
dynamicCalendar.init();
