//// Please follow the instructions at the beginning of webpack.config.js, for global configuration of your app.

//// Your specific imports for this page go here:
import './style/sample.css';
import './style/sample.sass';
import './style/sample.scss';
import useableCss from './style/sample.useable.css';
import useableSass from './style/sample.useable.sass';
import useableScss from './style/sample.useable.scss';

//// Your specific page code goes here, inside this function:
function pageMain() {
  //ensure that Fetch API exists, even in old browsers, since it is included in the 
  //dynamic-polyfills bundle that was downloaded dynamically by them, after the runtime checking above:
  console.log(`Hello World! Is Fetch Api available? ${!!window.fetch}!`);

  if (module.hot) { //should be true only if we run `npm start`
    console.log('Hot Module Replacement (HMR) is working!');
    //HMR works for css out of the box, change css values in src/style files to see it in action.
    //See https://webpack.js.org/guides/hot-module-replacement/ to use it also for hot reloading of js module files.
  }

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

//// Leave those lines here to init the page (e.g. load dynamic polyfills if necessary):
import { initPageAndThen } from './global/page-initializer';
initPageAndThen(pageMain);
