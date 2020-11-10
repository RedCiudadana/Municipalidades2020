const xlsx = require('node-xlsx').default;
const camelcaseKeys = require('camelcase-keys');
const camelCase = require('camelcase');
const fs = require('fs');

let dir = `${__dirname}/src/_data/plataformaMunicipalDatos`;

fs.readdir(dir, (err, files) => {
    if (err) {
        throw err;
    }

    files.forEach(file => {
        let xlsxData = xlsx.parse(`${dir}/${file}`)[0];
        let data;

        try {
            data = xlsxData.data;

            // // headers
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

            let filename = camelCase(file);

            fs.writeFile(`./src/_data/plataformaMunicipalDatosJSON/${filename}.json`, JSON.stringify(dataToExport), function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`${filename} parsed`);
                }
            });
        } catch (error) {
            console.log(file);
        }
    });
});