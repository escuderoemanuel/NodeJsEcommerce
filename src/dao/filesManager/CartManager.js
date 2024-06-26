const fs = require('fs');

const encoding = 'utf8';

class CartManager {

  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  // Add a new cart to the JSON file
  async addCart() {
    try {
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(this.path, '[]', encoding);
      }

      const products = []

      const data = await fs.promises.readFile(this.path, encoding);
      const parsedData = JSON.parse(data);

      const id = parsedData.length > 0 ? parsedData[parsedData.length - 1].id + 1 : 1;
      // Add new cart to the Carts
      const newCart = { id, products };


      parsedData.push(newCart);

      await fs.promises.writeFile(this.path, JSON.stringify(parsedData, null, 2), encoding);
      return newCart;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getCarts() {
    try {
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(this.path, '[]', encoding);
      }

      const data = await fs.promises.readFile(this.path, encoding);
      this.carts = await JSON.parse(data);
      return this.carts
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // List the products belonging to the cart with the 'cid' parameter provided.
  async getCartById(id) {
    try {
      const data = await fs.promises.readFile(this.path, encoding);
      const parsedData = JSON.parse(data);

      // Find the cart with the specified id.
      const cart = parsedData.find(cart => cart.id === id);
      if (cart) {
        return cart;
      } else {
        throw new Error(`Cart with id '${id}' not found!`)
      }

    } catch (error) {
      throw new Error(error.message)
    }
  }

  // Add the product to the “products” array of the selected cart '/:cid/product/:pid'
  async addProductToCart(cid, pid) {
    try {

      // Read carts.json file.
      const cartsData = await fs.promises.readFile(this.path, encoding);
      const cartsParsedData = await JSON.parse(cartsData);

      // Find the cart with the specified id.
      const cart = cartsParsedData.find(cart => cart.id === cid);

      if (cart) {
        // Read products.json file.
        const productsData = await fs.promises.readFile(`${__dirname}/files/products.json`, encoding);
        const productsParsedData = JSON.parse(productsData);

        // Find the cart with the specified id in products.json file!
        const productInProducts = productsParsedData.find(product => product.id === pid);

        if (!productInProducts) {
          throw new Error(`Product with id '${pid}' does not exist in the product list!`)
        }

        // Find in the cart, the product with the specified id.
        const productInCart = cart.products.find(product => product.id === pid);

        // If the product already exist in the cart...
        if (productInCart) {
          productInCart.quantity++;

          // If the product not exist in the cart ...
        } else {
          cart.products.push({ id: pid, quantity: 1 });
        }

        await fs.promises.writeFile(this.path, JSON.stringify(cartsParsedData, null, 2), encoding);
        return cart;
      } else {
        throw new Error(`Cart with id '${cid}' not found!`)
      }

    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = CartManager;
