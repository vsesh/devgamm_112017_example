const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        multi: './client/multiGame.js'
    },
    output: {
        filename: 'build/[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // new UglifyJSPlugin()
    ]
};
