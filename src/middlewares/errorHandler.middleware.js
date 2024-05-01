const TypesOfErrors = require('../utils/errors/TypesOfErrors')

const errorHandler = (error, req, res, next) => {

  switch (error.code) {
    case TypesOfErrors.UNKNOWN:
      res.status(400).send({ status: 'error', error: error.name, message: error.message })
      break
    default:
      res.status(500).send({ status: 'error', error: 'Custom Error. Unknown error' })
  }
  next()
}

module.exports = errorHandler