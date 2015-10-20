var path = require('path');
var webpack = require('webpack');
var join = path.join.bind(path, __dirname);
require('es6-promise').polyfill();
module.exports = {
    devtool: 'eval',
    devServer: {
        port: 7000
    },
    entry: [
        'webpack-hot-middleware/client',
        join('./public/index.jsx')
    ],
    output: {
        path: join('dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        alias: {
            'subschema': join('node_modules/subschema/src/'),
            'subschema-g10n': join('../'),
            'react':join('../node_modules/react'),
            'lodash':join('../node_modules/lodash')
        },
        extensions: ["", ".webpack-loader.js", ".web-loader.js", ".loader.js", ".js", '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.subschema\.js(on)?$/,
              // This is more realistic - but for sanity.
              //  loader: 'subschema-g10n/subschema-loader',
                loader:join('../subschema-loader')
            },
            {
                test: /\.js(x)?$/,
                loaders: ['babel?stage=0'],
                include: [join('src'), join('public'), 'subschema']

            }, {
                test: /\.js(x)?$/,
                loaders: ['babel?stage=0'],
                exclude: [/node_modules\/.*\/node_modules\/.*/]
                //   include: [path.join(__dirname, 'client'), path.join(__dirname, 'public'), path]
            }, {
                test: /.*\.less/,
                loader: "style!css!less?strictMath&noIeCompat"
            }]
    }
};
