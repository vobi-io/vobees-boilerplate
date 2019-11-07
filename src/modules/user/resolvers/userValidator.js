const validator = require('validator')
const { Resolver } = require('@vobi/api-composer')
const config = require('app/config')

class UserValidator extends Resolver {
  constructor () {
    super('userValidator')
  }

  signUp ({ args: { email, password } }) {
    if (!validator.isEmail(email)) return Promise.reject(new Error('Error: email'))
    if (!validator.isLength(password, { min: 6 })) {
      return Promise.reject(new Error('Error: password'))
    }
  }

  changePassword ({ args: { newPassword } }) {
    if (!validator.isLength(newPassword, { min: 6 })) {
      return Promise.reject(new Error('Error: newPassword'))
    }
  }

  newPassword ({ args: { newPassword } }) {
    if (!validator.isLength(newPassword, { min: 6 })) {
      return Promise.reject(new Error('Error: newPassword'))
    }
  }

  checkCypressToken ({ args: { token } }) {
    if (token !== config.cypressTestsSecret) {
      return Promise.reject(new Error('Error: newPassword'))
    }
  }

  updateUser ({ args: { email, firstName, lastName } }) {
    if (!validator.isEmail(email)) return Promise.reject(new Error('Error: email'))
    if (!validator.isLength(firstName, { min: 2 })) {
      return Promise.reject(new Error('Error: firstName'))
    }
    if (!validator.isLength(lastName, { min: 2 })) {
      return Promise.reject(new Error('Error: lastName'))
    }
  }
}

module.exports = UserValidator
