
var StorePageDetailCareersTabController = (function ($) {

	var controller = {

		// ===========================================================================
		// Variables
		// ===========================================================================
		
		// None

		// ===========================================================================
		// Boot Methods
		// ===========================================================================

		init: function() {
			var controller = this;
			controller.populateUI();
			controller.attachEventListeners();
			controller.showUI();
			console.log("Tab Controller Init Complete!");
		},

		populateUI: function() {
		    // Build the HTML here, without event handling

		    var template = $('#mustache-template').html();
		    $('#moustacheTableHtml').append(Mustache.render(template, {
		        rows: siteCoreLibrary.stores[0].careers
		    }));
		},
		
		attachEventListeners: function() {
		    // Delegate user events to handler functions

		    $('.editbutton').click(function () {
		        var id = $(this).closest('tr').attr('data-id');
		        controller.onClickEditCareer(id);
		    });

		    $('.deletebutton').click(function () {
		        var id = $(this).closest('tr').attr('data-id');
		        controller.onClickDeleteCareer(id);
		    });
		},
		
		showUI: function() {
		    // Unhide the UI now that it is built and ready for interaction
		    $("#careersdiv").show();
		},
		
		// ===========================================================================
		// Event Handlers
		// ===========================================================================
		
		onClickEditCareer: function (id) {
		    var self = this;
		    alert(id);
		},

		onClickDeleteCareer: function (id) {
		    $.each(siteCoreLibrary.stores[0].careers, function (i, career) {
		        if (career.id === id) {
		            siteCoreLibrary.stores[0].careers.splice(i, 1);

		            siteCoreLibrary.save(function (progress) { }, function () { controller.populateUI(); });
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
