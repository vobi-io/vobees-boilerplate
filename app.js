process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const i18next = require('i18next')
const middleware = require('i18next-express-middleware')

require('app/i18next')

const Sentry = require('@sentry/node')
const config = require('app/config')
Sentry.init({
  dsn: config.sentryKey,
  environment: process.env.NODE_ENV
})

const app = express()

app.use(cors())

app.use(middleware.handle(i18next, { removeLngFromUrl: false }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, authorization'
  )
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.set('superSecret', 'this$isThisfuckingsecret%^now')
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './src/views'))
// app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
const pathNodeModules = path.join(__dirname + '/node_modules') //eslint-disable-line
app.use('/node_modules', express.static(pathNodeModules))
app.use('/static/logos', express.static(path.join(__dirname, 'public/uploads/images')))

app.set('configuration', require('app/config'))

app.map = function (a, route) {
  route = route || ''
  for (var key in a) {
    if (Array.isArray(a[key])) {
      app[key](route, a[key])
    } else if (typeof a[key] === 'object') {
      app.map(a[key], route + key)
    } else if (typeof a[key] === 'function') {
      app[key](route, a[key])
    }
  }
}

app.get('/', (req, res) => {
  res.sendStatus(200)
})

module.exports = app
