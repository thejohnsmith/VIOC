/** Get Hash Parameters
 * Usage: getHashParams.hashParams || getHashParams.hashParams.programId
 * @return {object} hashParams
 */
var getHashParams = (function($) {
  var hashParams = {};
  var e,
    a = /\+/g, // Regex for replacing addition symbol with a space
    r = /([^&;=]+)=?([^&;]*)/g,
    d = function(s) {
      return decodeURIComponent(s.replace(a, " "));
    },
    q = window.location.hash.substring(1);

  while (e = r.exec(q))
    hashParams[d(e[1])] = d(e[2]);
  // return hashParams;

  return {
    hashParams: hashParams
  };
})(jQuery);
