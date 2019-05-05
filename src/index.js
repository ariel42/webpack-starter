//// Please follow the polyfills instructions at polyfills.js remarks, and keep the following import at the header of the file:
import { polyfills } from './polyfills'; 

//// Your global imports that used in all pages go here:
import './global';

//// Your specific imports for this page go here:
// import ... ;
// import ... ;
// import ... ;

//// If you need dynamic polyfills by runtime check, then keep this line here after the imports,
//// and implement the function isBrowserMissingFeatures in polyfills.js according to your needs:
polyfills.loadDynamicAndThen(pageMain);

//// Otherwise if you don't need dynamic polyfills, just remark it and call this instead:
// pageMain();

//// Your specific page code goes here, inside the function:
function pageMain() {
    console.log('Hello Webpack!')
}
