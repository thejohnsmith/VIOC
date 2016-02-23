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
      setDateLabel();
      setImagePath();
    },
    getCurrentMonth = function () {
      var currentMonth = new moment();
      return currentMonth;
    },
    getNextMonth = function () {
      var nextMonth = new moment().add(1, 'months');
      return nextMonth;
    },
    setDateLabel = function () {
      var dateLabelCurrent = getCurrentMonth().format('MMMM YYYY');
      var dateLabelNext = getNextMonth().format('MMMM YYYY');
      $calendarTabs.find('li:first a').attr('title', dateLabelCurrent).text(dateLabelCurrent);
      $calendarTabs.find('li:last a').attr('title', dateLabelNext).text(dateLabelNext);
      return;
    },
    setImagePath = function () {
      // /calendars folder
      //  "calendar-MM-YYYY.jpg format"
      var imgCurrent = getCurrentMonth().format('MM-YYYY');
      var imgNext = getNextMonth().format('MM-YYYY');
      $('.tab-content:first img').attr('src', '../calendar/calendar-' + imgCurrent + '.jpg');
      $('.tab-content:last img').attr('src', '../calendar/calendar-' + imgNext + '.jpg');
      return;
    }
  return {
    init: init,
    $calendar: $calendar,
    getCurrentMonth: getCurrentMonth,
  };
})(jQuery);
dynamicCalendar.init();
