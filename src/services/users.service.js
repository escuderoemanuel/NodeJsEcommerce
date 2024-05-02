class UsersService {
  constructor(dao) {
    this.dao = dao;

  }
  async create(user) {
    const newUser = await this.dao.create(user)
    return newUser
  }

  async getAll() {
    const users = await this.dao.getAll()
    return users
  }

  async getById(id) {
    const user = await this.dao.getById(id)
    return user
  }

  async getByEmail(email) {
    const user = await this.dao.getByEmail(email)
    return user
  }

  async getByProperty(property, value) {
    const item = await this.dao.getByProperty(property, value);
    if (!item) throw { message: `There's no Item by ${property} = ${value}`, status: 400 }
    return item;
  }


  async update(id, user) {
    const updatedUser = await this.dao.update(id, user)
    return updatedUser
  }

  async delete(id) {
    const deletedUser = await this.dao.delete(id)
    return deletedUser
  }
}

module.exports = UsersService;