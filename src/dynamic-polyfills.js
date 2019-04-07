//// The polyfills here will be bundeled into dynamic-polyfills.js, and will be downloaded dynamically only by browsers that need them.
//// Browsers that support natively all the needed features won't download that bundle at all.
//// PLEASE KEEP IN SYNC with the runtime browser features checking, at isBrowserMissingFeatures() in index.js (the exact order isn't important):

//// Fetch is not included in core-js and hence it will be compiled even for modern ES6 browsers, and it costs about 3kb gzipped.
//// Comment it if not needed:
// import 'whatwg-fetch';

import 'core-js/modules/es.symbol';
// import ...
// import ...
