const YAML = require('yamljs')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const pkg = require('../package.json')

var options = {
  swaggerDefinition: {
    info: {
      title: pkg.name, // Title (required)
      version: pkg.version, // Version (required)
    },
  },
  apis: ['./lib/controllers/api.js'], // Path to the API docs
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options)
module.exports = function (app) {
  app.get('/api-docs.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  });
  app.get('/api-docs.yaml', function (req, res) {
    res.setHeader('Content-Type', 'text/x-yaml')
    res.send(YAML.stringify(swaggerSpec, 4))
  })
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
