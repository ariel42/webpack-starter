//// The selected polyfills here will be always downloaded statically by polyfills.js bundle, for both legacy ES5 Browsers and modern ES6 browsers.
//// But the output bundle that will be built for ES6 Browsers should be smaller, since the native ES6 syntax is more compact,
//// and also modern browsers support natively many ES features without polyfills, so they won't be included in the bundle.

// import 'core-js/es'; //All ES stable language features, including Promise. Costs about 17kb/27kb gzipped for ES6/ES5 browsers.

//basic ES5 poyfills for old browsers compatibility:
import 'core-js/es/function/bind';
import 'core-js/es/object/create';
import 'core-js/es/object/define-property';
import 'core-js/es/object/define-properties';
import 'core-js/es/date/now';
import 'core-js/es/date/to-iso-string';
import 'core-js/es/date/to-json';
import 'core-js/es/date/to-primitive';
//polyfill for compatibility for that basic method:
import 'core-js/es/object/assign';

//needed for dynamic import:
import 'core-js/modules/es.promise'; //also needed for async/await, fetch, etc.
import 'core-js/modules/es.array.iterator';

//generators and async/await support (not needed and not bundled for es6 browsers):
import 'regenerator-runtime/runtime'; 

//// Import here any other non core-js polyfills, don't import more core-js polyfills since they are inferred automatically
//// from the code itself, and bundled statically if needed by the target browsers (ES6 or legacy browsers):
// import 'whatwg-fetch'; //in this project we load it dynamically just if needed, in dynamic-polyfills.js.
// import '...' ;
// import '...' ;
