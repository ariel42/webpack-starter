//// Polyfills section - please keep it at the header of the file:
////

//// Static polyfills that will be loaded anyway:
import './static-polyfills.js';

//// Dynamic polyfills that will be loaded by browser feature detection at run time:
//// Make sure that you loaded Promise inside static-polyfills.js, and fill the neededFeatures array.
//// The polyfills bundle will be loaded at runtime only by browsers that don't support all the features natively:

const neededFeatures = [window.fetch]; //KEEP IN SYNC with dynamic-polyfills.js
let hasMissingFeature = false; //we use simple code, that doesn't need polyfills by itself
for (var i = 0; i < neededFeatures.length; ++i) {
  if (neededFeatures[i] == null) {
    
    console.log(`Fetch is available? ${ window.fetch != null }! Making dynamic import of polyfills`);

    hasMissingFeature = true;
    import('./dynamic-polyfills').then(function() {
      main();
    });
    break;
  }
}
if (!hasMissingFeature) {
  main();
}

////
//// End of polyfills section.
//// Now your imports go here:

import './scss/main.scss';
import useableStyle from './scss/main.useable.scss';

////  And your code goes inside main() function:

function main() {
  console.log(`Fetch is available? ${ window.fetch != null }!`);

  useableStyle.use();

  setTimeout(() => {
    useableStyle.unuse();
    setTimeout(() => {
      useableStyle.use();
    }, 1000);
  }, 1000);
}
