/** Program Management
 * @file programManagement.js
 * @requires getStoreProgramData.jssp
 * @NOTE ** In order for this script to run it needs to have markup from program-settings.mustache.html
 * @todo Add overview in this documentation.
 * @example programManagementController.controller.init(user_id);
 * @return {object} controller
 */
/*
TODO:
- AG: Fix DFS Config changes not saving

- DONE - "Select All" should not target inactive checkboxes
- DONE - If you press "Selcet All" twice, you get a toast error
- Switch to using query paramaters instead of hash tags
- DONE - Within the management area, "View/Edit" needs to pass the ID of the selected config
- DONE - "Enroll All" should not submit the page
 */
var programManagementController = (function ($) {
  var controller = {
    api_path: 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/',
    user_configs: [],
    store_data: [],
    user_id: marcomUserData.$user.externalId,
    program_id: getParameterByName('programId', window.location.href) ,
    init: function () {
      var controller = this;
      if(!(controller.user_id > 0)) console.log("Valid user ID not provided to controller.");
      /* If this program doesn't use Additional Offers (aka DFS), hide
      the Additional Offer column and management controls */
      controller.retrieveUserConfigs(function (configs) {
        /* Populate the dropdowns with all possible values */
        controller.populateConfigDropdowns();
        /* Retrieve the store program data */
        controller.getStoreProgramData(function (store_data) {
          /* Now that the dropdowns are populated with all possible choices,
          determine which one should be selected for each store. */
          controller.highlightSelectedStoreConfiguration();
          /* Listen for dropdown changes and other events */
          controller.attachEventListeners();
          /* Refresh the bottom section of the page */
          controller.refreshManagementControls();
        });
      })
    },
    /** Gets a user config
     * @async getUserConfigurations.jssp
     * @callback json_results
     */
    retrieveUserConfigs: function (callback) {
      var controller = this;
      $.get(controller.api_path + 'getUserConfigurations.jssp?userId=' + controller.user_id + '&programId=' + controller.program_id, function (results) {
        var json_results = JSON.parse(results);
        controller.user_configs = json_results;
        if(typeof callback === 'function') callback(json_results);
      });
    },
    /** Gets store program data
     * @async getStoreProgramData.jssp
     * @callback json_results
     */
    getStoreProgramData: function (callback) {
      var controller = this;
      $.get(controller.api_path + 'getStoreProgramData.jssp?userId=' + controller.user_id + '&programId=' + controller.program_id, function (results) {
        var json_results = JSON.parse(results);
        controller.store_data = json_results;
        if(typeof callback === 'function') callback(json_results);
      }).promise().done(function () {
        controller.hideAdditionalOffersIfNeeded();
      });
    },
    hideAdditionalOffersIfNeeded: function () {
      var controller = this;
      for(var i = 0; i < $programParticipationStats.length; i++) {
        if($programParticipationStats[i].id == controller.program_id) {
          if($programParticipationStats[i].programUsesDfs == 0) $(".additional-offer").hide();
        }
      }
    },
    highlightSelectedStoreConfiguration: function () {
      /* Loop through all stores and select each store's active program */
      var controller = this;
      for(var idx = 0; idx < controller.store_data.length; idx++) {
        var store = controller.store_data[idx];
        $(".dropdown-" + store.storeId + "-program option[value='" + store.programConfigId + "']").attr('selected', 'selected');
        $(".dropdown-" + store.storeId + "-dfs  option[value='" + store.dfsConfigId + "']").attr('selected', 'selected');
      }
    },
    refreshManagementControls: function () {
      /**
       * @todo complete
       * 1) - DONE - Change "Edit" to "New" if the management config dropdown is showing a corporate item
       * 2) - DONE -  Change the href of the "Edit/New" button to contain the ID of the selected config
       **/
      $('.management-dropdown').each(function () {
        var $selectedMgmg = $(this).find(':selected');
        var configId = $selectedMgmg.val();
        var $selectedMgmgText = $selectedMgmg.text();
        var $newProgramConfigLink = $(this).parent().next().find('.btn.btn-link');
        var $baseUrl = $newProgramConfigLink.attr('data-baseUrl');
        // Update the Edit/View links
        $newProgramConfigLink.attr('href', $baseUrl + '&configId=' + configId + '&programId=' + controller.program_id);
        // Corporate Default configs are read-only.
        if($selectedMgmgText === 'Corporate Default') {
          return $newProgramConfigLink.text('View');
        } else {
          return $newProgramConfigLink.text('Edit');
        }
      });
    },
    showSuccessToast: function () {},
    showFailToast: function () {},
    attachEventListeners: function () {
      // Attach events
      var controller = this;
      $('.store-level-dropdown').on('change', function () {
        var storeId = $(this).attr('data-storeid');
        var configId = $(this).val();
        controller.saveStoreSubscription([storeId], configId, function () {
          toastr.success('Setting changes saved!')
          controller.getStoreProgramData(function (store_data) {
            controller.highlightSelectedStoreConfiguration();
          });
        });
      })
      $('.bulk-apply-program, .bulk-apply-dfs').on('click', function (e) {
        e.preventDefault();
        var storeIds = [];
        $.each($(".customCheckbox.checked"), function (i, obj) {
          storeIds.push($(obj).attr('data-storeid'));
        })
        var configId = 0;
        if($(this).hasClass('bulk-apply-program')) configId = $(".program-dropdown.bulk-level-dropdown").val();
        if($(this).hasClass('bulk-apply-dfs')) configId = $(".dfs-dropdown.bulk-level-dropdown").val();
        controller.saveStoreSubscription([storeIds], configId, function () {
          toastr.success('Setting changes saved!');
          controller.getStoreProgramData(function (store_data) {
            controller.highlightSelectedStoreConfiguration();
          });
        });
      });
      $('.management-dropdown').on('change', function () {
        controller.refreshManagementControls();
      })
    },
    saveStoreSubscription(selectedStores, configId, callback) {
      var controller = this;
      var stringStoreIds = selectedStores.join(",");
      $.get(controller.api_path + 'setStoreConfig.jssp?userId=' + controller.user_id + '&configId=' + configId + '&programId=' + controller.program_id + '&storeIds=' + stringStoreIds, function (results) {
        var json_results = JSON.parse(results);
        controller.store_data = json_results;
        if(typeof callback === 'function') callback(json_results);
      });
    },
    onSelectAll: function () {},
    onToggleCheckbox: function () {},
    populateConfigDropdowns: function () {
      var controller = this;
      var count = 0;
      // Clear all .program-dropdown selects
      $('.program-dropdown, .dfs-dropdown').html('');
      // Loop through the config data
      for(i = 0; i < controller.user_configs.length; i++) {
        var config = controller.user_configs[i];
        var target = (config.configType === 'program') ? '.program-dropdown' : '.dfs-dropdown';
        //console.log(config);
        /* console.log(count + ' / ' + controller.user_configs.length + ') Adding an option to '
        + target + ' with ID of ' + config.id + ' and label of ' + config.label);
        count++; */
        $(target).append($('<option>').val(config.id).html(config.label));
      }
      // controller.hideAdditionalOffersIfNeeded();
    }
  }
  return {
    controller: controller
  };
})(jQuery);
