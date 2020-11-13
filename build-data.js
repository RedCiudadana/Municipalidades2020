const JsonNodeNormalizer = require('json-node-normalizer');
const camelcaseKeys = require('camelcase-keys');
const fs = require('fs');

let municipios = require('./src/_data/municipios.json');
let ranking = require('./src/_data/ranking.json');
let aip = require('./src/_data/aip.json');
let ipm = require('./src/_data/ipm.json');
let coorporacion = require('./src/_data/coorporacion.json');
let _10Poblacion = require('./src/_data/plataformaMunicipalDatosJSON/10CuadroA1PoblaciónTotalPorSexo,GruposQuinquenalesDeEdadYÁreaXlsx.json');
let _11Poblacion = require('./src/_data/plataformaMunicipalDatosJSON/11CuadroA2PoblaciónSegúnParentescoConElJefe(a)DelHogarXlsx.json');
let _12Poblacion = require('./src/_data/plataformaMunicipalDatosJSON/12CuadroA3PoblaciónDe10AñosYMásPorEstadoConyugalXlsx.json');
let _13Poblacion = require('./src/_data/plataformaMunicipalDatosJSON/13CuadroA4PoblaciónTotalPorLugarDeNacimientoYLugarDeResidenciaEnAbrilDel2013Xlsx.json');

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
    },
    cuadro10Poblacion: {
        type : 'object',
        properties : {
            _no: {
                type: 'number'
            },
            _idMunicipal: {
                type: 'number'
            },
            _municipio: {
                type: 'string'
            },
            _codDepartamento: {
                type: 'number'
            },
            _departamento: {
                type: 'string'
            },
            _poblacionTotal: {
                type: 'number'
            },
            _hombres: {
                type: 'number'
            },
            _mujeres: {
                type: 'number'
            },
            _04: {
                type: 'number'
            },
            _59: {
                type: 'number'
            },
            _1014: {
                type: 'number'
            },
            _1519: {
                type: 'number'
            },
            _2024: {
                type: 'number'
            },
            _2529: {
                type: 'number'
            },
            _3034: {
                type: 'number'
            },
            _3539: {
                type: 'number'
            },
            _4044: {
                type: 'number'
            },
            _4549: {
                type: 'number'
            },
            _5054: {
                type: 'number'
            },
            _5559: {
                type: 'number'
            },
            _6064: {
                type: 'number'
            },
            _6569: {
                type: 'number'
            },
            _7074: {
                type: 'number'
            },
            _7579: {
                type: 'number'
            },
            _8084: {
                type: 'number'
            },
            _8589: {
                type: 'number'
            },
            _9094: {
                type: 'number'
            },
            _9599: {
                type: 'number'
            },
            _100OMas: {
                type: 'number'
            },
            _urbana: {
                type: 'number'
            },
            _rural: {
                type: 'number'
            },
        }
    },
    cuadro11Poblacion: {
        type: 'object'
    },
    cuadro12Poblacion : {
        type: 'object'
    },
    cuadro13Poblacion : {
        type: 'object'
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

    // _10Poblacion
    municipio.cuadro10Poblacion = _10Poblacion.find((_10Poblacion) => {
        return _10Poblacion._idMunicipal === municipio.id_municipal;
    });

    municipio.cuadro11Poblacion = _11Poblacion.find((_10Poblacion) => {
        return _10Poblacion._idMunicipal === municipio.id_municipal;
    });


    municipio.cuadro12Poblacion = _12Poblacion.find((_10Poblacion) => {
        return _10Poblacion._idMunicipal === municipio.id_municipal;
    });


    municipio.cuadro13Poblacion = _13Poblacion.find((_10Poblacion) => {
        return _10Poblacion._idMunicipal === municipio.id_municipal;
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