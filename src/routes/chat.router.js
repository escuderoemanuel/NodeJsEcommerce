const { Router } = require('express');
const MessagesModel = require('../dao/models/messages.model');

// Manager
const router = Router();

router.post('/', async (req, res) => {
  try {
    await MessagesModel.create(req.body);
    const message = await manager.addMessage();
    const messages = await manager.getMessages();

    res.status(201).send({ messages: messages });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

router.get('/', async (req, res) => {
  try {
    const messages = await MessagesModel.find().lean();
    res.send({ status: 'success', messages: messages })
      .render('chat', {
        messages,
        layout: 'main'
      })

  } catch (error) {
    res.status(500).send({ error: error.message });
  }
})

module.exports = router;