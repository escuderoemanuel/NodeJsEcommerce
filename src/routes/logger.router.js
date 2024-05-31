const { Router } = require('express');
const { verifyToken } = require('../middlewares/verifyToken.middleware');
const LoggerController = require('../controllers/logger.controller');

const router = Router();

router.get('/', verifyToken, LoggerController.getAll)

module.exports = { loggerTestRouter: router };