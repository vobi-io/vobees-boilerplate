const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const state = require('../common/state')
const generateGraphql = require('../mixins/generateGraphql')
const { user } = require('../static/data')

describe('Auth', () => {
  before(async function () {
    try {
      await db.UserModel.deleteOne({ email: user.email })
      await db.UserModel.deleteOne({ email: user.reservedEmail })
      await db.UserModel.deleteOne({ email: user.updatedEmail })
      await db.UserModel.deleteOne({ email: user.superAdminEmail })
      await db.UserModel.deleteOne({ email: user.waybillEmail })
    } catch (err) {
      console.log(err)
    }
  })

  describe('Sign up', () => {
    /**
     * @method mutation
     * @path signUp
     * @module User
     * @desc Should sign up for reserved user
     */
    it('Should sign up for reserved user', done => {
      generateGraphql({
        done,
        gql: 'signUp',
        method: 'mutation',
        params: {
          email: user.reservedEmail,
          password: user.password
        },
        auth: false,
        end: async () => {
          const foundUser = await db.UserModel.findOne({
            email: user.reservedEmail
          })
          state.set('reservedUserId', foundUser._id)
          done()
        }
      })
    })

    /**
     * @method mutation
     * @path signUp
     * @module User
     * @desc Should sign up
     */
    it('Should sign up', done => {
      generateGraphql({
        done,
        gql: 'signUp',
        method: 'mutation',
        params: {
          email: user.email,
          password: user.password
        },
        auth: false,
        state: { token: 'accessToken' },
        end: async () => {
          const foundUser = await db.UserModel.findOne({ email: user.email })
          state.set('userId', foundUser._id)
          done()
        }
      })
    })

    /**
     * @method mutation
     * @path signUp
     * @module User
     * @desc Should sign up super admin user
     */
    it('Should sign up super admin user', done => {
      generateGraphql({
        done,
        gql: 'signUp',
        method: 'mutation',
        params: {
          email: user.superAdminEmail,
          password: user.password
        },
        auth: false,
        state: { superAdminToken: 'accessToken' },
        end: async () => {
          const foundUser = await db.UserModel.findOne({ email: user.superAdminEmail })
          foundUser.isSuperAdmin = true
          await foundUser.save()
          state.set('superAdminUserId', foundUser._id)
          done()
        }
      })
    })

    /**
     * @method mutation
     * @path signUp
     * @module User
     * @desc Should sign up waybill user
     */
    it('Should sign up waybill user', done => {
      generateGraphql({
        done,
        gql: 'signUp',
        method: 'mutation',
        params: {
          email: user.waybillEmail,
          password: user.password
        },
        auth: false,
        state: { waybillToken: 'accessToken' },
        end: async () => {
          const foundUser = await db.UserModel.findOne({ email: user.waybillEmail })
          state.set('waybillUserId', foundUser._id)
          done()
        }
      })
    })

    /**
     * @method mutation
     * @path signUp
     * @module User
     * @desc Should not sign up if email already has been taken.
     */
    it('Should not sign up if email already has been taken.', done => {
      generateGraphql({
        done,
        gql: 'signUp',
        method: 'mutation',
        params: {
          email: user.email,
          password: user.password
        },
        auth: false,
        shouldError: true
      })
    })

    /**
     * @method mutation
     * @path signUp
     * @module User
     * @desc Should not sign up if user is already authorized
     */
    it('Should not sign up if user is already authorized', done => {
      generateGraphql({
        done,
        gql: 'signUp',
        method: 'mutation',
        params: {
          email: user.email,
          password: user.password
        },
        token: state.get('token'),
        shouldError: true
      })
    })
  })

  describe('Sign in', () => {
    /**
     * @method mutation
     * @path signIn
     * @module User
     * @desc Should sign in
     */
    it('Should sign in', done => {
      generateGraphql({
        done,
        gql: 'signIn',
        method: 'mutation',
        params: {
          email: user.email,
          password: user.password
        },
        auth: false,
        state: { token: 'accessToken' },
        end: async () => {
          const foundUser = await db.UserModel.findOne({ email: user.email })
          state.set('userId', foundUser._id)
          done()
        }
      })
    })

    /**
     * @method mutation
     * @path signIn
     * @module User
     * @desc Should not sign in if password is incorrect
     */
    it('Should not sign in if password is incorrect', done => {
      generateGraphql({
        done,
        gql: 'signIn',
        method: 'mutation',
        params: {
          email: user.email,
          password: user.incorrectPassword
        },
        auth: false,
        shouldError: true
      })
    })

    /**
     * @method mutation
     * @path signIn
     * @module User
     * @desc Should not sign in if user already authorized
     */
    it('Should not sign in if user already authorized', done => {
      generateGraphql({
        done,
        gql: 'signIn',
        method: 'mutation',
        params: {
          email: user.email,
          password: user.password
        },
        token: state.get('token'),
        shouldError: true
      })
    })
  })

  describe('Reset password', () => {
    /**
     * @method mutation
     * @path resetPassword
     * @module User
     * @desc Should reset password
     */
    it('Should reset password', done => {
      generateGraphql({
        done,
        gql: 'resetPassword',
        method: 'mutation',
        params: { email: user.email },
        auth: false,
        end: async res => {
          const foundUser = await db.UserModel.findOne({ email: user.email })
          state.set('resetPasswordToken', foundUser.account.resetPassword.token)
          done()
        }
      })
    })

    /**
     * @method mutation
     * @path resetPassword
     * @module User
     * @desc Should not reset password if user was not found
     */
    it('Should not reset password if user was not found', done => {
      generateGraphql({
        done,
        gql: 'resetPassword',
        method: 'mutation',
        params: { email: user.incorrectEmail },
        auth: false,
        shouldError: true
      })
    })

    /**
     * @method mutation
     * @path resetPassword
     * @module User
     * @desc Should not reset password if user is already authorized
     */
    it('Should not reset password if user is already authorized', done => {
      generateGraphql({
        done,
        gql: 'resetPassword',
        method: 'mutation',
        params: { email: user.email },
        token: state.get('token'),
        shouldError: true
      })
    })
  })

  describe('New password', () => {
    /**
     * @method mutation
     * @path newPassword
     * @module User
     * @desc Should new password
     */
    it('Should new password', done => {
      generateGraphql({
        done,
        gql: 'newPassword',
        method: 'mutation',
        params: {
          newPassword: user.password,
          token: state.get('resetPasswordToken')
        },
        state: { token: 'accessToken' },
        auth: false
      })
    })

    /**
     * @method mutation
     * @path newPassword
     * @module User
     * @desc Should not new password if token is incorrect or expired.
     */
    it('Should not new password if token is incorrect or expired.', done => {
      generateGraphql({
        done,
        gql: 'newPassword',
        method: 'mutation',
        params: {
          newPassword: user.password,
          token: state.get('resetPasswordToken')
        },
        auth: false,
        shouldError: true
      })
    })

    /**
     * @method mutation
     * @path newPassword
     * @module User
     * @desc Should not new password if user is already authorized
     */
    it('Should not new password if user is already authorized', done => {
      generateGraphql({
        done,
        gql: 'newPassword',
        method: 'mutation',
        params: {
          newPassword: user.password,
          token: state.get('resetPasswordToken')
        },
        token: state.get('token'),
        shouldError: true
      })
    })
  })

  describe('Verification', () => {
    /**
     * @method mutation
     * @path verifyRequest
     * @module User
     * @desc Should verfiy request
     */
    it('Should verfiy request', done => {
      generateGraphql({
        done,
        gql: 'verifyRequest',
        method: 'mutation',
        token: state.get('token'),
        end: async () => {
          const foundUser = await db.UserModel.findOne({ email: user.email })
          foundUser.account.verification.verified = true
          await foundUser.save()
          state.set('verificationToken', foundUser.account.verification.token)
          done()
        }
      })
    })

    /**
     * @method mutation
     * @path verifyRequest
     * @module User
     * @desc Should not verfiy request if user does not authorized
     */
    it('Should not verfiy request if user does not authorized', done => {
      generateGraphql({
        done,
        gql: 'verifyRequest',
        method: 'mutation',
        auth: false,
        shouldError: true
      })
    })

    /**
     * @method mutation
     * @path verifyRequest
     * @module User
     * @desc Should not verfiy request if user already verified
     */
    it('Should not verfiy request if user already verified', done => {
      generateGraphql({
        done,
        gql: 'verifyRequest',
        method: 'mutation',
        token: state.get('token'),
        shouldError: true,
        end: async () => {
          const foundUser = await db.UserModel.findOne({ email: user.email })
          foundUser.account.verification.verified = false
          await foundUser.save()
          done()
        }
      })
    })

    /**
     * @method mutation
     * @path verifyRequest
     * @module User
     * @desc Should verfiy
     */
    it('Should verfiy', done => {
      generateGraphql({
        done,
        gql: 'verify',
        method: 'mutation',
        params: {
          token: state.get('verificationToken')
        }
      })
    })

    /**
     * @method mutation
     * @path verifyRequest
     * @module User
     * @desc Should not verfiy if user already verified or token is incorrect or expired
     */
    it('Should not verfiy if user already verified or token is incorrect or expired', done => {
      generateGraphql({
        done,
        gql: 'verify',
        method: 'mutation',
        params: {
          token: state.get('verificationToken')
        },
        shouldError: true
      })
    })
  })

  describe('Get user', () => {
    /**
     * @method query
     * @path user
     * @module User
     * @desc Should get user
     */
    it('Should get user', done => {
      generateGraphql({
        done,
        gql: 'user',
        method: 'query',
        token: state.get('token'),
      })
    })

    /**
     * @method query
     * @path user
     * @module User
     * @desc Should not get user if unauthorized
     */
    it('Should not get user if unauthorized', done => {
      generateGraphql({
        done,
        gql: 'user',
        method: 'query',
        auth: false,
        shouldError: true
      })
    })
  })

  describe('Get all users', () => {
    /**
     * @method query
     * @path getAllUsers
     * @module User
     * @desc Should not get all users if unauthorized
     */
    it('Should not get all users if unauthorized', done => {
      generateGraphql({
        done,
        gql: 'getAllUsers',
        method: 'query',
        auth: false,
        shouldError: true
      })
    })

    /**
     * @method query
     * @path getAllUsers
     * @module User
     * @desc Should not get all users if not super admin
     */
    it('Should not get all users if not super admin', done => {
      generateGraphql({
        done,
        gql: 'getAllUsers',
        method: 'query',
        token: state.get('token'),
        shouldError: true,
      })
    })

    /**
     * @method query
     * @path getAllUsers
     * @module User
     * @desc Should get all users if super admin
     */
    it('Should get all users if super admin', done => {
      generateGraphql({
        done,
        gql: 'getAllUsers',
        method: 'query',
        params: {
          page: 1,
          perPage: 8,
          filter:{},
          sort: null
        },
        token: state.get('superAdminToken'),
      })
    })
  })
})
