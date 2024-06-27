const { Router } = require('express');
const ChatViewController = require('../controllers/chat.controller');
const { verifyToken } = require('../middlewares/verifyToken.middleware');

const router = Router();

router.post('/', verifyToken, ChatViewController.postMessage)
router.get('/', verifyToken, ChatViewController.getMessages)

module.exports = router;