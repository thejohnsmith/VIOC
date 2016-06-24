$(document).ready(function() {

  'use strict'

  var discountCodeInfoClosed = true;

   $('.closed').hide();

   $('.discountCodeLink').on('click', function(event) {
    event.preventDefault();
    showDiscountCodeInfo();
   });

  function showDiscountCodeInfo() {
    if(discountCodeInfoClosed === true) {
      discountCodeInfoClosed = false;
      $('.closed').show('slideDown');
    } else {
      discountCodeInfoClosed = true;
      $('.closed').hide('slideUp');
    }
  }
});