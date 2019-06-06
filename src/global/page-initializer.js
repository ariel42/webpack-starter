//// The following code will load the dynamic polyfills if necessary, and run the page.
//// 
//// Please don't modify the code.

import { isBrowserMissingFeatures } from './browser-checker';

let initAndRunPage = USE_DYNAMIC_POLYFILLS ?
    function (pageMainFn) {
        if (isBrowserMissingFeatures()) {
            if (WILL_BE_ANOTHER_STAGE) {
                import(/* webpackChunkName: "dynamic-polyfills-es6" */ './dynamic-polyfills').then(pageMainFn);
            }
            else {
                import(/* webpackChunkName: "dynamic-polyfills" */ './dynamic-polyfills').then(pageMainFn);
            }
        }
        else { //launch the callback asynchronously - don't release Zalgo!
            setTimeout(pageMainFn, 0);
        }
    } :
    function (pageMainFn) {
        setTimeout(pageMainFn, 0);
    };

export { initAndRunPage };
