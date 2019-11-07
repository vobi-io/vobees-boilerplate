'use strict'

const { mongoose } = require('app/dbConnect')

const defaultSchema = {
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    description: 'შემქნელი მომხმარებელი'
  },
  updater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    description: 'განახლების მომხმარებელი'
  },
  deletedAt: { type: Date, default: null, description: 'წაშლის თარიღი' }
}

const defaultConfig = {
  timestamps: { createdAt: 'createdAt', updateAt: 'updateAt' }
}
module.exports = {
  defaultSchema,
  defaultConfig
}
