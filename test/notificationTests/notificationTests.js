const state = require('../common/state')
const generateGraphql = require('../mixins/generateGraphql')

const { user, agentUser, talentUser, admin } = require('../static/data')

describe('Notification', () => {
  after(async () => {
    await db.ChatModel.deleteOne({ _id: state.get('chatId') })
    await db.BookingModel.deleteOne({ _id: state.get('bookingId') })
    await db.NotificationModel.deleteMany({ actionId: state.get('bookingId') })
  })

  describe('Create notification', () => {
    /**
     * @method mutation
     * @path notificationCreate
     * @module Notification
     * @desc should create notification
     */
    it('should create notification', done => {
      generateGraphql({
        done,
        gql: 'notificationCreate',
        method: 'mutation',
        params: {
          record: {
            actionId: state.get('bookingId'),
            message: 'something',
            owner: state.get('talentId'),
            actionUser: state.get('regularToken')
          }
        }
      })
    })
  })

  describe('Test notifications', () => {
    before(async () => {
      const notification = await db.NotificationModel.findOne({
        actionId: state.get('bookingId')
      })
      state.set('notificationId', notification._id)
    })

    /**
     * @method mutation
     * @path notificationUpdateById
     * @module Notification
     * @desc should not update notification by Id with unAuthorized
     */

    it('should not update notification by Id with unAuthorized', done => {
      generateGraphql({
        done,
        gql: 'notificationUpdateById',
        method: 'mutation',
        params: {
          record: { _id: state.get('notificationId'), message: 'something new' }
        },
        auth: false,
        shouldError: true
      })
    })

    it('should update notification by Id', done => {
      generateGraphql({
        done,
        gql: 'notificationUpdateById',
        method: 'mutation',
        token: state.get('talentToken'),
        params: {
          record: { _id: state.get('notificationId'), message: 'something new' }
        },
        check: {
          'data.notificationUpdateById.record.message': {
            value: 'something new'
          }
        }
      })
    })

    /**
     * @method mutation
     * @path notificationUpdateOne
     * @module Notification
     * @desc should not update notification one with unAuthorized
     */

    it('should not update notification one with unAuthorized', done => {
      generateGraphql({
        done,
        gql: 'notificationUpdateOne',
        method: 'mutation',
        auth: false,
        params: {
          record: { message: 'update one' },
          filter: { actionId: state.get('bookingId') }
        },
        shouldError: true
      })
    })

    it('should update notification one', done => {
      generateGraphql({
        done,
        gql: 'notificationUpdateOne',
        method: 'mutation',
        params: {
          record: { message: 'update one' },
          filter: { actionId: state.get('bookingId') }
        },
        token: state.get('talentToken'),
        check: {
          'data.notificationUpdateOne.record.message': { value: 'update one' }
        }
      })
    })

    /**
     * @method mutation
     * @path notificationUpdateMany
     * @module Notification
     * @desc should update notification many
     */
    

    it('should update notification many', done => {
      generateGraphql({
        done,
        gql: 'notificationUpdateMany',
        method: 'mutation',
        params: {
          record: { message: 'update many' },
          filter: { actionId: state.get('bookingId') }
        },
        token: state.get('talentToken'),
        check: { 'data.notificationUpdateMany.numAffected': { type: 'Number' } }
      })
    })

    /**
     * @method query
     * @path myNotifications
     * @module Notification
     * @desc should not get my notifications
     */
    

    it('should not get my notifications', done => {
      generateGraphql({
        done,
        gql: 'myNotifications',
        method: 'query',
        auth: false,
        shouldError: true
      })
    })

    it('should get my notifications', done => {
      generateGraphql({
        done,
        gql: 'myNotifications',
        method: 'query',
        token: state.get('talentToken'),
        check: { 'data.myNotifications': { type: 'Array' } }
      })
    })

    /**
     * @method query
     * @path notificationById
     * @module Notification
     * @desc should not get notification by id
     */

    it('should not get notification by id', done => {
      generateGraphql({
        done,
        gql: 'notificationById',
        method: 'query',
        params: { _id: state.get('notificationId') },
        auth: false,
        shouldError: true
      })
    })

    it('should get notification by id', done => {
      generateGraphql({
        done,
        gql: 'notificationById',
        method: 'query',
        token: state.get('talentToken'),
        params: { _id: state.get('notificationId') },
        check: {
          'data.notificationById.actionId': { value: state.get('bookingId') }
        }
      })
    })

    /**
     * @method query
     * @path notificationByIds
     * @module Notification
     * @desc should not get notification by ids with unAuthorized
     */
    

    it('should not get notification by ids with unAuthorized', done => {
      generateGraphql({
        done,
        gql: 'notificationByIds',
        method: 'query',
        params: { _ids: [state.get('notificationId')] },
        auth: false,
        shouldError: true
      })
    })

    it('should get notification by ids', done => {
      generateGraphql({
        done,
        gql: 'notificationByIds',
        method: 'query',
        token: state.get('talentToken'),
        params: { _ids: [state.get('notificationId')] },
        check: { 'data.notificationByIds': { type: 'Array' } }
      })
    })

    /**
     * @method query
     * @path notificationOne
     * @module Notification
     * @desc should not get notification one
     */
    

    it('should not get notification one', done => {
      generateGraphql({
        done,
        gql: 'notificationOne',
        method: 'query',
        params: { filter: { actionId: state.get('bookingId') } },
        auth: false,
        shouldError: true
      })
    })

    it('should get notification one', done => {
      generateGraphql({
        done,
        gql: 'notificationOne',
        method: 'query',
        token: state.get('talentToken'),
        params: { filter: { actionId: state.get('bookingId') } },
        check: {
          'data.notificationOne.actionId': { value: state.get('bookingId') }
        }
      })
    })

    /**
     * @method query
     * @path notificationMany
     * @module Notification
     * @desc should not get notification one with unAuthorized
     */

    it('should not get notification one with unAuthorized', done => {
      generateGraphql({
        done,
        gql: 'notificationMany',
        method: 'query',
        params: { filter: { actionId: state.get('bookingId') } },
        auth: false,
        shouldError: true
      })
    })

    it('should get notification one', done => {
      generateGraphql({
        done,
        gql: 'notificationMany',
        method: 'query',
        token: state.get('talentToken'),
        params: { filter: { actionId: state.get('bookingId') } },
        check: { 'data.notificationMany': { type: 'Array' } }
      })
    })

    /**
     * @method query
     * @path notificationCount
     * @module Notification
     * @desc should get notification one
     */

    it('should get notification one', done => {
      generateGraphql({
        done,
        gql: 'notificationCount',
        method: 'query',
        token: state.get('talentToken'),
        params: { filter: { actionId: state.get('bookingId') } },
        check: { 'data.notificationCount': { type: 'Number' } }
      })
    })

    /**
     * @method query
     * @path notificationConnection
     * @module Notification
     * @desc shoould get notifaction Connection
     */

    it('shoould get notifaction Connection', done => {
      generateGraphql({
        done,
        gql: 'notificationConnection',
        method: 'query',
        params: { filter: { actionId: state.get('bookingId') } },
        token: state.get('talentToken')
      })
    })

    /**
     * @method query
     * @path notificationPagination
     * @module Notification
     * @desc shoould get notifaction pagination
     */
    

    it('shoould get notifaction pagination', done => {
      generateGraphql({
        done,
        gql: 'notificationPagination',
        method: 'query',
        params: { filter: { actionId: state.get('bookingId') } },
        token: state.get('talentToken')
      })
    })

    /**
     * @method mutation
     * @path notificationRemoveById
     * @module Notification
     * @desc should remove notification by Id
     */
    
    it('should remove notification by Id', done => {
      generateGraphql({
        done,
        gql: 'notificationRemoveById',
        method: 'mutation',
        token: state.get('talentToken'),
        params: { _id: state.get('notificationId') }
      })
    })

    /**
     * @method mutation
     * @path notificationRemoveMany
     * @module Notification
     * @desc should remove notification by Id
     */

    it('should remove notification by Id', done => {
      generateGraphql({
        done,
        gql: 'notificationRemoveMany',
        method: 'mutation',
        token: state.get('talentToken'),
        params: { filter: { actionId: state.get('bookingId') } }
      })
    })
  })
})
