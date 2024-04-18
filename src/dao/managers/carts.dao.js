const CartsModel = require('../models/carts.model');
//  const ProductsService = require('../services/products.service');

class CartDao {

  async create() {
    try {
      const cart = { products: [] }
      await CartsModel.create(cart);
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getAll() {
    try {
      const carts = await CartsModel.find().lean();
      return carts;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getById(cid) {
    try {
      const cart = await CartsModel.findOne({ _id: cid }).lean()
      return cart;
    } catch (error) {
      throw new Error(`Error searching for cart with id: ${cid}`)
    }
  }
  async update(cid, cart) {
    try {
      await CartsModel.updateOne({ _id: cid }, cart);
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async delete(cid) {
    try {
      const result = await CartsModel.deleteOne({ _id: cid });
      if (result.deletedCount === 0) {
        throw new Error(`Cart with id ${cid} not found`);
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

// Exportación para utilizar en el app.js
module.exports = CartDao;