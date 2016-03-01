var updateRecipientCount = function()
{
	var oilType = $("#oilType").val();
	var mockStores = [1,2,3];
	var storeIds = mockStores.join(",");
	var recipientCount = '';
	var recipientPlural = 's';
	
	$.get( "https://adobe-uat-vioc.epsilon.com/jssp/vioc/getRecipientEstimate.jssp", { 
		"userId": userId,
		"oilType": oilType,
		"storeIds": storeIds
	})
	  .done(function( data ) {
		try 
		{	
			data = JSON.parse(data);
		}
		catch (e)
		{
			alert("Failed to parse JSON");
		}
		recipientCount = data.recipientCount;

		$(".recipient-count").html(recipientCount);

		if (recipientCount > 1) {
			recipientPlural = 's';
		} else {
			recipientPlural = '';
		}
		$('.plural').html(recipientPlural);
		$('.call-to-action .submit').html('Select up to ' + recipientCount + ' Target Recipient' + recipientPlural);
	  }).error(function(data) {
		alert('Cannot access JSON data.');
	  });

}

updateRecipientCount();