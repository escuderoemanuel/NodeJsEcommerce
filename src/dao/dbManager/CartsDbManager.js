const CartsModel = require('../models/carts.model');

class CartManager {

  //! ADD
  async addCart() {
    try {
      const cart = { items: [] }
      await CartsModel.create(cart);
    } catch (error) {
      throw new Error(error.message)
    }
  }

  //! GET ALL
  async getCarts() {
    try {
      const carts = await CartsModel.find();
      return carts;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  //! GET BY ID
  async getCartById(id) {
    try {
      const cart = await CartsModel.findOne({ _id: id })
      return cart;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  //! ADD ITEM
  async addProductToCart(cid, pid) {
    try {
      // Busca el cart que necesito
      const cart = await this.getCartById(cid);

      // Busca el producto dentro del cart y lo incrementa en 1 si ya existe, sino lo agrega al cart
      const productIndex = cart.items.findIndex(i => i.product === pid);
      if (productIndex >= 0) {
        cart.items[productIndex].quantity++;

      } else {
        cart.items.push({ product: pid, quantity: 1 });
      }

      await CartsModel.updateOne({ _id: cid }, cart);

    } catch (error) {
      throw new Error(error.message)
    }
  }

}

// Exportación para utilizar en el app.js
module.exports = CartManager;