const ProductsModel = require('./models/products.model');

class ProductsDao {


  async getAll(filter, options) {
    try {
      if (filter && options) {
        return await ProductsModel.paginate(filter, options);
      }
      const products = await ProductsModel.find().lean();
      return products;
    } catch (error) {
      throw new Error('Dao Error fetching products from database');
    }
  }

  async getById(pid) {
    try {
      const product = await ProductsModel.findOne({ _id: pid }).lean();
      return product;
    } catch (error) {
      throw new Error('Dao Error fetching product by ID from database');
    }
  }

  async create(product) {
    try {
      const newProduct = await ProductsModel.create(product);
      return newProduct;
    } catch (error) {
      throw new Error('Dao Error creating product in database');
    }
  }


  async update(pid, newProduct) {
    try {
      return await ProductsModel.updateOne({ _id: pid }, newProduct);
    } catch (error) {
      throw new Error('Dao Error updating product in database');
    }
  }

  async delete(pid) {
    try {
      return await ProductsModel.deleteOne({ _id: pid });
    } catch (error) {
      throw new Error('Dao Error deleting product from database');
    }
  }

}

module.exports = ProductsDao;