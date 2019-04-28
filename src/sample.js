//please read the polyfills instructions at global.js remarks, and keep the following import at the header of the file:
import { loadPolyfills } from './global';

//your imports go here: we demonstrate .css, .sass and .scss support, either as constant or as useable styles:
import './style/main.css';
import './style/main.sass';
import './style/main.scss';
import useableCss from './style/main.useable.css';
import useableSass from './style/main.useable.sass';
import useableScss from './style/main.useable.scss';

loadPolyfills(pageMain); //please keep it here, after the imports

//your specific page code goes here, inside the function:
function pageMain() {

  //ensure that Symbol if working, even in old browsers:
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
