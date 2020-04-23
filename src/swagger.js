const schema = {
  $ref: '#/definitions/Error'
}
module.exports = {
  info: {
    description: 'This is server.  You can find out more about Swagger at [https://vobi.io]', // eslint-disable-line
    version: '1.0.0',
    title: 'Swagger',
    termsOfService: 'https://invoice.ge/terms/',
    contact: {
      email: ''
    }
  },
  errors: {
    400: {
      description: 'The request cannot be fulfilled due to bad syntax',
      schema
    },
    401: {
      description: 'Missing or invalid authentication token',
      schema
    },
    403: {
      description: 'User not authorized to perform the operation',
      schema
    },
    404: {
      description: 'The requested resource could not be found but may be available again in the future', //eslint-disable-line
      schema
    },
    500: {
      description: 'Something bad happened on the server',
      schema
    }
  },
  definitions: {
    Error: {
      type: 'object',
      required: [
        'message'
      ],
      properties: {
        message: {
          type: 'string'
        }
      }
    }
  }
}
