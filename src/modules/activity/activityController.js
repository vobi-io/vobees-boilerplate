'use strict'
var MyError = require('../../util/responses/errors')
const ActivityRepo = require('./activityResolver')

class ActivityController {
  constructor () {
    this.activityRepository = new ActivityRepo()
  }

  syncTaskActivities (req, res) {
    const { taskId } = req.query

    this.activityRepository.getTaskActivities({ taskId })
      .then(res.ok)
      .catch(res.catchError)
  }

  syncActivities (req, res) {
    const { projectId, limit = 5, skip, locale, startDate, endDate } = req.query

    if (!projectId) {
      return res.catchError(MyError.badRequest('Missing values', MyError.level.WARNING))
    }

    this.activityRepository.getProjectActivitiesById({
      projectId,
      skip: parseInt(skip),
      limit: parseInt(limit),
      startDate,
      endDate,
      locale
    })
      .then(res.ok)
      .catch(res.catchError)
  }

  syncUserActivities (req, res) {
    const { limit = 5, skip, locale, startDate, endDate, userId } = req.query
    const { user } = req

    if (!userId) {
      return res.catchError(MyError.badRequest('Missing values', MyError.level.WARNING))
    }

    this.activityRepository.getUserActivities({
      userId,
      currUserId: user._id,
      limit: parseInt(limit),
      skip: parseInt(skip),
      locale,
      startDate,
      endDate
    })
      .then(res.ok)
      .catch(res.catchError)
  }

  syncActivitiesByTeam (req, res) {
    const { teamId, locale, skip, limit = 5, startDate, endDate } = req.query
    const { user } = req

    if (!teamId) {
      return res.catchError(MyError.badRequest('Missing values', MyError.level.WARNING))
    }

    this.activityRepository.getTeamActivities({
      teamId,
      userId: user._id,
      locale,
      skip: parseInt(skip),
      limit: parseInt(limit),
      startDate,
      endDate
    })
      .then(res.ok)
      .catch(res.catchError)
  }

  createActivity (req, res) {
    req.body.assignmentDate = Date.now()
    global.db.ActivityModel.httpPost(req, res)
  }

  editActivity (req, res) {
    global.db.ActivityModel.httpPut(req, res)
  }

  deleteActivity (req, res) {
    global.db.ActivityModel.httpDelete(req, res)
  }

  listActivity (req, res) {
    const { _id: userId } = req.user

    const options = {
      where: {
        owner: userId,
        status: { $ne: 'deleted' }
      }
    }

    global.db.ActivityModel.httpGet(req, res, options)
  }

  async getActivityMessages (req, res) {
    try {
      const { user } = req
      const { company: { language } } = user
      const actionIds = JSON.parse(req.query.actionIds)
      const { skip, limit } = req.query

      var results = []
      for (let i = 0; i < actionIds.length; i++) {
        const result = await this.activityRepository.getActivities(actionIds[i],
          language, skip, limit)

        Array.isArray(result) ? results.push(...result) : results.push(result)
      }
      return res.ok(results)
    } catch (error) {
      return res.badRequest(error)
    }
  }
}

module.exports = new ActivityController()
