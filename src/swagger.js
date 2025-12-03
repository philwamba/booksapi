const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books API',
            version: '1.0.0',
            description: 'A simple Express Library API',
        },
        servers: [
            {
                url: 'http://localhost:1337/api/v1',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
}

const specs = swaggerJsdoc(options)

module.exports = specs
