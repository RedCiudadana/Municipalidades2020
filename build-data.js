const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'log/combined.log' }),
    ],
});

const camelcaseKeys = require('camelcase-keys');
const fs = require('fs');

let municipios = require('./src/_data/municipios.json');
let ranking = require('./src/_data/ranking.json');
let aip = require('./src/_data/aip_v2.json');
let ipm = require('./src/_data/ipm_v2.json');
let coorporacion = require('./src/_data/coorporacion.json');
let desempeno5 = require('./src/_data/plataformaMunicipalDatosJSON/5DesempeñoDeEscuelasMunicipalesConsolidado20152019FinalXlsx.json');
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
let desnutricion = require('./src/_data/plataformaMunicipalDatosJSON/3DesnutricionXlsx.json');
let ejecucion6 = require('./src/_data/plataformaMunicipalDatosJSON/6EjecucionPresupuestariaIngresosFinalXlsx.json');
// let ejecucion7 = require('./src/_data/plataformaMunicipalDatosJSON/ejecucion7Xls.json');
let ejecucion7 = require('./src/_data/plataformaMunicipalDatosJSON/ejecucion7_2.json');
let finanzas8 = require('./src/_data/plataformaMunicipalDatosJSON/ejecucion8Xls.json');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

promedios = {
}

municipiosNormalize = municipios.map(function (municipio) {
    let id_municipio = municipio.id_municipal;
    let id_departamento = municipio.id_dep;

    if (promedios[id_departamento] === undefined) {
        promedios[id_departamento] = {
            ranking: {
                count: 0,
                segeplan2013: 0,
                segeplan2016: 0,
                segeplan2018: 0
            },
            aip: {
                count: 0,
                aip2019: 0,
                aip2017: 0,
                aip2015: 0,
                aip2015Insitu: 0
            },
            ipm: {
                count: 0,
                ipm2006: 0,
                ipm2011: 0,
                ipm2014: 0,
            },
            ejecucion7: {
                count: 0,
                asignado2016: 0,
                asignado2017: 0,
                asignado2018: 0,
                asignado2019: 0,
                devengado2016: 0,
                devengado2017: 0,
                devengado2018: 0,
                devengado2019: 0,
            },
            desnutricion: {
                count: 0,
                cronicaYAguda2012: 0,
                cronicaYAguda2013: 0,
                cronicaYAguda2014: 0,
                cronicaYAguda2015: 0,
                cronicaYAguda2016: 0,
                cronicaYAguda2017: 0,
                cronicaYAguda2018: 0,
                cronicaYAguda2019: 0
            },
            finanzas8: {
                count: 0,
                ingresos2016: 0,
                ingresos2017: 0,
                ingresos2018: 0,
                ingresos2019: 0
            }
        };
    }

    // Cargar ranking
    municipio.ranking = ranking.find((ranking) => {
        return ranking.id_municipal === municipio.id_municipal;
    });

    if (municipio.ranking) {
        promedios[id_departamento].ranking.segeplan2013 += municipio.ranking.segeplan2013;
        promedios[id_departamento].ranking.segeplan2016 += municipio.ranking.segeplan2016;
        promedios[id_departamento].ranking.segeplan2018 += municipio.ranking.segeplan2018;
        promedios[id_departamento].ranking.count += 1;
    }

    municipio.aip = aip.find((aip) => {
        return aip.id_municipal === municipio.id_municipal;
    });

    if (municipio.aip) {
        promedios[id_departamento].aip.aip2019 += municipio.aip.aip2019;
        promedios[id_departamento].aip.aip2017 += municipio.aip.aip2017;
        promedios[id_departamento].aip.aip2015 += municipio.aip.aip2015;
        promedios[id_departamento].aip.count += 1;
    }

    municipio.ipm = ipm.find((ipm) => {
        return ipm.id_municipal === municipio.id_municipal;
    });

    if (municipio.ipm) {
        promedios[id_departamento].ipm.ipm2006 += municipio.ipm.IPM2006;
        promedios[id_departamento].ipm.ipm2011 += municipio.ipm.IPM2011;
        promedios[id_departamento].ipm.ipm2014 += municipio.ipm.IPM2014;
        promedios[id_departamento].ipm.count += 1;
    }

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
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro19 = _cuadro19.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro20 = _cuadro20.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro21 = _cuadro21.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro22 = _cuadro22.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro23 = _cuadro23.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro24 = _cuadro24.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro25 = _cuadro25.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro26 = _cuadro26.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro27 = _cuadro27.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro28 = _cuadro28.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro29 = _cuadro29.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro30 = _cuadro30.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro31 = _cuadro31.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro32 = _cuadro32.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro33 = _cuadro33.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.cuadro34 = _cuadro34.find((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.ejecucion7 = ejecucion7.filter((item) => {
        return item.codigo_municipal == municipio.id_municipal;
    });

    municipio.ejecucion72019_asignado = municipio
        .ejecucion7
        .filter((item) => item.ejercicio === 2019);

    if (municipio.ejecucion72019_asignado.length > 0) {
        municipio.ejecucion72019_asignado = 
            municipio.ejecucion72019_asignado
                .map((item) => item.asignado)
                .reduce((a, b) => {
                    return a + b;
                });
    }

    municipio.ejecucion72019_devengado = municipio
        .ejecucion7
        .filter((item) => item.ejercicio === 2019);

    if (municipio.ejecucion72019_devengado.length > 0) {
        municipio.ejecucion72019_devengado =
            municipio.ejecucion72019_devengado
                .map((item) => item.devengado)
                .reduce((a, b) => {
                    return a + b;
                });
    }

    let asignado2016 = municipio.ejecucion7
        .filter((item) => item.ejercicio === 2016)
        .map((item) => item.asignado);
    if (asignado2016.length > 0) {
        promedios[id_departamento].ejecucion7.asignado2016 += asignado2016.reduce((a, b) => a + b);
    }

    let asignado2017 = municipio.ejecucion7
        .filter((item) => item.ejercicio === 2017)
        .map((item) => item.asignado);
    if (asignado2017.length > 0) {
        promedios[id_departamento].ejecucion7.asignado2017 += asignado2017.reduce((a, b) => a + b);
    }

    let asignado2018 = municipio.ejecucion7
        .filter((item) => item.ejercicio === 2018)
        .map((item) => item.asignado);
    if (asignado2018.length > 0) {
        promedios[id_departamento].ejecucion7.asignado2018 += asignado2018.reduce((a, b) => a + b);
    }

    let asignado2019 = municipio.ejecucion7
        .filter((item) => item.ejercicio === 2019)
        .map((item) => item.asignado);
    if (asignado2019.length > 0) {
        promedios[id_departamento].ejecucion7.asignado2019 += asignado2019.reduce((a, b) => a + b);
    }


    let devengado2016 = municipio.ejecucion7
        .filter((item) => item.ejercicio === 2016)
        .map((item) => item.devengado);
    if (devengado2016.length > 0) {
        promedios[id_departamento].ejecucion7.devengado2016 += devengado2016.reduce((a, b) => a + b);
    }

    let devengado2017 = municipio.ejecucion7
        .filter((item) => item.ejercicio === 2017)
        .map((item) => item.devengado);
    if (devengado2017.length > 0) {
        promedios[id_departamento].ejecucion7.devengado2017 += devengado2017.reduce((a, b) => a + b);
    }

    let devengado2018 = municipio.ejecucion7
        .filter((item) => item.ejercicio === 2018)
        .map((item) => item.devengado);
    if (devengado2018.length > 0) {
        promedios[id_departamento].ejecucion7.devengado2018 += devengado2018.reduce((a, b) => a + b);
    }

    let devengado2019 = municipio.ejecucion7
        .filter((item) => item.ejercicio === 2019)
        .map((item) => item.devengado);
    if (devengado2019.length > 0) {
        promedios[id_departamento].ejecucion7.devengado2019 += devengado2019.reduce((a, b) => a + b);
    }

    promedios[id_departamento].ejecucion7.count += 1;

    municipio.finanzas8 = finanzas8.filter((item) => {
        return item._idMunicipal == municipio.id_municipal;
    });

    municipio.finanzas8_2019 = municipio
        .finanzas8
        .find((item) => item._ejercicio === 2019);

    if (municipio.finanzas8_2019) {
        municipio.finanzas8_2019.total =
            municipio.finanzas8_2019['_impuestosDirectos'] +
            municipio.finanzas8_2019['_impuestosIndirectos'] +
            municipio.finanzas8_2019['_tasas'] +
            municipio.finanzas8_2019['_contribucionesPorMejoras'] +
            municipio.finanzas8_2019['_arrendamientoDeEdificios,EquiposEInstalaciones'] +
            municipio.finanzas8_2019['_multas'] +
            municipio.finanzas8_2019['_interesesPorMora'] +
            municipio.finanzas8_2019['_ventaDeServicios'] +
            municipio.finanzas8_2019['_intereses'] +
            municipio.finanzas8_2019['_arrendamientoDeTierrasYTerrenos'] +
            municipio.finanzas8_2019['_delSectorPrivado'] +
            municipio.finanzas8_2019['_donacionesCorrientes'] +
            municipio.finanzas8_2019['_delSectorPublico'] +
            municipio.finanzas8_2019['_disminucionDeDisponibilidades'] +
            municipio.finanzas8_2019['_obtencionDePrestamosInternosALargoPlazo'] +
            municipio.finanzas8_2019['_otrosIngresosNoTributarios'] +
            municipio.finanzas8_2019['_ventaDeBienes'] +
            municipio.finanzas8_2019['_dismDeActDiferidosYAnticiposAContratistas'] +
            municipio.finanzas8_2019['_ventaY/oDesincorporacionDeTierrasYTerrenos'] +
            municipio.finanzas8_2019['_dividendosY/oUtilidades'] +
            municipio.finanzas8_2019['_ventaY/oDesincorporacionDeActivosFijos'] +
            municipio.finanzas8_2019['_obtencionDePrestamosInternosACortoPlazo'] +
            municipio.finanzas8_2019['_delSectorExterno'] +
            municipio.finanzas8_2019['_donDeCapParaConstrDeBienesDeUsoCom'] +
            municipio.finanzas8_2019['_donDeCapP/ConstrDeBieUsoNoComYOtrasInv'] +
            municipio.finanzas8_2019['_disminucionDeCuentasACobrar'];

        var getTotalEjecucion = function (item) {
            if (!item) {
                return 0;
            }

            let total = item['_impuestosDirectos'] +
                item['_impuestosIndirectos'] +
                item['_tasas'] +
                item['_contribucionesPorMejoras'] +
                item['_arrendamientoDeEdificios,EquiposEInstalaciones'] +
                item['_multas'] +
                item['_interesesPorMora'] +
                item['_ventaDeServicios'] +
                item['_intereses'] +
                item['_arrendamientoDeTierrasYTerrenos'] +
                item['_delSectorPrivado'] +
                item['_donacionesCorrientes'] +
                item['_delSectorPublico'] +
                item['_disminucionDeDisponibilidades'] +
                item['_obtencionDePrestamosInternosALargoPlazo'] +
                item['_otrosIngresosNoTributarios'] +
                item['_ventaDeBienes'] +
                item['_dismDeActDiferidosYAnticiposAContratistas'] +
                item['_ventaY/oDesincorporacionDeTierrasYTerrenos'] +
                item['_dividendosY/oUtilidades'] +
                item['_ventaY/oDesincorporacionDeActivosFijos'] +
                item['_obtencionDePrestamosInternosACortoPlazo'] +
                item['_delSectorExterno'] +
                item['_donDeCapParaConstrDeBienesDeUsoCom'] +
                item['_donDeCapP/ConstrDeBieUsoNoComYOtrasInv'] +
                item['_disminucionDeCuentasACobrar'];

            return total;
        }

        let ingresos2016 = getTotalEjecucion(municipio.finanzas8
            .find((item) => item._ejercicio === 2016));
        
        if (Number.isNaN(ingresos2016)) {
            ingresos2016 = promedios[id_departamento].finanzas8.ingresos2016;
        }
        promedios[id_departamento].finanzas8.ingresos2016 += ingresos2016;

        let ingresos2017 = getTotalEjecucion(municipio.finanzas8
            .find((item) => item._ejercicio === 2017));
        
        if (Number.isNaN(ingresos2017)) {
            ingresos2017 = promedios[id_departamento].finanzas8.ingresos2017;
        }
        promedios[id_departamento].finanzas8.ingresos2017 += ingresos2017;

        let ingresos2018 = getTotalEjecucion(municipio.finanzas8
            .find((item) => item._ejercicio === 2018));
        
        if (Number.isNaN(ingresos2018)) {
            ingresos2018 = promedios[id_departamento].finanzas8.ingresos2018;
        }
        promedios[id_departamento].finanzas8.ingresos2018 += ingresos2018;

        let ingresos2019 = getTotalEjecucion(municipio.finanzas8
            .find((item) => item._ejercicio === 2019));
        
        if (Number.isNaN(ingresos2019)) {
            ingresos2019 = promedios[id_departamento].finanzas8.ingresos2019;
        }
        promedios[id_departamento].finanzas8.ingresos2019 += ingresos2019;

        promedios[id_departamento].finanzas8.count += 1;
    } else {
        logger
            .error(`El municipio ${municipio.id_municipal} ${municipio.departamento},
                ${municipio.municipio} no tiene finanzas 8 ejercicio 2019`);
    }

    let aguda = desnutricion.filter((item) => {
        return item._codMunicipal == municipio.id_municipal
            && item._tipo === "Aguda";
    });

    let cronica = desnutricion.filter((item) => {
        return item._codMunicipal == municipio.id_municipal
            && item._tipo === "Crónica";
    });

    municipio.desnutricion = {
        aguda,
        cronica,
        aguda2019: aguda.find((item) => item._periodo === 2019),
        cronica2019: cronica.find((item) => item._periodo === 2019)
    };

    aguda.forEach((item) => {
        promedios[id_departamento].desnutricion['cronicaYAguda' + item._periodo] += item._cantidad;
    });

    cronica.forEach((item) => {
        promedios[id_departamento].desnutricion['cronicaYAguda' + item._periodo] += item._cantidad;
    });

    promedios[id_departamento].desnutricion.count += 1;

    municipio.cuadro5 = desempeno5.filter((item) => {
        return item._idMunicipal === municipio.id_municipal;
    });

    municipio.cuadro5Y2018 = municipio.cuadro5.find((item) => {
        return item._idMunicipal === municipio.id_municipal
            && item._periodo === 2018;
    });

    logger.info(`${municipio.departamento}, ${municipio.municipio}`);

    municipio = camelcaseKeys(municipio, { deep: true });

    // Calcular promedios
    // municipio.ranking 

    return municipio;
});

// Calcular y rendondear promedios
Object.keys(promedios).forEach((dep) => {
    Object.keys(promedios[dep]).forEach((topic) => {
        Object.keys(promedios[dep][topic]).forEach((label) => {
            if (label === 'count') {
                return;
            }

            let value = promedios[dep][topic][label] / promedios[dep][topic].count;
            promedios[dep][topic][label] = parseFloat(parseFloat(value).toFixed(2));
        });
    });
});

municipiosNormalize = municipiosNormalize.map((item) => {
    item.promedios = promedios[item.idDep];

    return item;
});

// Wait for all Promises to complete
municipiosNormalize = municipiosNormalize.sort((a, b) => a.idMunicipal - b.idMunicipal);

fs.writeFile('./src/_data/municipiosData.json', JSON.stringify(municipiosNormalize), function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('Success build src/_data/municipiosData.json');
    }
});

fs.writeFile('./src/_data/municipioData.json', JSON.stringify(municipiosNormalize[0]), function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('Success build src/_data/municipioData.json');
    }
});

// Assets for json requests.

municipiosNormalize.forEach((municipio) => {
    fs.writeFile(`./assets/municipios/${municipio.idMunicipal}.json`, JSON.stringify(municipio), function (err) {
        if (err) {
            logger.error(err);
        } else {
            logger.info(`success build ./assets/municipios/${municipio.idMunicipal}.json`);
        }
    });
});

let indices = municipiosNormalize.map((municipio) => {

    let desnutricion = 0;
    if (municipio.desnutricion.aguda2019) {
        desnutricion =+ municipio.desnutricion.aguda2019.cantidad;
    }

    if (municipio.desnutricion.cronica2019) {
        desnutricion = + municipio.desnutricion.cronica2019.cantidad;
    }

    let aip;
    if (municipio.aip) {
        aip = municipio.aip.aip2019;
    }

    let ipm;
    if (municipio.ipm) {
        ipm = municipio.ipm.ipm2014;
    }

    let igm;
    if (municipio.ranking) {
        igm = municipio.ranking.segeplan2018;
    }

    let data = {
        idMunicipio: municipio.idMunicipal,
        idDepartamento: municipio.idDep,
        municipio: municipio.municipio,
        departamento: municipio.departamento,
        desnutricion,
        aip,
        ipm,
        igm
    };

    return data;
});

fs.writeFile(`./assets/indices.json`, JSON.stringify(indices), function (err) {
    if (err) {
        logger.error(err);
    } else {
        logger.info(`Indices data generated`);
    }
});