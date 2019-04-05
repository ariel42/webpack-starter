////  The selected polyfills here will be always loaded statically by polyfills.js bundle, for both es5Browsers and es56Browsers.
////  The es6Browsers output may be smaller, since modern browsers support natively many ES features without polyfills.

import 'regenerator-runtime'; //keep this line here anyway

//// Select polyfills to load statically:
// import ...
// import ...
// import ...

//// For loading all ES features - it costs about 23kb/34kb gzipped for es6Browsers/es5Browsers:
// import 'core-js/stable'; //comment above imports and uncomment this

//// if you need dynamic importing of polyfills, and you didn't import all ES features above, then you have to import Promise:
import 'core-js/es/promise'; //full Promise with Promise#finally, up to 12kb gzipped with its dependencies.

//// For Promise polyfill without Promise#finally, that saves up to 1kb gzipped and is good enough for dynamic loading,
//// you can use those 2 imports instead:
// import 'core-js/modules/es.promise';
// import 'core-js/modules/es.array.iterator';
