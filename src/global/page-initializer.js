//// The following code will load the dynamic polyfills if necessary, and run the page.
//// 
//// Please don't modify the code.

import { isBrowserMissingFeatures } from './browser-checker';

let initAndRunPage = USE_DYNAMIC_POLYFILLS ?
    function (pageMainFn) {
        if (isBrowserMissingFeatures()) {
            import('./dynamic-polyfills').then(pageMainFn);
        }
        else { //launch the callback asynchronously - don't release Zalgo!
            setTimeout(pageMainFn, 0);
        }
    } :
    function (pageMainFn) {
        setTimeout(pageMainFn, 0);
    };

export { initAndRunPage };
