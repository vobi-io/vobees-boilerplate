/*eslint-disable*/
module.exports = {
  port: 8000,
  HTTP_HOST: 'http://localhost:8000',
  database: {
    connection: process.env.MONGODB_URI
  },
  front_url: 'http://localhost:3000',
  back_url: 'http://localhost:8000',
  wsUrl: 'ws://localhost:8000'
}
