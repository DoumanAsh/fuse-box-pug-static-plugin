'use strict';

const path = require('path');
const fs = require('fs');
const mkdirs = require('./mkdirs.js').mkdirs;

/**
 * Jade plugin class.
 */
class PugCompiler {
    /**
     * Initializes new instance of ESLinter.
     * @param {Object} options - Optional options of plugin
     */
    constructor(options) {
        this.test = /.pug$/;

        this.root = require('app-root-path').path;
        this.inner = require('pug');

        this.ignore_pattern = /_*\.*/;
        if (options) {
            this.pug_options = options.pug || {};
        }
    }

    init(context) {
        context.allowExtension(".pug");

        this.out_dir = path.join(this.root, path.dirname(context.outFile));
        if (!fs.existsSync(this.out_dir)) {
            fs.mkdirSync(this.out_dir);
        }
    }

    transform(file) {
        if (file.collection.name === file.context.defaultPackageName) {
            file.loadContents();
            const parsed_pug = {
                content: this.inner.render(file.contents, this.pug_options),
                path: path.join(this.out_dir, file.info.fuseBoxPath.replace(/\..*$/, '.html'))
            };

            file.contents = '';
            return mkdirs(path.dirname(parsed_pug.path)).then(() => new Promise((resolve, reject) => {
                fs.writeFile(parsed_pug.path, parsed_pug.content, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            }));
        }
    }
}

module.exports = (options) => new PugCompiler(options);
