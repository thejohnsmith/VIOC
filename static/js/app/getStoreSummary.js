function getParameterByName(name, url) {
	if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

var jsonTreeData = '';
var userId = '';

$(document).ready(function() {

	userId = getParameterByName('userId', window.location.href);

	// Call and get the store tree:
	$.get( "https://adobe-uat-vioc.epsilon.com/jssp/vioc/getStoreSummary.jssp?userId=" + encodeURIComponent(marcomUserData.$user.externalId) )
	  .done(function( data ) {

		try {
			jsonTreeData = JSON.parse(data);
		}
		catch (e)
		{
			alert("Failed to parse JSON data");
		}

		if ($('#jstree').length) {
			$('#jstree').jstree({
				'plugins':["wholerow","checkbox"],
			  "core": {
				"data": jsonTreeData }}
			);
		}

	 });
});
