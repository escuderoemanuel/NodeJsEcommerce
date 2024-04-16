const { Router } = require('express');
const { privateAuthentication } = require('../middlewares/middlewares');
const ChatViewController = require('../controllers/chat.controller');


// Manager
const router = Router();

router.post('/', privateAuthentication, ChatViewController.postMessage)

router.get('/', privateAuthentication, ChatViewController.getMessages)

module.exports = router;