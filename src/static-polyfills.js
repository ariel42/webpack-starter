////  The selected polyfills here will be always loaded statically by polyfills.js bundle, for both es5Browsers and es56Browsers.
////  The es6Browsers output may be smaller, since modern browsers support natively many ES features without polyfills.

import 'regenerator-runtime'; //keep this line here anyway

//// Select polyfills to load statically:
// import ...
// import ...
// import ...

//// For loading all ES features - it costs about 23kb/34kb gzipped for es6Browsers/es5Browsers:
// import 'core-js/stable'; //comment above imports and uncomment this

//// About Promise:
//// The idea is that they are not needed in es6Browsers if their only use is to load polyfills dynamically.
//// Please choose one of the follwing:

//// 1. If you BOTH USE dynamic polyfills loading (it requires Promise), AND you DON'T HAVE any other use of Promise in your app:
//// Select the correct option in webpack.config.js (the LONGER 'main-es5' definition around line 62), and don't import nothing here.

//// 2. If you BOTH DON'T USE dynamic polyfills loading (it requires Promise), AND you DON'T HAVE any other use of Promise in your app:
//// Select the correct option in webpack.config.js (the SHORTER 'main-es5' definition around line 65), and don't import nothing here.

//// 3. If you HAVE any other of use of Promise in your app that not related to dynamic polyfills loading: 
//// Select the correct option in webpack.config.js (the SHORTER 'main-es5' definition around line 65), and also you have to import Promise.
//// If you imported all ES features above - nothing more is required.
//// If you didn't import all ES features above - you have to import Promise here, use either this:
////
// import 'core-js/es/promise'; // for full Promise with Promise#finally, up to 8kb gzipped with its dependencies.
////
//// Or if you don't have any use of Promise#finally in you app,
//// you can use these 2 imports instead of the above import, for a minor saving of about 0.5kb gzipped:
////
// import 'core-js/modules/es.promise';
// import 'core-js/modules/es.array.iterator';
