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
    refreshManagementControls: function (_that) {
      /*
		  1)  Change "Edit" to "New" if the management config dropdown is showing a corporate item
		  2)  Change the href of the "Edit/New" button to contain the ID of the selected config
			*/
      var $selectedMgmg = $('.config-select-program .management-dropdown').find(':selected').text();
      var $selectedAdditional = $('.config-select-additional .management-dropdown').find(':selected').text();
      // if($selectedMgmg === 'Corporate Default') {
      //   // console.log('selectedMgmg is Not Corporate Default');
      //   $('.config-select-program .btn').text('View');
      // } else {
      //   $('.config-select-program .btn').text('Edit');
      // }
      // if($selectedAdditional === 'Corporate Default') {
      //   // console.log('selectedAdditional is Not Corporate Default');
      //   $('.config-select-additional .btn').text('View');
      // } else {
      //   $('.config-select-additional .btn').text('Edit');
      // }
      /* New */
      var $newProgramId;
      if($('.config-select .management-dropdown').find(':selected').text() === 'Corporate Default') {
        $('.config-select .management-dropdown .btn').text('View');
        $newProgramId = _that.val();
        console.log($newProgramId);
      } else {
        $('.config-select .management-dropdown .btn').text('Edit');
        $newProgramId = _that.val();
        console.log($newProgramId);
      }
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
        var _that = $(this)
        controller.refreshManagementControls(_that);
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
