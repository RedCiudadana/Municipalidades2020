import Chart from 'chart.js/dist/Chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
    align: 'start',
    anchor: 'end',
    offset: -20,
    display: true,
    font: {
        weight: 'bold'
    },
    color: '#666666'
});