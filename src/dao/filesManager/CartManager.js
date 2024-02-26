const fs = require('fs');

const encoding = 'utf8';

class CartManager {

  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  // Deberá agregar un nuevo carrito al archivo JSON
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

  //Este no lo pide el desafío 
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

  // Deberá listar los productos que pertenezcan al carrito con el parámetro *'cid'* proporcionados.
  async getCartById(id) {
    try {
      const data = await fs.promises.readFile(this.path, encoding);
      const parsedData = JSON.parse(data);

      // Busca el carrito con el id especificado
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

  // Deberá agregar el producto al arreglo “products” del carrito seleccionado '/:cid/product/:pid'
  async addProductToCart(cid, pid) {
    try {

      // Lee el archivo carts.json
      const cartsData = await fs.promises.readFile(this.path, encoding);
      const cartsParsedData = await JSON.parse(cartsData);

      // Busca el carrito con el id especificado
      const cart = cartsParsedData.find(cart => cart.id === cid);

      //
      if (cart) {

        // Lee el archivo products.json
        const productsData = await fs.promises.readFile(`${__dirname}/files/products.json`, encoding);
        const productsParsedData = JSON.parse(productsData);

        // Busca en si hay un producto con el id especificado
        const productInProducts = productsParsedData.find(product => product.id === pid);

        if (!productInProducts) {
          throw new Error(`Product with id '${pid}' does not exist in the product list!`)
        }

        // Busca si el producto ya existe en el carrito
        const productInCart = cart.products.find(product => product.id === pid);

        // Si ya exoste...
        if (productInCart) {
          productInCart.quantity++;

          // Si el producto aún no está en el carrito...
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

// Exportación para utilizar en el app.js
module.exports = CartManager;
