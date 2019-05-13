//// Please follow the instructions at the beginning of webpack.config.js, for global configuration of your app.

//// Your specific imports for this page go here:
// import ... ;
// import ... ;
// import ... ;

//// If you want to use dynamic polyfills loading, and configured it at step 2 of the instructions, use these lines:
import { dynamicPolyfillsLoader } from './global/dynamic-polyfills-loader';
dynamicPolyfillsLoader.loadIfNeededAndThen(pageMain);

//// Otherwise if you don't need dynamic polyfills loading, remark those lines and just call pageMain() instead:
// pageMain();

//// Your specific page code goes here, inside this function:
function pageMain() {
    console.log('Hello Webpack!');
}
