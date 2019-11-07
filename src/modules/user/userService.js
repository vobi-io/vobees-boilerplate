const crypto = require('crypto-random-string')
const moment = require('moment')

const UserModel = require('app/modules/user/userModel')

class UserService {
  async verifyRequest (user) {
    try {
      const token = crypto({ length: 48, type: 'url-safe' })
      const expireIn = moment().add(7, 'days')
      const { _id: userId } = user

      await UserModel.updateOne(
        { _id: userId },
        {
          $set: {
            'account.verification.token': token,
            'account.verification.expireIn': expireIn
          }
        }
      )
      return token
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async clearExpiredVerifications () {
    try {
      const result = await UserModel.updateMany(
        {
          'account.verification.expireIn': { $lte: moment() }
        },
        {
          'account.verification.expireIn': null,
          'account.verification.token': null
        }
      ).exec()
      return result
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async clearExpiredResetPasswords () {
    try {
      const result = await UserModel.updateMany(
        {
          'account.resetPassword.expireIn': { $lte: moment() }
        },
        {
          'account.resetPassword.expireIn': null,
          'account.resetPassword.token': null
        }
      ).exec()
      return result
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

module.exports = new UserService()
