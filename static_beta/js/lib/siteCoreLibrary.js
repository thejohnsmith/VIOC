

var SiteCoreLibrary = (function () {
    function SiteCoreLibrary($) {
        this.settings = {
            'Services': [],
            'Features': [],
            'Careers': [],
            'Holidays': [],
            'ExpirationTypes': [],
            'AmountTypes': [],
            'OfferTypes': [],
            'FeatureIcons': [],
            'Status': []
        };
        this.stores = [];
        this._storesOriginal = [];
        /**
         * Initializes the SiteCoreLibrary by contacting SiteCore.  During init, it will:
         * - Pull down all Settings from SiteCore.
         * - Call back upon completion.
         *
         * @param {requestCallback} cb - A callback that triggers upon completion.  Provides 1 parameter: "error" (false or string)
         */
        this.init = function (cb) {
            var self = this;
            // :TODO: Call SiteCore at ~/sitecore/services/Settings endpoint and store the results in this.settings.
            // Trigger the callback
            jQuery.get( "https://vioc.d.epsilon.com/storeapi/settings.ashx", function(data) {   // :FEEDBACK: Move this path to a global constant / property
                self.settings.Services = data.results.services;
                self.settings.Features = data.results.features;
                self.settings.Careers = data.results.careers;
                self.settings.Holidays = data.results.holidays;
                self.settings.ExpirationTypes = data.results.expirationTypes;
                self.settings.AmountTypes = data.results.amountTypes;
                self.settings.OfferTypes = data.results.offerTypes;
                self.settings.FeatureIcons = data.results.featureIcons;
                self.settings.Status = data.status;
        
                //console.log(data);
                //console.log(self.settings);
                console.log("Init complete!");
                cb(null);
            });
        };
        /**
         * Retrieves store information from the SiteCore API and stores it in memory.
         *
         * Developer Note: When pulling data, write it to both this.stores and this._storesOriginal;
         *
         * @param {array} stores - An array of store numbers.  e.g. ["AB001", "AB002"], etc.  See LU_STORE_LV.@STORE_NUMBER for examples.
         * @param {function} callback - A callback that triggers upon completion.  Provides 1 parameter: "error" (false or string)
         */
        this.loadStores = function (stores, cb) 
        { 
            var self = this;
            
            var ajajCallsRemaining  = stores.length;
            
            for (var i = 0; i < stores.length; i++) { 
                jQuery.get( "https://vioc.d.epsilon.com/storeapi/storequery.ashx?id=" + stores[i] + "&Fields=ALL", function(data) {
                
				  self._processStoreQueryResponse(data);
                  
                  --ajajCallsRemaining;
                  if (ajajCallsRemaining <= 0) {
					  if (typeof cb == "function")
						cb(null);
                  }
                });      
            }; 
        };
		
		this._processStoreQueryResponse = function(data) {
			
            var self = this;
			
			for (var idx in data.results)
			{
				var newStore = data.results[idx];
				var alreadyExists = false;
				for (var idx2 in self.stores)
				{
					var existingStore = self.stores[idx2];
					if (newStore.id == existingStore.id)
						alreadyExists = true;
				};

				if (!alreadyExists) {
				  self.stores.push(JSON.parse(JSON.stringify(newStore)));
				  self._storesOriginal.push(JSON.parse(JSON.stringify(newStore)));
				}
			};
			
				  
		},
        /**  
        };
        /**
         * Retrieves store information from the SiteCore API and stores it in memory.
         *
         * @param {string} companyCode - A 3-4 character company code.  See LU_STORE_LV.@STORE_companyCode for examples.
         * @param {function} callback - A callback that triggers upon completion.  Provides 1 parameter: "error" (false or string)
         */
        this.loadStoresByFranchise = function (companyCode, cb) 
        { 
          var self = this;
          
          jQuery.get( "https://vioc.d.epsilon.com/storeapi/storequery.ashx?FranchiseId=" + companyCode + "&Fields=ALL", function(data) {
			  
				self._processStoreQueryResponse(data);
                
				if (typeof cb == "function")
					cb(null);
            }); 
        };

		this.unloadStore = function(storeNumber, cb)
		{
		    var self = this;

		    for (var i = 0; i < self.stores.length; i++) {
		        if (self.stores[i].storeNumber === storeNumber) {
		            self.stores.splice(i, 1);
		        }
		    }

		    for (var i = 0; i < self._storesOriginal.length; i++) {
		        if (self._storesOriginal[i].storeNumber === storeNumber) {
		            self._storesOriginal.splice(i, 1);
		        }
		    }

		    cb();
		},

        this.retrieveStoreCareers = function (storeNumber, cb) {
            var self = this;

            jQuery.get("https://vioc.d.epsilon.com/storeapi/storequery.ashx?id=" + storeNumber + "&Fields=ALL", function (data) {

                cb(data.results[0].careers);
            });
        },
        this.retrieveStoreNews = function (storeNumber, cb) {
            var self = this;

            jQuery.get("https://vioc.d.epsilon.com/storeapi/storequery.ashx?id=" + storeNumber + "&Fields=ALL", function (data) {

                cb(data.results[0].news);
            });
        }
        /**
         * Triggers a form to post to the /imageUpload.jssp API within Campaign.  This API will store the image on the media server and return a unique file URL.
         * This method will then return the path to the image, which can then be set as necessary.
         *
         * @param {function} callback - A callback that triggers upon completion.  Provides 1 parameter: "error" (false or string)
         */
        /*this.uploadImage = function('myForm', function(error, fileUrl) {
         if (error == false) alert('The file was uploaded to ' + fileUrl);
         } );*/
        
         this.createFeature = function(newFeature, cb) { 
            jQuery.ajax({
                  type: 'POST',
                  url: 'https://vioc.d.epsilon.com/storeapi/feature.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(newFeature),
                  dataType: "json",
                  crossdomain: true,
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
        
    
         /*this.addService();
         this.removeService();
    
         this.addHoliday();
         this.removeHoliday();
    
         this.featureMeta = {};
         this.createFeature();
    
         this.newsMeta = {};
         
         */
         
         this.createCareer = function(careerItem, cb)
         {
            jQuery.ajax({
                  type: 'POST',
                  url: 'https://vioc.d.epsilon.com/storeapi/career.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(careerItem),
                  dataType: "json",
                  crossDomain: true,
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
         
         this.modifyCareer = function(careerItem, cb)
         {
            jQuery.ajax({
                  type: 'PUT',
                  url: 'https://vioc.d.epsilon.com/storeapi/career.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(careerItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }

         this.deleteFeature = function(featureItem, cb)
         {
            jQuery.ajax({
                  type: 'DELETE',
                  url: 'https://vioc.d.epsilon.com/storeapi/feature.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(featureItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
         
         this.deleteCareer = function(careerItem, cb)
         {
            jQuery.ajax({
                  type: 'DELETE',
                  url: 'https://vioc.d.epsilon.com/storeapi/career.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(careerItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
         
         this.createNews = function(newsItem, cb)
         {
            jQuery.ajax({
                  type: 'POST',
                  url: 'https://vioc.d.epsilon.com/storeapi/news.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(newsItem),
                  dataType: "json",
                  crossdomain: true,
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
         
         this.modifyNews = function(newsItem, cb)
         {
            jQuery.ajax({
                  type: 'PUT',
                  url: 'https://vioc.d.epsilon.com/storeapi/news.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(newsItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
         
         this.deleteNews = function(newsItem, cb)
         {
            jQuery.ajax({
                  type: 'DELETE',
                  url: 'https://vioc.d.epsilon.com/storeapi/offer.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(newsItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
    
         this.getOffer = function(offerId, cb)
         {
             jQuery.ajax({
                 type: 'GET',
                 url: 'https://vioc.d.epsilon.com/storeapi/offer.ashx?id=' + offerId,
                 headers: {
                     "Authorization": "Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                 },
                 success: function (data) { cb(null, data); },
                 error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
             });
         }

         this.createOffer = function(offerItem, cb)
         {
            jQuery.ajax({
                  type: 'POST',
                  url: 'https://vioc.d.epsilon.com/storeapi/offer.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(offerItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
         
         this.modifyOffer = function(offerItem, cb)
         {
           jQuery.ajax({
                  type: 'PUT',
                  url: 'https://vioc.d.epsilon.com/storeapi/offer.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(offerItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
         
         this.deleteOffer = function(offerItem, cb)
         {
            jQuery.ajax({
                  type: 'DELETE',
                  url: 'https://vioc.d.epsilon.com/storeapi/offer.ashx',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  data: JSON.stringify(offerItem),
                  dataType: "json",
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
		 
         this.addStoreImage = function(formdata, cb) { 
            var self = this;
            
            jQuery.ajax({
                  type: 'POST',
                  url: 'https://vioc.d.epsilon.com/storeapi/image.ashx',
                  //url: 'https://requestb.in/1kxcfj41',
                  headers: {
                      "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                  },
                  cache: false,
                   contentType: false,
                   enctype: 'multipart/form-data',
                   processData: false,
                  /*contentType: 'multipart/form-data',*/
                  data: formdata,
                  success: function (data) { cb(null, data); },
                  error: function (jqXHR, textStatus, errorThrown) { cb(errorThrown, null); }
              });
         }
         
        /**
         * Pushes modified stores back to SiteCore.  If a store load is in progress,
         * this command will wait until the loading is complete before saving.
         *
         * @param {function} progress - A callback that triggers as progress is made.  Provides 1 parameter: "progress" (integer)
         * @param {function} complete - A callback that triggers upon completion.  Provides 1 parameter: "error" (false or string)
         */
        this.save = function (cbprogress, cbcomplete) {
            var self = this;
        
            var toModifyList = [];
        
            for (var i = 0; i < this.stores.length; i++){
              var storeID = this.stores[i].id;
              
              for (var t = 0; t < this._storesOriginal.length; t++) {
                var originalStoreID = this._storesOriginal[t].id;
                
                if (originalStoreID == storeID) {
                  var originalStoreJSON = JSON.stringify(this._storesOriginal[t]);
                  var storeJSON = JSON.stringify(this.stores[i]);
                  
                  if (originalStoreJSON != storeJSON) {
                    //console.log(originalStoreJSON + " --- " + storeJSON);
                    toModifyList.push(storeJSON);
                  }
                }  
              }
            } 
            
            var ajajCallsRemaining  = toModifyList.length;
            
            for (var i = 0; i < toModifyList.length; i++) { 
                jQuery.ajax({
                        type: 'PUT',
                        url: 'https://vioc.d.epsilon.com/storeapi/storeupdate.ashx',
                        //url: 'https://requestb.in/18ba6mk1',
                        headers: {
                            "Authorization":"Token  BE8E5CD2-61C0-4041-96DB-7A36B41643A5"
                        },
                        data: toModifyList[i],
                        dataType: "json",
                        contentType: "application/json",
                        success: function (data) 
                        { 
                          --ajajCallsRemaining;
                          if (ajajCallsRemaining <= 0) {
							  if (typeof cbcomplete == "function")
								cbcomplete(null, null);
                          }
						  if (typeof cbprogress == "function")
							cbprogress(ajajCallsRemaining);
                        },
                        error: function (jqXHR, textStatus, errorThrown) 
                        { 
                          --ajajCallsRemaining;
                          if (ajajCallsRemaining <= 0) {
							  if (typeof cbcomplete == "function")
								cbcomplete(null, null);
                          }
						  if (typeof cbprogress == "function")
							cbprogress(errorThrown, null); 
                        }
                    });    
            }
        };
    }
    return SiteCoreLibrary;
}(jQuery));

/*
  Store Front Test Center
  ==========================================
  Dashboard:
    # of Stores in Memory
    # of Modified Stores
      List of Modified Stores
      
  Debuggers:
    Store JSON Textbox                Contains JSON of all stores in memory.  User can modify it and hit "Apply"
     
  Functionality:
    Get Store By Store Number         User can type in a store number and it is loaded into memory; dashboard updated
    Get Store By Franchise Code       User can type in a franchise code and it is loaded into memory; dashboard updated
    Save Store Changes                User can press this button to commit all modified stores to SiteCore

    Create News                       User can modify a hard-coded news JSON blob and submit it to the server.
    
  
    
*/