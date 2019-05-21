//// The selected polyfills here will be always downloaded statically by polyfills.js bundle, for both legacy ES5 Browsers and modern ES6 browsers.
//// But the output bundle that will be built for ES6 Browsers should be smaller, since the native ES6 syntax is more compact,
//// and also modern browsers support natively many ES features without polyfills, so they won't be included in the bundle.

//// Typical polyfills:
import 'core-js/es'; //All ES stable language features, including Promise. Costs about 17kb/27kb gzipped for ES6/ES5 browsers.
import 'regenerator-runtime/runtime'; //Needed only for legacy browsers (generators support), ~3kb gzipped.

//// Import here any other core-js polyfills that were not included above.
// import 'core-js/...' ;
// import 'core-js/...' ;
// import 'core-js/...' ;
