const { prodLogger, devLogger } = require('../utils/loggers.utils');

const getLogger = (req, res, next) => {
  switch (process.env.NODE_ENV) {
    case 'production':
      req.logger = prodLogger;
      break;
    case 'development':
      req.logger = devLogger;
      break;
  }

  next()

}

module.exports = getLogger;