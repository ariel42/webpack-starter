//// The polyfills here will be bundeled into dynamic-polyfills.js, and will be downloaded dynamically only by browsers that need them.
//// Browsers that support all the needed features, either natively or by using the static polyfills, won't download that bundle at all.
////
//// Use this only for loading non core-js polyfills, since core-js polyfills are inferred automatically from the code itself,
//// and bundled statically if needed by the target browsers (ES6 or legacy browsers).
////
//// PLEASE KEEP IN SYNC with the runtime features checking - isBrowserMissingFeatures() at browser-checker.js (the exact polyfills order isn't important):

import 'whatwg-fetch'; //Fetch API is not part of core-js, and it costs about 3kb gzipped.
// import ...
// import ...
