/* #region Polyfills loading for your app - please keep it at the header of the file: */
////

//// Static polyfills that will be downloaded anyway:
import './static-polyfills.js';

//// Dynamic polyfills file that will be downloaded only after runtime check that the current browser 
//// doesn't support all the needed features natively. Modern browsers may not download it at all.
//// Make sure that you imported Promise polyfill correctly, by selecting the correct option for you app at static-polyfills.js:
function loadPolyfills(callback) {
    if (isBrowserMissingFeatures()) {
        import('./dynamic-polyfills.js').then(function() {
            callback();
        });
    }
    else {
        callback();
    }
}

//// Example for runtime browser features detection, the important things are to keep in sync
//// with dynamic-polyfills.js, and to write simple code that doesn't need any polyfills by itself:
function isBrowserMissingFeatures() {
    //// If no need for dynamic polyfills loading - just return false here:
    // return false;

    //// Sample code that can be used:
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

////
/* #endregion of Polyfills loading */

export { loadPolyfills };
