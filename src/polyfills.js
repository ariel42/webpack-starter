/* #region Static polyfills loading */

//// The selected polyfills here will be always downloaded statically by polyfills.js bundle, for both legacy ES5 Browsers and modern ES6 browsers.
//// But the output bundle that will be built for ES6 Browsers may be smaller, since the native ES6 syntax is more compact,
//// and also modern browsers support natively many ES features without polyfills, so they won't be included in the build.

import 'regenerator-runtime/runtime'; // keep this line here anyway

//// For loading all ES stable features, including Promise - uncomment this, it costs about 23kb/34kb gzipped for ES6/ES5 browsers:
import 'core-js/stable';

//// Import the Promise polyfill here if you didn't import all ES fetaures above, and also you have in your app
//// ANY usage of Promise that is NOT RELATED to dynamic import() (which is also Promise based):
// import 'core-js/es/promise';

//// Import here any other core-js polyfills that were not included above:
// import 'core-js/...'
// import 'core-js/...'
// import 'core-js/...'

/* #endregion of Static polyfills loading */


/* #region Dynamic polyfills loading */

//// The dynamic polyfills bundle (dynamic-polyfills.js) will be downloaded only after a runtime check that the current browser doesn't support
//// all the needed features (either natively or by the above static polyfills), so the browser will not download it at all if anything is already supported.
//// Please set appUsesDynamicImport to true at the beginning of webpack.config.js, to be able to use the dynamic import() here.

//// Here is a sample code that can be used for runtime browser features detection, the important things are 
//// to keep in sync with the imports inside dynamic-polyfills.js file, and to write simple code that doesn't need any polyfills by itself:
function isBrowserMissingFeatures() {
    const neededFeatures = [window.Symbol /*, window.fetch */ /*, etc. */]; //KEEP IN SYNC with dynamic-polyfills.js

    let missingFeatures = false; //we use simple code, that doesn't need polyfills by itself
    for (var i = 0; i < neededFeatures.length; ++i) {
        if (neededFeatures[i] == null) {
            missingFeatures = true;
            break;
        }
    }
    return missingFeatures;
}

let polyfills = {
    loadDynamicAndThen: function (callback) {
        if (isBrowserMissingFeatures()) {
            import('./dynamic-polyfills').then(function () {
                callback();
            });
        }
        else { //launch the callback asynchronously - Don't Release Zalgo!
            setTimeout(function () {
                callback();
            }, 0);
        }
    }
}

/* #endregion of Dynamic polyfills loading */

export { polyfills };
