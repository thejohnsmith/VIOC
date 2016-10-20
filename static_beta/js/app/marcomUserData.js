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
	environment = (environment == 478656)
		? 'PROD'
		: (environment == 20917)
			? 'PROD'
			: (environment == 479602)
				? 'UAT'
				: (environment == 20951)
					? 'UAT'
					: (location.href.match(/Beta_Epsilon/))
						? 'UAT'
						: 'PROD';

	/** PRODUCTION URLs
	 * @kind {string} Production or User Acceptance Testing (Beta_Epsilon)
	 * @example marcomUserData.$constants.apiPath
	 * @example marcomUserData.$constants.kind
	 * @return {object} environment
	 */
	environment = (environment == 'PROD')
		? constants = {
			kind: 'PROD',
			homePageUrl: 'home.aspx',
			homePageGroupUrl: 'home.aspx?uigroup_id=478656',
			lifecyclePageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12293',
			specialtyPageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12294',
			programManagementUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12300',
			additionalOfferPageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12302',
			configPageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12301',
			helpPageUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=12298',
			loginPageUrl: 'https://marcomcentral.app.pti.com/printone/login.aspx?company_id=20917',
			loginPage2Url: 'login.aspx?uigroup_id=478656',
			forgotPassPageUrl: 'forgotpassword.aspx?uigroup_id=478656',
			accountPageUrl: 'profile.aspx?uigroup_id=478656&mode=1',
			onDemandUrl: 'catalog.aspx?uigroup_id=478656&folder_id=1724903',
			storePagesUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=13586',  
			storeDetailsUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=13596', 
			storePagesNewOfferUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=13597',
			storePagesEditOfferUrl: 'CustomPage.aspx?uigroup_id=478656&page_id=13597',
			defaultStorePhotoId: "9d905764-f897-4d46-8c28-bcada654ebe9",
			defaultStorePhotoUrl: 'https://vioc.d.epsilon.com/images/Default_store.jpg',
			defaultManagerPhotoId: '11c3e57d-a90a-4de7-96f9-73e7aa6a7834',
			defaultManagerPhotoUrl: 'https://vioc.d.epsilon.com:443/~/media/Images/Locations/Stores/Manager Photos/Default Manager.ashx',
			apiPath: 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/',
			apiPathLocal: 'data/',
			marcomFilePath: 'https://files.marcomcentral.app.pti.com/epsilon/static/',
			marcomCustomFilePath: 'https://files.marcomcentral.app.pti.com/epsilon/static/marcom_custom/'
		}
		:

		/** UAT URLs
		 * @kind {string} Production or User Acceptance Testing (Beta_Epsilon)
		 * @example marcomUserData.$constants.storeDetailsUrl
		 * @example marcomUserData.$constants.kind = 'UAT'
		 * @return {object} environment
		 */

		/**
			* @TODO: Find a place for this odd-duckling (defaults to Prod, but shows _beta tag),
			* 				loginPage3Url: 'login.aspx?uigroup_id=479602&company_id=20951',
			*/
		(environment == 'UAT')
			? constants = {
				kind: 'UAT',
				homePageUrl: 'home.aspx?uigroup_id=479602',
				homePageGroupUrl: 'home.aspx?uigroup_id=479602',
				lifecyclePageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=10792',
				specialtyPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=10793',
				programManagementUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=11173',
				additionalOfferPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=11226',
				configPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=11225',
				helpPageUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=10798',
				loginPageUrl: 'login.aspx?company_id=20951',
				loginPage2Url: 'login.aspx?uigroup_id=479602',
				forgotPassPageUrl: 'forgotpassword.aspx?uigroup_id=479602',
				accountPageUrl: 'profile.aspx?uigroup_id=479602&mode=1',
				onDemandUrl: 'catalog.aspx?uigroup_id=479602&folder_id=1633307',
				storePagesUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=12939',
				storeDetailsUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=13090',
				storePagesNewOfferUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=13091',
				storePagesEditOfferUrl: 'CustomPage.aspx?uigroup_id=479602&page_id=13091',
				defaultStorePhotoId: 'f6f18b71-c587-4b44-893b-eba37d1f81e7',
				defaultStorePhotoUrl: 'https://vioc.d.epsilon.com/images/Default_store.jpg',
				defaultManagerPhotoId: 'f6f18b71-c587-4b44-893b-eba37d1f81e7',
				defaultManagerPhotoUrl: 'https://vioc.d.epsilon.com:443/~/media/Images/Locations/Stores/Manager Photos/Default Manager.ashx',
				apiPath: 'https://adobe-prod-vioc.epsilon.com/jssp/vioc/',
				apiPathLocal: 'data/',
				marcomFilePath: 'https://files.marcomcentral.app.pti.com/epsilon/static_beta/',
				marcomCustomFilePath: 'https://files.marcomcentral.app.pti.com/epsilon/static_beta/marcom_custom/'
			}
			: constants;
	return {marcomUserData: this, $user: user, $constants: constants, environmentKind: environment.kind};
})(jQuery);

(function ($) {
	// This is used as a precaution.
	var $j = jQuery.noConflict();

	// BACKUP 3pm
	// if ($('[data-dynamicUrl]').length >= 1 {
	// 	// $.each($('.productDescription'), function (index, value) {
	// 	// 	console.log(index + ':' + $(value).text());
	// 	// });
	// 	$('[data-dynamicUrl]').each(function (index, value) {
	// 		var path = marcomUserData.$constants + homePageGroupUrl;
	// 		$(this).attr('href', $(value));
	// 	});
	// }

	/**
 * Having an HTML element like this where I want to pass custom options:
 * @example
	<div class="my-element"
    data-options="background-color: #dadada; custom-key: custom-value;">
	</div>
 * @param {object} $elem
 * @param i
 * @param len
 * @param option
 * @param options
 * @param optionsObject = {};
 * @return {object} optionsObject
 */
	function readCustomOptions($elem) {
		var i,
			len,
			option,
			options,
			optionsObject = {};

		options = $elem.data('options');
		options = (options || '').replace(/\s/g, '').split(';');
		for (i = 0, len = options.length - 1; i < len; i++) {
			option = options[i].split(':');
			optionsObject[option[0]] = option[1];
		}
		return optionsObject;
	}

	console.log(readCustomOptions($j('.dynamicLink')));
	//
	// function setDynamicLink($elem) {
	// 	var options = optionsObject;
	// 	if ($('.dynamicLink').length >= 1 {
	// 		readCustomOptions($('.dynamicLink'));
	// 		var
	// 		// $('.dynamicLink').each(function (index, value) {
	// 		// 	var path = marcomUserData.$constants + homePageGroupUrl;
	// 		// 	$(this).attr('href', $(value));
	// 		// 	readCustomOptions($(this))
	// 		// });
	// 	}
	//
	// }


	/** @example
	 * @todo - Convert this to use a data-dynamicUrl
	 */
	$j('#homePageUrl').attr('href', marcomUserData.$constants.homePageGroupUrl);

	/* Monitor for flash messages */
	if (typeof getParameterByName === 'function' && typeof toastr === 'object') {
		if (getParameterByName('flashSuccessMsg', window.location.href) != '') {
			toastr.success(getParameterByName('flashSuccessMsg', window.location.href));
		}
	}

	if (typeof appUtilities === 'object') {
		/* Update the hard-coded URL's in the utility navigation. */
		appUtilities.changeNavBarLink();
		if (marcomUserData.environmentKind === 'UAT') {
			var $debug = appUtilities.runtimeDebugging();
		}
	}

	/* Record the user's login and possibly hide the reports tab */
	recordLogin.makeRequest();

	return $debug;
})(jQuery);
