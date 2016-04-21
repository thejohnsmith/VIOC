/** Get Program Participation Stats
 * Usage: getProgramParticipationStats.makeRequest();
 * @param {int} programId, this is taken from the location URL
 * @param {object} data.userId
 */
var getProgramParticipationStats = (function ($) {
	/* Use getHashParams.js to get programId */
	var programId = getParameterByName('programId', window.location.href);
	var marcomFilePath = marcomUserData.$constants.marcomFilePath;
	var makeRequest = function () {
			// Make sure there's a User ID loaded from Marcom before we Init this script.
			if (marcomUserData.$user.externalId === '%%User.ExternalId%%') {
				return;
			}
			var apiPath = marcomUserData.$constants.apiPath + 'getProgramParticipationStats.jssp';
			$.ajax({
				url: apiPath,
				type: 'GET',
				dataType: 'json',
				processData: true,
				data: {
					userId: marcomUserData.$user.externalId
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).done(function (result) {
				getProgramTitle(result);
				loadProgramData(result);
				loadDashboardData(result);
			}).fail(function () {
				requestFailed();
			}).always(function (result) {
				$programParticipationStats = result;
			});
		},
		/** Get Program title
		 * Gets the programTitle from API matched to the programID hash in the URL.
		 * @param {object} result Json object from API request.
		 * @return {string} programTitle
		 */
		getProgramTitle = function (result) {
			if (!$('.h1.page-title').length) {
				return;
			}
			return result.map(function (obj) {
				var programTitle = getParameterByName('programId', window.location.href);
				if (JSON.stringify(obj.id) === programId) {
					/** Update the breadcrumbs_previous text and title for Specialty Programs
					 */
					if (obj.isSpecialtyProgram) {
						isSpecialtyProgram = obj.isSpecialtyProgram;
						/* Change Breadcrumb text */
						$('.breadcrumbs_previous1 a').text('Specialty Programs').attr('title', 'Specialty Programs').attr('href', 'CustomPage.aspx?uigroup_id=479602&page_id=10793');
						/* Make nav item active */
						$('.navBarItem > a').filter(function () {
							return $(this).text() === 'SPECIALTY PROGRAMS';
						}).toggleClass('navBarEnhancedLinkColor navBarSelectedLinkColor').parent().toggleClass('navBarEnhancedActiveBackgroundColor navBarEnhancedBackgroundColor').addClass('navBarSelected');
					}
					programTitle = obj.programName;
					return setProgramTitle(programTitle);
				}
				if (programId === '#' || programId === 'l' || programId === '=' || programId < 1) {
					console.warn('Program ID was not found: %c Result is unknown', 'color: #f10; font-weight: bold;');
					programTitle = 'Unknown';
					return setProgramTitle(programTitle);
				}
			});
		},
		/** Set Program title
		 * Sets the programTitle text for the page header.
		 * Fades title in to prevent flashing of other text.
		 * @param {object} result Json object from API request.
		 * @return {string} programTitle found through getProgramTitle.
		 */
		setProgramTitle = function (programTitle) {
			$('.h1.page-title span').text(programTitle + ' Program').show();
			$('h1.page-title').removeClass('hidden')

			var programSettingsName = getParameterByName('programId', window.location.href);
			$('.settings-title').text(programSettingsName);
			// customCheckAndRadioBoxes.customCheckbox();
			return setBreadcrumbTitle(programTitle);
		},
		setBreadcrumbTitle = function (programTitle) {
			$('#breadcrumbs span').text(programTitle + ' Program');
		},
		loadDashboardData = function (result) {
			if ($('.participation-dashboard-tpl').length) {
				$.get(marcomFilePath + 'participation-dashboard.mustache.html', function (templates) {
					var template = $(templates).filter('.participation-dashboard-template').html();
					$('.participation-dashboard-tpl').html(Mustache.render(template, result));
					return loadProgramData(result);
				});
			}
		},
		/** Load Program Data
		 * Updates the participation dashboard
		 * @param {template} $programSelectTpl, Mustache template
		 * @param {string} programDataRendered, html output of $programSelectTpl
		 * @retrun {function} upDateProgramsDashboard
		 */
		loadProgramData = function (result) {
			$.get(marcomFilePath + 'program-list.mustache.html', function (templates) {
				var template = $(templates).filter('.program-list-template').html();
				$('.program-select.lifecycle-program-list').html(Mustache.render(template, result));
				// customCheckAndRadioBoxes.customCheckbox();
				return upDateProgramsDashboard(result), setProgramTabContent();
			});

			$.get(marcomFilePath + 'specialty-program-list.mustache.html', function (templates) {
				var template = $(templates).filter('.specialty-program-list-template').html();
				$('.program-select.specialty-program-list').html(Mustache.render(template, result));
				customCheckAndRadioBoxes.customCheckbox();
				upDateProgramsDashboard(result), setProgramTabContent();
			});
		},

		/**
		 * Updates the .program-select properties.
		 * @param {object} result Json object from API request.
		 * @param {string} $programId Shorthand for items.
		 * @return {string} outputs fill sections.
		 */
		upDateProgramsDashboard = function (result) {
			// define colors
			var programStatus = {
				alert: ['status-red'],
				warning: ['status-yellow'],
				success: ['status-green'],
				error: ['status-error']
			};

			// Yellow Highlight
			$('.program-select .program-list li').on('mouseover', function () {
			  $('.program-select .program-list li').removeClass('item-highlight');
			  $(this).addClass('item-highlight');
			});

			// Same Highlight, different, using jQueyr
			// $('.program-select .program-list li').hover(function () {
			// 	$(this).addClass('item-highlight');
			// }, function () {
			// 	$(this).removeClass('item-highlight');
			// });

			return $.each(result, function (index, obj) {
				var $programId = $('#program-' + obj.id);
				// Make sure to ommit non-lifecycle campaign entries.
				if (obj.isLifecycleCampaign || obj.isSpecialtyProgram) {
					// No stores participating : Red
					if (obj.storesParticipating === 0 || obj.storesParticipating === 0 && obj.storesEligible === 0) {
						$programId.attr('class', programStatus.alert);
					}
					// More than one store participating : Yellow
					if (obj.storesParticipating > 0 && obj.storesEligible > 0) {
						$programId.attr('class', programStatus.warning);
						// All stores participating : Green
						if (obj.storesParticipating === obj.storesEligible) {
							$programId.attr('class', programStatus.success);
							$programId.find('.customCheckbox').addClass('disabled disabled-checked');
						}
					}
				}
				// Check for errors:
				// If more stores participating than eligible display error state.
				if (obj.storesParticipating > obj.storesEligible || !$.isNumeric(obj.storesParticipating)) {
					handleDashboardError(obj);
				}
				// Handle errors
				// Color : Gray
				// Displays warning symbol '⚠'
				function handleDashboardError (obj) {
					return $programId.attr('class', programStatus.error).find('.program-status').html('&#9888;').attr('title', 'An error occurred');
				}
			});
		},
		setFirstProgramTabContent = function () {
			var $initialFirstTab = $('#programSummary .program-list:first .program-overview-tab-content').html();
			var $initialLastTab = $('#programSummary .program-list:first .program-touchpoints-tab-content').html();
			$('#programDetails .resp-tab-content:first').html($initialFirstTab);
			$('#programDetails .participation-table thead').next().html($initialLastTab);
			$('#programDetails .js-loading').fadeOut();
		},
		setProgramTabContent = function () {
			setFirstProgramTabContent();
			return $('.program-list').hover(function () {
				var $firstTab = $(this).find('.program-overview-tab-content').html();
				$('#programDetails .resp-tab-content:first').html($firstTab);
				var $lastTab = $(this).find('.program-touchpoints-tab-content').html();
				$('#programDetails .participation-table thead').next().html($lastTab);
			}, function () {
				return;
			});
		},
		requestFailed = function () {
			$('.program-select').html('There was a problem fetching your programs.' + 'Please check back again later.');
			$('.alert-container').html('<programss="alert-main alert-danger">DANGER: An error occured</div>').fadeIn();
			// Display a success toast, with a title
			return console.warn('An internal error has occurred.');
		};
	return {
		makeRequest: makeRequest,
		getProgramTitle: getProgramTitle,
		setProgramTitle: setProgramTitle,
		loadProgramData: loadProgramData,
		upDateProgramsDashboard: upDateProgramsDashboard,
		requestFailed: requestFailed
	};
})(jQuery);

getProgramParticipationStats.makeRequest();
