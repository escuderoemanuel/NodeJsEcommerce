const TypesOfErrors = require('../utils/errors/TypesOfErrors')

const errorHandler = (error, req, res, next) => {

  switch (error.code) {

    case TypesOfErrors.INVALID_TYPE_ERROR:
      req.logger.warning({ cause: error.cause, message: error.message })
      res.status(400).send({
        status: 'error',
        error: error.message
      })
      break;

    case TypesOfErrors.INVALID_PARAM_ERROR:
      req.logger.warning({ cause: error.cause, message: error.message })
      res.status(400).send({
        status: 'error',
        error: error.message
      })
      break;

    default:
      req.logger.fatal('Fatal error unhandled')
      res.status(500).send({
        status: 'error',
        error: 'Custom Fatal Error. Unknown error'
      })
      break;
  }
}

module.exports = errorHandler