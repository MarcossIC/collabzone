const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Escape Co',
      version: '1.0.0',
      description: 'Documentacion de Escape Co : https://github.com/No-Country-simulation/s18-01-ft-react',
    },
    servers: [
      {
        url: `${process.env.AUTH0_BASE_URL}`,
      },
    ],
    // Definición de esquemas de seguridad
    components: {
      securitySchemes: {
        cookiesAuth: {
          type: 'apiKey',
          scheme: 'bearer',
          name: 'token', // Opcional, indica el formato del token
        },
      },
    },
    // Aplicando el esquema de seguridad globalmente a todas las rutas
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/router/*.js'], // Aquí defines donde están tus rutas documentadas
};

module.exports = swaggerOptions;
