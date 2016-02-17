var topAccordion = new function($) {
  var $topAccordionComponent = $('#top-accordian'),
    init = function() {
      if (!$topAccordionComponent.length) {
        return;
      }
      return handlers();
    },
    handlers = function clickHandlers() {
      $topAccordionComponent.find('.accordion-title').on('click', function(
        event) {
        event.preventDefault(); //stop browser to take action for clicked anchor
        if (!$(this).next().is(':visible')) {
          $('#top-accordian .accordion-title').removeClass('active'); // close all
          $('#top-accordian .accordion-content').slideUp(); // close all
          $(this).next().slideDown(); //open`
          $(this).addClass('active');
        } else {
          $(this).next().slideUp(); //current close // only one
          $('#top-accordian .accordion-title').removeClass('active');
        }
      });
    };

  return {
    init: init
  };

}(jQuery);

topAccordion.init();
