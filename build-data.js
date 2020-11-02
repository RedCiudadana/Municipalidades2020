const JsonNodeNormalizer = require('json-node-normalizer');
const camelcaseKeys = require('camelcase-keys');
const fs = require('fs');

let municipios = require('./src/_data/municipios.json');
let ranking = require('./src/_data/ranking.json');
let aip = require('./src/_data/aip.json');
let ipm = require('./src/_data/ipm.json');
let coorporacion = require('./src/_data/coorporacion.json');

const jsonSchema = {
    id_dep: {
        type: 'number'
    },
    departamento: {
        type: 'string'
    },
    id_municipal: {
        type: 'number'
    },
    municipio: {
        type: 'string'
    },
    alcalde: {
        type: 'string'
    },
    partido: {
        type: 'string'
    },
    fundacion: {
        type: 'string'
    },
    telefono: {
        type: 'string'
    },
    email: {
        type: 'string'
    },
    web: {
        type: 'string'
    },
    twitter: {
        type: 'string'
    },
    facebook: {
        type: 'string'
    },
    ranking: {
        type: 'object',
        properties: {
            idMunicipal: {
                type: 'number'
            },
            municipio: {
                type: 'string'
            },
            idDep: {
                type: 'number'
            },
            departamento: {
                type: 'string'
            },
            segeplan2013: {
                type: 'number'
            },
            segeplan2016: {
                type: 'number'
            },
            segeplan2018: {
                type: 'number'
            },
            promediosegeplan: {
                type: 'number'
            },
        }
    },
    aip: {
        type: 'object',
        properties: {
            idDep: {
                type: 'number'
            },
            departamento: {
                type: 'string'
            },
            idMunicipal: {
                type: 'number'
            },
            municipio: {
                type: 'string'
            },
            aip2019: {
                type: 'string'
            },
            aip2017: {
                type: 'string'
            },
            aip2015: {
                type: 'string'
            },
            aip2015insitu: {
                type: 'string'
            },
            aipPromedio: {
                type: 'string'
            },
        }
    },
    ipm: {
        type: 'object',
        properties: {
            idMunicipal: {
                type: 'number'
            },
            municipio: {
                type: 'string'
            },
            idDep: {
                type: 'number'
            },
            departamento: {
                type: 'string'
            },
            incidencia2000: {
                type: 'number'
            },
            incidencia2006: {
                type: 'number'
            },
            incidencia2011: {
                type: 'number'
            },
            incidencia2014: {
                type: 'number'
            },
            poblacion2000: {
                type: 'number'
            },
            poblacion2006: {
                type: 'number'
            },
            poblacion2011: {
                type: 'number'
            },
            poblacion2014: {
                type: 'number'
            },
            ipm2000: {
                type: 'number'
            },
            ipm2006: {
                type: 'number'
            },
            ipm2011: {
                type: 'number'
            },
            ipm2014: {
                type: 'number'
            },
        }
    },
    coorporacion: {
        type: 'array',
        items: {
            idMunicipal: {
                type: 'number'
            },
            municipio: {
                type: 'string'
            },
            idDep: {
                type: 'number'
            },
            departamento: {
                type: 'string'
            },
            pais: {
                type: 'string'
            },
            cargo: {
                type: 'string'
            },
            partido: {
                type: 'string'
            },
            nombre: {
                type: 'string'
            },
        }
    }
}

promisesMunicipiosNormalize = municipios.map(function (municipio) {
    // Cargar ranking
    municipio.ranking = ranking.find((ranking) => {
        return ranking.id_municipal === municipio.id_municipal;
    });

    municipio.aip = aip.find((aip) => {
        return aip.id_municipal === municipio.id_municipal;
    });

    municipio.ipm = ipm.find((ipm) => {
        return ipm.id_municipal === municipio.id_municipal;
    });

    municipio.coorporacion = coorporacion.filter((coorporacion) => {
        return coorporacion.id_municipal === municipio.id_municipal;
    });

    municipio = camelcaseKeys(municipio, { deep: true });

    try {
        return JsonNodeNormalizer.normalize(municipio, jsonSchema);
    } catch (error) {
        console.error(error);
    }
});

// Wait for all Promises to complete
Promise.all(promisesMunicipiosNormalize)
    .then(results => {
        fs.writeFile('./src/_data/municipiosData.json', JSON.stringify(results), function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log('Success data build');
            }
        });
    })
    .catch(e => {
        console.error(e);
    });