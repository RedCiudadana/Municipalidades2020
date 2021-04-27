import Chart from 'chart.js/dist/Chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.plugins.register(ChartDataLabels);

function abbreviateNumber(value) {
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

  if (!(type === 'bar' || type === 'pie' || type === 'line')) {
    console.error(`El tipo ${type} no esta soportado. Los tipos soportados son bar y pie.`);
    return;
  }

  let config = null;

  if (type === 'pie') {
    config = {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: [
              '#8cddc9',
              '#ade7d9',
              '#cef0e8',
              '#185244',
              '#22735f',
              '#2c947a',
              '#35b595',
              '#4acaaa',
              '#6bd3ba',
              '#effaf7',
            ],
            borderWidth: 0,
            datalabels: {
              align: 'center',
              anchor: 'center',
              font: {
                weight: 'bold',
              },
              color: '#666666',
              formatter: function (value/* , context */) {
                return abbreviateNumber(value);
              },
            },
          }
        ]
      },
      options: {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.labels[tooltipItem.index] || '';

              if (label) {
                label += ': ';
              }

              label += parseFloat(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]).toLocaleString('lan');
              return label;
            }
          }
        },
        legend: {
          position: 'bottom',
          align: 'center',
        },
        layout: {
          padding: {
            top: 40,
          },
        },
        plugins: {
          datalabels: {
            clamp: true,
          },
        },
      },
    };
  }

  if (type === 'bar' || type === 'line') {
    config = {
      type: type,
      data: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            fill: true,
            backgroundColor: '#52CCAE',
            borderColor: '#52CCAE',
            borderWidth: 0,
            datalabels: {
              align: 'end',
              anchor: 'end',
              font: {
                weight: 'bold',
              },
              color: '#666666',
              formatter: function (value, context) {
                return abbreviateNumber(value);
              },
            },
          },
        ],
      },
      options: {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                label += ': ';
              }
              label += parseFloat(tooltipItem.yLabel).toLocaleString('lan');
              return label;
            }
          }
        },
        legend: {
          display: false,
        },
        layout: {
          padding: {
            top: 40,
          },
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                lineWidth: 1,
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
              },
              ticks: {
                beginAtZero: true,
                callback: function (
                  value
                ) {
                  return parseFloat(value).toLocaleString('lan');
                }
              },
            },
          ],
        },
        plugins: {
          datalabels: {
            offset: 0,
            clamp: false,
          },
        },
      },
    };
  }

  config.data.datasets[0].label = title;
  config.data.datasets[0].data = data;
  config.data.labels = labels;

  if (type === 'pie') {
    config.options.legend.display = true;
  }

      /* config.options =  */Object.assign(config.options, options);

  if (!document.getElementById(id)) {
    console.error(`El elemento ${id} no se encontro.`);
    return;
  }

  try {
    window.myCharts[id] = new Chart(document.getElementById(id), config);
  } catch (error) {
    console.error(`Error al creear chart ${id}`);
    console.error(error);
  }
}

let municipio = window.municipio;

// EMBED CHART ROUTE
// For now I will use the same page to embed charts.
// Because currently I dont know how a better way to mantain
// the charts updated between munucipio page and embed page.
const urlParams = new URLSearchParams(location.search);

if (urlParams.get('embed') && urlParams.get('tematica')) {
  console.log(document.getElementById('tematicas-row'));

  document.getElementById('navbar').style.display = 'none';
  document.getElementById('basic-info-row').style.display = 'none';
  document.getElementById('footer').style.display = 'none';
  document.getElementById('red-footer').style.display = 'none';
  document.getElementById('page-container').style.margin = 0;
  document.getElementById('page-container').style.padding = 0;
  document.getElementById('page-container').style.width = '100vw';
  document.getElementById('tematicas-row').style.width = '100vw';
  document.getElementById('tematicas-row').style.margin = 0;
  document.getElementById(`tematica-${urlParams.get('tematica')}`).style.padding = 0;
  document.getElementById(`tematica-${urlParams.get('tematica')}-header`).remove();

  let children = Array.from(document.getElementById('tematicas-row').children);

  children.forEach((tematica) => {
    if (tematica.id !== `tematica-${urlParams.get('tematica')}`) {
      tematica.style.display = 'none';
    }
  });
}

// General
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

// Gestion municipal
createChart(
  'line',
  'chart-gestion-municipal-1',
  'Indice gestión municipal %',
  [
    municipio.ranking.segeplan2013,
    municipio.ranking.segeplan2016,
    municipio.ranking.segeplan2018,
  ],
  ['2013', '2016', '2018']
);
// Transparencia
createChart(
  'line',
  'chart-transparencia-1',
  'Indice de Acceso a la Información Pública',
  [
    municipio.aip.aip2015,
    municipio.aip.aip2017,
    municipio.aip.aip2019,
  ],
  ['2015', '2017', '2019']
);
// Nutricion
let cronica = municipio.desnutricion.cronica.sort((a, b) => a.periodo - b.periodo);

let cronica2019 = cronica.filter((item) => item.periodo === 2019);

cronica2019 = cronica2019[0];

if (cronica2019) {
  let titles = document.getElementsByClassName('title-cronica-text');
  for (const key in titles) {
    if (Object.hasOwnProperty.call(titles, key)) {
      const element = titles[key];
      element.innerText = parseFloat(cronica2019.cantidad).toLocaleString('lan');
    }
  }
}

createChart(
  'line',
  'chart-nutricion-1',
  'Numero de Casos de Desnutrición Crónica por año',
  cronica.map((item) => item.cantidad),
  cronica.map((item) => item.periodo)
);

if (cronica2019) {
  createChart(
    'pie',
    'chart-nutricion-2',
    'Casos de Desnutrición Crónica por sexo',
    [
      cronica2019['m <1Mes'] +
      cronica2019['m1Ma <2M'] +
      cronica2019['m2Ma <1A'] +
      cronica2019['m1Aa4A'],
      cronica2019['f <1Mes'] +
      cronica2019['f1Ma <2M'] +
      cronica2019['f2Ma <1A'] +
      cronica2019['f1Aa4A']
    ],
    ['Masculino', 'Femenino']
  );
}

createChart(
  'bar',
  'chart-nutricion-3',
  'Numero de Casos de Desnutrición Crónica por edad',
  [
    cronica2019['m <1Mes'],
    cronica2019['m1Ma <2M'],
    cronica2019['m2Ma <1A'],
    cronica2019['m1Aa4A'],
    cronica2019['f <1Mes'],
    cronica2019['f1Ma <2M'],
    cronica2019['f2Ma <1A'],
    cronica2019['f1Aa4A']
  ],
  [
    'F < 1 mes ',
    'M < 1 mes',
    'F 1m a < 2m',
    'M 1m a < 2m',
    'F 2m a < 1 a',
    'M 2m a < 1 a',
    'F 1a a 4 a',
    'M 1a a 4 a'
  ]
);

let aguda = municipio.desnutricion.aguda.sort((a, b) => a.periodo - b.periodo);

let aguda2019 = aguda.filter((item) => item.periodo === 2019);

aguda2019 = aguda2019[0];

if (aguda2019) {
  let titles = document.getElementsByClassName('title-aguda-text');
  for (const key in titles) {
    if (Object.hasOwnProperty.call(titles, key)) {
      const element = titles[key];
      element.innerText = parseFloat(aguda2019.cantidad).toLocaleString('lan');
    }
  }
}

createChart(
  'line',
  'chart-nutricion-4',
  'Numero de Casos de Desnutrición Aguda por año',
  aguda.map((item) => item.cantidad),
  aguda.map((item) => item.periodo)
);

if (aguda2019) {
  createChart(
    'pie',
    'chart-nutricion-5',
    'Casos de Desnutrición Aguda por sexo',
    [
      aguda2019['m <1Mes'] +
      aguda2019['m1Ma <2M'] +
      aguda2019['m2Ma <1A'] +
      aguda2019['m1Aa4A'],
      aguda2019['f <1Mes'] +
      aguda2019['f1Ma <2M'] +
      aguda2019['f2Ma <1A'] +
      aguda2019['f1Aa4A']
    ],
    ['Masculino', 'Femenino']
  );
}

createChart(
  'bar',
  'chart-nutricion-6',
  'Numero de Casos de Desnutrición Aguda por año',
  [
    aguda2019['m <1Mes'],
    aguda2019['m1Ma <2M'],
    aguda2019['m2Ma <1A'],
    aguda2019['m1Aa4A'],
    aguda2019['f <1Mes'],
    aguda2019['f1Ma <2M'],
    aguda2019['f2Ma <1A'],
    aguda2019['f1Aa4A']
  ],
  [
    'F < 1 mes ',
    'M < 1 mes',
    'F 1m a < 2m',
    'M 1m a < 2m',
    'F 2m a < 1 a',
    'M 2m a < 1 a',
    'F 1a a 4 a',
    'M 1a a 4 a'
  ]
);

// Pobreza
createChart(
  'line',
  'chart-pobreza-1',
  'Índice de pobreza Multidimensional',
  [
    municipio.ipm.ipm2006,
    municipio.ipm.ipm2011,
    municipio.ipm.ipm2014,
  ],
  ['2006', '2011', '2014']
);
// Finanzas
createChart(
  'line',
  'chart-finanzas-1',
  'Presupuesto Municipal por año',
  [
    municipio.ejecucion6
      .filter((item) => item.ejercicio === 2016)
      .map((item) => item.asignado)
      .reduce((a, b) => a + b),
    municipio.ejecucion6
      .filter((item) => item.ejercicio === 2017)
      .map((item) => item.asignado)
      .reduce((a, b) => a + b),
    municipio.ejecucion6
      .filter((item) => item.ejercicio === 2018)
      .map((item) => item.asignado)
      .reduce((a, b) => a + b),
    municipio.ejecucion6
      .filter((item) => item.ejercicio === 2019)
      .map((item) => item.asignado)
      .reduce((a, b) => a + b),
  ],
  [
    '2016',
    '2017',
    '2018',
    '2019',
  ]
);

let ejecucion2019 = municipio.ejecucion6
  .filter((item) => item.ejercicio === 2019)
  .sort((a, b) => a.asignado - b.asignado);

createChart(
  'bar',
  'chart-finanzas-2',
  'Distribucion de Presupuesto Municipal 2019',
  ejecucion2019
    .map((item) => item.asignado),
  ejecucion2019
    .map((item) => item.seccion)
);

createChart(
  'line',
  'chart-finanzas-3',
  'Ejecución Presupuestaria Municipal por año',
  [
    municipio.ejecucion6
      .filter((item) => item.ejercicio === 2016)
      .map((item) => item.asignado)
      .reduce((a, b) => a + b),
    municipio.ejecucion6
      .filter((item) => item.ejercicio === 2017)
      .map((item) => item.asignado)
      .reduce((a, b) => a + b),
    municipio.ejecucion6
      .filter((item) => item.ejercicio === 2018)
      .map((item) => item.asignado)
      .reduce((a, b) => a + b),
    municipio.ejecucion6
      .filter((item) => item.ejercicio === 2019)
      .map((item) => item.asignado)
      .reduce((a, b) => a + b),
  ],
  [
    '2016',
    '2017',
    '2018',
    '2019',
  ]
);

let ejecucionPresupuestaria2019 = municipio.ejecucion7
  .find((item) => item.ejercicio === 2019);

createChart(
  'bar',
  'chart-finanzas-4',
  'Distribucion de Ejecución Presupuestaria Municipal 2019',
  [
    ejecucionPresupuestaria2019['actividadesDeportivas,recreativas,culturaYReligion'],
    ejecucionPresupuestaria2019['asuntosEconomicos'],
    ejecucionPresupuestaria2019['atencionADesastresYGestionDeRiesgos'],
    ejecucionPresupuestaria2019['defensa'],
    ejecucionPresupuestaria2019['educacion'],
    ejecucionPresupuestaria2019['ordenPublicoYSeguridadCiudadana'],
    ejecucionPresupuestaria2019['proteccionAmbiental'],
    ejecucionPresupuestaria2019['proteccionSocial'],
    ejecucionPresupuestaria2019['salud'],
    ejecucionPresupuestaria2019['serviciosPublicosGenerales'],
    ejecucionPresupuestaria2019['transaccionesDeLaDeudaPublica'],
    ejecucionPresupuestaria2019['urbanizacionYServiciosComunitarios'],
    ejecucionPresupuestaria2019['na'],
  ],
  [
    'Actividades Deportivas Recreativas Cultura Y Religion',
    'Asuntos Economicos',
    'Atencion A Desastres Y Gestion De Riesgos',
    'Defensa',
    'Educacion',
    'Orden Publico Y Seguridad Ciudadana',
    'Proteccion Ambiental',
    'Proteccion Social',
    'Salud',
    'Servicios Publicos Generales',
    'Transacciones De La Deuda Publica',
    'Urbanizacion Y Servicios Comunitarios',
    'No especificado',
  ]
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

  return total;
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
  ]
);

let ingresos2019 = municipio.finanzas8
  .find((item) => item.ejercicio === 2019);

createChart(
  'bar',
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
// Poblacion
// 1.- Población total por sexo
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
  ],
  // Esto talvez lo mejoro usando la funcionalidad de defaults de ChartJS.
  {
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            lineWidth: 1,
            drawOnChartArea: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            beginAtZero: true,
          },
          ticks: {
            callback: function (
              value
            ) {
              return parseFloat(value).toLocaleString('lan');
            }
          }
        }
      ]
    }
  }
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
// Educación
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

// Economia
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
  'pie',
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

// Salud
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

// Hogar
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
  'bar',
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
