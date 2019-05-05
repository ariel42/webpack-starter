//// Please follow the polyfills instructions at polyfills.js remarks, and keep the following import at the header of the file:
import { polyfills } from './polyfills';

//// Your global imports that used in all the pages go here:
import './global';

//// Your specific imports for this page go here:
import './style/main.css';
import './style/main.sass';
import './style/main.scss';
import useableCss from './style/main.useable.css';
import useableSass from './style/main.useable.sass';
import useableScss from './style/main.useable.scss';

//// If you need dynamic polyfills by runtime check, then keep this line here after the imports,
//// and implement the function isBrowserMissingFeatures in polyfills.js according to your needs:
polyfills.loadDynamicAndThen(pageMain);

//// Otherwise if you don't need dynamic polyfills, just remark it and call this instead:
// pageMain();

//// Your specific page code goes here, inside the function:
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
