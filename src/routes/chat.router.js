const { Router } = require('express');
const ChatViewController = require('../controllers/chat.controller');
const { verifyToken } = require('../middlewares/verifyToken.middleware');
const getRole = require('../middlewares/getRole.middleware');

// Manager
const router = Router();

router.post('/', verifyToken, getRole('user'), ChatViewController.postMessage)
router.get('/', verifyToken, getRole('user'), ChatViewController.getMessages)

module.exports = router;