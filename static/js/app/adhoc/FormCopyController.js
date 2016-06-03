/* FormCopy Controller
 * @NOTE - The On-Demand Marketing URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/catalog.aspx?uigroup_id=479602&folder_id=1633307
 *
 * @description - Loads templates with data from custom Adobe API.
 * @filename - FormCopyController.js
 * @author - Anthony Gill, John Smith : Epsilon 2016
 */
 var pageAnchor = '#ctl00_content_CtlAddToCart_InteractivityContainer_panelInteractivity';
 var pageKey = 'addToCart.aspx';

 ChooseTemplateController = (function ($) {
   'use strict';
   var controller = {
     intervalHandle: null,
     init: function () {
       var controller = this;
       controller.WatchForPageReady(function () {
         controller.AdjustUI();
       });
     },
     isPageReady: function () {
       return $(pageAnchor).length > 0;
     },
     WatchForPageReady: function (callback) {
       var controller = this;
       console.warn('Watching for: Page ready...');
       controller.intervalHandle = setInterval(function () {
         if (controller.isPageReady()) {
           clearInterval(controller.intervalHandle);
           callback();
         }
       }, 500);
     },
     AdjustUI: function () {
       console.warn('Adjusting UI...');
       $('.ButtonAddToCart.addToCartBtn > *').html('Send Immediately');
       // Change Add To Cart text on submit button to, 'Send Immediately'/
       $('td').filter(function() {
         $.trim($(this).html()) == '&nbsp;';
         $.trim($(this).html()) == '';
       }).remove();
     }
 	};
 	return {
 		controller: controller
 	};
 })(jQuery);

 // Only execute this controller on a certain page
 if (window.location.href.indexOf(pageKey) > -1) {
   var $j = jQuery;
  //  $j('#catalogContent').hide();
  //  $j('.js-loading').show();
 	ChooseTemplateController.controller.init();
 }
