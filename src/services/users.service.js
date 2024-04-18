const UsersDao = require('../dao/managers/users.dao')

class UsersService {
  constructor() {
    this.usersDao = new UsersDao()

  }
  async create(user) {
    const newUser = await this.usersDao.create(user)
    return newUser
  }

  async getAll() {
    const users = await this.usersDao.getAll()
    return users
  }

  async getById(id) {
    const user = await this.usersDao.getById(id)
    return user
  }

  async getByEmail(email) {
    const user = await this.usersDao.getByEmail(email)
    return user
  }


  async update(id, user) {
    const updatedUser = await this.usersDao.update(id, user)
    return updatedUser
  }

  async delete(id) {
    const deletedUser = await this.usersDao.delete(id)
    return deletedUser
  }
}

module.exports = UsersService;