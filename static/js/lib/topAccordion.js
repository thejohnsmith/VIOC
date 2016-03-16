var topAccordion = new function ($) {
	var $topAccordionComponent = $('#top-accordian'),
		init = function () {
			if (!$topAccordionComponent.length) {
				return;
			}
			return handlers();
		},
		handlers = function clickHandlers() {
			$topAccordionComponent.find('.accordion-title').on('click', function (event) {

				// stop browser to take action for clicked anchor
				event.preventDefault();

				if (!$(this).next().is(':visible')) {
					// close all
					$('#top-accordian .accordion-title').removeClass('active');
					$('#top-accordian .accordion-content').slideUp();

					// open
					$(this).next().slideDown();
					$(this).addClass('active');

				} else {

					// current close, only one
					$(this).next().slideUp();
					$('#top-accordian .accordion-title').removeClass('active');
				}
			});
		};
	return {
		init: init
	};

}(jQuery);

topAccordion.init();
