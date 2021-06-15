import { Area, Column, Treemap, Pie } from '@antv/g2plot';
import * as Sentry from "@sentry/browser";

Array.prototype.reduceCatch = function (_function) {
  if (this.length === 0) { return null }
  return this.reduce(_function);
};

function ChartException(message, parameters) {
  const error = new Error(message);

  error.parameters = parameters;
  return error;
}

ChartException.prototype = Object.create(Error.prototype);

function abbreviateNumber(value) {
  if (!value || Number.isNaN(value)) {
    return null;
  }

  return value.toLocaleString('lan');
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "K", "M"];
    var suffixNum = Math.floor(("" + value).length / 3);
    suffixNum = suffixNum >= 3 ? 2 : suffixNum;
    var shortValue = '';
    for (var precision = 4; precision >= (suffixNum === 2 ? 4 : 2); precision--) {
      shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortValue.length <= 3) { break; }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(2);
    newValue = shortValue.toLocaleString('lan') + ' ' + suffixes[suffixNum];
  }
  return newValue;
}

function createChart(type, id, title, data, labels, options) {
  if (window.myCharts === undefined) {
    window.myCharts = {};
  }

  if (window.myCharts[id] !== undefined) {
    console.error(`El chart ${id} ya está declarado.`);
    return;
  }

  if (!(
    type === 'bar'
    || type === 'pie'
    || type === 'line'
    || type === 'barStacked'
    || type === 'areaStacked'
    || type === 'treemap'
  )) {
    console.error(`El tipo ${type} no esta soportado. Los tipos soportados son bar y pie.`);
    return;
  }

  if (!document.getElementById(id)) {
    console.error(`El elemento ${id} no se encontro.`);
    Sentry.captureException(new Error(`El elemento ${id} no se encontro.`));
    return;
  }

  // Validar si ya se renderizo este chart.
  if (document.getElementById(id).attributes.getNamedItem('data-chart-source-type') !== null) {
    id = id.replace('chart', 'chart2');
  }


  let isPercentual = true;
  let g2plotdata = [];
  // guessing stuff
  if (options && options.isG2plotData) {
    g2plotdata = data;

    isPercentual = options.isPercentual ? true : false;
  } else {
    for (let i = 0; i < data.length; i++) {
      if (data[i] > 100) {
        isPercentual = false;
      }

      if (type === 'treemap') {
        g2plotdata.push({
          value: data[i],
          name: labels[i],
          label: labels[i]
        });
      } else {
        g2plotdata.push({
          data: data[i],
          label: labels[i]
        });
      }
    }
  }

  if (g2plotdata.length === 0) {
    document.getElementById(id).innerText = 'No hay datos disponibles';
    Sentry
      .captureException(new Error(`No hay datos en chart ${id}`), {
        level: Sentry.Severity.Warning,
        contexts: {
          municipio: municipio.idMunicipal
        }
      });

    return;
  }

  let color = null;
  if (options && options.color) {
    color = options.color;
  }

  let smooth = false;
  if (options && options.smooth) {
    smooth = options.smooth;
  }
  let promedio = [];
  if (options && options.promedio) {
    promedio = options.promedio;
  }

  // let annotations = [];
  // if (promedio.length > 0) {
  //   let firstAnnotation = null;
  //   promedio.forEach((item) => {
  //     if (firstAnnotation === null) {

  //     }
  //   });
  // }

  var canvas = document.getElementById(id);
  var container = document.createElement('div');
  container.id = id;
  container.style.height = '220px';
  canvas.replaceWith(container);

  // g2plot stuff
  if (type === 'line') {

    let annotations = [];
    if (options && options.promedio) {
      for (let i = 1; i < options.promedio.length; i++) {
        const promedioItem = options.promedio[i];
        const prevpromedioItem = options.promedio[i - 1];
        const dataItem = g2plotdata[i];
        const prevdataItem = g2plotdata[i - 1];

        annotations.push({
          type: 'line',
          // x, y
          start: [prevdataItem.label, prevpromedioItem],
          end: [dataItem.label, promedioItem],
          style: {
            stroke: '#F4664A',
            lineDash: [10, 4],
          }
        });

        annotations.push({
          type: 'text',
          position: annotations[0].start,
          content: 'Promedio del departamento',
          offsetY: -10,
          style: {
            textBaseline: 'bottom',
          },
        });
      }
    }

    let maxLimit = null;

    if (isPercentual) {
      maxLimit = 100;
    } else {
      if (options.promedio) {
        let maxPromedio = options.promedio.reduceCatch((a, b) => Math.max(a, b));
        let maxData = g2plotdata.map((item) => item.data).reduceCatch((a, b) => Math.max(a, b));

        if (maxPromedio > maxData) {
          maxLimit = maxPromedio * 1.2;
        }
      }
    }

    if (options && options.maxLimit) {
      maxLimit = options.maxLimit;
    }

    const line = new Area(id, {
      data: g2plotdata,
      xField: 'label',
      yField: 'data',
      smooth: smooth,
      yAxis: {
        maxLimit: maxLimit,
        label: {
          formatter: (text, item, index) => {
            // console.log(text, item, index);
            return parseInt(text);
          }
        }
      },
      tooltip: {
        formatter: ({ label, data }) => {
          return { name: label, value: abbreviateNumber(data) };
        },
      },
      annotations: annotations
    });


    // 低于中位数颜色变化
    // this is so cool.
    // {
    //   type: 'regionFilter',
    //   start: ['min', 'median'],
    //   end: ['max', '0'],
    //   color: '#F4664A',
    // },
    // {
    //   type: 'text',
    //   position: ['0%', '50%'],
    //   content: 'Media del departamento',
    //   offsetY: -10,
    //   style: {
    //     textBaseline: 'bottom',
    //   },
    // },
    // {
    //   type: 'line',
    //   // start: ['min', 'median'],
    //   // end: ['max', 'median'],
    //   start: ['0%', '50%'],
    //   end: ['100%', '50%'],
    //   style: {
    //     stroke: '#F4664A',
    //     lineDash: [10, 4],
    //   },
    // },

    try {
      line.render();
    } catch {
      console.error(`Error al renderizar ${id}`);
      Sentry
        .captureException(
          new ChartException(`Error al renderizar ${id}`, ...arguments));
      console.log(...arguments);
    }
    return;
  }

  if (type === 'bar') {

    const bar = new Column(id, {
      data: g2plotdata,
      yField: 'data',
      xField: 'label',
      // yAxis: {
      //   maxLimit: isPercentual ? 100 : null
      // },
      tooltip: {
        formatter: ({ label, data }) => {
          return { name: label, value: abbreviateNumber(data) };
        },
      }
    });

    try {
      bar.render();
    } catch {
      console.error(`Error al renderizar ${id}`);
      Sentry
        .captureException(
          new ChartException(`Error al renderizar ${id}`, ...arguments));
      console.log(...arguments);
    }
    return;
  }

  if (type === 'pie') {

    const pie = new Pie(id, {
      data: g2plotdata,
      angleField: 'data',
      colorField: 'label',
      height: 200,
      appendPadding: 1,
      radius: 0.5,
      legend: false,
      label: {
        type: 'spider',
        labelHeight: 28,
        content: '{name}\n{percentage}',
      },
      tooltip: {
        formatter: ({ label, data }) => {
          return { name: label, value: abbreviateNumber(data) };
        },
      }
    });

    try {
      pie.render();
    } catch {
      console.error(`Error al renderizar ${id}`);
      Sentry
        .captureException(
          new ChartException(`Error al renderizar ${id}`, ...arguments));
      console.log(...arguments);
    }
    return;
  }

  if (type === 'barStacked') {
    const stackedColumnPlot = new Column(id, {
      data: g2plotdata,
      isStack: true,
      yField: 'data',
      xField: 'label',
      smooth: smooth,
      color: color,
      seriesField: options.seriesField ? options.seriesField : 'serie',
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle', // 'top', 'bottom', 'middle'
        // 可配置附加的布局方法
        layout: [
          // 柱形图数据标签位置自动调整
          { type: 'interval-adjust-position' },
          // 数据标签防遮挡
          { type: 'interval-hide-overlap' },
          // 数据标签文颜色自动调整
          { type: 'adjust-color' },
        ],
      },
    });

    try {
      stackedColumnPlot.render();
    } catch {
      console.error(`Error al renderizar ${id}`);
      Sentry
        .captureException(
          new ChartException(`Error al renderizar ${id}`, ...arguments));
      console.log(...arguments);
    }
    return;
  }

  if (type === 'areaStacked') {

    let annotations = [];
    if (options && options.promedio) {
      let labels = g2plotdata.map((item) => item.label);
      let unique = labels.filter((item, i, ar) => ar.indexOf(item) === i);

      for (let i = 1; i < unique.length; i++) {
        const promedioItem = options.promedio[i];
        const prevpromedioItem = options.promedio[i - 1];
        const dataItem = unique[i];
        const prevdataItem = unique[i - 1];

        annotations.push({
          type: 'line',
          // x, y
          start: [prevdataItem, prevpromedioItem],
          end: [dataItem, promedioItem],
          style: {
            stroke: '#F4664A',
            lineDash: [10, 4],
          }
        });

        annotations.push({
          type: 'text',
          position: annotations[0].start,
          content: 'Promedio del departamento',
          offsetY: -10,
          style: {
            textBaseline: 'bottom',
          },
        });
      }
    }

    let serie = options.seriesField ? options.seriesField : 'serie';
    let maxLimit = options.maxLimit ? options.maxLimit : null;

    /**
     * Los stacked por ahora nunca seran porcentuales.
     */

    if (isPercentual) {
      maxLimit = 200;
    } else {
      if (options.promedio) {
        let maxPromedio = options.promedio.reduceCatch((a, b) => Math.max(a, b));
        let labels = g2plotdata.map((item) => item.label);
        labels = labels.filter((item, i, ar) => ar.indexOf(item) === i);

        let maxData = g2plotdata.map((item) => item.data).reduceCatch((a, b) => Math.max(a, b));

        labels.forEach((label) => {
          let total = g2plotdata.filter((item) => item.label === label).map((item) => item.data).reduceCatch((a, b) => a + b);
          maxData = Math.max(maxData, total);
        });

        if (maxPromedio > maxData) {
          maxLimit = maxPromedio * 2;
        }
      }
    }

    const stackedColumnPlot = new Area(id, {
      data: g2plotdata,
      yField: 'data',
      xField: 'label',
      color: color,
      yAxis: {
        maxLimit: maxLimit
      },
      seriesField: serie,
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle', // 'top', 'bottom', 'middle'
        // 可配置附加的布局方法
        layout: [
          // 柱形图数据标签位置自动调整
          { type: 'interval-adjust-position' },
          // 数据标签防遮挡
          { type: 'interval-hide-overlap' },
          // 数据标签文颜色自动调整
          { type: 'adjust-color' },
        ],
      },
      annotations: annotations
    });

    try {
      stackedColumnPlot.render();
    } catch {
      console.error(`Error al renderizar ${id}`);
      Sentry
        .captureException(
          new ChartException(`Error al renderizar ${id}`, ...arguments));
      console.log(...arguments);
    }
    return;
  }

  if (type === 'treemap') {
    const bar = new Treemap(id, {
      data: {
        name: title,
        children: g2plotdata
      },
      colorField: 'label',
      tooltip: {
        fields: ['label', 'value'],
        formatter: (options) => {
          let { label, value } = options;
          return { name: label, value: abbreviateNumber(value) };
        }
      }
    });

    try {
      bar.render();
    } catch {
      console.error(`Error al renderizar ${id}`);
      Sentry
        .captureException(
          new ChartException(`Error al renderizar ${id}`, ...arguments));
      console.log(...arguments);
    }
    return;
  }
}

// General
function renderGeneral(municipio) {
  if (municipio.cuadro10Poblacion) {
    createChart(
      'pie',
      'chart-general-1',
      'Sexo',
      [
        municipio.cuadro10Poblacion.hombres,
        municipio.cuadro10Poblacion.mujeres,
      ],
      ["Hombres", "Mujeres"]
    );

    createChart(
      'pie',
      'chart-general-2',
      'Tipo de área',
      [
        municipio.cuadro10Poblacion.urbana,
        municipio.cuadro10Poblacion.rural,
      ],
      ["Urbana", "Rural"]
    );
  }
}

// Gestion municipal
function renderGestionMunicipal(municipio) {
  createChart(
    'line',
    'chart-gestion-municipal-1',
    'Índice gestión municipal %',
    [
      municipio.ranking.segeplan2013,
      municipio.ranking.segeplan2016,
      municipio.ranking.segeplan2018,
    ],
    ['2013', '2016', '2018'],
    {
      promedio: [
        municipio.promedios.ranking.segeplan2013,
        municipio.promedios.ranking.segeplan2016,
        municipio.promedios.ranking.segeplan2018,
      ]
    }
  );
}

// Transparencia
function renderTransparencia(municipio) {
  createChart(
    'line',
    'chart-transparencia-1',
    'Índice de Acceso a la Información Pública',
    [
      municipio.aip.aip2015,
      municipio.aip.aip2017,
      municipio.aip.aip2019,
    ],
    ['2015', '2017', '2019'],
    {
      promedio: [
        municipio.promedios.aip.aip2015,
        municipio.promedios.aip.aip2017,
        municipio.promedios.aip.aip2019,
      ]
    }
  );
}

// Nutricion
function renderNutricionAlimentacion(municipio) {
  let cronica = municipio.desnutricion.cronica.sort((a, b) => a.periodo - b.periodo);
  let aguda = municipio.desnutricion.aguda.sort((a, b) => a.periodo - b.periodo);

  let cronicaLastYear = cronica[cronica.length - 1];
  let agudaLastYear = aguda[aguda.length - 1];

  let desnutricion = cronica.concat(aguda);
  desnutricion = desnutricion.sort((a, b) => a.periodo - b.periodo);

  let min = desnutricion[0].periodo;
  let max = desnutricion[desnutricion.length - 1].periodo;

  let newArray = [];

  for (let i = min; i <= max; i++) {
    const cronicaItem = cronica.find((item) => item.periodo == i);
    const agudaItem = aguda.find((item) => item.periodo == i);

    newArray.push({
      data: cronicaItem ? cronicaItem.cantidad * 10 : 0,
      label: cronicaItem ? cronicaItem.periodo.toString() : i.toString(),
      serie: 'Crónica'
    });

    newArray.push({
      data: agudaItem ? agudaItem.cantidad * 10 : 0,
      label: agudaItem ? agudaItem.periodo.toString() : i.toString(),
      serie: 'Aguda'
    });
  }

  createChart(
    'areaStacked',
    'chart-nutricion-1',
    'Numero de Casos de Desnutrición Crónica por año',
    newArray,
    null,
    {
      isG2plotData: true,
      promedio: [
        municipio.promedios.desnutricion.cronicaYAguda2012,
        municipio.promedios.desnutricion.cronicaYAguda2013,
        municipio.promedios.desnutricion.cronicaYAguda2014,
        municipio.promedios.desnutricion.cronicaYAguda2015,
        municipio.promedios.desnutricion.cronicaYAguda2016,
        municipio.promedios.desnutricion.cronicaYAguda2017,
        municipio.promedios.desnutricion.cronicaYAguda2018,
        municipio.promedios.desnutricion.cronicaYAguda2019
      ]
    }
  );

  createChart(
    'pie',
    'chart-nutricion-2',
    'Casos de Desnutrición Crónica por sexo',
    [
      cronicaLastYear['m <1Mes'] +
      cronicaLastYear['m1Ma <2M'] +
      cronicaLastYear['m2Ma <1A'] +
      cronicaLastYear['m1Aa4A'],
      cronicaLastYear['f <1Mes'] +
      cronicaLastYear['f1Ma <2M'] +
      cronicaLastYear['f2Ma <1A'] +
      cronicaLastYear['f1Aa4A']
    ],
    ['Masculino', 'Femenino']
  );

  let g2dataDesnutricionEdad = [
    {
      data: cronicaLastYear['m <1Mes'],
      label: '[M] < 1 mes',
      serie: 'Crónica'
    },
    {
      data: cronicaLastYear['m1Ma <2M'],
      label: '[M] 1m a < 2m',
      serie: 'Crónica'
    },
    {
      data: cronicaLastYear['m2Ma <1A'],
      label: '[M] 2m a < 1 a',
      serie: 'Crónica'
    },
    {
      data: cronicaLastYear['m1Aa4A'],
      label: '[M] 1a a 4 a',
      serie: 'Crónica'
    },
    {
      data: cronicaLastYear['f <1Mes'],
      label: '[F] < 1 mes',
      serie: 'Crónica'
    },
    {
      data: cronicaLastYear['f1Ma <2M'],
      label: '[F] 1m a < 2m',
      serie: 'Crónica'
    },
    {
      data: cronicaLastYear['f2Ma <1A'],
      label: '[F] 2m a < 1 a',
      serie: 'Crónica'
    },
    {
      data: cronicaLastYear['f1Aa4A'],
      label: '[F] 1a a 4 a',
      serie: 'Crónica'
    },

    // aguda
    {
      data: agudaLastYear['m <1Mes'],
      label: '[M] < 1 mes',
      serie: 'Aguda'
    },
    {
      data: agudaLastYear['m1Ma <2M'],
      label: '[M] 1m a < 2m',
      serie: 'Aguda'
    },
    {
      data: agudaLastYear['m2Ma <1A'],
      label: '[M] 2m a < 1 a',
      serie: 'Aguda'
    },
    {
      data: agudaLastYear['m1Aa4A'],
      label: '[M] 1a a 4 a',
      serie: 'Aguda'
    },
    {
      data: agudaLastYear['f <1Mes'],
      label: '[F] < 1 mes',
      serie: 'Aguda'
    },
    {
      data: agudaLastYear['f1Ma <2M'],
      label: '[F] 1m a < 2m',
      serie: 'Aguda'
    },
    {
      data: agudaLastYear['f2Ma <1A'],
      label: '[F] 2m a < 1 a',
      serie: 'Aguda'
    },
    {
      data: agudaLastYear['f1Aa4A'],
      label: '[F] 1a a 4 a',
      serie: 'Aguda'
    }
  ];

  createChart(
    'barStacked',
    'chart-nutricion-3',
    'Numero de Casos de Desnutrición por edad',
    g2dataDesnutricionEdad,
    null,
    {
      isG2plotData: true,
      // 
      // color: ['#3866c3', '#95b8ff', '#80ffd6', '#5fc0a1'],
      smooth: false
    }
  );
}

// Pobreza
function renderPobreza(municipio) {
  createChart(
    'line',
    'chart-pobreza-1',
    'Índice de pobreza Multidimensional',
    [
      municipio.ipm.ipm2006,
      municipio.ipm.ipm2011,
      municipio.ipm.ipm2014,
    ],
    ['2006', '2011', '2014'],
    {
      promedio: [
        municipio.promedios.ipm.ipm2006,
        municipio.promedios.ipm.ipm2011,
        municipio.promedios.ipm.ipm2014
      ],
      maxLimit: 1
    }
  );
}
// Finanzas
function renderFinanzas(municipio) {
  createChart(
    'line',
    'chart-finanzas-1',
    'Presupuesto Municipal por año',
    [
      municipio.ejecucion7
        .filter((item) => item.ejercicio === 2016)
        .map((item) => Math.round(item.asignado))
        .reduceCatch((a, b) => a + b),
      municipio.ejecucion7
        .filter((item) => item.ejercicio === 2017)
        .map((item) => Math.round(item.asignado))
        .reduceCatch((a, b) => a + b),
      municipio.ejecucion7
        .filter((item) => item.ejercicio === 2018)
        .map((item) => Math.round(item.asignado))
        .reduceCatch((a, b) => a + b),
      municipio.ejecucion7
        .filter((item) => item.ejercicio === 2019)
        .map((item) => Math.round(item.asignado))
        .reduceCatch((a, b) => a + b),
    ],
    [
      '2016',
      '2017',
      '2018',
      '2019',
    ],
    {
      promedio: [
        Math.round(municipio.promedios.ejecucion7.asignado2016),
        Math.round(municipio.promedios.ejecucion7.asignado2017),
        Math.round(municipio.promedios.ejecucion7.asignado2018),
        Math.round(municipio.promedios.ejecucion7.asignado2019),
      ]
    }
  );

  let ejecucion2019 = municipio.ejecucion7
    .filter((item) => item.ejercicio === 2019)
    .sort((a, b) => a.asignado - b.asignado);

  createChart(
    'treemap',
    'chart-finanzas-2',
    'Distribucion de Presupuesto Municipal 2019',
    ejecucion2019
      .map((item) => Math.round(item.asignado)),
    ejecucion2019
      .map((item) => item.funcion)
  );

  createChart(
    'line',
    'chart-finanzas-3',
    'Ejecución Presupuestaria Municipal por año',
    [
      municipio.ejecucion7
        .filter((item) => item.ejercicio === 2016)
        .map((item) => Math.round(item.devengado))
        .reduceCatch((a, b) => a + b),
      municipio.ejecucion7
        .filter((item) => item.ejercicio === 2017)
        .map((item) => Math.round(item.devengado))
        .reduceCatch((a, b) => a + b),
      municipio.ejecucion7
        .filter((item) => item.ejercicio === 2018)
        .map((item) => Math.round(item.devengado))
        .reduceCatch((a, b) => a + b),
      municipio.ejecucion7
        .filter((item) => item.ejercicio === 2019)
        .map((item) => Math.round(item.devengado))
        .reduceCatch((a, b) => a + b),
    ],
    [
      '2016',
      '2017',
      '2018',
      '2019',
    ],
    {
      promedio: [
        municipio.promedios.ejecucion7.devengado2016,
        municipio.promedios.ejecucion7.devengado2017,
        municipio.promedios.ejecucion7.devengado2018,
        municipio.promedios.ejecucion7.devengado2019
      ]
    }
  );

  let ejecucionPresupuestaria2019 = municipio.ejecucion7
    .filter((item) => item.ejercicio === 2019)
    .sort((a, b) => a.devengado - b.devengado);

  createChart(
    'treemap',
    'chart-finanzas-4',
    'Distribucion de Ejecución Presupuestaria Municipal 2019',
    ejecucionPresupuestaria2019.map((item) => Math.round(item.devengado)),
    ejecucionPresupuestaria2019.map((item) => item.funcion)
  );

  var getTotalEjecucion = function (item) {
    let total = item['impuestosDirectos'] +
      item['impuestosIndirectos'] +
      item['tasas'] +
      item['contribucionesPorMejoras'] +
      item['arrendamientoDeEdificios,equiposEInstalaciones'] +
      item['multas'] +
      item['interesesPorMora'] +
      item['ventaDeServicios'] +
      item['intereses'] +
      item['arrendamientoDeTierrasYTerrenos'] +
      item['delSectorPrivado'] +
      item['donacionesCorrientes'] +
      item['delSectorPublico'] +
      item['disminucionDeDisponibilidades'] +
      item['obtencionDePrestamosInternosALargoPlazo'] +
      item['otrosIngresosNoTributarios'] +
      item['ventaDeBienes'] +
      item['dismDeActDiferidosYAnticiposAContratistas'] +
      item['ventaY/oDesincorporacionDeTierrasYTerrenos'] +
      item['dividendosY/oUtilidades'] +
      item['ventaY/oDesincorporacionDeActivosFijos'] +
      item['obtencionDePrestamosInternosACortoPlazo'] +
      item['delSectorExterno'] +
      item['donDeCapParaConstrDeBienesDeUsoCom'] +
      item['donDeCapP/constrDeBieUsoNoComYOtrasInv'] +
      item['disminucionDeCuentasACobrar'];

    return Math.round(total);
  }

  let dataFinanzas5 = [
    municipio.finanzas8
      .filter((item) => item.ejercicio === 2016)
      .map(getTotalEjecucion)[0],
    municipio.finanzas8
      .filter((item) => item.ejercicio === 2017)
      .map(getTotalEjecucion)[0],
    municipio.finanzas8
      .filter((item) => item.ejercicio === 2018)
      .map(getTotalEjecucion)[0],
    municipio.finanzas8
      .filter((item) => item.ejercicio === 2019)
      .map(getTotalEjecucion)[0],
  ];

  createChart(
    'line',
    'chart-finanzas-5',
    'Ingresos Municipales por año',
    dataFinanzas5,
    [
      '2016',
      '2017',
      '2018',
      '2019',
    ],
    {
      promedio: [
        municipio.promedios.finanzas8.ingresos2016,
        municipio.promedios.finanzas8.ingresos2017,
        municipio.promedios.finanzas8.ingresos2018,
        municipio.promedios.finanzas8.ingresos2019,
      ]
    }
  );

  let ingresos2019 = municipio.finanzas8
    .find((item) => item.ejercicio === 2019);

  createChart(
    'treemap',
    'chart-finanzas-6',
    'Distribucion de Ejecución Presupuestaria Municipal 2019',
    [
      ingresos2019['impuestosDirectos'],
      ingresos2019['impuestosIndirectos'],
      ingresos2019['tasas'],
      ingresos2019['contribucionesPorMejoras'],
      ingresos2019['arrendamientoDeEdificios,equiposEInstalaciones'],
      ingresos2019['multas'],
      ingresos2019['interesesPorMora'],
      ingresos2019['ventaDeServicios'],
      ingresos2019['intereses'],
      ingresos2019['arrendamientoDeTierrasYTerrenos'],
      ingresos2019['delSectorPrivado'],
      ingresos2019['donacionesCorrientes'],
      ingresos2019['delSectorPublico'],
      ingresos2019['disminucionDeDisponibilidades'],
      ingresos2019['obtencionDePrestamosInternosALargoPlazo'],
      ingresos2019['otrosIngresosNoTributarios'],
      ingresos2019['ventaDeBienes'],
      ingresos2019['dismDeActDiferidosYAnticiposAContratistas'],
      ingresos2019['ventaY/oDesincorporacionDeTierrasYTerrenos'],
      ingresos2019['dividendosY/oUtilidades'],
      ingresos2019['ventaY/oDesincorporacionDeActivosFijos'],
      ingresos2019['obtencionDePrestamosInternosACortoPlazo'],
      ingresos2019['delSectorExterno'],
      ingresos2019['donDeCapParaConstrDeBienesDeUsoCom'],
      ingresos2019['donDeCapP/constrDeBieUsoNoComYOtrasInv'],
      ingresos2019['disminucionDeCuentasACobrar'],
    ],
    [
      'Impuestos directos',
      'Impuestos indirectos',
      'Tasas',
      'Contribuciones por mejoras',
      'Arrendamiento de edificios equipos e instalaciones',
      'Multas',
      'Intereses por mora',
      'Venta de servicios',
      'Intereses',
      'Arrendamiento de tierras y terrenos',
      'Del sector privado',
      'Donaciones corrientes',
      'Del sector publico',
      'Disminucion de disponibilidades',
      'Obtencion de prestamos internos a largo plazo',
      'Otros ingresos no tributarios',
      'Venta de bienes',
      'Dism de act diferidos y anticipos a contratistas',
      'Venta y o desincorporacion de tierras y terrenos',
      'Dividendos y o utilidades',
      'Venta y o desincorporacion de activos fijos',
      'Obtencion de prestamos internos a corto plazo',
      'Del sector externo',
      'Don de cap para constr de bienes de uso com',
      'Don de cap p constr de bie uso no com y otras inv',
      'Disminucion de cuentas a cobrar',
    ]
  );
}
// Poblacion
function renderPoblacion(municipio) {
  // 1.- Población total por sexo
  if (municipio.cuadro10Poblacion) {
    createChart(
      'pie',
      'chart-poblacion-1',
      'Sexo',
      [
        municipio.cuadro10Poblacion.hombres,
        municipio.cuadro10Poblacion.mujeres,
      ],
      ["Hombres", "Mujeres"]
    );

    // 2.- Población total por grupos quinquenales de edad
    createChart(
      'bar',
      'chart-poblacion-2',
      'Población por grupo de edad',
      [
        municipio.cuadro10Poblacion["04"],
        municipio.cuadro10Poblacion["59"],
        municipio.cuadro10Poblacion["1014"],
        municipio.cuadro10Poblacion["1519"],
        municipio.cuadro10Poblacion["2024"],
        municipio.cuadro10Poblacion["2529"],
        municipio.cuadro10Poblacion["3034"],
        municipio.cuadro10Poblacion["3539"],
        municipio.cuadro10Poblacion["4044"],
        municipio.cuadro10Poblacion["4549"],
        municipio.cuadro10Poblacion["5054"],
      ],
      [
        "0-4",
        "5-9",
        "15-19",
        "20-24",
        "25-29",
        "30-34",
        "35-39",
        "40-44",
        "45-49",
        "50-54",
      ]
    );

    // 3.- Población total por área
    createChart(
      'pie',
      'chart-poblacion-3',
      'Tipo de área',
      [
        municipio.cuadro10Poblacion.urbana,
        municipio.cuadro10Poblacion.rural,
      ],
      ["Urbana", "Rural"]
    );
  }

  if (municipio.cuadro11Poblacion) {
    // 4.- Población según parentesco con el jefe(a) del hogar
    createChart(
      'bar',
      'chart-poblacion-4',
      "Población según parentesco con el jefe(a) del hogar",
      [
        municipio.cuadro11Poblacion["jefe(a)deHogar"],
        municipio.cuadro11Poblacion["esposa(o)oPareja"],
        municipio.cuadro11Poblacion["hija(o)hijastra(o)"],
        municipio.cuadro11Poblacion["nueraOYerno"],
        municipio.cuadro11Poblacion["nietaONieto"],
        municipio.cuadro11Poblacion["hermanaOHermano"],
        municipio.cuadro11Poblacion["madreOPadre"],
        municipio.cuadro11Poblacion["suegraOSuegro"],
        municipio.cuadro11Poblacion["cuñadaOCuñado"],
        municipio.cuadro11Poblacion["otra(o)pariente"],
        municipio.cuadro11Poblacion["noParientes"],
        municipio.cuadro11Poblacion[
        "poblaciónEnViviendasColectivasOEnSituaciónDeCalle"
        ],
      ],
      [
        "Jefe(a) de hogar",
        "Esposa(o) o pareja",
        "Hija(o) hijastra(o)",
        "Nuera o yerno",
        "Nieta o nieto",
        "Hermana o hermano",
        "Madre o padre",
        "Suegra o suegro",
        "Cuñada o cuñado",
        "Otra(o) pariente",
        "No parientes",
        "Viviendas colectivas o en situación de calle",
      ]
    );

    // 5.- Población de 10 años y más por estado conyugal
    createChart(
      'bar',
      'chart-poblacion-5',
      "Población por estado conyugal",
      [
        municipio.cuadro12Poblacion["soltera(o)"],
        municipio.cuadro12Poblacion["unida(o)"],
        municipio.cuadro12Poblacion["casada(o)"],
        municipio.cuadro12Poblacion["separada(o)"],
        municipio.cuadro12Poblacion["divorciada(o)"],
        municipio.cuadro12Poblacion["viuda(o)"],
      ],
      [
        "Soltera(o)",
        "Unida(o)",
        "Casada(o)",
        "Separada(o)",
        "Divorciada(o)",
        "Viuda(o)",
      ]
    );

    // 6.- Población total por lugar de nacimiento
    createChart(
      'bar',
      'chart-poblacion-6',
      "Población total por lugar de nacimiento",
      [
        municipio.cuadro13Poblacion["lugarNacimientoEnElMismoMunicipio"],
        municipio.cuadro13Poblacion["lugarNacimientoEnOtroMunicipio"],
        municipio.cuadro13Poblacion["lugarNacimientoEnOtroPais"],
        municipio.cuadro13Poblacion["lugarNacimientoNoDeclarado"],
      ],
      [
        "Mismo municipio",
        "En otro municipio ",
        "En otro pais",
        "No declarado",
      ]
    );
    // 7.- Población total por pueblos
    createChart(
      'bar',
      'chart-poblacion-7',
      "Población total por pueblos",
      [
        municipio.cuadro13Poblacion["lugarNacimientoEnElMismoMunicipio"],
        municipio.cuadro13Poblacion["lugarNacimientoEnOtroMunicipio"],
        municipio.cuadro13Poblacion["lugarNacimientoEnOtroPais"],
        municipio.cuadro13Poblacion["lugarNacimientoNoDeclarado"],
      ],
      [
        "Maya",
        "Gaifuna",
        "Xinka",
        "Afrodescendiente / Creole / Afromestizo",
        "Ladina(o)",
        "Extranjera(o)",
      ]
    );

    // 8.- Población con dificultades para ver, oír, caminar o subir escaleras, recordar o concentrarse, cuidado personal o comunicarse
    createChart(
      'pie',
      'chart-poblacion-8',
      "Población total por dificultades",
      [
        municipio.cuadro17Poblacion["sinDificultad"],
        municipio.cuadro17Poblacion["personasConAlMenosUnaDificultad"],
        municipio.cuadro17Poblacion["noDeclarado"],
      ],
      [
        "Sin dificultad",
        "Personas con al menos una dificultad",
        "No declarado",
      ]
    );

    // 9.- Población maya por comunidad lingüística
    createChart(
      'bar',
      'chart-poblacion-9',
      "Población maya por comunidad lingüística",
      [
        municipio.cuadro15Poblacion["achi"],
        municipio.cuadro15Poblacion["akateka"],
        municipio.cuadro15Poblacion["awakateka"],
        municipio.cuadro15Poblacion["ch'orti'"],
        municipio.cuadro15Poblacion["chalchiteka"],
        municipio.cuadro15Poblacion["chuj"],
        municipio.cuadro15Poblacion["itza'"],
        municipio.cuadro15Poblacion["ixil"],
        municipio.cuadro15Poblacion["jakalteko /popti'"],
        municipio.cuadro15Poblacion["k'iche'"],
        municipio.cuadro15Poblacion["kaqchikel"],
        municipio.cuadro15Poblacion["mam"],
        municipio.cuadro15Poblacion["mopan"],
        municipio.cuadro15Poblacion["poqomam"],
        municipio.cuadro15Poblacion["poqomchi'"],
        municipio.cuadro15Poblacion["q'anjob'al"],
        municipio.cuadro15Poblacion["q'eqchi'"],
        municipio.cuadro15Poblacion["sakapulteka"],
        municipio.cuadro15Poblacion["sipakapense"],
        municipio.cuadro15Poblacion["tektiteka"],
        municipio.cuadro15Poblacion["tz'utujil"],
        municipio.cuadro15Poblacion["uspanteka"],
      ],
      [
        "Achi",
        "Akateka",
        "Awakateka",
        "Ch'orti",
        "Chalchiteka",
        "Chuj",
        "Itza",
        "Ixil",
        "Jakalteko /Popti",
        "K'iche",
        "Kaqchikel",
        "Mam",
        "Mopan",
        "Poqomam",
        "Poqomchi",
        "Q'anjob'al",
        "Q'eqchi",
        "Sakapulteka",
        "Sipakapense",
        "Tektiteka",
        "Tz'utujil",
        "Uspanteka",
      ]
    );
    // 10.- Población según dificultades
    createChart(
      'bar',
      'chart-poblacion-10',
      "Población según dificultades",
      [
        municipio.cuadro17Poblacion["ver,aunSiUsaLentes"],
        municipio.cuadro17Poblacion["oir,inclusoConAparato"],
        municipio.cuadro17Poblacion["caminarOSubirEscaleras"],
        municipio.cuadro17Poblacion["recordarOConcentrarse"],
        municipio.cuadro17Poblacion["cuidadoPersonalOVestirse"],
        municipio.cuadro17Poblacion["comunicarse"],
      ],
      [
        "Ver, aun si usa lentes",
        "Oir, incluso con aparato",
        "Caminar o subir escaleras",
        "Recordar o concentrarse",
        "Cuidado personal o vestirse",
        "Comunicarse",
      ]
    );
  }
}

// Educación
function renderEducacion(municipio) {
  // 1.- Educación
  createChart(
    'bar',
    'chart-educacion-1',
    "Población de 4 años y más por nivel educativo",
    [
      municipio.cuadro18.preprimaria,
      municipio.cuadro18.primaria13,
      municipio.cuadro18.primaria45,
      municipio.cuadro18.primaria6,
      municipio.cuadro18.basico,
      municipio.cuadro18.diversificado,
      municipio.cuadro18.licenciatura,
      municipio.cuadro18.maestriaODoctorado,
    ],
    [
      "Preprimaria",
      "Primaria  1 - 3",
      "Primaria 4 - 5",
      "Primaria 6",
      "Basico",
      "Diversificado",
      "Licenciatura",
      "Maestria o Doctorado",
    ]
  );

  // 2.- Educación
  createChart(
    'bar',
    'chart-educacion-2',
    "Causa principal de inasistencia",
    [
      municipio.cuadro19["faltaDeDinero"],
      municipio.cuadro19["tieneQueTrabajar"],
      municipio.cuadro19["noHayEscuela,institutoOUniversidad"],
      municipio.cuadro19["losPadres /parejaNoQuieren"],
      municipio.cuadro19["quehaceresDelHogar"],
      municipio.cuadro19["noLeGusta /noQuiereIr"],
      municipio.cuadro19["yaTerminoSusEstudios"],
      municipio.cuadro19["otraCausa"],
      municipio.cuadro19["noDeclarada"],
    ],
    [
      "Falta de dinero",
      "Tiene que trabajar",
      "No hay escuela, instituto o universidad",
      "Los padres / pareja no quieren",
      "Quehaceres del hogar",
      "No le gusta / no quiere ir",
      "Ya termino sus estudios",
      "Otra causa",
      "No declarada",
    ]
  );

  // 3.- Educación
  createChart(
    'pie',
    'chart-educacion-3',
    "Población de 7 años o más con alfabetismo",
    [
      municipio.cuadro20["hombres"],
      municipio.cuadro20["mujeres"],
    ],
    ["Hombres", "Mujeres"]
  );
  // 4.- Educación
  createChart(
    'pie',
    'chart-educacion-4',
    "Asistencia escolar",
    [
      municipio.cuadro20["asiste"],
      municipio.cuadro20["noAsiste"],
    ],
    ["Asiste", "No Asiste"]
  );

  // 5.- Educación
  createChart(
    'bar',
    'chart-educacion-5',
    "Lugar de estudio",
    [
      municipio.cuadro20["enElMismoMunicipio"],
      municipio.cuadro20["enOtroMunicipio"],
      municipio.cuadro20["enOtroPais"],
      municipio.cuadro20["noDeclarado"],
    ],
    [
      "En el mismo municipio",
      "En otro municipio ",
      "En otro pais",
      "No declarado",
    ]
  );

  // 6.- Educación 6
  let chart6Educacion = [];
  let chart6EducacionPromedio = [];

  municipio.cuadro5.forEach((item) => {
    chart6Educacion.push({
      data: Math.round(item.lecturaMunicipal),
      label: item.periodo,
      serie: 'Lectura'
    });

    chart6Educacion.push({
      data: Math.round(item.matematicaMunicipal),
      label: item.periodo,
      serie: 'Matemática'
    });
  });

  chart6EducacionPromedio = municipio.cuadro5
    .sort((a, b) => a.periodo - b.periodo)
    .map((item) => {
      return item.lecturaDepartamental + item.matematicaDepartamental
    }
    );

  createChart(
    'areaStacked',
    'chart-educacion-6',
    'Desempeño Municipal en Matemáticas y Lectura',
    chart6Educacion,
    null,
    {
      isG2plotData: true,
      maxLimit: 200
    }
  );
}

// Economia
function renderEconomia(municipio) {
  createChart(
    'pie',
    "chart-economia-1",
    "Uso de celular",
    [
      municipio.cuadro21["usaCelular"],
      municipio.cuadro21["noUsaCelular"],
      municipio.cuadro21["noDeclaradoUsoDeCelular"],
    ],
    [
      "Usa celular",
      "No usa celular",
      "No declarado uso de celular",
    ]
  );

  createChart(
    'pie',
    "chart-economia-2",
    "Uso de computadora",
    [
      municipio.cuadro21["usaComputadora"],
      municipio.cuadro21["noUsaComputadora"],
      municipio.cuadro21["noDeclaradoElUsoDeComputadora"],
    ],
    [
      "Usa computadora",
      "No usa computadora",
      "No declarado el uso de computadora ",
    ]
  );

  createChart(
    'pie',
    "chart-economia-3",
    "Uso de internet",
    [
      municipio.cuadro21["usaInternet"],
      municipio.cuadro21["noUsaInternet"],
      municipio.cuadro21["noDeclaradoElUsoDeInternet"],
    ],
    [
      "Usa Internet",
      "No usa Internet",
      "No declarado el uso de Internet",
    ]
  );

  createChart(
    'bar',
    "chart-economia-4",
    "Uso de celular, computadora y/o internet",
    [
      municipio.cuadro21["celular,computadoraEInternet"],
      municipio.cuadro21["celularYComputadora"],
      municipio.cuadro21["celularEInternet"],
      municipio.cuadro21["computadoraEInternet"],
    ],
    [
      "Celular, computadora e internet",
      "Celular y computadora",
      "Celular e internet",
      "Computadora e internet",
    ]
  );

  createChart(
    'pie',
    "chart-economia-5",
    "Población económicamente activa e inactiva",
    [
      municipio.cuadro22["totalPea"],
      municipio.cuadro22["totalPei"],
    ],
    ["Total PEA", "Total PEI"]
  );

  createChart(
    'pie',
    "chart-economia-6",
    "Condición de inactividad",
    [
      municipio.cuadro22["peaOcupada"],
      municipio.cuadro22["peaCesante"],
      municipio.cuadro22["peaAspirante"],
    ],
    [
      "PEA Ocupada",
      "PEA Cesante",
      "PEA Aspirante",
    ]
  );

  createChart(
    'bar',
    "chart-economia-7",
    "Población económicamente inactiva",
    [
      municipio.cuadro22["peiUnicamenteEstudio"],
      municipio.cuadro22["peiRentistaOJubilado"],
      municipio.cuadro22["peiQueHaceresDelHogar"],
      municipio.cuadro22["peiCuidadoDePersonas"],
      municipio.cuadro22["peiCargoComunitario"],
      municipio.cuadro22["peiOtra"],
      municipio.cuadro22["peiNoDeclarado"],
    ],
    [
      "PEI Unicamente estudio",
      "PEI  Rentista o jubilado",
      "PEI  Que haceres del hogar",
      "PEI  Cuidado de personas",
      "PEI  Cargo comunitario",
      "PEI  Otra",
      "PEI  No declarado",
    ]
  );

  createChart(
    'bar',
    "chart-economia-8",
    "Lugar de trabajo",
    [
      municipio.cuadro22["lugarDeTrabajoEnElMismoMunicipio"],
      municipio.cuadro22["lugarDeTrabajoEnOtroMunicipio"],
      municipio.cuadro22["lugarDeTrabajoEnOtroPais"],
      municipio.cuadro22["lugarDeTrabajoNoDeclarado"],
    ],
    [
      "Lugar de trabajo en el mismo municipio",
      "Lugar de trabajo en otro municipio ",
      "Lugar de trabajo en otro pais",
      "Lugar de trabajo no declarado",
    ]
  );
}

// Salud
function renderSalud(municipio) {
  createChart(
    'bar',
    "chart-salud-1",
    "Número de hijos nacidos vivos",
    [
      municipio.cuadro23["nacidosVivos0"],
      municipio.cuadro23["nacidosVivos1"],
      municipio.cuadro23["nacidosVivos2"],
      municipio.cuadro23["nacidosVivos3"],
      municipio.cuadro23["nacidosVivos4"],
      municipio.cuadro23["nacidosVivos5OMas"],
      municipio.cuadro23["nacidosVivosNoDeclarado"],
    ],
    [
      "Nacidos vivos 0",
      "Nacidos vivos 1",
      "Nacidos vivos 2",
      "Nacidos vivos 3",
      "Nacidos vivos 4",
      "Nacidos vivos 5 o mas",
      "No declarado",
    ]
  );

  createChart(
    'bar',
    "chart-salud-2",
    "Edad de la mujer al nacimiento de su primer hijo",
    [
      municipio.cuadro23["edadMujerAlMomentoDePartoAntesDe15"],
      municipio.cuadro23["edadMujerAlMomentoDeParto1517Años"],
      municipio.cuadro23["edadMujerAlMomentoDeParto1819Años"],
      municipio.cuadro23["edadMujerAlMomentoDeParto2024Años"],
      municipio.cuadro23["edadMujerAlMomentoDeParto2529Años"],
      municipio.cuadro23["edadMujerAlMomentoDeParto30AñosOMas"],
      municipio.cuadro23["edadMujerAlMomentoDePartoNoDeclarado"],
    ],
    [
      "Edad mujer al momento de parto  antes de 15",
      "Edad mujer al momento de parto 15 - 17 años",
      "Edad mujer al momento de parto 18 - 19 años",
      "Edad mujer al momento de parto 20 - 24 años",
      "Edad mujer al momento de parto 25 - 29 años",
      "Edad mujer al momento de parto 30 años o mas",
      "Edad mujer al momento de parto no declarado",
    ]
  );
}

// Hogar
function renderHogar(municipio) {
  createChart(
    'bar',
    "chart-hogar-1",
    "Hogares por tipo de tenencia de la vivienda",
    [
      municipio.cuadro24["propia"],
      municipio.cuadro24["alquilada"],
      municipio.cuadro24["cedidaOPrestada"],
      municipio.cuadro24["propiedadComunal"],
      municipio.cuadro24["otra"],
    ],
    [
      "Propia",
      "Alquilada",
      "Cedida o prestada",
      "Propiedad comunal",
      "Otra",
    ]
  );

  createChart(
    'bar',
    "chart-hogar-2",
    "Hogares por sexo del propietario de la vivienda",
    [
      municipio.cuadro24["propoetarioHombre"],
      municipio.cuadro24["propoetarioMujer"],
      municipio.cuadro24["propoetarioAmbos"],
      municipio.cuadro24["propoetarioNoDeclarado"],
    ],
    [
      "Propietario Hombre",
      "Propietario Mujer",
      "Propietario Ambos",
      "Propietario no declarado",
    ]
  );

  createChart(
    'bar',
    "chart-hogar-3",
    "Hogares por tipo de tenencia de la vivienda",
    [
      municipio.cuadro24["decisionesHogarHombre"],
      municipio.cuadro24["decisionesHogarMujer"],
      municipio.cuadro24["decisionesHogarAmbos"],
      municipio.cuadro24["decisionesHogarNoDeclarado"],
    ],
    [
      "Decisiones hogar Hombre",
      "Decisiones hogar Mujer",
      "Decisiones hogar ambos",
      "Decisiones hogar no declarado",
    ]
  );

  createChart(
    'treemap',
    "chart-hogar-4",
    "Hogares por fuente principal de agua para consumo",
    [
      municipio.cuadro24["decisionesHogarHombre"],
      municipio.cuadro24["decisionesHogarMujer"],
      municipio.cuadro24["decisionesHogarAmbos"],
      municipio.cuadro24["decisionesHogarNoDeclarado"],
    ],
    [
      "Tuberia en la vivienda",
      "Tuberia fuera de la vivienda",
      "Chorro publico",
      "Pozo perforado",
      "Agua de lluvia",
      "Rio o lago",
      "Manantial o nacimiento",
      "Camion o tonel",
      "Otro",
    ]
  );
}

// Vivienda
function renderVivienda(municipio) {
  createChart(
    'bar',
    "chart-vivienda-1",
    "Distribución de viviendas por tipos de pisos",
    [
      municipio.cuadro34["ladrilloCeramico"],
      municipio.cuadro34["ladrilloDeCemento"],
      municipio.cuadro34["ladrilloDeBarro"],
      municipio.cuadro34["tortaDeCemento"],
      municipio.cuadro34["parqueOVinil"],
      municipio.cuadro34["madera"],
      municipio.cuadro34["tierra"],
      municipio.cuadro34["otro"],
    ],
    [
      "Ladrillo cerámico",
      "Ladrillo de cemento",
      "Ladrillo de barro",
      "Torta de cemento",
      "Parque o vinil",
      "Madera",
      "Tierra",
      "Otro"
    ]
  );

  createChart(
    'treemap',
    "chart-vivienda-2",
    "Distribución de viviendas por tipo de techo",
    [
      municipio.cuadro33["techoConcreto"],
      municipio.cuadro33["techoLaminaMetalica"],
      municipio.cuadro33["techoAsbestoOCemento"],
      municipio.cuadro33["techoTeja"],
      municipio.cuadro33["techoPaja,palmaOSimilar"],
      municipio.cuadro33["techoMaterialDeDesecho"],
      municipio.cuadro33["techoOtro"],
      municipio.cuadro33["techoIgnorado"]
    ],
    [
      "Concreto",
      "Lamina metalica",
      "Asbesto o cemento",
      "Teja",
      "Paja palma o similar",
      "Material de desecho",
      "Otro",
      "Ignorado"
    ]
  );

  createChart(
    'bar',
    "chart-vivienda-3",
    "Tipo de vivienda particular",
    [
      municipio.cuadro32["viviendaParticularTotal"],
      municipio.cuadro32["viviendaParticularCasaFormal"],
      municipio.cuadro32["viviendaParticularApartamento"],
      municipio.cuadro32["viviendaParticularCuartoEnCasaDeVecindad"],
      municipio.cuadro32["viviendaParticularRancho"],
      municipio.cuadro32["viviendaParticularImprovisada"],
      municipio.cuadro32["viviendaParticularOtro"],
      municipio.cuadro32["viviendaParticularIgnorado"],
    ],
    [
      'Particular total',
      'Casa formal',
      'Apartamento',
      'Cuarto en casa de vecindad',
      'Rancho',
      'Particular improvisada',
      'Otro',
      'Ignorado',
    ]
  );

  createChart(
    'treemap',
    "chart-vivienda-4",
    "Distribución de viviendas por tipo de pared",
    [
      municipio.cuadro33['paredLadrillo'],
      municipio.cuadro33['paredBlock'],
      municipio.cuadro33['paredConcreto'],
      municipio.cuadro33['paredAdobe'],
      municipio.cuadro33['paredMadera'],
      municipio.cuadro33['paredLaminaMetalica'],
      municipio.cuadro33['paredBajareque'],
      municipio.cuadro33['paredLepa'],
      municipio.cuadro33['paredMaterialDeDesecho'],
      municipio.cuadro33['paredOtro'],
      municipio.cuadro33['paredIgnorado'],
    ],
    [
      'Ladrillo',
      'Block',
      'Concreto',
      'Adobe',
      'Madera',
      'Lamina metalica',
      'Bajareque',
      'Lepa',
      'Material de desecho',
      'Otro',
      'Ignorado'
    ]
  );

  createChart(
    'bar',
    "chart-vivienda-5",
    "Condición de ocupación de viviendas",
    [
      municipio.cuadro32['condicionDeOcupacionViviendasColectivas'],
      municipio.cuadro32['condicionDeOcupacionOcupada'],
      municipio.cuadro32['condicionDeOcupacionDeUsoTemporal'],
      municipio.cuadro32['condicionDeOcupacionDesocupada'],
    ],
    [
      'Viviendas colectivas',
      'Ocupada',
      'De uso temporal',
      'Desocupada',
    ]
  );
}

/**
 * COMPARAR
 */

// Obtener <select> de departamentos y municipios
var departamentoSelect1 = document.getElementById('departamento1');
var municipioSelect1 = document.getElementById('municipio1');
var departamentoSelect2 = document.getElementById('departamento2');
var municipioSelect2 = document.getElementById('municipio2');

// Obtener listado de solo municipios
var departamentos = window.municipios.reduce((municipios, municipio) => {
  if (municipios.indexOf(municipio.departamento) < 0) {
    municipios.push(municipio.departamento);
  }

  return municipios;
}, []);

// Agregar departamentos como options
departamentos.forEach(function (departamento) {
  var option = document.createElement('option');
  option.value = departamento;
  option.innerHTML = departamento;
  departamentoSelect1.add(option);
  departamentoSelect2.add(option.cloneNode(true));
});

// Reiniciar select a "Seleccionar departamento"
departamentoSelect1.selectedIndex = 0;
departamentoSelect2.selectedIndex = 0;

// Event listeners

// [CHANGE] Select departamento 1
departamentoSelect1.addEventListener('change', function (event) {
  // Eliminar opciones anteriores
  let L = municipioSelect1.options.length - 1;
  for (let i = L; i > 0; i--) {
    municipioSelect1.remove(i);
  }

  var departamentoSelected = event.target.value;

  // Agregar municipio filtrados
  window.municipios.forEach((municipio) => {
    if (departamentoSelected === municipio.departamento) {
      var option = document.createElement('option');
      option.value = municipio.id_municipal;
      option.innerHTML = municipio.municipio;
      municipioSelect1.appendChild(option);
    }
  });

  // Reiniciar select a "Seleccionar municipio"
  municipioSelect1.selectedIndex = 0;
});

// [CHANGE] Select departamento
departamentoSelect2.addEventListener('change', function (event) {
  // Eliminar opciones anteriores
  let L = municipioSelect2.options.length - 1;
  for (let i = L; i > 0; i--) {
    municipioSelect2.remove(i);
  }

  var departamentoSelected = event.target.value;

  // Agregar municipio filtrados
  window.municipios.forEach((municipio) => {
    if (departamentoSelected === municipio.departamento) {
      var option = document.createElement('option');
      option.value = municipio.id_municipal;
      option.innerHTML = municipio.municipio;
      municipioSelect2.appendChild(option);
    }
  });

  // Reiniciar select a "Seleccionar municipio"
  municipioSelect2.selectedIndex = 0;
});

document.getElementById('form-comparar').addEventListener('submit', function (event) {
  event.preventDefault();

  let departamento1 = document.getElementById('departamento1');
  let municipio1 = document.getElementById('municipio1');
  let departamento2 = document.getElementById('departamento2');
  let municipio2 = document.getElementById('municipio2');
  let tematica = document.getElementById('tematica');

  console.log(tematica);

  if (!(
    departamento1.value &&
    departamento2.value &&
    municipio1.value &&
    municipio2.value
  )) {
    return;
  }

  Promise.all([
    fetch(`/assets/municipios/${municipio2.value}.json`).then((response) => response.json()),
    fetch(`/assets/municipios/${municipio1.value}.json`).then((response) => response.json())
  ]).then((result) => {
    // busqueda de datos
    let municipio1 = result[0];
    let municipio2 = result[1];
    let tematica = document.getElementById('tematica');

    document.getElementById('title-municipio1').innerHTML = municipio1.municipio;
    document.getElementById('title-municipio2').innerHTML = municipio2.municipio;

    var titles = document.getElementsByClassName('title-tematica');

    for (let item of titles) {
      item.innerHTML = tematica.value || 'General';
    }

    if (window.prevTematica) {
      var tematicasList = Array.from(document.getElementsByClassName(`tematica-${window.prevTematica}`));
      tematicasList.forEach((x) => x.classList.remove('d-block'));
    }

    tematica  = tematica.value;

    var tematicasList = Array.from(document.getElementsByClassName(`tematica-${tematica}`));
    tematicasList.forEach((x) => x.classList.add('d-block'));

    window.prevTematica = tematica;

    console.log(tematica);

    if (tematica === 'general') {
      renderGeneral(municipio1);
      renderGeneral(municipio2);
    }

    if (tematica === 'gestion-municipal') {
      renderGestionMunicipal(municipio1);
      renderGestionMunicipal(municipio2);
    }

    if (tematica === 'transparencia') {
      renderTransparencia(municipio1);
      renderTransparencia(municipio2);
    }

    if (tematica === 'nutricion-alimentacion') {
      renderNutricionAlimentacion(municipio1);
      renderNutricionAlimentacion(municipio2);
    }

    if (tematica === 'pobreza') {
      renderPobreza(municipio1);
      renderPobreza(municipio2);
    }

    if (tematica === 'finanzas') {
      renderFinanzas(municipio1);
      renderFinanzas(municipio2);
    }

    if (tematica === 'poblacion') {
      renderPoblacion(municipio1);
      renderPoblacion(municipio2);
    }

    if (tematica === 'educacion') {
      renderEducacion(municipio1);
      renderEducacion(municipio2);
    }

    if (tematica === 'economia') {
      renderEconomia(municipio1);
      renderEconomia(municipio2);
    }

    if (tematica === 'salud') {
      renderSalud(municipio1);
      renderSalud(municipio2);
    }

    if (tematica === 'hogar') {
      renderHogar(municipio1);
      renderHogar(municipio2);
    }

    if (tematica === 'vivienda') {
      renderVivienda(municipio1);
      renderVivienda(municipio2);
    }
  })
});