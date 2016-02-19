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

      // TO DO: Write a proper function for these...
      $j('.navBarItem > a').filter(function() {
        return $j(this).text() === 'REPORTS';
      }).attr('href', 'https://bo-vioc.epsilon.com').attr('target',
        '_blank');
      $j('.navBarItem > a').filter(function() {
        return $j(this).text() === 'ON DEMAND MARKETING';
      }).attr('href',
        'https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/catalog.aspx?uigroup_id=479602&folder_id=1633307'
      );
    },
    /* Inserts a the site favicon */
    setFavicon = function() {
      return $j('head').append(
        '<link rel="icon" href="https://files.marcomcentral.app.pti.com/epsilon/static/images/favicon.ico" type="image/x-icon">'
      );
    }
  return appUtilities();
})
