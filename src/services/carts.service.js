const CartDao = require('../dao/carts.dao');
const ProductsService = require('./products.service');


class CartService {
  constructor() {
    this.dao = new CartDao();
    this.productsService = new ProductsService();
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(cid) {
    const cart = await this.dao.getById(cid);
    if (!cart) {
      throw new Error(`There's no card by id ${cid}`)
    };
    return cart;
  }

  async create() {
    const cart = { products: [] }
    return await this.dao.create(cart);
  }

  async update(cid, cart) {
    await this.getById(cid);
    return await this.dao.update(cid, cart);
  }

  async delete(cid) {
    await this.getById(cid);
    return await this.dao.delete(cid);
  }

  async addProduct(cid, pid) {
    const cart = await this.getById(cid);
    const product = await this.productsService.getById(pid);

    if (!cart) {
      throw new Error('Cart does not exist');
    }

    if (!product) {
      throw new Error('Product does not exist');
    }

    const existingProductIndex = cart.products.findIndex(item => item.product._id.toString() === pid);

    if (existingProductIndex >= 0) {
      cart.products[existingProductIndex].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this.update({ _id: cid }, cart);
    return { message: 'Product added to cart successfully' };
  }

  async deleteProductFromCartById(cid, pid) {
    const cart = await this.getById(cid);
    const productToDelete = await this.productsService.getById(pid);

    const newContent = cart.products.filter(item => item.product._id.toString() !== pid)
    await this.update(cid, { products: newContent });
    return this.getById(cid);
  }


  async updateProductQuantity(cid, pid, quantity) {
    const cart = await this.getById(cid);
    //console.log('cart en cartService', cart)
    const product = await this.productsService.getById(pid);
    //console.log('product en cartService', product)

    if (!quantity || isNaN(quantity) || quantity < 0) {
      throw { message: 'Quantity is not valid', status: 400 }
    }

    const productIndex = cart.products.findIndex(item => item.product._id.toString() === pid);

    if (productIndex < 0) {
      throw { message: 'Product not found', status: 404 }
    }
    cart.products[productIndex].quantity = parseInt(quantity);

    await this.update(cid, cart);
    return this.getById(cid);
  }

  async deleteAllProducts(cid) {
    await this.getById(cid);
    await this.update(cid, { products: [] });
    return this.getById(cid);
  }
}
module.exports = CartService;