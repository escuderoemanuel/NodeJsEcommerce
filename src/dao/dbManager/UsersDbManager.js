const UserModel = require('../models/user.model');

class UsersDbManager {
  constructor() {
    console.log('UserDbManager Intance')
  }

  async getAll() {
    let users = await UserModel.find().lean();
    return users;
  }

  async getById(id) {
    let result = await UserModel.findOne({ _id: id }).lean();
    return result;
  }

  async getByEmail(email) {
    let result = await UserModel.findOne(email).lean();
    return result;
  }

  async createUser(user) {
    let result = await UserModel.create(user);
    return result;
  }

  async deleteUser(id) {
    let result = await UserModel.deleteOne({ _id: id });
    return result;
  }

  async updateUser(id, user) {
    let result = await UserModel.updateOne({ _id: id }, user);
    return result;
  }
}

module.exports = UsersDbManager;