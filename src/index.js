/* #region Polyfills loading for your app - please keep it at the header of the file: */
////

//// Static polyfills that will be downloaded anyway:
import './static-polyfills.js';

//// Dynamic polyfills that will be downloaded only by browsers that were found at runtime 
//// that they don't support all the needed features natively. Modern browsers may not download it at all.
//// Make sure that you imported Promise polyfill correctly, by selecting the correct option for you app at static-polyfills.js:
if (isBrowserMissingFeatures()) {
  import('./dynamic-polyfills.js').then(function() {
    main();
  });
} else {
  main();
}

//// Example for runtime browser features detection, the important things are to keep in sync
//// with dynamic-polyfills.js, and to write simple code that doesn't need any polyfills by itself:
function isBrowserMissingFeatures() {
  //// If no need for dynamic polyfills loadings - just return false here:
  // return false;

  //// Sample code that can be used:
  const neededFeatures = [window.fetch /* feature2 /*, /* etc. */]; //KEEP IN SYNC with dynamic-polyfills.js

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

//// Now your imports go here:
import './scss/main.scss';
import useableStyle from './scss/main.useable.scss';

//// And your code goes inside main() function:
function main() {
  useableStyle.use();

  setTimeout(() => {
    useableStyle.unuse();
    setTimeout(() => {
      useableStyle.use();
    }, 1000);
  }, 1000);
}
