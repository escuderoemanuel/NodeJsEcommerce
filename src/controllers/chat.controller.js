const MessagesDao = require('../dao/daoManagers/messages.dao');
const MessagesModel = require('../dao/models/messages.model');
const { usersService } = require('../repositories');

class ChatViewController {

  static async postMessage(req, res) {
    try {
      await MessagesModel.create(req.body);
      const messages = await MessagesDao.getAll();
      const user = await usersService.getById(req.user.id);
      res.status(201).send({ user, messages: messages });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const messages = await MessagesModel.find().lean();
      const user = await usersService.getById(req.user.id);

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
