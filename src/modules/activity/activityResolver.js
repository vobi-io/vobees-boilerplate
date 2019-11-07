const moment = require('moment')
var Promise = require('bluebird')
var deepDiff = require('app/utils/deepDiff')
const { Resolver } = require('@vobi/api-composer')
const ActivityModel = require('app/modules/activity/activityModel')

const objectNames = {
  task: 'Customer',
  project: 'Invoice',
  user: 'User',
  file: 'Product',
  plan: 'Plan'
}

const messageKey = {
  shareContact: 'share_contact',
  exportUsers: 'export_users'
}

const removeUnregisterArgs = (args) => {
  const newArgs = Object.assign({}, args)
  delete newArgs.token
  delete newArgs.newPassword
  delete newArgs.oldPassword
  delete newArgs.passwor
  return newArgs
}

class ActivityResolver extends Resolver {
  constructor () {
    super('activity')
    this.objects = objectNames
    this.messages = messageKey
  }

  async register ({ args, context, info }) {
    const { user, oldItem = {}, newItem = {} } = context
    const { fieldName: actionName } = info
    let userId
    if (user) {
      userId = user._id
    }
    let actionId
    if (newItem._id) {
      actionId = newItem._id
    }
    if (!actionId && oldItem._id) {
      actionId = oldItem._id
    }

    try {
      // const { _id: currUserId } = userId
      const unCheckKeys = ['creator', 'updater', 'createdAt', 'updateAt']

      const activity = {
        actionUser: userId,
        actionName,
        actionId,
        args: removeUnregisterArgs(args)
      }

      if (userId) {
        activity.actionUser = userId
      }

      const activityChangesMeta = oldItem.meta || newItem.meta
      delete oldItem.meta
      delete newItem.meta

      const changes = deepDiff.differenceBy(oldItem || {}, newItem, {
        unchanged: false,
        unCheckKeys
      })

      activity.changes = {
        ...changes,
        meta: activityChangesMeta
      }

      const model = new ActivityModel(activity)
      const record = await model.save()
      return record
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async addActivityInDatabase (activity) {
    try {
      const model = new global.db.ActivityModel(activity)
      const record = await model.save()
      return Promise.resolve(record)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async getUserActivities ({ userId, currUserId, skip, limit, startDate, endDate, locale }) {
    if (!userId) return []

    const initialSearchQuery = { actionUser: userId }

    if (currUserId.toString() !== userId.toString()) {
      const projectsToSearchIn = await global.db.ProjectModel.find(
        {
          status: { $ne: 'deleted' },
          'members.member': { $all: [userId.toString(), currUserId.toString()] }
        },
        { _id: true }
      )

      initialSearchQuery.project = { $in: projectsToSearchIn.map(project => project._id) }
    }

    const activities = await this.getActivitiesTemplate({
      initialSearchQuery,
      locale,
      limit,
      skip,
      startDate,
      endDate
    })

    return activities
  }

  async getActivities (actionId, locale, skip, limit) {
    const items = await global.db.ActivityModel
      .find({ actionId })
      .skip(skip)
      .limit(limit)
      .populate(['actionUser'])

    if (items.length === 0) {
      const message = `can not find activity with id ${actionId}`
      return Promise.resolve(message)
    }

    const result = items.map(activity => {
      return this.getActivityMessage(activity, locale)
    })

    return Promise.resolve(result)
  }

  async getActivityMessage (activity, locale) {
    const { actionUser, changes } = activity

    const params = {
      actionUserName: actionUser.firstName,
      actionUserUrl: actionUser.url,
      actionId: activity.actionId,
      activityMessage: activity.message,
      changes,
      created: moment(activity.created).toISOString()
    }

    switch (activity.actionName) {
      case 'test': {
        const meta = changes.meta || {}
        const { taskUrl, taskName } = meta

        params.taskName = `<a class="ActivityItem-link u-colorInfo" href=${taskUrl}>${taskName}</a>`
        break
      }
    }
  }

  translate (phrase, locale, params) {
    const createdDate = moment(params.created).format('DD MMM, YYYY')

    switch (params.actionTypeBullet) {
      case 'edited':
        phrase = `
          <div class="ActivityBulletContainer">
            <span class="ActivityBullet u-bgColorEdited"></span>
          </div>

          <div style="flex: 1">
            <span class="u-bold u-colorEdited">${params.actionUserName}</span>
            <span class="u-Phrase">${phrase}</span>
          </div>

          <span style="padding-left: 20px">${createdDate}</span>
        `
        break

      case 'created':
        phrase = `
          <div class="ActivityBulletContainer">
            <span class="ActivityBullet u-bgColorCreated"></span>
          </div>

          <div style="flex: 1">
            <span class="u-bold u-colorCreated">${params.actionUserName}</span>
            <span class="u-Phrase">${phrase}</span>
          </div>

          <span style="padding-left: 20px">${createdDate}</span>
        `
        break

      case 'completed':
        phrase = `
          <div class="ActivityBulletContainer">
            <span class="ActivityBullet u-bgColorCompleted"></span>
          </div>

          <div style="flex: 1">
            <span class="u-bold u-colorCompleted">${params.actionUserName}</span>
            <span class="u-Phrase">${phrase}</span>
          </div>

          <span style="padding-left: 20px">${createdDate}</span>
          `
        break

      case 'deleted':
      default:
        phrase = `
          <div class="ActivityBulletContainer">
            <span class="ActivityBullet u-bgColorDeleted"></span>
          </div>

          <div style="flex: 1">
            <span class="u-bold u-colorDeleted">${params.actionUserName}</span>
            <span class="u-Phrase">${phrase}</span>
          </div>

          <span style="padding-left: 20px">${createdDate}</span>
        `
        break
    }

    return global.i18n.__({ phrase, locale }, params)
  }
}

module.exports = ActivityResolver
