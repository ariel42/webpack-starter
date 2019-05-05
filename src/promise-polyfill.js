//// The idea here is the Promise polyfill is not needed for modern ES6 browsers, if the only use of Promise 
//// in your app is for dynamic import() of other modules. The native Promise implementations in those browsers 
//// should be good enough for that, even if they aren't 100% compliant with the most recent standard.
////
//// Please choose one of the following:

//// 1. If in your app, you BOTH USE dynamic import(), that requires Promise, AND ALSO DON'T HAVE any other use of Promise:
//// Set promiseUsedOnlyForDynamicImport = true at the beginning of webpack.config.js, and don't import anything here.

//// 2. If in you app, you BOTH DON'T USE dynamic import(), AND ALSO DON'T HAVE any other use of Promise in your app:
//// Set promiseUsedOnlyForDynamicImport = false at the beginning of webpack.config.js, and don't import anything here.

//// 3. If in your app, you HAVE any other of use of Promise that not related to dynamic import():
//// Set promiseUsedOnlyForDynamicImport = false at the beginning of webpack.config.js, and also you have to import Promise:
//// If you imported all ES features at the beginning of polyfills.js - nothing more is required.
//// Otherwise, you have to import Promise here. Either use this:
////
// import 'core-js/es/promise'; // for full Promise with Promise#finally, up to 8kb gzipped with its dependencies.
////
//// Or if you don't have any use of Promise#finally in you app,
//// you can use these 2 imports instead of it, for a minor saving of about 0.5kb gzipped:
////
// import 'core-js/modules/es.promise';
// import 'core-js/modules/es.array.iterator';
