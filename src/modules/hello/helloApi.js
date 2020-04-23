const api = makeApi('Hello')

var HelloResolver = require('./helloResolver')
var helloResoslver = new HelloResolver()

api.query('getHello')
  .resolve(helloResoslver.getHello)
  .type('JSON')
