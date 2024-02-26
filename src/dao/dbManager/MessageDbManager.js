const MessagesModel = require('../models/messages.model');

class MessagesDbManager {
  constructor() {
    this.messages = [];
  }

  async init() {
    try {
      await MessagesModel.createCollection();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteMessages() {
    try {
      return MessagesModel.deleteMany({});
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteMessage(id) {
    try {
      return MessagesModel.deleteOne({ _id: id });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getMessage(id) {
    try {
      return MessagesModel.findOne({ _id: id }).lean();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateMessage(id, message) {
    try {
      return MessagesModel.updateOne({ _id: id }, message);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getMessages() {
    try {
      return MessagesModel.find().lean();
    } catch (error) {
      throw new Error(error.message);
    };
  }

  async addMessage(message) {
    try {
      return MessagesModel.create(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }

}

module.exports = MessagesDbManager;