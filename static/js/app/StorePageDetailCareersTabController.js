
var StorePageDetailCareersTabController = (function ($) {

	var controller = {

		// ===========================================================================
		// Variables
	    // ===========================================================================

	    isAdd: false,
        idEditing : null,
		showArchived: false,
		
		// None

		// ===========================================================================
		// Boot Methods
		// ===========================================================================

		init: function() {
			var controller = this;
			controller.populateUI(function () {
			    controller.attachEventListeners();
			    controller.showUI();
			    console.log("Tab Controller Init Complete!");
			});
		},

		populateUI: function(cb) {
		    // Build the HTML here, without event handling

		    siteCoreLibrary.retrieveStoreCareers([siteCoreLibrary.stores[0].storeNumber], function (careers) {
				
				// Remove careers that are archived if needed
				var data = careers;
				$.each(careers, function(i, c) {
					data[i].hide = (!controller.showArchived && c.isArchived);
				} );
				
				// Populate mustache template 
		        var template = $('#mustache-template').html();
		        var render = Mustache.render(template, {
		            rows: data
		        });
		        $('#mustacheTableHtml').html(render);
		        cb();
		    });
		},
		
		attachEventListeners: function() {
		    // Delegate user events to handler functions
			

		    $('.storeCareersShowAll').unbind().click(function () {
		        var id = $(this).attr('data-id');
		        controller.onShowArchived();
		    });
			
		    $('.archive-link').unbind().click(function () {
		        var id = $(this).attr('data-id');
		        controller.onChangeArchiveState(id);
		    });

		    $('.editbuttoncareers').unbind().click(function () {
		        var id = $(this).closest('tr').attr('data-id');
		        controller.onClickEditCareer(id);
		    });

		    $('.deletebuttoncareers').unbind().click(function () {
		        var id = $(this).closest('tr').attr('data-id');
		        controller.onClickDeleteCareer(id);
		    });

		    $('#buttonsavecareer').unbind().click(function () {
		        controller.onButtonSaveCareer();
		    });

		    $('#addcareerbutton').unbind().click(function () {
		        controller.onClickAddCareer();
		    });

		    $('#buttoncancelcareer').unbind().click(function () {
		        controller.onButtonCancelCareer();
		    });

		    $('#Templates').unbind().on('change', function () {
		        if ($(this).val() === 'Assistant Manager') {
		            $('#JobTitle').val('Assistant Manager');
		            $('#JobDescription').val('Your role is to help the service center manager keep the store running smoothly, and that guests (customers) are highly satisfied with their service. You will help run operations by assist with scheduling and staffing, enforcing company policy and procedure, monitoring inventory and reports, working with vendors, and more. Sound like you?');
		        }
		        else if ($(this).val() === 'Automotive Technician') {
		            $('#JobTitle').val('Automotive Technician');
		            $('#JobDescription').val('Do you like working with your hands, while working for a fun team? Your role as part of the Valvoline team is to perform high-quality oil changes and other preventative maintenance services to each guest (customer). ');
		        }
		        else if ($(this).val() === 'Customer Service Advisor') {
		            $('#JobTitle').val('Customer Service Advisor');
		            $('#JobDescription').val('Your role is to ensure each guest (customer) is highly satisfied with their service. You are the person who will greet, interact and make recommendations to the guest. Most importantly you must bring your smile to work everyday.');
		        }
		        else if ($(this).val() === 'Service Center Manager') {
		            $('#JobTitle').val('Service Center Manager');
		            $('#JobDescription').val('Your role is to lead your team to success by providing an excellent customer experience and high-quality work. You\'re responsible for managing a staff, enforcing company policy and procedure, training and coaching your team, delivering results and staying on track and on budget - all while demonstrating strong leadership and communication skills. Sound like you?');
		        }
		        else if ($(this).val() === 'Missouri State Inspector/Automotive Technician') {
		            $('#JobTitle').val('Missouri State Inspector/Automotive Technician');
		            $('#JobDescription').val('Do you like working with your hands, while working for a fun team?  Your role as part of the Valvoline team is to perform high-quality oil changes and other preventative maintenance services to each guest (customer).  In order to be qualified for this position, you must possess one of the following: current certification as a Missouri Safety Inspector, ASE certification in brakes and suspension/steering, completed an automotive mechanics course at a Technical/Vocational school (degree or certificate required) - or at least one year working in a Full Service Repair facility (working on brakes, inspections, and/or suspension repair).  If you do, then this opportunity is for YOU!');
		        }
		        else if ($(this).val() === 'Missouri State Inspector/Assistant Manager') {
		            $('#JobTitle').val('Missouri State Inspector/Assistant Manager');
		            $('#JobDescription').val('Your role is to help the service center manager keep the store running smoothly, and that guests (customers) are highly satisfied with their service. You will help run operations by assist with scheduling and staffing, enforcing company policy and procedure, monitoring inventory and reports, working with vendors, and more. Sound like you?  In order to be qualified for this position, you must possess one of the following: current certification as a Missouri Safety Inspector, ASE certification in brakes and suspension/steering, completed an automotive mechanics course at a Technical/Vocational school (degree or certificate required) - or at least one year working in a Full Service Repair facility (working on brakes, inspections, and/or suspension repair).  If you do, then this opportunity is for YOU!');
		        }
		    });
		},
		
		showUI: function() {
		    // Unhide the UI now that it is built and ready for interaction
		    $("#careersdiv").show();
		},
		
		// ===========================================================================
		// Event Handlers
	    // ===========================================================================

		onClickAddCareer: function () {
		    controller.isAdd = true;
		    $('#careerformbanner').html('Add Career');
		    $('#JobTitle').val('');
		    $('#JobDescription').val('');
		    $('#thelink').val('');
		    $('#emailto').val('');
		    $('#tellthevisitor').val('');
		},
		
		onClickEditCareer: function (id) {
		    
		    siteCoreLibrary.retrieveStoreCareers([siteCoreLibrary.stores[0].storeNumber], function (careers) {
		        $.each(careers, function (i, career) {
		            if (career.id === id) {

		                controller.isAdd = false;
		                controller.idEditing = id;

		                $('#JobTitle').val(career.title);
		                $('#JobDescription').val(career.description);

		                if (career.linkType == 'Web') {
		                    $('#optionsRadios1').prop('checked', true);
		                    $('#thelink').val(career.link);
		                }
		                else if (career.linkType == 'Email') {
		                    $('#optionsRadios2').prop('checked', true);
		                    $('#emailto').val(career.link);
		                }
		                else if (career.linkType == 'Store') {
		                    $('#optionsRadios3').prop('checked', true);
		                    $('#tellthevisitor').val(career.link);
		                }

		                $('#careerformbanner').html('Edit Career');
		                $('#collapseCareersForms').show();
		            }
		        });
		    });
		    
		},

		onClickDeleteCareer: function (id) {
		    jConfirm("Are you sure you want to delete this career?", "Please confirm", function(r) {
		        if (r) {
		            siteCoreLibrary.retrieveStoreCareers([siteCoreLibrary.stores[0].storeNumber], function (careers) {
		                $.each(careers, function (i, career) {
		                    if (career.id === id) {
		                        var careerItemToDelete = {};
		                        careerItemToDelete.id = id; 
		                        siteCoreLibrary.deleteCareer(careerItemToDelete, function (err, data) {
		                            toastr.success("Career deleted!");
		                            setTimeout(function () {
		                                controller.populateUI(function () {
		                                    controller.attachEventListeners();
		                                });
		                            }, 1000);

		                        });
		                    }
		                });
		            });
		        }
		    });
		},

		onButtonSaveCareer() {

		    var careerItem = {};
		    careerItem.title = $('#JobTitle').val();
		    careerItem.name = $("#JobTitle").val();
		    careerItem.description = $('#JobDescription').val();

		    if ($("#optionsRadios1").is(':checked')) {
		        careerItem.linkType = 'http://';
		        careerItem.link = $('#thelink').val();
		    }
		    else if ($("#optionsRadios2").is(':checked')) {
		        careerItem.linkType = 'Email';
		        careerItem.link = $('#emailto').val();
		    }
		    else if ($("#optionsRadios3").is(':checked')) {
		        careerItem.linkType = 'Store';
		        careerItem.link = $('#tellthevisitor').val();
		    }

		    if (controller.isAdd == true) {
		        careerItem.storeid = "{" + siteCoreLibrary.stores[0].id + "}";
		        siteCoreLibrary.createCareer(careerItem, function (err, data) {
		            controller.populateUI(function () {
		                controller.attachEventListeners();

		                $('#JobTitle').val('');
		                $('#JobDescription').val('');
		                $('#thelink').val('');
		                $('#emailto').val('');
		                $('#tellthevisitor').val('');

		                $('#collapseCareersForms').hide();
		            });
		        });
		    }
		    else if (controller.isAdd == false) {
		        careerItem.id = controller.idEditing;

		        siteCoreLibrary.modifyCareer(careerItem, function (err, data) {
		            controller.populateUI(function () {
		                controller.attachEventListeners();

		                $('#JobTitle').val('');
		                $('#JobDescription').val('');
		                $('#thelink').val('');
		                $('#emailto').val('');
		                $('#tellthevisitor').val('');

		                $('#collapseCareersForms').hide();
		            });
		        });
		    }
		},

		onButtonCancelCareer() {
		    window.location.href = marcomUserData.$constants.storePagesUrl;
		},
		
		onShowArchived() { 
			var controller = this;
			controller.showArchived = true;
			controller.populateUI(function() {
				controller.attachEventListeners();
			});
		},
		
		onChangeArchiveState(careerId) {
			var controller = this;
			console.log("Changing career id: " + careerId);
			// Find the career 
			var career = null;
			var careerIndex = null;
			siteCoreLibrary.retrieveStoreCareers([siteCoreLibrary.stores[0].storeNumber], function (careers) {
			    $.each(careers, function (i, c) {
			        if (c.id == careerId)
			            career = c;
			        careerIndex = i;
			    });

			    if (career != null) {
			        if (career.isArchived) {
			            career.isArchived = false;
			            siteCoreLibrary.unarchiveCareer(career, function (err, data) {
			                //siteCoreLibrary.stores[0].careers[careerIndex].isArchived = (!career.isArchived);
			                controller.populateUI(function () {
			                    controller.attachEventListeners();
			                });
			            });
			        } else {
			            career.isArchived = true;
			            siteCoreLibrary.archiveCareer(career, function (err, data) {
			                controller.populateUI(function () {
			                    controller.attachEventListeners();
			                });
			            });
			        }
			    }
			});
		}
	};

	return {
		controller: controller,
	};
})(jQuery);

StorePageDetailController.controller.postInitCallbacks.push(
	function() { StorePageDetailCareersTabController.controller.init() } 
);
