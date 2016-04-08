/** Marcom User Data
 * Usage: marcomUserData.$user || marcomUserData.$user.externalId
 * @param {class} .user-related
 * @return {object} $user
 */

var marcomUserData = (function ($) {
	var $userRelated = $('.user-related');
	var user = {
		externalId: $userRelated.data('user-external-id') || '',
		loginId: $userRelated.data('user-login-id') || '',
		firstName: $userRelated.data('user-first-name') || '',
		lastName: $userRelated.data('user-last-name') || '',
		email: $userRelated.data('user-email') || ''
	};
	// Usage: marcomUserData.$constants.apiPath
	var constants = {
		lifecyclePageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=10792',
		specialtyPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=10793',
		programManagementUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=11173',
		additionalOfferPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=11226',
		configPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=11225',
		apiPath: 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/',
		apiPathLocal: 'data/',
		marcomFilePath: 'https://files.marcomcentral.app.pti.com/epsilon/static/'
	};
	return {
		$user: user,
		$constants: constants
	};
})(jQuery);

/* Monitor for flash messages */
if (getParameterByName('flashSuccessMsg', window.location.href) != '') {
	toastr.success(getParameterByName('flashSuccessMsg', window.location.href));
}
