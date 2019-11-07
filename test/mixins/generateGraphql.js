const path = require('path')
const fs = require('fs')
const generateTest = require('./generateTest')

const generateGql = ({ gql, params, method }) => {
  const gqlFile = `../generated/${method.toLowerCase()}/${gql}.gql`
  const gqlFilePath = path.resolve(__dirname, gqlFile)
  return fs.readFileSync(gqlFilePath, 'utf8')
}

const generateGraphql = ({
  done,
  method = 'query',
  params = {},
  gql,
  end,
  state = {},
  shouldError = false,
  token,
  ...rest
}) => {
  const graphql = {
    query: generateGql({ gql, params, method }),
    variables: params
  }

  const newState = {}

  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      const element = state[key]

      if (element === '*') {
        newState[key] = `data.${gql}`
      } else {
        newState[key] = `data.${gql}.${element}`
      }
    }
  }
  // let status
  // if (shouldError) {
  //   status = 500
  // }

  generateTest({
    ...rest,
    done,
    route: '/graphql',
    method: 'post',
    params: graphql,
    state: newState,
    token,
    // status,
    gql,
    end: res => {
      if (!shouldError && res.body.errors && res.body.errors.length) {
        if (end) return end(res.body.errors)
        return done(res.body.errors)
      }
      res.body.should.be.a('object')
      // token
      if (shouldError) {
        res.body.should.have.property('errors')
      } else {
        res.body.should.have.property('data')
        if (gql !== 'chatById' && gql !== 'chatMany') res.body.data.should.have.property(gql)
        else if (gql === 'chatById') res.body.data.should.have.property('chat')
        else res.body.data.should.have.property('chats')
      }

      if (end) {
        end(res)
      } else {
        done()
      }
    }
  })
}

module.exports = generateGraphql
