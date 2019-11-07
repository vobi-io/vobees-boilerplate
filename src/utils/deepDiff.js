/* eslint no-useless-constructor:0 */
/* eslint handle-callback-err:0 */
'use strict'

// todo move to vobi-core
class DeepDiff {
  constructor () {
    this.VALUE_CREATED = 'created'
    this.VALUE_UPDATED = 'updated'
    this.VALUE_DELETED = 'deleted'
    this.VALUE_UNCHANGED = 'unchanged'
  }

  difference (oldData, newData, options) {
    if (!options) { options = {} }
    if (this.isFunction(oldData) || this.isFunction(newData)) {
      return {}
    }
    if (this.isValue(oldData) || this.isValue(newData)) {
      return this.getCompareValues(oldData, newData)
    }
    var diff = {}
    for (var key in oldData) {
      if (this.isFunction(oldData[key])) {
        continue
      }

      const value = this.difference(oldData[key], newData[key])

      diff[key] = value
    }
    for (var key2 in newData) {
      if (this.isFunction(newData[key2]) || (typeof (diff[key2]) !== 'undefined')) {
        continue
      }
      const value = this.difference(undefined, newData[key2])
      diff[key2] = value
    }

    if (options.unCheckKeys && options.unCheckKeys.length > 0) {
      options.unCheckKeys.map(key => {
        delete diff[key]
      })
    }

    if (options.checkKeys && options.checkKeys.length > 0) {
      var newDiff = {}
      options.checkKeys.map(key => {
        newDiff[key] = diff[key]
      })
      diff = newDiff
    }
    return diff
  }

  differenceBy (oldData, newData, options) {
    if (!options) { options = {} }
    let diff = this.difference(oldData, newData, options)

    if (options.unchanged === false) {
      diff = this.removeUnchangedFields(diff)
    }

    return diff
  }

  removeUnchangedFields (data) {
    for (var key in data) {
      if (data[key]._type === this.VALUE_UNCHANGED) {
        delete data[key]
      }

      if (data._type) {
        return data
      }

      if (data[key] && data[key]._type === undefined && typeof data[key] === 'object') {
        data[key] = this.removeUnchangedFields(data[key])
      }
      if (data[key] && Object.keys(data[key]).length === 0) {
        delete data[key]
      }
    }
    return data
  }

  getCompareValues (oldValue, newValue) {
    if (oldValue === newValue) {
      return { _type: this.VALUE_UNCHANGED, old: oldValue, new: newValue }
    }
    if (this.isDate(oldValue) && this.isDate(newValue) &&
    oldValue.getTime() === newValue.getTime()) {
      return { _type: this.VALUE_UNCHANGED, old: oldValue, new: newValue }
    }
    if (this.isObjectId(oldValue) && this.isObjectId(newValue) &&
      oldValue.toString() === newValue.toString()) {
      return { _type: this.VALUE_UNCHANGED, old: oldValue.toString(), new: newValue.toString() }
    }
    if (typeof (oldValue) === 'undefined') {
      return { _type: this.VALUE_CREATED, old: oldValue, new: newValue }
    }
    if (typeof (newValue) === 'undefined') {
      return { _type: this.VALUE_DELETED, old: oldValue, new: newValue }
    }

    return { _type: this.VALUE_UPDATED, old: oldValue, new: newValue }
  }

  isFunction (obj) {
    return {}.toString.apply(obj) === '[object Function]'
  }

  isArray (obj) {
    return {}.toString.apply(obj) === '[object Array]'
  }

  isDate (obj) {
    return {}.toString.apply(obj) === '[object Date]'
  }

  isObjectId (obj) {
    return this.isObject(obj) && obj._bsontype === 'ObjectID'
  }

  isObject (obj) {
    return {}.toString.apply(obj) === '[object Object]'
  }

  isValue (obj) {
    if (this.isObjectId(obj)) {
      return true
    }
    return !this.isObject(obj) && !this.isArray(obj)
  }

  getDeepKeys (obj) {
    var keys = []
    for (var key in obj) {
      keys.push(key)
      if (typeof obj[key] === 'object') {
        var subkeys = this.getDeepKeys(obj[key])
        keys = keys.concat(subkeys.map(function (subkey) {
          return key + '.' + subkey
        }))
      }
    }
    return keys
  }

  getObjectByString (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
    s = s.replace(/^\./, '') // strip a leading dot
    var a = s.split('.')
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i]
      if (k in o) {
        o = o[k]
      } else {
        return
      }
    }
    return o
  }
}

module.exports = new DeepDiff()
