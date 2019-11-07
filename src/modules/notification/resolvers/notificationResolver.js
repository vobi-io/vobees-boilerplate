const NotificationModel = require('app/modules/notification/notificationModel')
const { Resolver } = require('@vobi/api-composer')

class NotificationResolver extends Resolver {
  constructor () {
    super('notification')
  }

  async createNotification ({ args, context: { user, pubsub } }) {
    try {
      const notification = await new NotificationModel({
        ...args,
        type: 'Create new Customer',
        notifiableId: args.notifiableId,
        notifiableType: 'Customer',
        recieverId: user._id
      }).save()

      pubsub.publish('createNotification', { notification })

      return notification
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = NotificationResolver
