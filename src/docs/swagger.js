const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation for User Management and Admin functionalities',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // 自动读取所有路由文件中的注释
  apis: [
    './src/modules/**/*.route.js', // 假设所有路由文件位于 modules 文件夹中
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;