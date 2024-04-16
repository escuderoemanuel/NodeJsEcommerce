const CartsService = require('../services/carts.service');
const ProductsService = require('../services/products.service');
const cartsService = new CartsService();
// const productsService = new ProductsService();

class CartsController {

  static async create(req, res) {
    try {
      const cart = await cartsService.create()
      res.send({ status: 'success', payload: cart });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const carts = await cartsService.getAll();
      res.send({ status: 'success', carts: carts });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const cid = req.params.cid;
      const cart = await cartsService.getById(cid);
      if (!cart) {
        res.status(400).send('Cart does not exist')
      } else {
        res.send(cart);
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async addProductToCart(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const cart = await cartsService.addProduct(cid, pid);
      res.send({ status: 'success', cart });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async deleteProductById(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      await cartsService.deleteProductFromCartById(cid, pid);
      res.send({ status: 'success', message: 'Product successfully removed' });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }


  static async updateProductQuantityById(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const quantity = req.body.quantity;
      await cartsService.updateProductQuantity(cid, pid, quantity);
      res.send({
        status: 'success',
        message: 'Product quantity successfully updated'
      })
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async emptyCartById(req, res) {
    try {
      const cid = req.params.cid;
      await cartsService.deleteAllProducts(cid);
      res.send({
        status: 'success',
        message: 'All products successfully removed'
      })
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}

module.exports = CartsController;