const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../bin/www')

let should = chai.should()
let expect = chai.expect
chai.use(chaiHttp)

const state = require('../common/state')

const isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

const checkStatus = ({ res, status }) => {
  let statusCodes = [200, 201]

  if (status) {
    if (Array.isArray(status)) {
      statusCodes = status
    } else if (typeof status === 'number') {
      statusCodes = [status]
    }
  }

  return expect(res.status).to.be.oneOf(statusCodes)
}

Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  s = s.replace(/^\./, '') // strip a leading dot
  var a = s.split('.')
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i]
    if (k in o) {
      o = o[k]
    } else {
      return
    }
  }
  return o
}

const log = ({ debug, err, params, res, paramType, method, route }) => {
  if (debug) {
    console.warn('===================== INFO START =====================')
    console.info('ParamType ::', paramType)
    console.info('Method ::', method)
    console.info('Route ::', route)
    console.info('Params', params)
    console.warn('===================== INFO END   =====================')

    console.warn('===================== ERROR START =====================')
    console.error(err)
    console.warn('===================== ERROR END   =====================')

    console.warn('===================== STATUS START =====================')
    console.info(res.status)
    console.warn('===================== STATUS END =====================')

    console.warn('===================== BODY START =====================')
    console.log(res.body)
    console.warn('===================== BODY START =====================')

    console.warn('===================== Errors =====================')
    console.log(res.body.errors)
    console.warn('===================== Errors =====================')
  }
}

const generateTest = ({
  done,

  method = 'get',
  params = {},
  route,

  end,

  check: fields = {},

  state: updateState = {},
  auth = true,
  status,
  gql,
  debug = false,
  token: incommingToken,
}) => {
  let paramType = 'query'

  if (method.toLowerCase() === 'post' || 'put') {
    paramType = 'send'
  }

  // If auth property not equals FALSE, send token to every enpoint
  let token = incommingToken
  if (!token) {
    token = state.get('token')
  }

  if (auth === false) {
    token = null
  }

  chai
    .request(server)
  [method](route)
  [paramType](params)
    .set('authorization', `Bearer ${token}`)
    .end((err, res) => {
      // If call to enpoint errored, stop test and return error
      log({ debug, err, params, res, paramType, method, route })

      if (err) {
        return done(err)
      }

      // Check status
      checkStatus({ res, status })

      // Every request must be an object containing data property
      res.body.should.be.a('object')
      // res.body.should.have.property('data')

      // Check fields
      if (!isEmpty(fields)) {
        for (const key in fields) {
          if (fields.hasOwnProperty(key)) {
            const field = fields[key]
            const fieldType = field.type
            const fieldValue = field.value
            const fieldPath = key.split('.')
            if (fieldPath.length === 1) {
              const fieldName = fieldPath[0]

              res.body.should.have.property(fieldName)
              if (fieldType && fieldValue) {
                res.body[fieldName].should.be.a(fieldType)
                expect(res.body[fieldName]).to.equal(fieldValue)
              } else if (fieldType && !fieldValue) {
                res.body[fieldName].should.be.a(fieldType)
              } else {
                expect(res.body[fieldName]).to.equal(fieldValue)
              }
            } else {
              const fieldName = fieldPath[fieldPath.length - 1]
              const fieldParent = fieldPath.slice(0, -1)

              const parent = Object.byString(res.body, fieldParent.join('.'))
              parent.should.have.property(fieldName)
              if (fieldType && fieldValue) {
                parent[fieldName].should.be.a(fieldType)
                expect(parent[fieldName]).to.equal(fieldValue)
              } else if (fieldType && !fieldValue) {
                parent[fieldName].should.be.a(fieldType)
              } else {
                expect(parent[fieldName]).to.equal(fieldValue)
              }
            }
          }
        }
      }

      // Update state
      if (!isEmpty(updateState)) {
        for (const key in updateState) {
          if (updateState.hasOwnProperty(key)) {
            const value = Object.byString(res.body, updateState[key])
            state.set(key, value)
          }
        }
      }

      // Call callback function
      if (!end) {
        done()
      } else {
        res.args = params
        end(res)
      }
    })
}

module.exports = generateTest
