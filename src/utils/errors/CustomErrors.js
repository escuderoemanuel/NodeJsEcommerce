const TypesOfErrors = require('./TypesOfErrors');

class CustomErrors extends Error {
  constructor({ name = 'error', cause, message, code = TypesOfErrors.UNKNOWN, }) {
    super(message)
    this.name = name;
    this.cause = cause;
    this.code = code;
  }
}

module.exports = CustomErrors