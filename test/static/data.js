const moment = require('moment')

module.exports = {
  user: {
    email: 'test@gmail.com',
    incorrectEmail: 'incorrect@vobi.io',
    updatedEmail: 'updated@vobi.io',
    reservedEmail: 'reserved@vobi.io',
    superAdminEmail: 'superAdmin@vobi.io',
    waybillEmail: 'waybill@vobi.io',
    password: 'secret',
    incorrectPassword: 'incorrect',
    newPassword: 'newPassword',
    firstName: 'Test',
    lastName: 'Testson'
  },

  switchLocale: {
    english: 'en',
    georgia: 'ge',
    incorrectProvider: 'incorrectProvider'
  },

  admin: {
    email: '/* admin email */',
    password: '12345678',
    role: 'admin',
    invalidPassword: 'invalidPassword'
  },
}
