class ProductsService {

  constructor(dao) {
    this.dao = dao;
  }

  async create(product) {
    return await this.dao.create(product);
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(pid) {
    return await this.dao.getById(pid);
  }

  async update(pid, product) {
    return await this.dao.update(pid, product);
  }

  async delete(pid) {
    return await this.dao.delete(pid);
  }

}

module.exports = ProductsService;