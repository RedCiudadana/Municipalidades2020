const fs = require('fs');

const ranking = require('./src/_data/ranking.json');
const aip = require('./src/_data/aip.json');
const ipm = require('./src/_data/ipm.json');

// ranking.map((item) => {
//   item.segeplan2013 = parseFloat(item.segeplan2013.replace(/[^0-9,]/, '').replace(',', '.'));
//   item.segeplan2016 = parseFloat(item.segeplan2016.replace(/[^0-9,]/, '').replace(',', '.'));
//   item.segeplan2018 = parseFloat(item.segeplan2018.replace(/[^0-9,]/, '').replace(',', '.'));
//   item.Promediosegeplan = parseFloat(item.Promediosegeplan.replace(/[^0-9,]/, '').replace(',', '.'));

//   return item;
// });

// fs.writeFile('./src/_data/ranking.json', JSON.stringify(ranking), function (err) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Success build ./src/_data/ranking.json');
//   }
// });

// delete ranking;

aip.map((item) => {
  try {
    item.aip2019 = parseFloat(item.aip2019.replace(/[^0-9,]/, '').replace(',', '.'));
    item.aip2017 = parseFloat(item.aip2017.replace(/[^0-9,]/, '').replace(',', '.'));
    item.aip2015 = parseFloat(item.aip2015.replace(/[^0-9,]/, '').replace(',', '.'));
    item.aip2015insitu = parseFloat(item.aip2015insitu.replace(/[^0-9,]/, '').replace(',', '.'));
    item.aipPromedio = parseFloat(item.aipPromedio.replace(/[^0-9,]/, '').replace(',', '.'));
  } catch (error) {
    console.error(`Error en: ${item.id_municipal}`);
    console.error(error);
  }

  return item;
});

fs.writeFile('./src/_data/aip_v2.json', JSON.stringify(aip), function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('Success build ./src/_data/aip_v2.json');
  }
});

delete aip;

ipm.map((item) => {
  item.Incidencia2000 = parseFloat(item.Incidencia2000.replace(/[^0-9,]/, '').replace(',', '.'));
  item.Incidencia2006 = parseFloat(item.Incidencia2006.replace(/[^0-9,]/, '').replace(',', '.'));
  item.Incidencia2011 = parseFloat(item.Incidencia2011.replace(/[^0-9,]/, '').replace(',', '.'));
  item.Incidencia2014 = parseFloat(item.Incidencia2014.replace(/[^0-9,]/, '').replace(',', '.'));
  item.Poblacion2000 = parseFloat(item.Poblacion2000.replace(/[^0-9,]/, '').replace(',', '.'));
  item.Poblacion2006 = parseFloat(item.Poblacion2006.replace(/[^0-9,]/, '').replace(',', '.'));
  item.Poblacion2011 = parseFloat(item.Poblacion2011.replace(/[^0-9,]/, '').replace(',', '.'));
  item.Poblacion2014 = parseFloat(item.Poblacion2014.replace(/[^0-9,]/, '').replace(',', '.'));
  item.IPM2000 = parseFloat(item.IPM2000.replace(/[^0-9,]/, '').replace(',', '.'));
  item.IPM2006 = parseFloat(item.IPM2006.replace(/[^0-9,]/, '').replace(',', '.'));
  item.IPM2011 = parseFloat(item.IPM2011.replace(/[^0-9,]/, '').replace(',', '.'));
  item.IPM2014 = parseFloat(item.IPM2014.replace(/[^0-9,]/, '').replace(',', '.'));

  return item;
});

fs.writeFile('./src/_data/ipm_v2.json', JSON.stringify(ipm), function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('Success build ./src/_data/ipm_v2.json');
  }
});