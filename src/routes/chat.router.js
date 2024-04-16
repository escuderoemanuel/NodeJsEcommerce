const { Router } = require('express');
const { privateAuthentication } = require('../middlewares/middlewares');
const ChatViewController = require('../controllers/chat.controller');


// Manager
const router = Router();

router.post('/', privateAuthentication, ChatViewController.postMessage) //! Todo: Chequear que el privateAuthentication sea el correcto

router.get('/', privateAuthentication, ChatViewController.getMessages)

module.exports = router;