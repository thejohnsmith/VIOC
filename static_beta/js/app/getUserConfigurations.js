/** Get User Configurations
 * Returns the configurations associated to a user's account
 * Usage: getUserConfigurations.makeRequest();
 * 1. Find a vioc: user by userId and verify they are legal.
 * 2. Query all configs that (belong to this user ID) or
 *    (have a null user ID and corporate defaults) or
 *    (belongs to no user (0) and belongs to that program ID)
 * @param {object} userId The caller's unique Franchisee ID
 * @param {object} programId The ID of the program you're retrieving configs for
 * @param {object} data.programIds
 */

var getUserConfigurations = (function ($) {
	var marcomFilePath = marcomUserData.$constants.marcomFilePath;
	var makeRequest = function ($programId) {
			if (marcomUserData.$user.externalId === '%%User.ExternalId%%') {
				return;
			}
			var programId = getParameterByName('programId', window.location.href);
			if (!programId) {
				return;
			}
			var apiPath = marcomUserData.$constants.apiPath + 'getUserConfigurations.jssp?userId=' + encodeURIComponent(marcomUserData.$user.externalId);
			$.ajax({
				url: apiPath,
				type: 'GET',
				contentType: 'application/json',
				processData: true,
				data: {
					programId: programId
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).done(function (result) {
				updateUI(result);

			}).fail(function () {
				console.log(
					'%c ** Request failed ** ',
					'color: #f10; font-weight: bold;',
					'\nProgram ID not found.');
			});
		},
		updateUI = function updateUI (result) {
			if ($('.program-enrollment-section').length) {

				/** Use programId as selected option
				 *  Display all "configType": "program" as options
				 */
				$.get(marcomFilePath + 'program-config-options.mustache.html',
					function (templates) {
						var template = $(templates).filter('.program-config-options-template').html();
						$('.program-config-options-section').html(Mustache.render(
							template,
							result));
					});
			}
		};
	return {
		makeRequest: makeRequest,
		updateUI: updateUI
	};
})(jQuery);

getUserConfigurations.makeRequest();
