var navTabs = new function ($) {
	var $navTabsComponent = $('.nav-tabs'),
		init = function () {
			if (!$navTabsComponent.length) {
				return;
			}
			return handlers();
		},
		handlers = function clickHandlers() {
			$navTabsComponent.find('a').on('click', function (event) {
				// stop browser to take action for clicked anchor
				event.preventDefault();

				// get displaying tab content jQuery selector
				var active_tab_selector = $('.nav-tabs > .active > a').attr('href');

				// find actived navigation and remove 'active' css
				var actived_nav = $('.nav-tabs > .active');
				actived_nav.removeClass('active');

				// add 'active' css into clicked navigation
				$(this).parents('li').addClass('active');

				// hide displaying tab content
				$(active_tab_selector).removeClass('active');
				$(active_tab_selector).addClass('hide');

				// show target tab content
				var target_tab_selector = $(this).attr('href');
				$(target_tab_selector).removeClass('hide');
				$(target_tab_selector).addClass('active');
			});
		};

	return {
		init: init
	};

}(jQuery);

navTabs.init();
