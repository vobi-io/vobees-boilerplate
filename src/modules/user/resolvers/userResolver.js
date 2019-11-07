const UserModel = require('app/modules/user/userModel')
const { Resolver } = require('@vobi/api-composer')

class UserResolver extends Resolver {
  constructor () {
    super('user')
  }

  /**
   * Update user
   * @param {email} email
   * @param {firstName} firstName
   * @param {lastName} lastName
   * @return {object}
   */
  async updateUser ({ args, context: { user } }) {
    try {
      if (user.email !== args.email) {
        const userExist = await UserModel.findOne({ email: args.email })
        if (userExist) return Promise.reject(new Error('emailHasAlreadyBeenTaken'))
      }

      for (const arg in args) user[arg] = args[arg]

      return await user.save()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Switch locale
   * @param {locale} email
   * @return {object}
   */
  async switchLocale ({ args: { locale }, context: { user } }) {
    try {
      user.locale = locale

      return await user.save()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = UserResolver
