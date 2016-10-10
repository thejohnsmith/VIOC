
siteCoreLibrary = new SiteCoreLibrary();

var OfferPageController = OfferPageController || (function ($) {
	'use strict';
	var controller = {

	    // ===========================================================================
	    // Variables
	    // ===========================================================================

	    offerData: null,
		storeData: [],
	    apiPath: marcomUserData.$constants.apiPath,
	    userId: marcomUserData.$user.externalId,
		expirationTypeSequenceMap : [	
			'Plus 15',
			'Plus 30',
			'Plus 45',
			'Plus 60',
			'Specific Date'
		],

	    // ===========================================================================
	    // Boot Methods
	    // ===========================================================================

	    init: function () {
	        var controller = this;
			programManagementFilters.controller.init();
	        siteCoreLibrary.init(function (error) {
				controller.loadRequestedOffer(function() {
					controller.populateUI();
					controller.attachEventListeners();
					controller.showUI();
				});
	        });
	    },
		
		loadRequestedOffer: function(callback) {
	        var controller = this;
			var offerId = getParameterByName('offerId', window.location.href);
			var storeNumber = getParameterByName('storeNumber', window.location.href);
			
			if ((offerId != "" && offerId != undefined) && (storeNumber != "" && storeNumber != undefined))
			{
				siteCoreLibrary.loadStores([storeNumber], function(err) { 
				
					if (err != null) {
						toastr.error("Unable to load offer for store number " + storeNumber);
						return 0; // End the script.
					}
					
					$.each(siteCoreLibrary.stores[0].offers, function(i, offer)
					{
						if (offer.id == offerId)
						{
							controller.offerData = offer;
						}
					});
					callback();
				});
			}
			else
			{
				callback();
			}
		},
		
		populateUI: function() {
			var controller = this;
			controller.setBreadcrumbs();
			controller.setFormChoices();
			controller.setCurrentOfferData();
			controller.setStoreList();
		},
		setBreadcrumbs: function() {
			$(".breadcrumbs_previous a").attr("href", marcomUserData.$constants.storePagesUrl);
		},
		
		setFormChoices: function() {
			var controller = this;

			// Build a distinct list of offers, keyed by name.
			var offerTypes = {}
			$.each(siteCoreLibrary.settings.OfferTypes, function(i, ot) {
				offerTypes[ot.name] = ot;
			});

			// Fill offer dropdown with a distinct list of offers, keyed by name.
			// Convert each name into a hash for easy/safer comparison later.
			$("#offerType").html();
			$.each(offerTypes, function(i, ot) {
				var opt = $("<option/>").html(ot.name).val(ot.id).attr('data-checksum', controller.hashCode(ot.name) );
				$("#offerType").append(opt);
			});
			
			// Build a distinct list of amount types, keyed by name
			var amountTypes = {};
			$.each(siteCoreLibrary.settings.AmountTypes, function(i, at) {
				amountTypes[at.name] = at;
			});
			
			// Fill Amount Type dropdown
			$("#offerAmountType").html();
			$.each(amountTypes, function(i, at) {
				var opt = $("<option/>").html(at.name).val(at.id).attr('data-checksum', controller.hashCode(at.name) );
				$("#offerAmountType").append(opt);
			});

			// Create the expiration choices:
			var simpleHtmlTemplate = '<label class="radio-default" for="ID"><input type="radio" id="ID" name="expiration-choice" data-checksum="CHECKSUM" data-label="NAME" value="ID">NAME EXP_INPUT</label>';
			$("#expiration-container").html();
			$.each(controller.expirationTypeSequenceMap, function(i, mapItem) {
				$.each(siteCoreLibrary.settings.ExpirationTypes, function(i2, et) {
					if (et.name == mapItem) {
						
						var content = simpleHtmlTemplate;
						content = content.replace(/ID/g,et.id);
						content = content.replace(/CHECKSUM/g,controller.hashCode(et.name));
						content = content.replace(/NAME/g,et.name);
						content = content.replace(/EXP_INPUT/g, (et.name == "Specific Date") ? '<input type="date" id="specificExpirationDate" value="">' : "");
						
						$("#expiration-container").append(content);
					}
				});
			});
			
		},
		
		setCurrentOfferData: function() {
			var controller = this;
			var offerData = controller.offerData;
			if (offerData == null) {
				$(".page-title, .breadcrumbs_current").html("Create Offer");
				return 0;
			}

			$(".page-title, .breadcrumbs_current").html("Edit " + offerData.code);
			$("#discountCode").val(offerData.code);
			$("#offerType option[data-checksum=" + controller.hashCode(offerData.offerType.name) + "]").prop('selected', true);
			$("#offerAmount").val(offerData.amount);
			$("#offerAmountType option[data-checksum=" + controller.hashCode(offerData.amountType.name) + "]").prop('selected', true);
			$("#expiration-container input:radio[data-checksum=" + controller.hashCode(offerData.expirationType.name) + "]").prop('checked', true);
			$("#specificExpirationDate").val(offerData.expirationDate.substring(0,10));
		},
		
		setStoreList: function() {
			$.get(controller.apiPath + 'getStoreProgramData.jssp?userId=' + encodeURIComponent(controller.userId) + '&programId=1', function (results) {

				var htmlTemplate = '';
				
				htmlTemplate += '<tr draggable="false" class="not-sortable-item filterable store-item" data-filter-storeid="ID" data-storeid="ID">';
				htmlTemplate += '<td class="list-item text-center store-name">';
				htmlTemplate += '<input type="checkbox" data-store-number="NUMBER" id="store-cb-ID"/> <label for="store-cb-ID">NAME (<span class="text-center store-number">Store #NUMBER</span>)</label></td></tr>';
				
				$("#storeDetail tbody").html('');
				
				$.each(results, function(i, r) {
					var row = htmlTemplate;

					row = row.replace(/ID/g, r.storeId);
					row = row.replace(/NAME/g, r.storeName);
					row = row.replace(/NUMBER/g, r.storeNumber);
					
					$("#storeDetail tbody").append(row);
				});
				
				// This area gets a little magical.  programManagementFilter.js wasn't built with proper encapulation,
				// so I'm hacking it's onFilterChange function to notify us when things change.
				programManagementFilters.controller.onFilterChangeOriginal = programManagementFilters.controller.onFilterChange;
				programManagementFilters.controller.onFilterChange = controller.onFilterChange;
				controller.onFilterChange(programManagementFilters.controller.store_ids);
			});
		},
		
		setOfferOwnership: function() {
			var storeList = [];
			var offerData = controller.offerData;
	
			// Build a list of stores to load
			$.each($("input:checkbox:visible"), function(i,cb) {
				storeList.push($(cb).attr('data-store-number'));
			});
			
			if (storeList.length == 0) return;

			$("input:checkbox:visible").attr("disabled", true);
			console.log("Loading " + storeList.length + " stores...");

			siteCoreLibrary.loadStores(storeList, function(err) { 
				
				$.each($("input:checkbox:visible"), function(i,cb) {
					var storeNumber = $(cb).attr('data-store-number');
					$.each(siteCoreLibrary.stores, function(i,s) {
						if (s.storeNumber == storeNumber) {
							$(cb).attr('data-store-guid', s.id);
							if (s.offers != undefined && offerData != null)
							{
								$.each(s.offers, function(i,o){ 
									if (o.id == offerData.id) {
										console.log("Store " + s.storeNumber + " has offer " + o.id);
										$(cb).prop('checked',true);
									}
								});
							}
						}
					});
				});
				// Reenable all checkboxes
				$("input:checkbox:visible").removeAttr("disabled");
			});
		},

	    attachEventListeners: function() {
	        var controller = this;
			
			$("#expiration-container input:radio[name=expiration-choice]").change(controller.onExpirationChoiceChange);
			$("#expiration-container input:radio[name=expiration-choice][checked]").trigger('change');
			$(".select-all").click(controller.onSelectAll);
			$(".offer-save-btn").click(controller.onSave);
			$(".offer-delete-btn").click(controller.onDelete);
			$(".offer-cancel-btn").click(controller.onCancel);

	    },

		showUI: function() {
			var controller = this;

			$('.js-content').fadeIn();
			$('.js-loading').hide();
		},

		// ===========================================================================
		// Helper Methods
		// ===========================================================================
		
		hashCode: function(s) {
		  var hash = 0, i, chr, len;
		  if (s.length === 0) return hash;
		  for (i = 0, len = s.length; i < len; i++) {
			chr   = s.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		  }
		  return hash;
		},
		
		isNumeric: function(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		
		isString: function(s, min, max) {
			if (s == undefined || s == null || typeof s != "string") return false;
			if (min != undefined && s.length < min) return false;
			if (max != undefined && s.length > max) return false;
			return true;
		},
		
		// ===========================================================================
		// Event Handlers
		// ===========================================================================

		onExpirationChoiceChange: function(e)
		{
			$("#specificExpirationDate").toggle(($(e.target).attr('data-label') == 'Specific Date'));
		},
		
		onSelectAll: function() {
			var visible_count = $("input:checkbox:visible").length;
			var checked_count = $("input:checkbox:visible:checked").length;
			$("input:checkbox:visible").prop('checked',(visible_count != checked_count));
		},
		
		onFilterChange: function(storeIds)
		{
			// Call the original functionality of the store filter
			programManagementFilters.controller.onFilterChangeOriginal(storeIds);
			
			// Do our custom add-on
			controller.setOfferOwnership();
		},
		
		onSave: function() 
		{
			var controller = OfferPageController.controller;
			var error = null;

			// ------------------------------------
			// Fill offerData and validate
			// ------------------------------------
			
			var saveData = {};

			// Set Name 
			saveData.name = $('#offerType option:selected').text();
			
			// Set ID
			if (controller.offerData != null)
				saveData.id = (controller.offerData.id);
				
			// Set/Validate Amount
			if (!controller.isNumeric(saveData.amount = $("input#offerAmount").val()))
				error = "Please provide a valid amount.";
		
			// Set Code
			if (!controller.isString(saveData.code = $("input#discountCode").val(), 3, undefined))
				error = "Please provide a valid discount code.";

			// Set ExpirationDate
			saveData.expirationDate = "0001-01-01T00:00:00";

			if ($("input[data-label='Specific Date']:checked").length > 0)
			{
				if (!controller.isString(saveData.expirationDate = $("input#specificExpirationDate").val(), 10, 10))
					error = "Please provide a valid expiration date.";
			}
			
			// Set OfferTypeId
			saveData.offerType = { "id" : $("#offerType").val() };
				
			// Set ExpirationTypeId
			var ExpirationTypeId = null;
			if (!controller.isString(ExpirationTypeId = $("input[name='expiration-choice']:checked").attr('id'), 30, 40))
				error = "Please select an expiration type.";
			
			saveData.expirationType = { "id" : ExpirationTypeId};
				
			// Set AmountTypeId
			saveData.amountType = { "id" : $("#offerAmountType").val()};
			
			// Set Stores
			saveData.stores = [];
			
			$.each($(".store-item input:checked"), function(i,cb) { 
				saveData.stores.push({ "id" : $(cb).attr('data-store-guid') });
			});
			
			if (saveData.stores.length == 0)	
				error = "Please select one or more stores to apply this offer code to.";

			if (error != null)
			{
				toastr.error(error);
				return 0;
			}

			// ------------------------------------
			// Perform Save
			// ------------------------------------
			
			$("button").prop('disabled',true);
			
			var method = (saveData.id != undefined) ? "modifyOffer" : "createOffer";
			
			siteCoreLibrary[method](saveData, function(err) { 
				toastr.success("Offer saved!  Returning to previous page...");
				setTimeout(function() { window.location.href = marcomUserData.$constants.storePagesUrl }, 2000);
			});
		},
		
		onDelete: function()
		{
			var controller = OfferPageController.controller;
			jConfirm("Are you sure you want to delete this offer?", "Please confirm", function(r) {
				if (r) {
					$("button").prop('disabled',true);
					siteCoreLibrary.deleteOffer(controller.offerData, function(err) { 
						toastr.success("Offer deleted!  Returning to previous page...");
						setTimeout(function() { window.location.href = marcomUserData.$constants.storePagesUrl }, 2000);
					});
				}
			});
		},
		
		onCancel: function() 
		{
			window.location.href = marcomUserData.$constants.storePagesUrl;
		}
	};
	return {
		controller: controller,
	};
})(jQuery);