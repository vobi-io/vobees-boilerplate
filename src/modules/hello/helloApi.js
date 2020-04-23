const api = makeApi('App')

var HelloResolver = require('./helloResolver')
var helloResoslver = new HelloResolver()

api.query('hello')
  .resolve(helloResoslver.getHello)
  .type('JSON')
  .doc({
    displayName: 'Hello world'
  })
