import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';
const slugify = require("slugify");


// WIP: Start loading here.

Promise.all([
  fetch('/assets/municipios_limites_340_carto.geojson').then(res => res.json()),
  fetch('/assets/indices.json').then(res => res.json())
]).then((result) => {
  let GeoJSON = result[0];
  let indices = result[1];

  let indiceName = 'desnutricion';

  const userData = [];

  const geoDv = new DataSet.View().source(GeoJSON, {
    type: 'GeoJSON'
  }).transform({
    type: 'map',
    callback(row) {
      userData.push({
        longitude: row.centroidX,
        latitude: row.centroidY,
        name: row.properties.mun,
        cod_mun: row.properties.cod_mun
      });

      row.nombre_municipio = row.properties.mun;
      let indiceData = indices.find((item) => item.idMunicipio === row.properties.cod_mun);

      if (indiceData) {
        row.municipio = indiceData.municipio;
        row.departamento = indiceData.departamento;
        row.indice = indiceData[indiceName];
      } else {
        row.indice = 0;
      }

      return row;
    }
  });

  const chart = new Chart({
    container: 'chart-container',
    autoFit: false,
    height: 650,
    width: 650,
    padding: 0
  });
  chart.scale({
    latitude: { sync: true },
    longitude: { sync: true }
  });
  chart.legend(true);
  chart.axis(false);

  chart.tooltip({
    showTitle: true
  });

  const geoView = chart.createView();
  geoView.data(geoDv.rows);
  geoView.polygon()
    .position('longitude*latitude')
    .color('indice', ['#30BF78', '#FAAD14',  '#F4664A'])
    .tooltip('nombre_municipio*indice', (nombre_municipio, indice) => {
      return {
        title: 'Índice aleatorio',
        name: nombre_municipio,
        value: indice
      };
    });

  const userView = chart.createView();
  userView.data(userData);

  function slug(string) {
    return slugify(string, {
      lower: true,
      replacement: "-",
      remove: /[*+~·,()'"`´%!?¿:@\/]/g,
    });
  }

  chart.on('polygon:click', (ev) => {
    let properties = ev.data.data.properties;
    let indiceData = indices.find((item) => item.idMunicipio === properties.cod_mun);

    console.log(indiceData);
    let url = `/${slug(indiceData.departamento)}/${slug(indiceData.municipio)}`;

    window.location.href = url;
  });

  chart.render();
});