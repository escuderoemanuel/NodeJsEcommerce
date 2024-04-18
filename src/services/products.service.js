const ProductsDao = require('../dao/managers/products.dao');

class ProductsService {

  constructor() {
    this.productsDao = new ProductsDao();
  }

  async create(product) {
    return await this.productsDao.create(product);
  }

  async getAll() {
    return await this.productsDao.getAll();
  }

  async getById(pid) {
    return await this.productsDao.getById(pid);
  }

  async update(pid, product) {
    return await this.productsDao.update(pid, product);
  }

  async delete(pid) {
    return await this.productsDao.delete(pid);
  }

}

module.exports = ProductsService;