const MailingsService = require('./mailings.service')
const mailingsService = new MailingsService();

class CartsService {
  constructor(dao, productsService, ticketService) {
    this.dao = dao;
    this.productsService = productsService;
    this.ticketService = ticketService;
  }

  async create() {
    const cart = { products: [] }
    return await this.dao.create(cart);
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(cid) {
    const cart = await this.dao.getById(cid);
    if (!cart) {
      throw { message: `There's no cart by id ${cid}`, status: 400 }
    };
    return cart;
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

    const existingProductIndex = cart.products.findIndex(product => product.product._id.toString() === pid);

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

    const newContent = cart.products.filter(product => product.product._id.toString() !== pid)
    await this.update(cid, { products: newContent });
    return this.getById(cid);
  }


  async updateProductQuantity(cid, pid, quantity) {
    const cart = await this.getById(cid);
    const product = await this.productsService.getById(pid);

    if (!quantity || isNaN(quantity) || quantity < 0) {
      throw { message: 'Quantity is not valid', status: 400 }
    }

    const productIndex = cart.products.findIndex(product => product.product._id.toString() === pid);

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

  async purchase(cid, email) {
    const cart = await this.getById(cid);

    const notPurchasedIds = []
    let totalAmount = 0;
    for (let i = 0; i < cart.products.length; i++) {
      const product = cart.products[i];
      const remainder = product.product.stock - product.quantity;
      if (remainder >= 0) {
        await this.productsService.update(product.product._id, { ...product.product, stock: remainder })
        await this.deleteProductFromCartById(cid, product.product._id.toString())
        totalAmount += product.quantity * product.product.price;
      } else {
        notPurchasedIds.push(product.product._id);
      }
    };

    if (totalAmount > 0) {
      const ticket = await this.ticketService.generate(email, totalAmount);
      await mailingsService.sendPurchaseEmail(email, ticket);
    }

    return notPurchasedIds;
  }
}
module.exports = CartsService;