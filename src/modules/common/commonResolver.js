const { Resolver } = require('@vobi/api-composer')

class CommonResolver extends Resolver {
  constructor () {
    super('common')
  }

  filterNotDeleted (rp) {
    try {
      if (!rp.args.filter) {
        rp.args.filter = {}
      }

      rp.args.filter.deletedAt = null
    } catch (e) {
      return Promise.reject(e)
    }
  }

  setCreator (rp) {
    try {
      if (!rp.args.record) {
        rp.args.record = {}
      }

      rp.args.creator = rp.context.user._id
    } catch (e) {
      return Promise.reject(e)
    }
  }

  attachUpdater (rp) {
    try {
      if (!rp.args.record) {
        rp.args.record = {}
      }

      rp.args.record.updater = rp.context.user._id
      rp.args.record.updated = new Date()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  attachFilterCreator (rp) {
    try {
      if (!rp.args.filter) {
        rp.args.filter = {}
      }

      rp.args.filter.creator = rp.context.user._id
    } catch (e) {
      return Promise.reject(e)
    }
  }

  attachFilterCreatorAndCompany (rp) {
    try {
      if (!rp.args.filter) {
        rp.args.filter = {}
      }

      rp.args.filter.creator = rp.context.user._id
      rp.args.filter.company = rp.context.company._id
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

module.exports = CommonResolver
