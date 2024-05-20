const TypesOfErrors = require('./TypesOfErrors');

class CustomErrors extends Error {
  constructor({ name = 'error', cause, message, code = TypesOfErrors.UNKNOWN_ERROR, }) {
    super(message)
    this.name = name;
    this.code = code;
    this.cause = cause;
  }
}

module.exports = CustomErrors