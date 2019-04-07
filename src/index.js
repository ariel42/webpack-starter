/* #region Polyfills loading for your app - please keep it at the header of the file: */
////

//// Static polyfills that will be downloaded anyway:
import './static-polyfills.js';

//// Dynamic polyfills that will be downloaded only by browsers that were found at runtime 
//// that they don't support all the needed features natively. Modern browsers may not download it at all.
//// Make sure that you imported Promise polyfill correctly, by selecting the correct option for you app at static-polyfills.js:
if (isBrowserMissingFeatures()) {
  import('./dynamic-polyfills.js').then(function () {
    main();
  });
} else {
  main();
}

//// Example for runtime browser features detection, the important things are to keep in sync
//// with dynamic-polyfills.js, and to write simple code that doesn't need any polyfills by itself:
function isBrowserMissingFeatures() {
  //// If no need for dynamic polyfills loading - just return false here:
  // return false;

  //// Sample code that can be used:
  const neededFeatures = [window.Symbol /*, window.fetch /* /*, etc. */]; //KEEP IN SYNC with dynamic-polyfills.js

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
//demonstrate .css, .sass and .scss support, either as constant or as useable styles:
import './style/main.css';
import './style/main.sass';
import './style/main.scss';
import useableCss from './style/main.useable.css';
import useableSass from './style/main.useable.sass';
import useableScss from './style/main.useable.scss';

//// And your code goes inside main() function:
function main() {
  //ensure that Symbol if working, even in old browsers:
  var testSymbol = Symbol('Test');
  window[testSymbol] = 'Hello world, Symbol is working!';
  console.log(window[testSymbol]);

  useableCss.use();
  useableSass.use();
  useableScss.use();
  switchUseableStyles(true);
}

function switchUseableStyles(again) {
  setTimeout(() => {
    useableCss.unuse();
    useableSass.unuse();
    useableScss.unuse();

    setTimeout(() => {
      useableCss.use();
      useableSass.use();
      useableScss.use();

      if (again) {
        switchUseableStyles(false);
      }
    }, 1000);
    
  }, 1000);
}
