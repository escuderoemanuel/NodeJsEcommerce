const winston = require('winston')

const customProperties = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warning: 'yellow',
    info: 'blue',
    http: 'cyan',
    debug: 'white'
  }
}

const prodLogger = winston.createLogger({
  levels: customProperties.levels,
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.json()
    }),
    new winston.transports.File({
      level: 'info', filename: './src/logs/errors.log',
      format: winston.format.json()
    })
  ]
})

const devLogger = winston.createLogger({
  levels: customProperties.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.json()
    }),
  ]
})

module.exports = {
  prodLogger,
  devLogger
}
