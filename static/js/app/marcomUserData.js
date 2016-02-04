/** Marcom User Data
 * Usage: marcomUserData.$user || marcomUserData.$user.externalId
 * @param {class} .user-related
 * @return {object} $user
 */

var marcomUserData = (function($) {
  var $userRelated = $('.user-related');
  var user = {
    externalId: $userRelated.data('user-external-id') || '',
    loginId: $userRelated.data('user-login-id') || '',
    firstName: $userRelated.data('user-first-name') || '',
    lastName: $userRelated.data('user-last-name') || '',
    email: $userRelated.data('user-email') || ''
  };
  return {
    $user: user
  };
})(jQuery);
