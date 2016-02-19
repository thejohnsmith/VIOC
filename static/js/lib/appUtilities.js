$j(function() {
  var appUtilities = function() {
      setBrowserTitle(),
        changeNavBarLink(),
        setFavicon()
    },
    setBrowserTitle = function() {
      var $pageTitle = $j('.page-title').text();
      $j('title').remove().html($pageTitle);
    },
    /* Adds a new destination to the Reports link in main navigation */
    changeNavBarLink = function() {
      $j('.navBarItem > a').filter(function() {
        return $j(this).text() === 'REPORTS';
      }).attr('href', 'https://bo-vioc.epsilon.com').attr('target',
        '_blank');
    },
    /* Inserts a the site favicon */
    setFavicon = function() {
      return $j('head').append(
        '<link rel="icon" href="https://files.marcomcentral.app.pti.com/epsilon/static/images/favicon.ico" type="image/x-icon">'
      );
    }
  return appUtilities();
})
