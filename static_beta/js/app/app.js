/** App - Epsilon 2016
 * @file app.js
 * initial init
 * @return {object} controller
 */
var app = (function ($) {
	var controller = {
		init: function appInit() {
			var constants = marcomUserData.$constants;
			var programManagementController = programManagementController;


			getProgramParticipationStats.makeRequest();
			getStoreProgramData.makeRequest();
			getUserConfigurations.makeRequest();

			if (typeof appUtilities === 'object') {
				/* Update the hard-coded URL's in the utility navigation. */
				appUtilities.changeNavBarLink();
				appUtilities.runtimeDebugging();
			}

			/* Run the login controller */
			if ($('#homePageLanding').length >= 1) {
				recordLogin.makeRequest();
			}

			if (window.location.href.indexOf(constants.additionalOfferPageUrl) > -1) {
				$('.js-content').hide();
				$('.js-loading').show();
				additionalOfferController.controller.init();
			}

			if (window.location.href.indexOf(constants.configPageUrl) > -1) {
				$('.js-content').hide();
				$('.js-loading').show();
				programConfigController.controller.init();
			}
			if (window.location.href.indexOf(constants.programManagementUrl) > -1 || $('.filter-select').length || $('.filterable').length) {
				programManagementFilters.controller.init();
			}

			/* This is actually called from the contactUsController HTML  */
			if (window.location.href.indexOf(constants.helpPageUrl) > -1) {
				console.warn('calling contactUsController from parent script.');
				contactUsController.controller.init();
			}

		}
	};
	return {
		controller: controller
	};
})(jQuery);
