 $(window).load(function() {
   jQuery("body").css('opacity', '1');
 });

 jQuery(document).ready(function() {
   //  jQuery(".selectbox").selectbox({
   //    hide_duplicate_option: true
   //  });
   jQuery('.enumenu_ul').responsiveMenu({
     'menuIcon_text': '',
     onMenuopen: function() {}
   });
 });
 $(document).ready(function() {
   $('.next').on('click', function() {
     if ($('.nav').find('.active').next().length == 0) {
       $('.nav').find('li').first().find('a').trigger('click');
     } else {
       $('.nav').find('.active').next().find('a').trigger('click');
     }
   });
 });

 /* Removed init and placed into easyResponsiveTabs.js */
 // $(document).ready(function() {
 //   //Horizontal Tab
 //   $('#parentHorizontalTab').easyResponsiveTabs({
 //     type: 'default', //Types: default, vertical, accordion
 //     width: 'auto', //auto or any width like 600px
 //     fit: true, // 100% fit in a container
 //     tabidentify: 'hor_1', // The tab groups identifier
 //     activate: function(event) { // Callback function if tab is switched
 //       var $tab = $(this);
 //       var $info = $('#nested-tabInfo');
 //       var $name = $('span', $info);
 //       $name.text($tab.text());
 //       $info.show();
 //     }
 //   });
 // });

 $(document).ready(function() {
   jQuery('.mobie-details1').on('click', function(event) {
     jQuery('.mobile-info1').toggle('show');
   });
   jQuery('.mobie-details2').on('click', function(event) {
     jQuery('.mobile-info2').toggle('show');
   });
   jQuery('.mobie-details3').on('click', function(event) {
     jQuery('.mobile-info3').toggle('show');
   });
   $('#top-accordian .accordion-title').click(function(e) {
     e.preventDefault();
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
 });

 $(document).ready(function() {
   $('input,textarea').placeholder();
   $("input[name='phone']").keypress(function(e) {
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
       //display error message
       return false;
     }
   });
   $("input[name='lphone']").keypress(function(e) {
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
       //display error message
       return false;
     }
   });

   $("#contact-form-main").validate({
     ignore: [],
     rules: {
       name: {
         required: true
       },
       email: {
         required: true,
         email: true
       },
       phone: {
         required: true
       },
       message: {
         required: true
       }
     },
     errorClass: 'error',
     validClass: 'valid',
     errorElement: 'div',
     highlight: function(element, errorClass, validClass) {
       $(element).addClass(errorClass).removeClass(validClass);
     },
     unhighlight: function(element, errorClass, validClass) {
       $(element).removeClass(errorClass).addClass(validClass);
     },
     /*messages:{
     	fname:{ required: "plese mesage"},
     },*/
     errorPlacement: function(error, element) {
       //error.insertAfter(element);
     },
     submitHandler: function(form) { // for demo
       $('#contact-form-main .successmsg').fadeIn();
       setTimeout(function() {
         $('#contact-form-main .successmsg').fadeOut();
         $('#contact-form-main #result').fadeOut();
         $('#contact-form-main')[0].reset();
         $(".valid").each(function() {
           $(this).removeClass("valid")
         })
       }, 3000)
       return false;
     }

   });

   $('.contact-form-main .input-main input').on('blur', function() {
     $("#contact-form-main").validate().element(this);
   });

   $("#submit-btn").click(function() {
     setTimeout(function() {
       $("form#contact-form-main input.error").first().focus();
     }, 50)
   });

  if ($('.last-service-date').length) {
    $( "#from" ).datepicker({
      showOn: "button",
      buttonImage: "images/calendar.gif",
      buttonImageOnly: true,
      buttonText: "Select date",
      //defaultDate: "+1w",
      minDate: 0, 
      maxDate: "+1Y",
      onClose: function( selectedDate ) {
        $( "#to" ).datepicker( "option", "minDate", selectedDate );
      }
    });
    $( "#to" ).datepicker({
      showOn: "button",
      buttonImage: "images/calendar.gif",
      buttonImageOnly: true,
      buttonText: "Select date",
      minDate: 0, 
      maxDate: "+1Y",
      onClose: function( selectedDate ) {
        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
      }
    });
  }

  if ($('#jstree').length) {
    $('#jstree').jstree({'plugins':["wholerow","checkbox"]});
    // 7 bind to events triggered on the tree
    $('#jstree').on("changed.jstree", function (e, data) {
      console.log(data.selected);
    });
            
    $('#root_node_1').on('click', function () {
      $('#jstree').jstree(true).select_node('child_node_1');
      $('#jstree').jstree('select_node', 'child_node_1');
      $.jstree.reference('#jstree').select_node('child_node_1');
    });
    $('#root_node_2').on('click', function () {
      $('#jstree').jstree(true).select_node('child_node_2');
      $('#jstree').jstree('select_node', 'child_node_2');
      $.jstree.reference('#jstree').select_node('child_node_2');
    });

  }

  // Parse URL parameters from the query
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  var userExternalId = getParameterByName('userExternalId'); 
  var productExternalId = getParameterByName('productExternalId'); 
  var returnUrl = getParameterByName('returnUrl'); 

  console.log('userExternalId: ' + userExternalId);
  console.log('productExternalId: ' + productExternalId);
  console.log('returnUrl: ' + returnUrl);

  // AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      console.log('response from ajax: ' + xhttp.responseText);
    }
  };
  xhttp.open("GET", "data/getStoreSummary.jssp", true);
  xhttp.send();

});

