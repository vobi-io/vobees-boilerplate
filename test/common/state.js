const state = {

}

const get = (key) => {
  return state[key]
}

const set = (key, value) => {
  state[key] = value
}

module.exports.get = get
module.exports.set = set
