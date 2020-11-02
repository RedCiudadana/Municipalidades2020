const JsonNodeNormalizer = require('json-node-normalizer');

async function init() {
    const dataToNormalize = {
        data: {
            enable: 'true', // MUST BE CONVERTED TO BOOLEAN
            '_2017': '23'
        }
    };
    const jsonSchema = {
        data: {
            type: 'object',
            properties: {
                enable: {
                    type: 'boolean'
                },
                _2017: {
                    type: 'number'
                }
            }
        }
    };
    const result = await JsonNodeNormalizer.normalize(dataToNormalize, jsonSchema);
    console.log(result);
}

init();