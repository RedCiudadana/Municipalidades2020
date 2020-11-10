const fs = require('fs');
const papa = require('papaparse');
const camelCase = require('camelcase');

fs.readFile(`${__dirname}/src/_data/plataformaMunicipalDatos/7. Ejecución presupuestaria municipal FINAL consolidado.csv`, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    data = papa.parse(data).data;

    // headers
    headers = data[0].map(key => {
        return camelCase(key);
    });

    dataToExport = [];

    data.slice(1, data.length).forEach((row) => {
        let obj = {};
        headers.forEach((header, i) => {
            obj[header] = row[i];
        });

        dataToExport.push(obj);
    });

    fs.writeFile(`./src/_data/bigvoy.json`, JSON.stringify(dataToExport), function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Success data build');
        }
    });
});
