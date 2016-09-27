
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
		
			$(".breadcrumbs_previous").attr("href", marcomUserData.$constants.storePagesUrl);
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
			if (offerData == null) return 0;
			
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
			
			$.each($("input:checkbox:visible"), function(i,cb) {
				var storeNumber = $(cb).attr('data-store-number');
				var alreadyLoaded = false;
				
				$.each(siteCoreLibrary.stores, function(i,s) {
					if (s.storeNumber == storeNumber)
						alreadyLoaded = true;
				});

				if (!alreadyLoaded)
				{
					storeList.push(storeNumber);
					$(cb).attr("disabled", true);
				}
			});
			
			siteCoreLibrary.loadStores(storeList, function(err) { 
				$.each($("input:checkbox:visible"), function(i,cb) {
					if ($(cb).attr('data-state-loaded') != '1') {
						var storeNumber = $(cb).attr('data-store-number');
						$.each(siteCoreLibrary.stores, function(i,s) {
							if (s.storeNumber == storeNumber && s.offers != undefined) {
								$.each(s.offers, function(i,o){ 
									if (o.id == offerData.id) {
										console.log("Store " + s.storeNumber + " has offer " + o.id);
										$(cb).prop('checked',true);
									}
								});
							}
						});
						$(cb).attr('data-state-loaded', '1');
					}
					
					$(cb).removeAttr("disabled");
				});
			
			});
		},

	    attachEventListeners: function() {
	        var controller = this;
			
			$("#expiration-container input:radio[name=expiration-choice]").change(controller.onExpirationChoiceChange);
			$("#expiration-container input:radio[name=expiration-choice][checked]").trigger('change');
			$(".select-all").click(controller.onSelectAll);

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
		}
	};
	return {
		controller: controller,
	};
})(jQuery);

OfferPageController.controller.init()