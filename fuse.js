const fsbx = require('fuse-box');
const puged = require('./src');

fsbx.FuseBox.init({
    homeDir: "test_templates/",
    plugins: [
        puged()
    ],
    outFile: "build/out.js"
}).bundle(">index.ts [**/*.pug]");
