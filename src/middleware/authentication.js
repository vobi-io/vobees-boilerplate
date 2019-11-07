const jwt = require('jsonwebtoken')
const UserModel = require('app/modules/user/userModel')
const config = require('app/config')

const authentication = async (req, res, next) => {
  try {
    const {
      headers: { authorization }
    } = req
    if (!authorization) return next()
    const accessToken = authorization.split(' ')[1]
    if (accessToken === 'null') return next()
    const decoded = jwt.verify(accessToken, config.jwt.secret)
    if (!decoded) return next()
    const user = await UserModel.findById(decoded.userId)
    if (!user) return next()
    req.accessToken = accessToken
    req.user = user
    return next()
  } catch (error) {
    return next()
  }
}

module.exports = authentication
