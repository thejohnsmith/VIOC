/** Marcom User Data
 * Usage: marcomUserData.$user || marcomUserData.$user.externalId
 * @param {class} .user-related
 * @return {object} $user
 */

var marcomUserData = (function ($) {
	var constants;
	var $userRelated = $('.user-related');
	var user = {
		externalId: $userRelated.data('user-external-id') || '',
		loginId: $userRelated.data('user-login-id') || '',
		firstName: $userRelated.data('user-first-name') || '',
		lastName: $userRelated.data('user-last-name') || '',
		email: $userRelated.data('user-email') || ''
	};
	/** Detect codebase environment
	 * @NOTE Check for querystring values -
	 * @NOTE Changes environment var to 'PROD' or 'UAT' string values.
	 * @param uigroup_id
	 * @param company_id
	 * @default 'PROD'
	 */
	var environment = getParameterByName('uigroup_id', window.location.href) || getParameterByName('company_id', window.location.href);
	environment =
		(environment == 478656) ? 'PROD' :
		(environment == 20917) ? 'PROD' :
		(environment == 479602) ? 'UAT' :
		(environment == 20951) ? 'UAT' :
		'PROD';

	console.warn('Environment: ' + environment);
	console.warn('URL: ' + window.location.href);

	/** PRODUCTION URLs
	 * @kind {string} Production or User Acceptance Testing (Beta_Epsilon)
	 * @example marcomUserData.$constants.apiPath
	 * @example marcomUserData.$constants.kind
	 * @return {object} environment
	 */
	environment =
		(environment == 'PROD') ?
		constants = {
			kind: 'PROD',
			lifecyclePageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12293',
			specialtyPageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12294',
			programManagementUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12300',
			additionalOfferPageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12302',
			configPageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12301',
			helpPageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12298',
			loginPageUrl: 'https://marcomcentral.app.pti.com/printone/login.aspx?company_id=20917',
			loginPage2Url: 'login.aspx?uigroup_id=478656',
			forgotPassPageUrl: 'forgotpassword.aspx?uigroup_id=478656',
			onDemandUrl: 'catalog.aspx?uigroup_id=478656&folder_id=1633307',
			apiPath: 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/',
			apiPathLocal: 'data/',
			marcomFilePath: 'https://files.marcomcentral.app.pti.com/epsilon/static/'
		} :

		/** UAT URLs
		 * @kind {string} Production or User Acceptance Testing (Beta_Epsilon)
		 * @example marcomUserData.$constants.apiPath
		 * @example marcomUserData.$constants.kind = 'UAT'
		 * @return {object} environment
		 */
		(environment == 'UAT') ?
		constants = {
			kind: 'UAT',
			lifecyclePageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=10792',
			specialtyPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=10793',
			programManagementUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=11173',
			additionalOfferPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=11226',
			configPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=11225',
			helpPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=10798',
			loginPageUrl: 'login.aspx?company_id=20951',
			loginPage2Url: 'login.aspx?uigroup_id=479602',
			forgotPassPageUrl: 'forgotpassword.aspx?uigroup_id=479602',
			onDemandUrl: 'catalog.aspx?uigroup_id=479602&folder_id=1633307',
			apiPath: 'https://adobe-uat-vioc.epsilon.com/jssp/vioc/',
			apiPathLocal: 'data/',
			marcomFilePath: 'https://files.marcomcentral.app.pti.com/epsilon/static/'
		} : constants;
	return {
		$user: user,
		$constants: constants,
		environmentKind: environment.kind
	};
})(jQuery);

/* Monitor for flash messages */
if (getParameterByName('flashSuccessMsg', window.location.href) != '') {
	toastr.success(getParameterByName('flashSuccessMsg', window.location.href));
}
