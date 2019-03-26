# webpack-starter
Webpack starter kit with simple and sane configuration, for starting a clean HTML and ES6 project with modern development tools, without assumptions about any external library.

This projects aims to setup Webpack and take advantage of its benefits to create a good start point for many web sites and web applications, by providing a good development experience and an efficient production build. So instead of spending hours to learn Webpack and configure it correctly you are provided with a good configuration out of the box. You may customize it later if you want, but you don't have to.

This project makes no assumptions about any library that will or will not be used in the application, such as React, Vue.js, jQuery, etc, and should not be used instead of specific framework tools such as create-react-app for React based apps. It is just inteneded for starting a clean HTML and ES6 project, and you are welcome to import any library to it.

### Features

- Very simple way to start a clean web project with Webpack benefits
- ES6 modules support by Webpack (import/export, import(), require/module.exports)
- ES6 language support by Babel
- Development server with hot reload
- Builds efficient production code, with optimizations and minifications
- SCSS support
- Usable css/scss support - use or unuse the style programmatically (see the included hello world code for example)
- Generates source maps

### Usage

After cloning or getting the master version into a folder, just run ` npm install ` and then ` npm start ` 
inside that folder to start the development server. It will open the browser with the hello world code from src folder. Edit the html, js or scss files to see the hot reload in action!

Use src/index.js as the main entry of your application - import and use any other libraries and scss files there.

When ready to production, run ` npm run build `.
The ready optimized production files will be located inside build folder. 
