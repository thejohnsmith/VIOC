// $(document).ready(function () {
//     var b = "";
//     var e = ["555", "123", "4567"];
//     var d = "Email Address";
//     var c = "ZIP Code";
//     var a = "Mobile Number";
//     // @Example
//     // https://adobe-prod-vioc.epsilon.com/jssp/vioc/facebookSignUp.jssp?email=foo&zip=01234
//     // apiPath: 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/',
//     $("#email").focus(function () {
//         var f = $(this);
//         if(f.val() == b) {
//             f.val("")
//         }
//     });
//     $("#email").blur(function () {
//         var f = $(this);
//         if(f.val() == "") {
//             f.val(b)
//         }
//     });
//     $(".first-sms").focus(function () {
//         var f = $(this);
//         if(f.val() == e[0]) {
//             f.val("")
//         }
//     });
//     $(".first-sms").blur(function () {
//         var f = $(this);
//         if(f.val() == "") {
//             f.val(e[0])
//         }
//     });
//     $(".second-sms").focus(function () {
//         var f = $(this);
//         if(f.val() == e[1]) {
//             f.val("")
//         }
//     });
//     $(".second-sms").blur(function () {
//         var f = $(this);
//         if(f.val() == "") {
//             f.val(e[1])
//         }
//     });
//     $(".third-sms").focus(function () {
//         var f = $(this);
//         if(f.val() == e[2]) {
//             f.val("")
//         }
//     });
//     $(".third-sms").blur(function () {
//         var f = $(this);
//         if(f.val() == "") {
//             f.val(e[2])
//         }
//     });
//     $(".email-input").focus(function () {
//         var f = $(this);
//         if(f.val() == d) {
//             f.val("")
//         }
//     });
//     $(".email-input").blur(function () {
//         var f = $(this);
//         if(f.val() == "") {
//             f.val(d)
//         }
//     });
//     $(".zip-input").focus(function () {
//         var f = $(this);
//         if(f.val() == c) {
//             f.val("")
//         }
//     });
//     $(".zip-input").blur(function () {
//         var f = $(this);
//         if(f.val() == "") {
//             f.val(c)
//         }
//     });
//     $(".mobile-input").focus(function () {
//         var f = $(this);
//         if(f.val() == a) {
//             f.val("")
//         }
//     });
//     $(".mobile-input").blur(function () {
//         var f = $(this);
//         if(f.val() == "") {
//             f.val(a)
//         }
//     });
//     $("#carecare-optin .email-box input").keypress(function (h) {
//         if(h.which == 13) {
//             var g = $("#carecare-optin #currentlyProcessing").attr("value");
//             if(g == "false") {
//                 $("#carecare-optin #currentlyProcessing").attr("value", "true");
//                 $("#carecare-optin #optin-message>p").html("Submitting...<br />");
//                 $("#carecare-optin .email-box").css("display", "none");
//                 $("#carecare-optin .submit").css("display", "none");
//                 $("#carecare-optin #optin-message").css("display", "block");
//                 var f = $("#carecare-optin #email").val();
//                 submitEmail(f, "");
//                 return false
//             } else {
//                 return false
//             }
//         }
//     });
//     $("#carecare-optin .submit").click(function (h) {
//         var g = $("#carecare-optin #currentlyProcessing").attr("value");
//
//             console.warn('effing g: ' +g);
//
//         if(g == "false") {
//             $("#carecare-optin #currentlyProcessing").attr("value", "true");
//             $("#carecare-optin #optin-message>p").html("Submitting...<br />");
//             $("#carecare-optin .email-box").css("display", "none");
//             $("#carecare-optin .submit").css("display", "none");
//             $("#carecare-optin #optin-message").css("display", "block");
//             var f = $("#carecare-optin #email").val();
//             submitEmail(f, "");
//             return false
//         } else {
//             return false
//         }
//     })
// });
//
// function submitEmail(a, b) {
//     // @Example
//     // https://adobe-prod-vioc.epsilon.com/jssp/vioc/facebookSignUp.jssp?email=foo&zip=01234
//     var apiPath = 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/facebookSignUp.jssp';
// 		$.ajax({
// 			url: apiPath,
// 			type: 'GET',
// 			contentType: 'application/json',
// 			processData: true,
// 			data: {
// 				email: a,
// 				zip: b
// 			},
// 			headers: {
// 				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
// 			},
//       success: function (a) {
//         console.log('Save was successful!: ' + a);
//         // parseData(a);
//       },
//       error: function (c, e, d) {}
// 		});
// }
// // function submitEmail(a, b) {
// //   b = 01234;
// //     $.ajax({
// //         url: 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/',
// //         type: 'GET',
// //         headers: {
// //           'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
// //         },
// //         data: "email" + a + "&zip=" + b,
// //         processData: true,
// //         contentType: 'application/json',
// //         error: function (c, e, d) {}
// //     });
// // }
// //
// // Original
// // function submitEmail(a, b) {
// //     $.ajax({
// //         url: apiPath,
// //         data: "&email=" + a + "&zipcode=" + b + "&reason=email&source=coupons.vioc.com&function=parseData",
// //         type: "POST",
// //         dataType: "jsonp",
// //         error: function (c, e, d) {}
// //     })
// // }
// function parseData(a) {
//     if((a != null) && (a.response.success == "true")) {
//         $("#carecare-optin #optin-message>p").html("Thank You! Your address has been submitted.");
//         $("#carecare-optin #optin-form #carecare-optin-text").attr("value", "Enter email address");
//         $("#carecare-optin #optin-message").css("display", "block")
//     } else {
//         alert(a.response.message);
//         $("#carecare-optin #optin-message>p").html("Please try again.<br />");
//         $("#carecare-optin #optin-message").css("display", "block");
//         $("#carecare-optin .email-box").css("display", "block");
//         $("#carecare-optin .submit").css("display", "block");
//         $("#carecare-optin #currentlyProcessing").attr("value", "false")
//     }
// };
