const ProductsModel = require('./models/products.model');

class ProductsDao {


  async getAll(filter, options) {
    if (filter && options) {
      return await ProductsModel.paginate(filter, options);
    }
    return await ProductsModel.find().lean();;
  }

  /* async getAll() {
    return await ProductsModel.find().lean();
  } */

  async getById(pid) {
    return await ProductsModel.findOne({ _id: pid }).lean();
  }

  async create(product) {
    return await ProductsModel.create(product);
  }

  async update(pid, product) {
    return await ProductsModel.updateOne({ _id: pid }, product);
  }

  async delete(pid) {
    return await ProductsModel.deleteOne({ _id: pid });
  }

}

module.exports = ProductsDao;