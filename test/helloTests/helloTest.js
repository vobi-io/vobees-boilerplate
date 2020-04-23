const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const state = require('../common/state')
const generateGraphql = require('../mixins/generateGraphql')
const { user, company, logoutUser } = require('../static/data')

describe('Hello', () => {
  before(async function () {

  })

  describe('Hello Get', () => {
    /**
     * @method query
     * @path getHello
     * @module Hellp
     * @desc Should get success
     */
    it('Should get success', done => {
      generateGraphql({
        done,
        gql: 'getHello',
        method: 'query',
        params: {
        },
        auth: false,
        end: async (res) => {
          state.set('message', res)
          done()
        }
      })
    })
  })
})
