process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const i18next = require('i18next')
const middleware = require('i18next-express-middleware')
const helmet = require('helmet')
require('app/i18next')

const app = express()

var whitelist = [
  // todo need add production urls in cors, and move test in staging and development
]

if (process.env.NODE_ENV !== 'production') {
  whitelist = whitelist.concat([
    /(localhost)./
  ])
}

const corsOptions = {
  origin: function (origin, callback) {
    const length = whitelist.filter(i => i.test(origin)).length
    if (length > 0 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['X-Requested-With',
    'X-HTTP-Method-Override', 'Content-Type',
    'Accept', 'Authorization', 'User-Agent', 'companyId',
    'Strict-Transport-Security', 'Content-Security-Policy',
    'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Feature-Policy'
  ]
}

app.use(helmet())

// X-Content-Type-Options
app.use(helmet.noSniff())

// X-Frame-Options
app.use(helmet.frameguard({ action: 'sameorigin' }))

// Referrer-Policy
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

// Strict - Transport - Security
const sixtyDaysInSeconds = 5184000
app.use(helmet.hsts({
  maxAge: sixtyDaysInSeconds
}))

app.use(cors(corsOptions))
app.use(middleware.handle(i18next, { removeLngFromUrl: false }))

app.set('superSecret', 'Secret')
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
const pathNodeModules = path.join(__dirname + '/node_modules') //eslint-disable-line
app.use('/node_modules', express.static(pathNodeModules))

app.set('configuration', require('app/config'))

app.get('/', (req, res) => {
  res.sendStatus(200)
})

module.exports = app
