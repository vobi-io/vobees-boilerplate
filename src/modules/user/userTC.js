module.exports = (api) => {
  const UserTC = api.getGqlType('User')

  UserTC.removeField('password')

  const userAccountTC = UserTC.getFieldTC('account')

  userAccountTC.getFieldTC('verification').removeField(['token', 'expiredIn'])
  userAccountTC.removeField('resetPassword')
}
