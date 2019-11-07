const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto-random-string')
const moment = require('moment')
const i18next = require('i18next')

// const redis = require('app/redis')
const UserService = require('app/modules/user/userService')
const userMail = require('./userMail').getInstance()
const UserModel = require('app/modules/user/userModel')
const { apiErrors, utils } = require('vobi-core')
const { Resolver } = require('@vobi/api-composer')
const config = require('app/config')

class AuthResolver extends Resolver {
  constructor () {
    super('auth')
    this.createUser = this.createUser.bind(this)
  }

  /**
   * Get user
   * @return {object}
   */
  async getCurrentUser ({ context: { user } }) {
    return user
  }

  /**
   * Sign in
   * @param {email} email
   * @param {password} password
   * @return {object}
   */
  async signIn ({ args: { email, password }, context }) {
    try {
      const user = await UserModel.emailExist(email)
      if (!user) return apiErrors.notFound('User not found.')
      const comparePassword = await user.comparePassword(password)
      if (!comparePassword) {
        return apiErrors.badRequest('Password is incorrect.')
      }
      const accessToken = jwt.sign(
        { userId: user._id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiration }
      )
      context.user = user
      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Sign up
   * @param {email} email
   * @param {password} password
   * @return {object}
   */
  async signUp ({ args, context }) {
    try {
      const { email, password } = args
      let user = await UserModel.emailExist(email)
      if (user) return apiErrors.conflict('Email has already been taken.')
      const hash = bcrypt.hashSync(password, 10)
      user = await new UserModel({
        email,
        password: hash,
        locale: i18next.defaultLocale
      }).save()

      const accessToken = jwt.sign(
        { userId: user._id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiration }
      )
      const token = await UserService.verifyRequest(user)
      args.token = token
      context.user = user
      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Logout
   */
  async logout ({ context: { accessToken } }) {
    try {
      // await redis.rpush('expiredTokens', accessToken)
      // redis.expire('expiredTokens', process.env.REDIS_EXPIRE)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Verify request
   * @return {object}
   */
  async verifyRequest ({ args, context: { user } }) {
    try {
      const token = await UserService.verifyRequest(user)
      args.token = token
      args.email = user.email

      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Verify request
   * @param {token} token
   * @return {object}
   */
  async verify ({ args: { token }, context }) {
    try {
      const user = await UserModel.findOne({
        'account.verification.token': token
      })
      if (!user) {
        return Promise.reject(new Error('Access Token is not valid or has expired.'))
      }

      await UserModel.updateOne({ _id: user._id }, {
        'account.verification': {
          verified: true,
          token: null,
          expireIn: null
        }
      })

      const accessToken = jwt.sign(
        { userId: user._id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiration }
      )
      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Reset password
   * @param {email} email
   */
  async resetPassword ({ args }) {
    try {
      const { email } = args
      const user = await UserModel.findOne({ email })
      if (!user) return Promise.reject(new Error('User not found.'))
      const token = crypto({ length: 48, type: 'url-safe' })
      const expireIn = moment().add(7, 'days')
      user.account.resetPassword = {
        token,
        expireIn
      }
      await user.save()
      args.token = token
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * New password
   * @param {token} token
   * @param {newPassword} newPassword
   * @return {object}
   */
  async newPassword ({ args: { token, newPassword } }) {
    try {
      const user = await UserModel.findOne({
        'account.resetPassword.token': token
      })
      if (!user) {
        return Promise.reject(new Error('Access Token is not valid or has expired.'))
      }
      const hash = bcrypt.hashSync(newPassword, 10)
      user.password = hash
      user.account.resetPassword = {
        token: null,
        expireIn: null
      }
      await user.save()
      const accessToken = jwt.sign(
        { userId: user._id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiration }
      )
      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Change password
   * @param {currentPassword} currentPassword
   * @param {newPassword} newPassword
   * @return {object}
   */
  async changePassword ({
    args: { currentPassword, newPassword },
    context: { user }
  }) {
    try {
      const comparePassword = await user.comparePassword(currentPassword)
      if (!comparePassword) return Promise.reject(new Error('currentPasswordIsIncorrect'))
      const hash = bcrypt.hashSync(newPassword, 10)
      user.password = hash
      return await user.save()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createUser ({ args }) {
    const { firstName, lastName, email } = args

    const password = utils.generateRandomPassword(7)
    const newUser = new UserModel({
      email,
      firstName,
      lastName,
      password: bcrypt.hashSync(password, 10)
    })

    const user = await newUser.save()

    const token = await UserService.verifyRequest(user._id)
    args.token = token
    args.password = password

    await userMail.verifyRequest({ args })

    return user
  }

  async getCypressUser ({ context, args }) {
    if (process.env.NODE_ENV === 'production') {
      return apiErrors.badRequest('Can not get cypress user in produciton mode.')
    }

    const email = config.cypressTestEmail
    let user = await UserModel.emailExist(email)
    if (!user) {
      const hash = bcrypt.hashSync(config.cypressTestPassword, 10)
      user = await new UserModel({
        email,
        password: hash,
        locale: i18next.defaultLocale,
        account: {
          verification: {
            verified: true,
            token: null,
            expireIn: null
          }
        }
      }).save()
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiration }
    )
    context.user = user
    return { accessToken }
  }
}

module.exports = AuthResolver
