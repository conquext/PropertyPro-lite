import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
    info: {
      title: 'PropertyPro-lite',
      version: '1.0.0',
      description: 'Property Pro Lite is a platform where people can create and/or search properties for sale or rent.',
    },
    host: 'localhost:4000',
    basePath: '/api/v1/',
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
      basicauth: {
        type: 'basic',
      },
    },
}

const options = {
    swaggerDefinition,
    apis: ['./API/routes/*.js', './API/models/*.js'],
};

const specs = swaggerJsdoc(options);
 
export default specs;