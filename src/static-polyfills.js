//// The selected polyfills here will be always downloaded statically by polyfills.js bundle, for both es5Browsers and es56Browsers.
//// The es6Browsers output may be smaller, since the native ES6 syntax is more compact,
//// and also modern browsers support natively many ES features without polyfills.

import 'regenerator-runtime/runtime'; // keep this line here anyway

//// Select polyfills to load statically:
// import ...
// import ...
// import ...

//// For loading all ES stable features - uncomment this, it costs about 23kb/34kb gzipped for es6Browsers/es5Browsers:
// import 'core-js/stable';

/* #region Promise polyfill selection: */
////
//// The idea is that it is not needed in es6Browsers, if the only use of Promise in your app 
//// is for dynamic import() of scripts. The native Promise implementations in those browsers 
//// should be good enough for that, even if they aren't 100% compliant with the most recent standard.
////
//// Please choose one of the following:

//// 1. If in your app, you BOTH USE dynamic import(), that requires Promise, AND ALSO DON'T HAVE any other use of Promise:
//// Select the correct option in webpack.config.js (the LONGER 'main-es5' definition around line 62), and don't import anything here.

//// 2. If in you app, you BOTH DON'T USE dynamic import(), AND ALSO DON'T HAVE any other use of Promise in your app:
//// Select the correct option in webpack.config.js (the SHORTER 'main-es5' definition around line 65), and don't import anything here.

//// 3. If in your app, you HAVE any other of use of Promise that not related to dynamic import():
//// Select the correct option in webpack.config.js (the SHORTER 'main-es5' definition around line 65), and also you have to import Promise.
//// If you imported all ES features above - nothing more is required.
//// Otherwise, you have to import Promise here. Either use this:
////
// import 'core-js/es/promise'; // for full Promise with Promise#finally, up to 8kb gzipped with its dependencies.
////
//// Or if you don't have any use of Promise#finally in you app,
//// you can use these 2 imports instead of it, for a minor saving of about 0.5kb gzipped:
////
// import 'core-js/modules/es.promise';
// import 'core-js/modules/es.array.iterator';

////
/* #endregion of Promise polyfill selection */
