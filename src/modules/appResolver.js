const { Resolver } = require('@vobi/api-composer')

class AppResolver extends Resolver {
  getHello({ args, context }) {
    return 'Hello World!';
  }
}

module.exports = AppResolver
