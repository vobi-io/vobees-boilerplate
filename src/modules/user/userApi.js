const api = makeApi('User')
require('app/modules/user/userTypes')(api)
require('app/modules/user/userTC')(api)

api
  .policy(['auth.isAuth', 'auth.isVerified'])
  .only([
    'user',
    'changePassword',
    'updateUser',
    'switchLocale',
    'getAllUsers'
  ])

api.policy('auth.isAuth').only('logout')

api.policy(['auth.isAuth', 'auth.isUnverified']).only('verifyRequest')

api
  .policy('auth.isGuest')
  .only(['signUp', 'signIn', 'resetPassword', 'newPassword'])

api.query('user').resolve('auth.getCurrentUser')

api
  .queryOf('User.pagination', 'getAllUsers')
  .policy('auth.isSuperAdmin')

api
  .mutation('signIn')
  .args({
    email: 'String!',
    password: 'String!'
  })
  .resolve('auth.signIn')
  .type('AccessToken')
  .afterAsync('activity.register')

api
  .mutation('signUp')
  .before('userValidator.signUp')
  .args({
    email: 'String!',
    password: 'String!'
  })
  .resolve('auth.signUp')
  .afterAsync(['userMail.signUp', 'userMail.verifyRequest'])
  .type('AccessToken')
  .afterAsync('activity.register')

api.mutation('logout')
  .resolve('auth.logout')
  .afterAsync('activity.register')

api
  .mutation('verifyRequest')
  .resolve('auth.verifyRequest')
  .afterAsync('userMail.verifyRequest')
  .afterAsync('activity.register')

api
  .mutation('verify')
  .args({ token: 'String!' })
  .resolve('auth.verify')
  .type('AccessToken')
  .afterAsync('activity.register')

api
  .mutation('resetPassword')
  .args({ email: 'String!' })
  .resolve('auth.resetPassword')
  .afterAsync('userMail.resetPassword')
  .afterAsync('activity.register')

api
  .mutation('newPassword')
  .before('userValidator.newPassword')
  .args({
    token: 'String!',
    newPassword: 'String!'
  })
  .resolve('auth.newPassword')
  .type('AccessToken')
  .afterAsync('activity.register')

api
  .mutation('changePassword')
  .before('userValidator.changePassword')
  .args({
    currentPassword: 'String!',
    newPassword: 'String!'
  })
  .resolve('auth.changePassword')
  .afterAsync('activity.register')

api
  .mutation('updateUser')
  .before('userValidator.updateUser')
  .args({
    email: 'String!',
    firstName: 'String!',
    lastName: 'String!'
  })
  .resolve('user.updateUser')
  .afterAsync('activity.register')

api
  .mutation('switchLocale')
  .args({ locale: 'Locale!' })
  .resolve('user.switchLocale')
  .afterAsync('activity.register')

// get cypress test user
api.mutation('getCypressUser')
  .before('userValidator.checkCypressToken')
  .resolve('auth.getCypressUser')
  .args({
    token: 'String!'
  })
  .type('AccessToken')
