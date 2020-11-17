const path = require('path');

module.exports = {
    entry: './chart.js',
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'main.js'
    },
    resolve: {
        alias: {
            'chart.js': 'chart.js/dist/Chart.js'
        }
    },
    externals: {
        moment: 'moment'
    }
};