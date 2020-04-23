const authentication = async (req, res, next) => {
  try {
    // const {
    //   headers: { authorization, companyid: companyId }
    // } = req

    // req.user = user
    return next()
  } catch (error) {
    return next()
  }
}

module.exports = authentication
