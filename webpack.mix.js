const mix = require("laravel-mix");

mix.js("resources/js/app.js", "public/js/pp.js").sass("resources/scss/app.scss", "public/scss/app.scss");
