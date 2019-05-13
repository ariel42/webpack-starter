//// Please follow the instructions at the beginning of webpack.config.js, for global configuration of your app.

//// Your specific imports for this page go here:
import './style/main.css';
import './style/main.sass';
import './style/main.scss';
import useableCss from './style/main.useable.css';
import useableSass from './style/main.useable.sass';
import useableScss from './style/main.useable.scss';

//// If you want to use dynamic polyfills loading, and configured it at step 2 of the instructions, use these lines:
import { dynamicPolyfillsLoader } from './global/dynamic-polyfills-loader';
dynamicPolyfillsLoader.loadIfNeededAndThen(pageMain);

//// Otherwise if you don't need dynamic polyfills loading, just call pageMain() instead:
// pageMain();

//// Your specific page code goes here, inside this function:
function pageMain() {
  //ensure that Symbol if working, even in old browsers, since it is included in the 
  //dynamic-polyfills bundle that was downloaded dynamically by them (and only by them):
  var testSymbol = Symbol('Test');
  window[testSymbol] = 'Hello world, Symbol is working!';
  console.log(window[testSymbol]);

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
