const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TrueNumber API',
      version: '1.0.0',
      description: 'API pour l\'application TrueNumber - Test HIGH REFERENCE SARL',
      contact: {
        name: 'Support API',
        email: 'api@truenumber.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-api-url.com/api' 
          : 'http://localhost:5000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TrueNumber API Documentation'
  }));
};