/** Program Management
 * @file programManagement.js
 * @requires getStoreProgramData.jssp
 * @NOTE ** In order for this script to run it needs to have markup from program-settings.mustache.html
 * @todo Add overview in this documentation.
 * @example programManagementController.controller.init();
 * @return {object} controller
 */
var programManagementController = (function ($) {
  var controller = {
    user_configs: [],
    store_data: [],
    init: function () {
      var controller = this;
      controller.retrieveUserConfigs(function (configs) {
        controller.user_configs = configs;
        controller.populateConfigDropdowns();
        /* Retrieve the store program data */
        controller.getStoreProgramData();
        /* Now that the dropdowns are populated with all possible choices,
        determine which one should be selected for each store. */
        controller.selectStoreConfigurations();
        controller.attachEventListeners();
        /* Refresh the bottom section of the page */
        controller.refreshManagementControls();
      })
    },
    retrieveUserConfigs: function (callback) {
      /**
       * @todo use dynamic userId and programId
       */
      $.get('https://adobe-uat-vioc.epsilon.com/jssp/vioc/getUserConfigurations.jssp?userId=34567&programId=1', function (results) {
        if(typeof callback === "function") callback(JSON.parse(results));
      });
    },
    getStoreProgramData: function () {
      // Do stuff
    },
    selectStoreConfigurations: function () {
      // Do stuff
    },
    refreshManagementControls: function () {
      /*
		  1)  Change "Edit" to "New" if the management config dropdown is showing a corporate item
		  2)  Change the href of the "Edit/New" button to contain the ID of the selected config
			*/
      $('.management-dropdown').each(function(){
        var $selectedMgmg = $(this).find(':selected');
        var $selectedMgmgId = $selectedMgmg.val();
        var $selectedMgmgText = $selectedMgmg.text();
        var $newProgramConfigLink = $(this).parent().next().find('.btn.btn-link');
        var $configUrl = $newProgramConfigLink.attr('data-baseUrl');

        // Update the Edit/View links
        $newProgramConfigLink.attr('href', $configUrl + '#programId=' + $selectedMgmgId);

        // Corporate Default configs are read-only.
        if($selectedMgmgText === 'Corporate Default') {
          return $newProgramConfigLink.text('View');
        } else {
          return $newProgramConfigLink.text('Edit');
        }
      });
    },
    attachEventListeners: function () {
      // Attach events
      $('.store-level-dropdown').on('change', function () {
        //console.log('Save the change to setStoreConfig.jssp for the related store.  The checkbox is not a factor and then show a toast message.');
      })
      $('.bulk-apply-program').on('click', function () {
        //console.log('Retrieve the IDs of the selected stores and call setStoreConfig.jssp.  Then refresh the store data and dropdowns.  Then uncheck all of the selected stores and show a toast message');
      });
      $('.bulk-apply-additional').on('click', function () {
        //console.log('Retrieve the IDs of the selected stores and call setStoreConfig.jssp.  Then refresh the store data and dropdowns.  Then uncheck all of the selected stores and show a toast message');
      });
      $('.management-dropdown').on('change', function () {
        //console.log('Store level config changed!');
        controller.refreshManagementControls();
      })
    },
    onSelectAll: function () {},
    onToggleCheckbox: function () {},
    populateConfigDropdowns: function () {
      var controller = this;
      var count = 0;
      // Clear all .program-dropdown selects
      $('.program-dropdown, .additional-dropdown').html('');
      // Loop through the config data
      for(i = 0; i < controller.user_configs.length; i++) {
        var config = controller.user_configs[i];
        var target = (config.configType === 'program') ? '.program-dropdown' : '.additional-dropdown';
        //console.log(config);
        /* console.log(count + ' / ' + controller.user_configs.length + ') Adding an option to '
				+ target + ' with ID of ' + config.id + ' and label of ' + config.label);
				count++; */
        $(target).append($('<option>').val(config.id).html(config.label));
      }
    }
  }
  return {
    controller: controller
  };
})(jQuery);
