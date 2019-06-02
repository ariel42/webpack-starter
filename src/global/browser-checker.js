//// The dynamic polyfills bundle (dynamic-polyfills.js) will be downloaded only after a runtime check that the current browser doesn't support
//// all the needed features (either natively or by the static polyfills), so the browser will not download it at all if anything is already supported.
//// It implements the ideas of this great artice by Philip Walton: https://philipwalton.com/articles/loading-polyfills-only-when-needed/
////
//// Use this only for loading non core-js polyfills, since core-js polyfills are inferred automatically from the code itself,
//// and bundled statically if needed by the target browsers (ES6 or legacy browsers).
////
//// Please implement the following isBrowserMissingFeatures function according to your needs, return true if one or more required features are missing.

//// Here is a sample code that can be used, the important things are to keep in sync with the imports inside 
//// dynamic-polyfills.js file, and to write a simple code that doesn't need any polyfills by itself:
export function isBrowserMissingFeatures() {
    const neededFeatures = [window.fetch /*, etc */ /*, etc. */]; //KEEP IN SYNC with dynamic-polyfills.js

    let missingFeatures = false; //we use simple code, that doesn't need polyfills by itself
    for (var i = 0; i < neededFeatures.length; ++i) {
        if (!neededFeatures[i]) {
            missingFeatures = true;
            break;
        }
    }
    return missingFeatures;
} 
