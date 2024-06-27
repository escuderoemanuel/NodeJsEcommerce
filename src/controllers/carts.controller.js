const { cartsService, productsService, usersService } = require('../repositories');
const { getAddProductToCartErrorInfo } = require('../utils/errors/ErrorInfo');
const TypesOfErrors = require('../utils/errors/TypesOfErrors');
const CustomErrors = require('../utils/errors/CustomErrors');

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
      const user = await usersService.getById(req.user.id);
      const cid = req.params.cid;
      const cart = await cartsService.getById(cid);
      if (!cart) {
        res.status(400).send('Cart does not exist')
      } else {
        // Verify headers 'Accept'. If the query is from the FRONT, make a res.render but if not, make a res.json
        const acceptHeader = req.headers['accept'] || '';
        if (acceptHeader.includes('text/html')) {
          res.render('userCart', { ...cart, user });
        } else {
          res.send({ status: 'success', payload: cart });
        }
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
  static async addProductToCart(req, res, next) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;

      if (!cid || !pid) {
        throw new CustomErrors({
          name: 'Product added error',
          cause: getAddProductToCartErrorInfo(cid, pid),
          message: 'Error adding product to the cart',
          code: TypesOfErrors.INVALID_PRODUCT_DATA
        })
      }

      const product = await productsService.getById(pid);

      if (product.stock < 1) {
        throw new CustomErrors({
          name: 'Product added error',
          cause: 'Product adding error',
          message: 'Product out of stock',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        })
      }

      if (req.user.role === 'premium' && product.owner === req.user.email) {
        throw new CustomErrors({
          name: 'Product added error',
          cause: 'Product adding error',
          message: 'You cannot add your own products',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        })
      }

      const cart = await cartsService.addProduct(cid, pid);
      res.send({ status: 'success', cart });
    } catch (error) {
      next(error)
    }
  }

  static async deleteProductById(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const result = await cartsService.deleteProductFromCartById(cid, pid);
      res.send({ status: 'success', message: 'Product successfully removed', result });
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


  static async getProducts(req, res) {
    try {
      const { docs, ...rest } = await productsService.getAll(req.query);
      const cart = await cartsService.getById(req.user.cart)
      res.render('userCart', { products: docs, user: req.user, cart, ...rest })
    } catch (error) {
      res.status(error.status || 500).send({ status: 'error', error: error.message })
    }
  }


  static async purchase(req, res) {
    const { cid } = req.params;
    const cart = await cartsService.getById(cid);
    if (cart.products.length === 0) {
      return res.status(400).send({ status: 'error', error: 'Cart is empty' })
    }
    try {
      const remainderItems = await cartsService.purchase(cid, req.user.email)

      res.send({ status: 'success', payload: remainderItems })
    } catch (error) {
      return res.status(error.status || 500).send({ status: 'error', error: error.message })
    }
  }
}

module.exports = CartsController;