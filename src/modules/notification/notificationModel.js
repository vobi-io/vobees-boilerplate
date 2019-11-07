const { mongoose } = require('app/dbConnect')

const { notifiableModels } = require('app/modules/notification/notificationUtils')
const { defaultSchema, defaultConfig } = require('app/modules/common/schemaMongoose')

const { Schema } = mongoose

const customerSchema = new Schema(
  {
    type: { type: String, description: 'თუ რა სახის ნოტიფიკციაა' },
    notifiableId: {
      type: String,
      description:
        'ჩანაწერის იდენტიფიკატორი, რომელიც იქნება ამოღებული [Invoice, Customer, Product]'
    },
    notifiableType: {
      type: String,
      enum: Object.values(notifiableModels),
      description:
        'თუ რომელ მოდელს ეკუთვნის ნოტიფიკციაა [Invoice, Customer, Product]',
      maxlength: 200
    },
    recieverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      description: 'რეფერენსი მიმღებ მომხმარებელთან'
    },
    seen: {
      type: Boolean,
      default: false,
      description: 'არის თუ არა ნანახი'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      description: 'რეფერენსი მომხმარებელთან'
    },
    ...defaultSchema
  },
  { ...defaultConfig }
)

const notification = mongoose.model('Notification', customerSchema)

module.exports = notification
