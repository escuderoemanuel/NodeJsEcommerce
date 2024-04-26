const ProductsModel = require('../models/products.model');

class ProductsDao {

  async create(product) {
    return await ProductsModel.create(product);
  }

  async getAll(options, paginateData) {
    if (options && paginateData) {
      return await ProductsModel.paginate(options, paginateData);
    }
    return await ProductsModel.find().lean();
  }

  async getById(id) {
    return await ProductsModel.findOne({ _id: id }).lean();
  }

  async update(pid, product) {
    return await ProductsModel.updateOne({ _id: pid }, product);
  }

  async delete(pid) {
    return await ProductsModel.deleteOne({ _id: pid });
  }

}

module.exports = ProductsDao;