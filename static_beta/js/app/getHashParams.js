/** Get Hash Parameters
 * Usage: getHashParams.hashParams || getParameterByName('programId', window.location.href)
 * @return {object} hashParams
 */
var getHashParams = (function ($) {
	var hashParams = {};
	var e,
		// Regex for replacing addition symbol with a space
		a = /\+/g,
		r = /([^&;=]+)=?([^&;]*)/g,
		d = function (s) {
			return decodeURIComponent(s.replace(a, ' '));
		},
		q = window.location.hash.substring(1);

	while (e = r.exec(q)) {
		hashParams[d(e[1])] = d(e[2]);
	}
	return {
		hashParams: hashParams
	};
})(jQuery);