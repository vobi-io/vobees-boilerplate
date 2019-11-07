
const state = {
}

const getApi = (key) => {
  return state[key]
}

const makeApi = (name) => {
  if (state[name]) {
    return state[name]
  }
  const { ApiComposer } = require('@vobi/api-composer')
  const api = new ApiComposer()
  api.setDefaultType(name)
  api.setResolversPath(global.resolverPattern)
  api.setPoliciesPath(global.policyPattern)
  state[name] = api
  return api
}

const getApis = () => {
  const result = Object.keys(state).map(k => state[k])
  return result
}
global.makeApi = makeApi
global.getApi = getApi

module.exports = {
  getApi,
  getApis,
  makeApi
}
