/* #region Static polyfills loading */

//// The selected polyfills here will be always downloaded statically by polyfills.js bundle, for both legacy ES5 Browsers and modern ES6 browsers.
//// But the output for ES6 Browsers may be smaller, since the native ES6 syntax is more compact,
//// and also modern browsers support natively many ES features without polyfills, so they won't be included in the build.

import 'regenerator-runtime/runtime'; // keep this line here anyway

//// For loading all ES stable features, including Promise - uncomment this, it costs about 23kb/34kb gzipped for ES6/ES5 browsers:
import 'core-js/stable';

// If you didn't import all ES fetaures, then import promise polyfill and select the correct option from the 3 options in that file:
// import './promise-polyfill';

//// ...and also import any other core-js polyfills to load statically:
// import ...
// import ...
// import ...

/* #endregion of Static polyfills loading */


/* #region Dynamic polyfills loading */

//// The dynamic polyfills bundle (dynamic-polyfills.js) will be downloaded only after a runtime check that the current browser doesn't support
//// all the needed features (either natively or by the above static polyfills), so the browser will not download it at all if anything is already supported.
//// Make sure that you imported Promise polyfill correctly above.

//// Here is a sample code that can be used for runtime browser features detection, the important things are 
//// to keep in sync with dynamic-polyfills.js, and to write simple code that doesn't need any polyfills by itself:
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
        else {
            callback();
        }
    }
}

/* #endregion of Dynamic polyfills loading */

export { polyfills };
