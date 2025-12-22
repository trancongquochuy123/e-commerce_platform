const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'Swagger documentation for E-Commerce Platform'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },

  apis: [
    path.resolve(__dirname, '../src/api/v1/routes/*.js'),
    path.resolve(__dirname, '../src/admin/routes/*.js'),
  ]
};

module.exports = swaggerJSDoc(options);
