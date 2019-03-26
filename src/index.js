import './scss/main.scss';
import useableStyle from './scss/main.useable.scss';

useableStyle.use();

setTimeout(() => {
  useableStyle.unuse();
  setTimeout(() => {
    useableStyle.use();
  }, 1000);
}, 1000);

console.log('Hello, world!');
