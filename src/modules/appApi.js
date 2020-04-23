const api = makeApi('App')

var AppResolver = require('./appResolver')
var appResoslver = new AppResolver()

api.query('hello', appResoslver.getHello)
