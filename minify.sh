#! /bin/bash
#Minify JS and CSS
node ./node_modules/minifier/index.js ./public/js/util.js
node ./node_modules/minifier/index.js ./public/css/animation.css
node ./node_modules/minifier/index.js ./public/css/css-form.css
node ./node_modules/minifier/index.js ./public/css/style.css
node ./node_modules/minifier/index.js ./public/css/infoCard.css
