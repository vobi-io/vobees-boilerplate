var path = require('path')

var rootFolder = path.resolve(__dirname, '..', '..')

module.exports = {
  port: 8000,
  google: {
    mapApiKey: process.env.GOOGLE_MAP_API_KEY || '/* map api key */',
    projectId: process.env.GOOGLE_PROJECT_ID || 'test',
    credentials: {}
  },
  socket: {
    port: 8002,
    server: 'http://localhost:8002/'
  },
  upload: {
    dir: rootFolder + '/public/uploads/images',
    maxFieldSize: 20000000 // 20 MB
    // maxFileSize: ,
    // maxFiles
  },
  logoUrl: 'http://localhost:8000/static/logos',
  jwt: {
    secret: 'secret',
    expiration: '24h'
  },
  sendGrid: {
    apiKey: process.env.SENDGRID_API_KEY
  },
  cronSecretKey: process.env.CRON_SECRET_KEY,
  activityLogKey: process.env.ACTIVITY_LOG_KEY,
  HTTP_HOST: 'http://localhost:8001',
  qrCodes: {
    upload: `${rootFolder}/public/qrcodes/`,
    assetFolder: '/qrcodes/'
  },
  deploymentDir: `${rootFolder}/deployment`,
  sentryKey: process.env.SENTRY_KEY,
  // cronjobKey : 'vinc!ncGamax!losAm0wydesErtDges'
  smsService: {
    apiUrl: 'http://smsoffice.ge/api/v2/send',
    token: '/* sms service token /*',
    sender: 'appDomain'
  },
  cypressTestsSecret: '/* cypress secret */',
  cypressTestEmail: 'cypress@appDomain.com',
  cypressTestPassword: '/* cypress password */'
}
