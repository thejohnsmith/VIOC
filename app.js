/**
 * Require Browsersync
 */
var browserSync = require('browser-sync');

/**
 * Run Browsersync with server config
 */
browserSync({
  server: "static",
  files: ["static/*.js", "static/*.html", "static/css/*.css"]
});
