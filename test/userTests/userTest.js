const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const state = require('../common/state')
const generateGraphql = require('../mixins/generateGraphql')
const { user, switchLocale } = require('../static/data')

describe('User', () => {

  describe('Update user', () => {
    /**
     * @method mutation
     * @path updateUser
     * @module User
     * @desc Should update user
     */
    it('Should update user', done => {
      generateGraphql({
        done,
        gql: 'updateUser',
        method: 'mutation',
        params: {
          email: user.updatedEmail,
          lastName: user.lastName,
          firstName: user.firstName,
        },
        token: state.get('token'),
        state: { updatedUserId: '_id' },
        check: {
          'data.updateUser.email': { type: 'String', value: user.updatedEmail }
        }
      })
    })

    /**
     * @method mutation
     * @path updateUser
     * @module User
     * @desc Should not update user if unauthorized
     */
    it('Should not update user if unauthorized', done => {
      generateGraphql({
        done,
        gql: 'updateUser',
        method: 'mutation',
        params: {
          email: user.updatedEmail,
          lastName: user.lastName,
          firstName: user.firstName
        },
        auth: false,
        shouldError: true
      })
    })

    /**
     * @method mutation
     * @path updateUser
     * @module User
     * @desc Should not update user if email does not exist
     */
    it('Should not update user if email does not exist', done => {
      generateGraphql({
        done,
        gql: 'updateUser',
        method: 'mutation',
        params: {
          lastName: user.lastName,
          firstName: user.firstName
        },
        token: state.get('token'),
        shouldError: true,
        status: 500
      })
    })

    /**
     * @method mutation
     * @path updateUser
     * @module User
     * @desc Should not update user if lastName does not exist
     */
    it('Should not update user if lastName does not exist', done => {
      generateGraphql({
        done,
        gql: 'updateUser',
        method: 'mutation',
        params: {
          email: user.updatedEmail,
          firstName: user.firstName
        },
        token: state.get('token'),
        shouldError: true,
        status: 500
      })
    })

    /**
     * @method mutation
     * @path updateUser
     * @module User
     * @desc Should not update user if firstName does not exist
     */
    it('Should not update user if firstName does not exist', done => {
      generateGraphql({
        done,
        gql: 'updateUser',
        method: 'mutation',
        params: {
          email: user.updatedEmail,
          lastName: user.lastName
        },
        token: state.get('token'),
        shouldError: true,
        status: 500
      })
    })
  })

  describe('Change password', () => {
    /**
     * @method mutation
     * @path changePassword
     * @module User
     * @desc Should change password
     */
    it('Should change password', done => {
      generateGraphql({
        done,
        gql: 'changePassword',
        method: 'mutation',
        params: {
          currentPassword: user.password,
          newPassword: user.newPassword
        },
        token: state.get('token'),
      })
    })

    /**
     * @method mutation
     * @path changePassword
     * @module User
     * @desc Should not change password if unauthorized
     */
    it('Should not change password if unauthorized', done => {
      generateGraphql({
        done,
        gql: 'changePassword',
        method: 'mutation',
        params: {
          currentPassword: user.password,
          newPassword: user.newPassword
        },
        auth: false,
        shouldError: true
      })
    })

    /**
     * @method mutation
     * @path changePassword
     * @module User
     * @desc Should not change password if current password is incorrect
     */
    it('Should not change password if current password is incorrect', done => {
      generateGraphql({
        done,
        gql: 'changePassword',
        method: 'mutation',
        params: {
          currentPassword: user.incorrectPassword,
          newPassword: user.newPassword
        },
        token: state.get('token'),
        shouldError: true
      })
    })
  })

  describe('Switch locale', () => {
    /**
     * @method mutation
     * @path switchLocale
     * @module User
     * @desc Should switch locale
     */
    it('Should switch locale', done => {
      generateGraphql({
        done,
        gql: 'switchLocale',
        method: 'mutation',
        params: {
          locale: switchLocale.english
        },
        token: state.get('token'),
      })
    })

    /**
     * @method mutation
     * @path switchLocale
     * @module User
     * @desc Should not switch locale if provider is incorrect
     */
    it('Should not switch locale if provider is incorrect', done => {
      generateGraphql({
        done,
        gql: 'switchLocale',
        method: 'mutation',
        params: {
          locale: switchLocale.incorrectProvider
        },
        token: state.get('token'),
        shouldError: true,
        status: 500
      })
    })

    /**
     * @method mutation
     * @path switchLocale
     * @module User
     * @desc Should not switch locale if unauthorized
     */
    it('Should not switch locale if unauthorized', done => {
      generateGraphql({
        done,
        gql: 'switchLocale',
        method: 'mutation',
        params: {
          locale: switchLocale.english
        },
        auth: false,
        shouldError: true
      })
    })
  })


})
