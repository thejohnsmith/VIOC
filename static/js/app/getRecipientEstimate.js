var updateRecipientCount = function()
{
	var oilType = $("#oilType").val();
	var mockStores = [1,2,3];
	var storeIds = mockStores.join(",");
	
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

		$("#counter").html("Recipient: " + data.recipientCount);
	  }).error(function(data) {
		alert("Something bad happened");
	  });

}