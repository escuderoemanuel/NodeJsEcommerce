class LoggerController {
  static async getAll(req, res) {

    req.logger.fatal('Level 0. This is a fatal log');
    req.logger.error('Level 1. Unhandled error');
    req.logger.warning('Level 2. This is a warning log');
    req.logger.info('Level 3. This is a info log');
    req.logger.http('Level 4. This is a http log');
    req.logger.debug('Level 5. This is a debug log');

    res.send({ status: 'success', message: 'Logger Test', environment: process.env.NODE_ENV })
  }
}

module.exports = LoggerController;