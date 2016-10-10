
var StorePageDetailFeaturesController = (function ($) {

	var controller = {

		// ===========================================================================
		// Variables
		// ===========================================================================
		
		uploadedImageId : null,

		// ===========================================================================
		// Boot Methods
		// ===========================================================================

		init: function() {
			var controller = this;
			controller.populateUI();
			controller.attachEventListeners();
			controller.showUI();
			console.log("Features Controller Init Complete!");
		},

		populateUI: function() {
			// Build the HTML here, without event handling
			var controller = this;
			controller.populateFeatures();
		},

		populateFeatures: function() {
			var controller = this;
			var template = $(".store-feature-template").html();

			// ------------------------------------
			// Populate available features
			// ------------------------------------
			
			var $target = $(".available-feature-container");
			$target.html('');
			
			$.each(siteCoreLibrary.settings.Features, function(i, feature) {
				
				// Verify the feature isn't active within the current store 
				var currentlyActive = false;
				if (siteCoreLibrary.stores[0].features != undefined && siteCoreLibrary.stores[0].features.length > 0)
				{
					$.each(siteCoreLibrary.stores[0].features, function(i,storeFeature) {
						if (storeFeature.id == feature.id)
							currentlyActive = true;
					});
				}
				
				if (currentlyActive) return;

				var data = {
					"featureId" : feature.id,
					"featureName" : feature.name,
					"checkedState": false,				
					"featureTitle": feature.name,
					"featureImgSource": feature.image.url,
					"sortable": false,
					"custom": false
				};
				$target.append(Mustache.render(template, data));
			});
			
			// ------------------------------------
			// Populate features used on the store
			// ------------------------------------
			
			var $target = $(".active-feature-container");
			$target.html('');
			
			if (siteCoreLibrary.stores[0].features != undefined && siteCoreLibrary.stores[0].features.length > 0)
			{
				$.each(siteCoreLibrary.stores[0].features, function(i,feature) {
					var data = {
						"featureId" : feature.id,
						"featureName" : feature.name,
						"checkedState": true,				
						"featureTitle": feature.name,
						"featureImgSource": feature.image.url,
						"sortable": true,
						"custom": true
					};
					$target.append(Mustache.render(template, data));
				});
			}
			
			// ------------------------------------
			// Attach listeners to dynamically generated objects
			// ------------------------------------
			
			$(".feature-checkbox").change(controller.onChangeFeatureState);
			dragula([$(".active-feature-container")[0]]).on('drop', function(el) { controller.onDragEnd(el) } );
		},
		
		attachEventListeners: function() {
			var controller = this;
			$("#addFeatureButton").click(function(e) { controller.onShowCreateFeatureForm(e) } );
			$("#save-feature").click(function(e) { controller.onCreateFeature(e) });

		    $('.feature-icon-upload-file-input').change(function () { $('#feature-image-upload-form').submit(); });
		    $("#feature-image-upload-form").submit(function (event) { controller.onUploadImage(event); });
			
		},
		
		showUI: function() {
			// Unhide the UI now that it is built and ready for interaction
		},
		
		// ===========================================================================
		// Helper Methods
		// ===========================================================================
		
		findSettingFeatureById: function(id) {
			var result = null;
			$.each(siteCoreLibrary.settings.Features, function(i, feature) {
				if (feature.id == id)
					result = feature;
			});
			return result;
		},

		findStoreFeatureById: function(id) {
			var result = null;
			if (siteCoreLibrary.stores[0].features != undefined && siteCoreLibrary.stores[0].features.length > 0)
			{
				$.each(siteCoreLibrary.stores[0].features, function(i,feature) {
					if (feature.id == id)
						result = feature;
				});
			}
			return result;
		},

		findStoreFeatureIndexById: function(id) {
			var result = null;
			if (siteCoreLibrary.stores[0].features != undefined && siteCoreLibrary.stores[0].features.length > 0)
			{
				$.each(siteCoreLibrary.stores[0].features, function(i,feature) {
					if (feature.id == id)
						result = i;
				});
			}
			return result;
		},
		
		// ===========================================================================
		// Event Handlers
		// ===========================================================================

		onShowCreateFeatureForm: function(e) {
			$(".feature-create-container").removeClass("none");
		},
		
		onChangeFeatureState: function(e) {
			var controller = StorePageDetailFeaturesController.controller;
			var featureId = $(e.target).attr('data-id');
			var becomingActive = $(e.target).prop('checked'); //Note: This is it's state AFTER being changed.
			
			var finishUp = function() {
				
			};

			if (becomingActive)
			{
				// Move the item into the store
				if (siteCoreLibrary.stores[0].features == undefined)
						siteCoreLibrary.stores[0].features = [];
				
				if (siteCoreLibrary.stores[0].features.length >= 6)
				{
					toastr.error("No more than 6 features may be selected.");
					e.preventDefault();
					e.stopPropagation();
					$(e.target).prop('checked', false);
					return false;
				}
				
				siteCoreLibrary.stores[0].features.push(controller.findSettingFeatureById(featureId));
			}
			else // Becoming inactive...
			{
				// Move the item out of the store
				var index = null;

				if ((index = controller.findStoreFeatureIndexById(featureId)) != null)
				{
					siteCoreLibrary.stores[0].features.splice(index,1); 
				}
			}
			
			StorePageDetailFeaturesController.controller.populateFeatures();
			
			controller.onSave();
		},
		
		onDragEnd: function(el) { 
			var controller = this;

			var newFeatures = [];
			var deduplicator = [];

			$.each($(".active-feature-container div"), function(i,div) {
				var id = $(div).attr('id');
				$.each(siteCoreLibrary.stores[0].features, function(i, currentFeature) {
					if (id == currentFeature.id && $.inArray(id, deduplicator) == -1)
					{
						newFeatures.push(currentFeature);
						deduplicator.push(id);
						return;
					}
				});
			} );

			siteCoreLibrary.stores[0].features = newFeatures;
			
			controller.onSave();
		},
		
		onEditFeature: function(e) {
			// :TODO: When you choose to edit a custom feature, the create feature form should switch to edit mode.
		},
		
		onDeleteCustomFeature: function(e) {
			// :TODO: When you delete a custom image, it should jConfirm() first, then perform the delete.
			// Then refresh the page.
		},
		
		resetFeatureUploadImage: function() {
		    $(".feature-media-icon").attr("src", "https://placeholdit.imgix.net/~text?txtsize=24&txt=Loading...&w=60&h=40");
		},
		
		onUploadImage: function(event) {

		    var controller = this;
		    event.preventDefault();

			$("input[name='StoreNumber']").val(siteCoreLibrary.stores[0].storeNumber);
			$("input[name='ImageType']").val("feature_" + Date.now().toString());
			
			controller.resetFeatureUploadImage();

		    siteCoreLibrary.addStoreImage(new FormData($('#feature-image-upload-form')[0]), function (err, data) {
		        controller.uploadedImageId = data.results.id;
		        $(".feature-media-icon").attr("src", data.results.url);
		    });
		},
		
		onSave: function() {
			// :TODO: When a new feature is saved, it sohuld be added to the end siteCoreLibrary.stores[0].features
			// Then reload the page.
			siteCoreLibrary.save(function(err) {
				if (typeof err == 'string') {
					toastr.error("Error during save: " + err);
				}
				else
				{
					toastr.success("Feature change saved!");
				}
			});
		},
		
		onCreateFeature: function() {
			
			var controller = this;
			var newFeature = { 
				"isCustom" : true, 
				"image" : { 
					"id" : null
				},
				"storeId" : siteCoreLibrary.stores[0].id
			};
			var error = null;
			
			if (siteCoreLibrary.stores[0].features.length >= 6)
				error = "A store is limited to 6 features.  Please uncheck one before proceeding.";
			
			if ((newFeature.name = $('#feature-name').val()) == "")
				error = "Please provide a name for your new feature.";
			
			if ((newFeature.image.id = controller.uploadedImageId) == null)
				error = "Please upload a feature icon.";
			
			if (error != null)
			{
				toastr.error(error);
				return false;
			}
			
			siteCoreLibrary.createFeature(newFeature, function(err, data) {
				debugger;
				if (typeof err == 'string')
				{
					toastr.error(err)
				}
				else
				{
					toastr.success("New Feature Created!");
					siteCoreLibrary.stores[0].features.push(data.results);
					controller.populateFeatures();
					 $("html, body").animate({ scrollTop: 0 }, "slow");
					$(".feature-create-container").addClass("none");
					$('#feature-name').val('');
					controller.uploadedImageId = null;
					controller.resetFeatureUploadImage();
				}
			} );
			
		}
		
	};

	return {
		controller: controller,
	};
})(jQuery);

StorePageDetailController.controller.postInitCallbacks.push(
	function() { StorePageDetailFeaturesController.controller.init() } 
);
