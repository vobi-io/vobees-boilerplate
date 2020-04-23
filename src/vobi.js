const path = require('path')
const { ApiComposer, mergeApis } = require('@vobi/api-composer')
const bodyParser = require('body-parser')
const { graphqlUploadExpress } = require('graphql-upload')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const pubsub = require('app/pubsub')
const swaggerData = require('./swagger')
const { testCoverage, html, routes } = require('@vobi-io/test-coverage')
const { modelsFromModules } = require('app/utils')

const resolverPattern = `${__dirname}/**/*.js`
const policyPattern = `${__dirname}/**/*.js`
const modulePattern = path.resolve('./src/modules/**/**Model.js')
global.resolverPattern = resolverPattern
global.modulePattern = modulePattern
global.policyPattern = policyPattern

const { getApis } = require('./apiComposer')

const {
  // onErrorExpress,
  // onErrorGraphql,
  responseDecorator
  // modelsFromModules
  // collectModulePaths
} = require('vobi-core')

class Vobi {
  async prepare (app, server) {
    // this.initResponses(app)
    this.initModels()
    this.initGraphqlTypes()
    this.initGraphql(app, server)
    this.initRouter(app)
    // this.initSocket()
  }

  initResponses (app) {
    try {
      require('./utils/responses').forEach(response => {
        app.use(response)
      })
    } catch (err) {
      console.log(err)
    }
  }

  initTestCoverage ({ app, schema }) {
    if (process.env.NODE_ENV !== 'production') {
      const queries = []
      const mutations = []

      if (schema._queryType && schema._queryType._fields) {
        queries.push(...Object.keys(schema._queryType._fields))
      }
      if (schema._mutationType && schema._mutationType._fields) {
        mutations.push(...Object.keys(schema._mutationType._fields))
      }

      testCoverage({
        testFolder: path.resolve(__dirname, '../test'),
        routes: [
          { method: 'query', endpoints: queries },
          { method: 'mutation', endpoints: mutations }
        ],
        tagNames: ['method', 'path', 'module', 'desc']
      })

      app.get('/test-coverage', (req, res) => {
        res.sendFile(html)
      })

      app.get('/routes.json', (req, res) => {
        res.sendFile(routes)
      })
    }
  }

  initModels () {
    try {
      this.mongooseModels = modelsFromModules(modulePattern)
      Object.values(this.mongooseModels).forEach(model => {
        db[`${model.modelName}Model`] = model
      })
    } catch (e) {
      console.log('error in initModels:', e)
    }
  }

  initGraphqlTypes () {
    try {
      this.baseApi = new ApiComposer()

      this.baseApi.typesFromMongooseModels(Object.values(this.mongooseModels))
    } catch (e) {
      console.log('error in initGraphqlTypes:', e)
    }
  }

  initGraphql (app, server) {
    try {
      const apis = this.apisFromModules()
      const api = mergeApis(apis, this.baseApi)
      api.responseDecorator(responseDecorator)

      this.api = api

      const graphqlHTTP = require('express-graphql')
      const authentication = require('app/middleware/authentication')

      const schema = api.getGraphqlSchema()

      this.initTestCoverage({ app, schema })

      app.use(
        '/graphql',
        authentication,
        bodyParser.json(),
        graphqlUploadExpress(app.get('configuration').upload),
        graphqlHTTP(async (request, response, graphQLParams) => ({
          schema,
          graphiql: true,
          endpointURL: '/graphql',
          subscriptionsEndpoint: 'ws://localhost:3000/subscriptions',
          context: {
            user: request.user,
            pubsub
          },
          customFormatErrorFn: (error) => {
            if (process.env.NODE_ENV === 'production') {
              return ({
                message: error.message
              })
            }
            return error
          }
        }))
      )
      this.initGraphqlSubscription(schema, app, server)
    } catch (e) {
      console.log('error in initGraphql:', e)
    }
  }

  initApiSwagger (app) {
    try {
      this.api.generateSwagger({
        filePath: path.resolve('./public/swagger.json'),
        data: swaggerData
      })
      setTimeout(() => {
        const swaggerUi = require('swagger-ui-express')
        const swaggerDocument = require(path.join(
          __dirname,
          '../public/swagger.json'
        ))

        var options = {
          explorer: true
        }

        app.use(
          '/api-docs',
          swaggerUi.serve,
          swaggerUi.setup(swaggerDocument, options)
        )
      }, 3000)
    } catch (err) {
      console.log('Error in initApiSwagger ', err)
    }
  }

  initRouter (app) {
    try {
      const router = this.api.getExpressRoutes()

      this.api.setExpressContext(req => ({
        user: req.user,
        company: req.company,
        headers: req.headers
      }))
      app.use(router)
      this.initApiSwagger(app)
    } catch (e) {
      console.log('error in initRouter:', e)
    }
  }

  initGraphqlSubscription (schema, app, server) {
    // eslint-disable-next-line
    const subServer = new SubscriptionServer(
      {
        schema,
        execute,
        subscribe,
        onConnect: (e) => {
          console.log(e)
        },
        onOperation: (message, params, webSocket) => ({
          ...params,
          context: { pubsub }
        })
      },
      {
        server,
        path: '/subscriptions'
      }
    )

    console.log('Init Graphql Subscription')
  }

  apiForModule (_graphqlTypes, modulePath, moduleApiFile) {
    try {
      let result = []
      // const moduleName = getModuleName(modulePath)
      const md = require(moduleApiFile)
      const moduleName = md.moduleName

      if (md.apis) {
        result = md.apis.map(api => {
          if (_graphqlTypes.includes(moduleName)) {
            api.setDefaultType(moduleName)
          }
          api.setResolversPath(resolverPattern)
          api.setPoliciesPath(policyPattern)
          return api
        })
      }

      return result
    } catch (err) {
      console.log(err)
    }
  }

  collectApiPaths (pathPattern) {
    try {
      const glob = require('glob')
      return glob.sync(pathPattern)
    } catch (e) {
      console.log('error', e)
    }
  }

  apisFromModules () {
    try {
      const apiPaths = this.collectApiPaths(path.resolve('./src/modules/**/*Api.js'))
      apiPaths.map(apiPath => {
        const a = require(apiPath)
        return a
      })
      const apis = getApis()
      return apis
    } catch (error) {
      console.log('error in apisFromModules:', error)
      return Promise.reject(error)
    }
  }
}

module.exports = new Vobi()
