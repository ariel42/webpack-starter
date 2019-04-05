//// The scripts here will be loaded dynamically from dynamic-polyfills.js bunlde only by browsers that need them.
//// Browsers that support natively all the needed features won't download the polyfills bundle at all.
////
//// PLEASE KEEP IN SYNC with neededFeatures array in index.js, in the dynamic polyfills part:

// import ...
// import ...
// import ...

//// Fetch is not included in core-js and hence it will be compiled even for es6Browsers, and it costs about 3kb gzipped.
//// Comment it if not needed:
import 'whatwg-fetch';
