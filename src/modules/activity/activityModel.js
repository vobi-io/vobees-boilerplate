const { mongoose } = require('app/dbConnect')
const { defaultConfig, defaultSchema } = require('app/modules/common/schemaMongoose')
const { Schema } = mongoose

const activitySchema = new Schema({
  args: {},
  message: {},
  changes: {},
  actionId: { type: String },
  actionUser: { type: Schema.Types.ObjectId, ref: 'User' },
  actionName: { type: String },
  productId: { type: String, ref: 'Product', index: 1 },
  customerId: { type: String, ref: 'Customer', index: 1 },
  ...defaultSchema
}, {
  ...defaultConfig,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

activitySchema.pre('save', function (next) {
  this.version = +new Date()
  next()
})

activitySchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  delete obj._id

  return obj
}

const Activity = mongoose.model('Activity', activitySchema)

module.exports = Activity
