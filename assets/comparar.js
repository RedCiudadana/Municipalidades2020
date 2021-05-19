/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/comparar.js":
/*!*************************!*\
  !*** ./src/comparar.js ***!
  \*************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports */
/***/ (function() {

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Obtener <select> de departamentos y municipios
var departamentoSelect1 = document.getElementById('departamento1');
var municipioSelect1 = document.getElementById('municipio1');
var departamentoSelect2 = document.getElementById('departamento2');
var municipioSelect2 = document.getElementById('municipio2'); // Obtener listado de solo municipios

var departamentos = this.municipios.reduce(function (municipios, municipio) {
  if (municipios.indexOf(municipio.departamento) < 0) {
    municipios.push(municipio.departamento);
  }

  return municipios;
}, []); // Agregar departamentos como options

departamentos.forEach(function (departamento) {
  var option = document.createElement('option');
  option.value = departamento;
  option.innerHTML = departamento;
  departamentoSelect1.add(option);
  departamentoSelect2.add(option.cloneNode(true));
}); // Reiniciar select a "Seleccionar departamento"

departamentoSelect1.selectedIndex = 0;
departamentoSelect2.selectedIndex = 0; // Event listeners
// [CHANGE] Select departamento 1

departamentoSelect1.addEventListener('change', function (event) {
  // Eliminar opciones anteriores
  var L = municipioSelect1.options.length - 1;

  for (i = L; i > 0; i--) {
    municipioSelect1.remove(i);
  }

  var departamentoSelected = event.target.value; // Agregar municipio filtrados

  window.municipios.forEach(function (municipio) {
    if (departamentoSelected === municipio.departamento) {
      var option = document.createElement('option');
      option.value = municipio.id_municipal;
      option.innerHTML = municipio.municipio;
      municipioSelect1.appendChild(option);
    }
  }); // Reiniciar select a "Seleccionar municipio"

  municipioSelect1.selectedIndex = 0;
}); // [CHANGE] Select departamento

departamentoSelect2.addEventListener('change', function (event) {
  // Eliminar opciones anteriores
  var L = municipioSelect2.options.length - 1;

  for (i = L; i > 0; i--) {
    municipioSelect2.remove(i);
  }

  var departamentoSelected = event.target.value; // Agregar municipio filtrados

  window.municipios.forEach(function (municipio) {
    if (departamentoSelected === municipio.departamento) {
      var option = document.createElement('option');
      option.value = municipio.id_municipal;
      option.innerHTML = municipio.municipio;
      municipioSelect2.appendChild(option);
    }
  }); // Reiniciar select a "Seleccionar municipio"

  municipioSelect2.selectedIndex = 0;
});
document.getElementById('form-comparar').addEventListener('submit', function (event) {
  event.preventDefault();
  var departamento1 = document.getElementById('departamento1');
  var municipio1 = document.getElementById('municipio1');
  var departamento2 = document.getElementById('departamento2');
  var municipio2 = document.getElementById('municipio2');
  var tematica = document.getElementById('tematica');

  if (!(departamento1.value && departamento2.value && municipio1.value && municipio2.value)) {
    return;
  }

  function nutricionCharts(municipio, container) {
    // Nutricion
    var cronica = municipio.desnutricion.cronica.sort(function (a, b) {
      return a.periodo - b.periodo;
    });
    var aguda = municipio.desnutricion.aguda.sort(function (a, b) {
      return a.periodo - b.periodo;
    });
    var cronicaLastYear = cronica[cronica.length - 1];
    var agudaLastYear = aguda[aguda.length - 1];
    var desnutricion = cronica.concat(aguda);
    desnutricion = desnutricion.sort(function (a, b) {
      return a.periodo - b.periodo;
    });
    var min = desnutricion[0].periodo;
    var max = desnutricion[desnutricion.length - 1].periodo;
    var newArray = [];

    var _loop = function _loop(_i) {
      var cronicaItem = cronica.find(function (item) {
        return item.periodo == _i;
      });
      var agudaItem = aguda.find(function (item) {
        return item.periodo == _i;
      });
      newArray.push({
        data: cronicaItem ? cronicaItem.cantidad * 10 : 0,
        label: cronicaItem ? cronicaItem.periodo.toString() : _i.toString(),
        serie: 'Crónica'
      });
      newArray.push({
        data: agudaItem ? agudaItem.cantidad * 10 : 0,
        label: agudaItem ? agudaItem.periodo.toString() : _i.toString(),
        serie: 'Aguda'
      });
    };

    for (var _i = min; _i <= max; _i++) {
      _loop(_i);
    }

    createChart('areaStacked', container, 'Numero de Casos de Desnutrición Crónica por año', newArray, null, {
      isG2plotData: true,
      promedio: [municipio.promedios.desnutricion.cronicaYAguda2012, municipio.promedios.desnutricion.cronicaYAguda2013, municipio.promedios.desnutricion.cronicaYAguda2014, municipio.promedios.desnutricion.cronicaYAguda2015, municipio.promedios.desnutricion.cronicaYAguda2016, municipio.promedios.desnutricion.cronicaYAguda2017, municipio.promedios.desnutricion.cronicaYAguda2018, municipio.promedios.desnutricion.cronicaYAguda2019]
    });
  }

  Promise.all([fetch("/assets/municipios/".concat(municipio2.value, ".json")).then(function (response) {
    return response.json();
  }), fetch("/assets/municipios/".concat(municipio1.value, ".json")).then(function (response) {
    return response.json();
  })]).then(function (result) {
    // busqueda de datos
    var municipio1 = result[0];
    var municipio2 = result[1];
    nutricionCharts(municipio1, 'chart-1');
    nutricionCharts(municipio2, 'chart-2');
    document.getElementById('title-municipio1').innerHTML = municipio1.municipio;
    document.getElementById('title-municipio2').innerHTML = municipio2.municipio;
    var titles = document.getElementsByClassName('title-tematica');

    var _iterator = _createForOfIteratorHelper(titles),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        item.innerHTML = tematica.value || 'General';
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_modules__["./src/comparar.js"]();
/******/ })()
;
//# sourceMappingURL=comparar.js.map