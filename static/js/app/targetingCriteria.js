function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
	var results = regex.exec(url);
	if (!results) {
		return undefined;
	}
	if (!results[2]) {
		return '';
	}
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var jsonTreeData = '';
var userId = '';
var attachActivityListeners = function () {
	$('#oilType, #chkActive, #chkInactive, #chkNew, #fleet').change(updateRecipientCount);
	$('#from, #to').blur(updateRecipientCount);
	$('#btnCancel').click(cancelSubmission);
	$('#btnSubmit').click(submitForm);
};
var cancelSubmission = function () {
	if (confirm('Are you sure you wish to cancel?')) {
		var cancelUrl = getParameterByName('cancelUrl', window.location.href);
		if (cancelUrl !== '' && typeof cancelUrl !== 'undefined') {
			window.location.href = cancelUrl;
		} else {
			window.location.href = 'http://www.vioc.com';
		}
	}
};
var submitForm = function () {
	updateRecipientCount(true, function (recipientCount, saveId) {
		var returnUrl = getParameterByName('returnUrl', window.location.href);
		var firstChar = '&';
		if (returnUrl.indexOf('?') === '-1') {
			firstChar = '?';
		}
		if (returnUrl !== '' && typeof returnUrl !== 'undefined') {
			window.location.href = returnUrl + firstChar + 'quantity=' + recipientCount + '&targetingCriteriaId=' + saveId;
		} else {
			window.location.href = 'http://www.vioc.com';
		}
	});
};
var updateRecipientCount = function (save, callback) {
	var storeIds = [];
	if ($('#jstree').length) {
		var selectedElements = $('#jstree').jstree().get_selected();
	}
	for (var idx in selectedElements) {
		if (!isNaN(parseInt(selectedElements[idx]))) storeIds.push(selectedElements[idx]);
	}
	var data = {
		'dateStart': $('#from').val(),
		'dateEnd': $('#to').val(),
		'oilType': $('#oilType').val(),
		'customerActive': ($('#chkActive').is(':checked')) ? 1 : 0,
		'customerInactive': ($('#chkInactive').is(':checked')) ? 1 : 0,
		'customerNew': ($('#chkNew').is(':checked')) ? 1 : 0,
		'oilType': $('#fleet').val(),
		'storeIds': storeIds,
		'save': 0
	};
	if (save === true) data.save = 1;
	$.get('https://adobe-uat-vioc.epsilon.com/jssp/vioc/getRecipientEstimate.jssp', data).done(function (data) {
		try {
			data = JSON.parse(data);
			$('#counter').html(data.recipientCount);
			$('#btnSubmit').html('Submit (' + data.recipientCount + ' Recipients)');
			if (typeof callback === 'function') callback(data.recipientCount, data.saveId);
		} catch (e) {
			alert('Failed to parse JSON:' + e);
		}
	}).error(function (data) {
		alert('Something bad happened');
	});
};
$(document).ready(function () {
	if ($('#jstree').length) {
		attachActivityListeners();
		userId = getParameterByName('userId', window.location.href) || marcomUserData.$user.externalId;
		// Call and get the store tree:
		$.get('https://adobe-uat-vioc.epsilon.com/jssp/vioc/getStoreSummary.jssp', {
			'userId': userId
		}).done(function (data) {
			try {
				jsonTreeData = JSON.parse(data);
			} catch (e) {
				alert('Failed to parse JSON data');
			}
			$('#jstree').jstree({
				'plugins': ['wholerow', 'checkbox'],
				'core': {
					'data': jsonTreeData
				}
			}).on('changed.jstree', function (e, data) {
				updateRecipientCount();
			});
			updateRecipientCount();
		});
	}
});
