const moment = require('moment')
const config = require('app/config')
const urljoin = require('url-join')

module.exports = {
  formatDate (date, format) {
    return moment(date).format(format)
  },
  capitalize (str) {
    return str[0].toUpperCase() + str.substring(1)
  },
  frontUrl (...args) {
    return urljoin(config.front_url, ...args.filter(a => typeof a === 'string'))
  },
  backUrl (...args) {
    return urljoin(config.back_url, ...args.filter(a => typeof a === 'string'))
  },
  join (str1, str2) {
    return str1 + str2
  },
  toString (stringable) {
    return toString(stringable)
  }
}
