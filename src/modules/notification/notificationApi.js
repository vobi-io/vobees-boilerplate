const api = makeApi('Notification')
const { schemaComposer } = require('graphql-compose')

require('app/modules/notification/notificationTypes')(api)

api.policy(['auth.isAuth', 'auth.isVerified'])
api.before(['common.filterNotDeleted',
  'common.setCreator'])

api.queryOf('Notification.findMany', 'notifications')

schemaComposer.Subscription.addFields({
  notifications: {
    type: 'Notification!',
    resolve: payload => payload.notification,
    subscribe: (source, args, { pubsub }) =>
      pubsub.asyncIterator('createNotification')
  }
})
