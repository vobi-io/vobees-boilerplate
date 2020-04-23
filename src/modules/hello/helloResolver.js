const { Resolver } = require('@vobi/api-composer')

class HelloResolver extends Resolver {
  getHello ({ args, context }) {
    return { message: 'Hello World!' }
  }
}

module.exports = HelloResolver
