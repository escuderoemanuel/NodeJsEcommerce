const UserModel = require('../models/user.model');

class UsersDao {

  constructor() {
  }

  async create(user) {
    let result = await UserModel.create(user);
    return result;
  }

  async getAll() {
    let users = await UserModel.find().lean();
    return users;
  }

  async getById(id) {
    let result = await UserModel.findOne({ _id: id }).lean();
    return result;
  }

  async getByProperty(property, value) {
    let options = {}
    options[property] = value;
    let result = await UserModel.findOne(options).lean();
    return result;
  }

  async getByEmail(email) {
    let result = await UserModel.findOne({ email }).lean();
    return result;
  }


  async update(id, user) {
    let result = await UserModel.updateOne({ _id: id }, user);
    return result;
  }

  async delete(id) {
    let result = await UserModel.deleteOne({ _id: id });
    return result;
  }
}

module.exports = UsersDao;