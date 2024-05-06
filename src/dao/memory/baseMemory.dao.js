class BaseMemoryDAO {
  static id = 0;
  constructor() {
    this.data = []
  }

  async getAll() {
    return this.data;
  }


  async getById(id) {
    return this.data.find(d => d._id == id)
  }

  async getByEmail(email) {
    return this.data.find(d => d.email == email)
  }

  async getByProperty(property, value) {
    const result = this.data.find(d => value == d[property]);
    return result;
  }

  async create(item) {
    item._id = ++BaseMemoryDAO.id;
    this.data.push(item);
    return item;
  }

  async update(id, item) {
    let index = this.data.findIndex(d => _id == id)
    if (index < 0) {
      throw new Error('id does not exists')
    }
    this.data[index] = { ...this.data[index], ...item };
    return this.data[index];
  }

  async delete(id) {
    let index = this.data.findIndex(d => _id == id)
    this.data.splice(index, 1);
    return this.data;
  }
}

module.exports = BaseMemoryDAO;