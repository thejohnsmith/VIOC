/* dynamicCalendar.js
  * Dynamically determine the two Month / Years shown.
  * Move the calendar images under a /calendars folder on Marcom's FTP and name them in "calendar-MM-YYYY.png format".
  * Copy one of the calendars to be calendar-03-2016.png,  calendar-04-2016.png  and calendar-05-2016.png
  * @param {class} .calendar-paceholder Holds the calendar images.

  * @param {class} .nav-tabs Child of .tab-links, this is the ul that contains triggers for changing out images.
  * @param {class} .active applied to three places: .nav-tabs > li, .nav-tabs > li a, .calendar-paceholder > a
 */
var dynamicCalendar = (function ($) {
	var controller = {
		calendar: $('#calendar'),
		calendarTabs: $('#calendar .nav-tabs'),
		init: function () {
			controller.setDateLabel();
			controller.setImagePath();
		},
		getCurrentMonth: function () {
			var currentMonth = new moment();
			return currentMonth;
		},
		getNextMonth: function () {
			var nextMonth = new moment().add(1, 'months');
			return nextMonth;
		},
		setDateLabel: function () {
			var dateLabelCurrent = controller.getCurrentMonth().format('MMMM YYYY');
			var dateLabelNext = controller.getNextMonth().format('MMMM YYYY');
			controller.calendarTabs.find('li:first a').attr('title', dateLabelCurrent).text(dateLabelCurrent);
			controller.calendarTabs.find('li:last a').attr('title', dateLabelNext).text(dateLabelNext);
		},
		setImagePath: function () {
			// /calendars folder
			//  "calendar-MM-YYYY.png format"
			var imgCurrent = controller.getCurrentMonth().format('MM-YYYY');
			var imgNext = controller.getNextMonth().format('MM-YYYY');
			$('.tab-content:first img').attr('src', 'https://files.marcomcentral.app.pti.com/epsilon/calendars/calendar-' + imgCurrent + '.png');
			$('.tab-content:last img').attr('src', 'https://files.marcomcentral.app.pti.com/epsilon/calendars/calendar-' + imgNext + '.png');
		}
	};
	return {
		controller: controller
	};
})(jQuery);

dynamicCalendar.controller.init();
