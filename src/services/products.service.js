const ProductsDao = require('../dao/products.dao');

class ProductsService {

  constructor() {
    this.productsDao = new ProductsDao();
  }

  async getAll() {
    return await this.productsDao.getAll();
  }

  async getById(pid) {
    return await this.productsDao.getById(pid);
  }

  async create(product) {
    return await this.productsDao.create(product);
  }

  async update(pid, product) {
    return await this.productsDao.update(pid, product);
  }

  async delete(pid) {
    return await this.productsDao.delete(pid);
  }

}

module.exports = ProductsService;