const path = require('path');

module.exports = {
    entry: {
        municipio: {
            import: './src/municipio.js'
        }
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
    },
    resolve: {
        alias: {
            'chart.js': 'chart.js/dist/Chart.js'
        }
    },
    externals: {
        moment: 'moment'
    },
    mode: 'production'
};