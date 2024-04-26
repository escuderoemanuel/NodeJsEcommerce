const MessagesDao = require('../dao/daoManagers/messages.dao');
const MessagesModel = require('../dao/models/messages.model');

class ChatViewController {
  static async postMessage(req, res) {
    try {
      await MessagesModel.create(req.body);
      const user = req.user;
      const messages = await MessagesDao.getAll();

      res.status(201).send({ user, messages: messages });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const messages = await MessagesModel.find().lean();
      const user = req.user;
      res.render('chat', {
        messages,
        user,
        layout: 'main'
      })
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

module.exports = ChatViewController;
