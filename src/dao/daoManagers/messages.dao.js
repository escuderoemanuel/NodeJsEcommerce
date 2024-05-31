const MessagesModel = require('../models/messages.model');

class MessagesDao {
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

  async deleteAll() {
    try {
      return MessagesModel.deleteMany({});
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id) {
    try {
      return MessagesModel.deleteOne({ _id: id });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getById(id) {
    try {
      return MessagesModel.findOne({ _id: id }).lean();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id, message) {
    try {
      return MessagesModel.updateOne({ _id: id }, message);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAll() {
    try {
      return MessagesModel.find().lean();
    } catch (error) {
      throw new Error(error.message);
    };
  }

  async create(message) {
    try {
      return MessagesModel.create(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }

}

module.exports = MessagesDao;