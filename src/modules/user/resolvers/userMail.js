const mailService = require('app/services/sendgrid/sgService')
const config = require('app/config')
const { Resolver } = require('@vobi/api-composer')

class UserMail extends Resolver {
  constructor () {
    super('userMail')
  }

  async signUp ({ args: { email } }) {
    try {
      const result = await mailService.send({
        templateName: 'signUp',
        to: email,
        from: 'no-reply@appDomain.com',
        subject: 'appDomain - Sign up'
      })
      return result
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async resetPassword ({ args: { email, token } }) {
    try {
      const resetPasswordURL = `${config.front_url}/new-password/${token}`

      const result = await mailService.send({
        templateName: 'resetPassword',
        templateData: { resetPasswordURL },
        to: email,
        from: 'no-reply@appDomain.com',
        subject: 'appDomain - Reset password'
      })
      return result
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async verifyRequest ({ args: { email, token } }) {
    try {
      const verifyURL = `${config.front_url}/verify/${token}`

      const result = mailService.send({
        templateName: 'verify',
        templateData: { verifyURL },
        to: email,
        from: 'no-reply@appDomain.com',
        subject: 'appDomain - Verification'
      })
      return result
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

module.exports = UserMail
