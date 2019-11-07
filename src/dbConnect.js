const config = require('./config')
const mongoose = require('./db')(config.database.connection, 'Main')
const db = { mongoose }
global.db = db

module.exports = {
  db,
  mongoose
}
