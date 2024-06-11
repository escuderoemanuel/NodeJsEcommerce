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

  async getById(uid) {
    const user = await this.dao.getById(uid)
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


  async update(uid, user) {
    const updatedUser = await this.dao.update(uid, user)
    return updatedUser
  }

  async delete(uid) {
    const deletedUser = await this.dao.delete(uid)
    return deletedUser
  }

  async setLastConnection(uid) {
    const user = await this.dao.getById(uid)
    return await this.dao.update(uid, { lastConnection: new Date().toLocaleString() })
  }

  async addDocuments(uid, files) {
    const user = await this.getById(uid);
    let documents = user.documents || [];

    documents = [...documents, ...(files.map(file => {
      return { name: file.originalname, reference: file.path.split('public')[1].replace(/\\/g, '/') }
    }))]

    return await this.update(uid, { documents: documents })
  }

  async changeRole(uid) {
    const user = await this.getById(uid);
    return await this.update(uid, { role: user.role })
  }

}

module.exports = UsersService;