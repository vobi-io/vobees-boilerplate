const fs = require('fs')

const collectModulePaths = (pathPattern) => {
  try {
    const glob = require('glob')
    return glob.sync(pathPattern)
  } catch (e) {
    console.log('error', e)
  }
}
const modelsFromModule = (modulePath, models) => {
  try {
    if (fs.existsSync(modulePath)) {
      const model = require(modulePath)
      models.set(model.modelName, model)
    }
  } catch (e) {
    console.log('error in modelsFromModule: ', e)
  }
}

const modelsFromModules = (pathPattern) => {
  try {
    const modulePaths = collectModulePaths(pathPattern)
    const models = new Map()
    modulePaths.forEach(modulePath => {
      modelsFromModule(modulePath, models)
    })
    return [...models.values()]
  } catch (e) {
    console.log('error trying to collect models', e)
  }
}

const findKeyByValue = (obj, val) =>
  Object.keys(obj).find(key => obj[key] === val)

module.exports = {
  findKeyByValue,
  modelsFromModules
}
