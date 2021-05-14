// Obtener <select> de departamentos y municipios
var departamentoSelect1 = document.getElementById('departamento1');
var municipioSelect1 = document.getElementById('municipio1');
var departamentoSelect2 = document.getElementById('departamento2');
var municipioSelect2 = document.getElementById('municipio2');

// Obtener listado de solo municipios
var departamentos = this.municipios.reduce((municipios, municipio) => {
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
  for (i = L; i > 0; i--) {
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
  for (i = L; i > 0; i--) {
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

  if (!(
    departamento1.value &&
    departamento2.value &&
    municipio1.value &&
    municipio2.value
  )) {
    return;
  }

  function nutricionCharts(municipio, container) {
    // Nutricion
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
      container,
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
  }

  Promise.all([
    fetch(`/assets/municipios/${municipio2.value}.json`).then((response) => response.json()),
    fetch(`/assets/municipios/${municipio1.value}.json`).then((response) => response.json())
  ]).then((result) => {
    // busqueda de datos
    let municipio1 = result[0];
    let municipio2 = result[1];

    nutricionCharts(municipio1, 'chart-1');
    nutricionCharts(municipio2, 'chart-2');

    document.getElementById('title-municipio1').innerHTML = municipio1.municipio;
    document.getElementById('title-municipio2').innerHTML = municipio2.municipio;

    var titles = document.getElementsByClassName('title-tematica');

    for (let item of titles) {
      item.innerHTML = tematica.value || 'General';
    }
  })
});