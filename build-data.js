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
let _14Poblacion = require('./src/_data/plataformaMunicipalDatosJSON/14CuadroA5PoblaciónTotalPorPueblosXlsx.json');
let _15Poblacion = require('./src/_data/plataformaMunicipalDatosJSON/15CuadroA6PoblaciónMayaPorComunidadLingüísticaXlsx.json');
let _16Poblacion = require('./src/_data/plataformaMunicipalDatosJSON/16CuadroA7PoblaciónDe4AñosYMásPorIdiomaMaternoXlsx.json');
let _17Poblacion = require('./src/_data/plataformaMunicipalDatosJSON/17CuadroA8PoblaciónDe4AñosYMás,SegúnDificultadesParaVer,Oír,CaminarOSubirEscaleras,RecordarOConcentrarse,CuidadoPersonalOComunicarseXlsx.json');
let _cuadro18 = require('./src/_data/plataformaMunicipalDatosJSON/18CuadroA9PoblaciónDe4AñosYMásPorNivelEducativoXlsx.json');
let _cuadro19 = require('./src/_data/plataformaMunicipalDatosJSON/19CuadroA10PoblaciónDe4A29AñosQueNoAsisteAUnEstablecimientoEducativoPorCausaPrincipalDeInasistenciaXlsx.json');
let _cuadro20 = require('./src/_data/plataformaMunicipalDatosJSON/20CuadroA11PoblaciónDe7AñosOMásPorAlfabetismo,AsistenciaEscolarYLugarDeEstudioXlsx.json');
let _cuadro21 = require('./src/_data/plataformaMunicipalDatosJSON/21CuadroA12PoblaciónDe7AñosOMásPorUsoDeCelular,ComputadoraYoInternetXlsx.json');
let _cuadro22 = require('./src/_data/plataformaMunicipalDatosJSON/22CuadroA13PoblaciónDe15AñosYMás,EconómicamenteActivaEInactiva,CondiciónDeInactividadYLugarDeTrabajoXlsx.json');
let _cuadro23 = require('./src/_data/plataformaMunicipalDatosJSON/23CuadroA14MujeresDe15AñosYMás,NúmeroDeHijosNacidosVivos,NúmeroDeHijosVivos,YEdadDeLaMujerAlNacimientoDeSuPrimerHijoXlsx.json');
let _cuadro24 = require('./src/_data/plataformaMunicipalDatosJSON/24CuadroB1HogaresPorTipoDeTenenciaDeLaVivienda,SexoDelPropietarioDeLaVivienda,YSexoDeLaPersonaQueTomaLasPrincipalesDecisionesEnElHogarXlsx.json');
let _cuadro25 = require('./src/_data/plataformaMunicipalDatosJSON/25CuadroB2HogaresPorFuentePrincipalDeAguaParaConsumoXlsx.json');
let _cuadro26 = require('./src/_data/plataformaMunicipalDatosJSON/26CuadroB3HogaresPorTipoYUsoDeServicioSanitarioXlsx.json');
let _cuadro27 = require('./src/_data/plataformaMunicipalDatosJSON/27CuadroB4HogaresSegúnTipoDeAlumbrado,FuentePrincipalDeEnergíaParaCocinarYDisponibilidadDeCuartoExclusivoParaCocinarXlsx.json');
let _cuadro28 = require('./src/_data/plataformaMunicipalDatosJSON/28CuadroB5EquipamientoDelHogarXlsx.json');
let _cuadro29 = require('./src/_data/plataformaMunicipalDatosJSON/29CuadroB6HogaresPorFormaPrincipalDeEliminaciónDeLaBasuraXlsx.json');
let _cuadro30 = require('./src/_data/plataformaMunicipalDatosJSON/30CuadroB7HogaresPorNúmeroDeCuartosYDormitoriosXlsx.json');
let _cuadro31 = require('./src/_data/plataformaMunicipalDatosJSON/31CuadroB8TipologíaDeHogarXlsx.json');
let _cuadro32 = require('./src/_data/plataformaMunicipalDatosJSON/32CuadroC1TipoDeViviendaYCondiciónDeOcupaciónXlsx.json');
let _cuadro33 = require('./src/_data/plataformaMunicipalDatosJSON/33CuadroC2ViviendasParticularesPorMaterialPredominanteEnLasParedesExterioresYEnElTechoXlsx.json');
let _cuadro34 = require('./src/_data/plataformaMunicipalDatosJSON/34CuadroC3ViviendasParticularesPorMaterialPredominanteEnElPisoXlsx.json');

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
    },
    cuadro14Poblacion: {
        type: 'object'
    },
    cuadro15Poblacion: {
        type: 'object'
    },
    cuadro16Poblacion: {
        type: 'object'
    },
    cuadro17Poblacion: {
        type: 'object'
    },
    cuadro18: {
        type: 'object'
    },
    cuadro19: {
        type: 'object'
    },
    cuadro20: {
        type: 'object'
    },
    cuadro21: {
        type: 'object'
    },
    cuadro22: {
        type: 'object'
    },
    cuadro23: {
        type: 'object'
    },
    cuadro24: {
        type: 'object'
    },
    cuadro25: {
        type: 'object'
    },
    cuadro26: {
        type: 'object'
    },
    cuadro27: {
        type: 'object'
    },
    cuadro28: {
        type: 'object'
    },
    cuadro29: {
        type: 'object'
    },
    cuadro30: {
        type: 'object'
    },
    cuadro31: {
        type: 'object'
    },
    cuadro32: {
        type: 'object'
    },
    cuadro33: {
        type: 'object'
    },
    cuadro34: {
        type: 'object'
    },
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

    municipio.cuadro14Poblacion = _14Poblacion.find((_10Poblacion) => {
        return _10Poblacion._idMunicipal === municipio.id_municipal;
    });

    municipio.cuadro15Poblacion = _15Poblacion.find((_10Poblacion) => {
        return _10Poblacion._idMunicipal === municipio.id_municipal;
    });

    municipio.cuadro16Poblacion = _16Poblacion.find((_10Poblacion) => {
        return _10Poblacion._idMunicipal === municipio.id_municipal;
    });
    
    municipio.cuadro17Poblacion = _17Poblacion.find((_10Poblacion) => {
        return _10Poblacion._idMunicipal === municipio.id_municipal;
    });

    municipio.cuadro18 = _cuadro18.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro19 = _cuadro19.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro20 = _cuadro20.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro21 = _cuadro21.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro22 = _cuadro22.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro23 = _cuadro23.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro24 = _cuadro24.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro25 = _cuadro25.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro26 = _cuadro26.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro27 = _cuadro27.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro28 = _cuadro28.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro29 = _cuadro29.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro30 = _cuadro30.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro31 = _cuadro31.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro32 = _cuadro32.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro33 = _cuadro33.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
    });

    municipio.cuadro34 = _cuadro34.find((item) => {
        return item._idMunicipal = municipio.id_municipal;
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

        fs.writeFile('./src/_data/municipioData.json', JSON.stringify(results[0]), function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log('Success data build');
            }
        });
    })
    .catch(e => {        console.error(e);
    });