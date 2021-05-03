const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|assets)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    entry: {
        municipio: {
            import: './src/municipio.js'
        }
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        // filename: "[name].js",
        // sourceMapFilename: "[name].js.map"
    },
    resolve: {
        alias: {
            'chart.js': 'chart.js/dist/Chart.js'
        }
    },
    externals: {
        moment: 'moment'
    },
    devtool: 'source-map',
    ignoreWarnings: [/Failed to parse source map/],
};