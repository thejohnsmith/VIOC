
var StorePageDetailNewsController = (function ($) {

	var controller = {

		// ===========================================================================
		// Variables
	    // ===========================================================================

	    isAdd: false,
	    idEditing: null,
	    savenewStorePromoImageId: null,
	    savenewStorePromoImageUrl: null,
	    showAll: false,
		
		// None

		// ===========================================================================
		// Boot Methods
		// ===========================================================================

		init: function() {
			var controller = this;
			controller.populateUI(function () {
			    controller.attachEventListeners();
			    controller.showUI();
			    console.log("News Controller Init Complete!");
			});
		},

		populateUI: function(cb) {
		    // Build the HTML here, without event handling
		    siteCoreLibrary.retrieveStoreNews([siteCoreLibrary.stores[0].storeNumber], function (news) {

                if (controller.showAll == false) {
                    for (var i = 0; i < news.length; i++) {
                        if (false == moment().isBetween(news[i].postOnDate, news[i].removeOnDate)) {
                            news.splice(i, 1);
                        }
                    }
                }

		        var promoarray = [];
		        var eventarray = [];
		        var newsarray = [];

		        for (var i = 0; i < news.length; i++) {
		            if (news[i].type.toUpperCase() === '1911FD9D-64CB-4795-870D-3CCB912CD2FB') {
		                eventarray.push(news[i]);
		            }
		            else if (news[i].type.toUpperCase() === '8FE528B2-28EB-49C9-8939-F014FF0FEF26') {
		                newsarray.push(news[i]);
		            }
		            else if (news[i].type.toUpperCase() === 'B0B7670A-8EB5-43E5-91FA-AFC9FA085D94') {
		                promoarray.push(news[i]);
		            }
		        }

		        promoarray.sort(function (a, b) {
		            return new Date(a.postOnDate).getTime() - new Date(b.postOnDate).getTime()
		        });

		        eventarray.sort(function (a, b) {
		            return new Date(a.postOnDate).getTime() - new Date(b.postOnDate).getTime()
		        });

		        newsarray.sort(function (a, b) {
		            return new Date(a.postOnDate).getTime() - new Date(b.postOnDate).getTime()
		        });

		        news = [];

		        for (var i = 0; i < promoarray.length; i++) {
		            news.push(promoarray[i]);
		        }

		        for (var i = 0; i < newsarray.length; i++) {
		            news.push(newsarray[i]);
		        }

		        for (var i = 0; i < eventarray.length; i++) {
		            news.push(eventarray[i]);
		        }

		        /*
            1911FD9D-64CB-4795-870D-3CCB912CD2FB - Events
            8FE528B2-28EB-49C9-8939-F014FF0FEF26 - News
            B0B7670A-8EB5-43E5-91FA-AFC9FA085D94 - Promotion

            */
		        for (var i = 0; i < news.length; i++) {

		            if (news[i].type.toUpperCase() === '1911FD9D-64CB-4795-870D-3CCB912CD2FB') {
		                news[i].typeeasy = 'Event';
		            }
		            else if (news[i].type.toUpperCase() === '8FE528B2-28EB-49C9-8939-F014FF0FEF26') {
		                news[i].typeeasy = 'News';
		            }
		            else if (news[i].type.toUpperCase() === 'B0B7670A-8EB5-43E5-91FA-AFC9FA085D94') {
		                news[i].typeeasy = 'Promotion';
		            }
		        };

		        for (var i = 0; i < news.length; i++) {
		            news[i].postOnDate = moment(news[i].postOnDate).format('YYYY-MM-DD');
		            news[i].removeOnDate = moment(news[i].removeOnDate).format('YYYY-MM-DD');
		        }

		        var template = $('#mustache-template-news').html();
		        $('#mustacheTableHtmlNews').html(Mustache.render(template, {
		            rows: news
		        }));
		        cb();

				if (news.length > 0)
				{
					$("#mustacheTableHtmlNews .empty-row").remove();
				}

		    });
		},
		
		attachEventListeners: function() {
		    // Delegate user events to handler functions

		    $('.editbutton').unbind().click(function () {
		        var id = $(this).closest('tr').attr('data-id');
		        controller.onClickEditNews(id);
		    });

		    $('.deletebutton').unbind().click(function () {
		        var id = $(this).closest('tr').attr('data-id');
		        controller.onClickDeleteNews(id);
		    });

		    $('#buttonsavenews').unbind().click(function (e) {
		        controller.onButtonSaveNews(e);
		    });

		    $('#addnewsbutton').unbind().click(function () {
		        controller.onClickAddNews();
		    });

		    $('#buttoncancelnews').unbind().click(function () {
		        controller.onButtonCancelNews();
		    });

		    $('#removegraphicbutton').unbind().click(function () {
		        controller.onRemoveGraphicButton();
		    });

		    $('#linkshowactiveonly').unbind().click(function () {
		        controller.OnShowActiveOnly();
		    });

		    $('#linkshowall').unbind().click(function () {
		        controller.OnShowAll();
		    });

		    $('#newimagenews').unbind().change(function () { $('#uploader_form_newsimage_1').submit(); });
		    $("#uploader_form_newsimage_1").unbind().submit(function (event) { controller.onUploadPhoto(event); });
		},
		
		showUI: function() {
		    // Unhide the UI now that it is built and ready for interaction

		    $("#newsdiv").show();
		},
		
		// ===========================================================================
		// Event Handlers
		// ===========================================================================

		onClickAddNews: function () {
		    controller.isAdd = true;
		    $('#newsformbanner').html('Add News');
		    $('#posttype').val('promotion');
		    $('#newsEventTitle').val('');
		    $('#newsEventText').val('');
		    $('#moreInfoLink').val('');
		    $('#newsEventPostDate').val('');
		    $('#newsEventRemoveDate').val('');

		    controller.savenewStorePromoImageId = null;
		    controller.savenewStorePromoImageUrl = null;
		},

		onClickEditNews: function (id) {

		    siteCoreLibrary.retrieveStoreNews([siteCoreLibrary.stores[0].storeNumber], function (news) {
		        $.each(news, function (i, newsItem) {
		            if (newsItem.id === id) {

		                controller.isAdd = false;
		                controller.idEditing = id;

		                /*
            1911FD9D-64CB-4795-870D-3CCB912CD2FB - Events
            8FE528B2-28EB-49C9-8939-F014FF0FEF26 - News
            B0B7670A-8EB5-43E5-91FA-AFC9FA085D94 - Promotion

            */

		                if (newsItem.type.toUpperCase() === '8FE528B2-28EB-49C9-8939-F014FF0FEF26') {
		                    $('#posttype').val('news');
		                }
		                else if (newsItem.type.toUpperCase() === '1911FD9D-64CB-4795-870D-3CCB912CD2FB') {
		                    $('#posttype').val('event');
		                }
		                else if (newsItem.type.toUpperCase() === 'B0B7670A-8EB5-43E5-91FA-AFC9FA085D94') {
		                    $('#posttype').val('promotion');
		                }
		                
		                $('#newsEventTitle').val(newsItem.shortTitle);
		                $('#newsEventTitle').val(newsItem.longTitle);
		                $('#newsEventText').val(newsItem.description);
		                $('#moreInfoLink').val(newsItem.externalURL);
		                $('#newsEventPostDate').val(new moment(newsItem.postOnDate).format('YYYY-MM-DD'));
		                $('#newsEventRemoveDate').val(new moment(newsItem.removeOnDate).format('YYYY-MM-DD'));

		                // load image
		                if (newsItem.image.url) {
		                    $("#newsEventPromotionImage").attr("src", newsItem.image.url + "?" + Math.random());
		                    controller.savenewStorePromoImageId = newsItem.image.id;
		                    controller.savenewStorePromoImageUrl = newsItem.savenewStorePromoImageUrl;
		                }
		                else {
		                    $("#newsEventPromotionImage").attr("src", "https://placeholdit.imgix.net/~text?txtsize=33&txt=1046%C3%97322&w=1046&h=322");
		                }

		                $('#newsformbanner').html('Edit News/Event/Promotion');
		                $('#collapseNewsEventForms').show();
		            }
		        });
		    });

		},

		onClickDeleteNews: function (id) {
		    jConfirm("Are you sure you want to delete this item?", "Please confirm", function(r) {
		        if (r) {
		            siteCoreLibrary.retrieveStoreNews([siteCoreLibrary.stores[0].storeNumber], function (news) {
		                $.each(news, function (i, newsItem) {
		                    if (newsItem.id === id) {
		                        var newsItemToDelete = {};
		                        newsItemToDelete.id = id;
		                        siteCoreLibrary.deleteNews(newsItemToDelete, function (err, data) {
		                            toastr.success("Item deleted!");
		                            controller.populateUI(function () {
		                                controller.attachEventListeners();
		                            });
		                        });
		                    }
		                });
		            });
		        }
		    });
		},

		onButtonSaveNews(e) {

		    // verify post on and remove on date are correct

		    var postOnDate = moment($('#newsEventPostDate').val());
		    var removeOnDate = moment($('#newsEventRemoveDate').val());

		    if (!removeOnDate.isAfter(postOnDate)) {
		        e.stopPropagation();
		        toastr.error("Remove On Date has to be after Post On Date.");
		        return;
		    }

		    /*
            1911FD9D-64CB-4795-870D-3CCB912CD2FB - Events
            8FE528B2-28EB-49C9-8939-F014FF0FEF26 - News
            B0B7670A-8EB5-43E5-91FA-AFC9FA085D94 - Promotion

            */

		    var newsItem = {};
		    newsItem.StoreId = siteCoreLibrary.stores[0].id;
		    if ($('#posttype').val() === 'news') {
		        newsItem.type = '8FE528B2-28EB-49C9-8939-F014FF0FEF26';
		    }
		    else if ($('#posttype').val() === 'event') {
		        newsItem.type = '1911FD9D-64CB-4795-870D-3CCB912CD2FB';
		    }
		    else if ($('#posttype').val() === 'promotion') {
		        newsItem.type = 'B0B7670A-8EB5-43E5-91FA-AFC9FA085D94';
            }
		  
		    newsItem.shortTitle = $('#newsEventTitle').val();
		    newsItem.longTitle = $('#newsEventTitle').val();
		    newsItem.description = $('#newsEventText').val();
		    newsItem.externalURL = $('#moreInfoLink').val();
		    newsItem.postOnDate = moment($('#newsEventPostDate').val()).format('YYYY-MM-DDT00:00:00');
		    newsItem.removeOnDate = moment($('#newsEventRemoveDate').val()).format('YYYY-MM-DDT00:00:00');
		    newsItem.eventStartDate = '0001-01-01T00:00:00';
		    newsItem.eventEndDate = '0001-01-01T00:00:00';

		    if (controller.savenewStorePromoImageId != null) {
		        newsItem.image = {};
		        newsItem.image.id = controller.savenewStorePromoImageId;
		        newsItem.image.url = controller.savenewStorePromoImageUrl;
		    }
		    else {
		        newsItem.image = {};
		    }

		    if (controller.isAdd == true) {
		        siteCoreLibrary.createNews(newsItem, function (err, data) {
		            controller.populateUI(function () {
		                controller.attachEventListeners();
		            });
		        });
		    }
		    else if (controller.isAdd == false) {
		        newsItem.id = controller.idEditing;

		        siteCoreLibrary.modifyNews(newsItem, function (err, data) {
		            controller.populateUI(function () {
		                controller.attachEventListeners();
		            });
		        });
		    }
		},

		onUploadPhoto: function (event) {

		    var controller = this;
		    event.preventDefault();

		    $('#storenumberhiddenn').val(siteCoreLibrary.stores[0].storeNumber);

		    $("#newsEventPromotionImage").attr("src", "https://placeholdit.imgix.net/~text?txtsize=24&txt=Loading...&w=150&h=150");

		    siteCoreLibrary.addStoreImage(new FormData($('#uploader_form_newsimage_1')[0]), function (err, data) {
		        controller.savenewStorePromoImageId = data.results.id;
		        controller.savenewStorePromoImageUrl = data.results.url;
		        $("#newsEventPromotionImage").attr("src", controller.savenewStorePromoImageUrl + "?" + Math.random());
		     
		        $('#uploader_form_newsimage_1')[0].reset();
		    });

		},

		onRemoveGraphicButton() {
		    controller.savenewStorePromoImageId = null;
		    controller.savenewStorePromoImageUrl = null;
		    $('#newsEventPromotionImage').attr('src', 'https://placeholdit.imgix.net/~text?txtsize=33&txt=1046%C3%97322&w=1046&h=322');
		},

		onButtonCancelNews() {
		    window.location.href = marcomUserData.$constants.storePagesUrl;
		},

		OnShowActiveOnly() {
		    $('#linkshowall').show();
		    $('#linkshowactiveonly').hide();

		    controller.showAll = false;

		    controller.populateUI(function () {
		        controller.attachEventListeners();
		    });
		},

		OnShowAll() {

		    $('#linkshowall').hide();
		    $('#linkshowactiveonly').show();

		    controller.showAll = true;

		    controller.populateUI(function () {
		        controller.attachEventListeners();
		    });
		}
  
	};

	return {
		controller: controller,
	};
})(jQuery);

StorePageDetailController.controller.postInitCallbacks.push(
	function() { StorePageDetailNewsController.controller.init() } 
);
