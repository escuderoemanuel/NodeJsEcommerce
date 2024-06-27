const CartsModel = require('../models/carts.model');

class CartManager {

  //? ADD CART
  async addCart() {
    try {
      const cart = { products: [] }
      await CartsModel.create(cart);
    } catch (error) {
      throw new Error(error.message)
    }
  }

  //? GET ALL CARTS
  async getCarts() {
    try {
      const carts = await CartsModel.find().lean();
      return carts;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  //? GET CART BY ID
  async getCartById(id) {
    try {
      const cart = await CartsModel.findOne({ _id: id }).lean()
      return cart;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  //? ADD ITEM TO CART
  async addProductToCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);

      // Search for the product in the cart and increment it by 1 if it already exists, otherwise it adds it to the cart
      const productIndex = cart.products.findIndex(i => i.product === pid);
      if (productIndex >= 0) {
        cart.products[productIndex].quantity++;

      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await CartsModel.updateOne({ _id: cid }, cart);

    } catch (error) {
      throw new Error(error.message)
    }
  };

  //? DELETE PRODUCT FROM CART
  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);
      const productIndex = cart.products.findIndex(i => i.product === pid);
      if (productIndex >= 0) {
        cart.products.splice(productIndex, 1);
        await CartsModel.updateOne({ _id: cid }, cart);
      }
    } catch (error) {
      throw new Error(error.message)
    }
    return;
  }

  //? UPDATE PRODUCTS FROM CART
  async updateProductsFromCart(cid, products) {
    try {
      const cart = await this.getCartById(cid);
      cart.products = products;
      await CartsModel.updateOne({ _id: cid }, cart);
    } catch (error) {
      throw new Error(error.message)
    }
    return;
  }

  //? UPDATE PRODUCT QUANTITY FROM CART
  async updateProductQuantityFromCart(cid, pid, quantity) {
    try {
      const cart = await this.getCartById(cid);
      const productIndex = cart.products.findIndex(i => i.product === pid);

      if (productIndex >= 0) {
        // If the product is already in the cart, update the quantity
        cart.products[productIndex].quantity = quantity;
      } else {
        // If the product is not in the cart, it adds it with the specified quantity
        cart.products.push({ product: pid, quantity: quantity });
      }
      await CartsModel.updateOne({ _id: cid }, cart);
    } catch (error) {
      throw new Error(error.message)
    }
    return;
  }

  //? DELETE: api/carts/:cid remove all products from the cart
  async deleteAllProductsFromCart(cid) {
    try {
      const cart = await this.getCartById(cid);
      cart.products = [];
      await CartsModel.updateOne({ _id: cid }, cart);
    } catch (error) {
      throw new Error(error.message)
    }
    return;
  }
}

module.exports = CartManager;