//// Please follow the instructions at the beginning of webpack.config.js, for global configuration of your app.

//// Your specific imports for this page go here:
// import ... ;
// import ... ;
// import ... ;

//// Your specific page code goes here, inside this function:
function pageMain() {
    console.log('Hello Webpack!');
}

//// Leave those lines here to init and run the page (e.g. load dynamic polyfills if necessary):
import { initAndRunPage } from './global/page-initializer';
initAndRunPage(pageMain);
