//// The polyfills here will be bundeled into dynamic-polyfills.js, and will ne loaded dynamically only by browsers that need them.
//// Browsers that support natively all the needed features won't download that bundle at all.
//// PLEASE KEEP IN SYNC with the runtime browser features checking, at isBrowserMissingFeatures() in index.js:

// import ...
// import ...
// import ...

//// Fetch is not included in core-js and hence it will be compiled even for es6Browsers, and it costs about 3kb gzipped.
//// Comment it if not needed:
import 'whatwg-fetch';
