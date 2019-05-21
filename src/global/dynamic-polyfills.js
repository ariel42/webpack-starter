//// The polyfills here will be bundeled into dynamic-polyfills.js, and will be downloaded dynamically only by browsers that need them.
//// Browsers that support all the needed features, either natively or by using the static polyfills, won't download that bundle at all.
////
//// PLEASE KEEP IN SYNC with the runtime browser features checking, at isBrowserMissingFeatures() in index.js (the exact order isn't important).
//// Also keep in mind that dynamic importing is Promise based, so make sure that Promise is included in static-polyfills.js.

//// Fetch API is not included in core-js and hence it will be bundled here even for modern ES6 browsers, and it costs about 3kb gzipped.
import 'whatwg-fetch';
import 'core-js/modules/web.url';
// import ...

