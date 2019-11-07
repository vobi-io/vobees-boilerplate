const { apiErrors } = require('vobi-core')
const { Policy } = require('@vobi/api-composer')

class AuthPolicy extends Policy {
  constructor () {
    super('auth')
  }

  async isAuth ({ context: { user } }) {
    if (!user) return apiErrors.unauthorized('User not authorized.')
    return true
  }

  async isGuest ({ context: { user } }) {
    if (user) return apiErrors.conflict('You have already authorized.')
    return true
  }

  async isVerified ({ context: { user } }) {
    // if (!user.account.verification.verified)
    //   return Promise.reject('You must be verified.')
    return true
  }

  async isUnverified ({ context: { user } }) {
    if (user.account.verification.verified) {
      return apiErrors.conflict('You have already verified.')
    }
    return true
  }

  async isSuperAdmin ({ context: { user } }) {
    if (!user.isSuperAdmin) return Promise.reject(new Error('User does not have perrmission'))
    return true
  }
}

module.exports = AuthPolicy
