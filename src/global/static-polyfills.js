//// The selected polyfills here will be always downloaded statically by polyfills.js bundle, for both legacy ES5 Browsers and modern ES6 browsers.
//// But the output bundle that will be built for ES6 Browsers may be smaller, since the native ES6 syntax is more compact,
//// and also modern browsers support natively many ES features without polyfills, so they won't be included in the build.

import 'regenerator-runtime/runtime'; // keep this line here anyway

//// For loading all ES stable features - uncomment this, it costs about 23kb/34kb gzipped for ES6/ES5 browsers:
// import 'core-js/stable';

//// Import here any other core-js polyfills that were not included above.
////
//// DON'T IMPORT Promise polyfill here, it will be included automatically if needed by webpack.config.js,
//// according to your configuration settings at the beginning of that file:
////
// import 'core-js/...' ;
// import 'core-js/...' ;
// import 'core-js/...' ;
