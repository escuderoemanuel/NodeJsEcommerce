const { Router } = require('express');
const CartsDbManager = require('../dao/dbManager/CartsDbManager');
const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');

// Managers
const cartManager = new CartsDbManager();
const productManager = new ProductsDbManager();

const router = Router();

// Deberá crear un nuevo carrito con id y products[].
router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.addCart();

    res.send({ status: 'success', payload: cart });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})


// Deberá listar todos los carritos (No lo pide el desafío).
router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.send({ status: 'success', carts: carts });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
})

// Deberá listar los productos que pertenezcan al carrito con el cid proporcionado
router.get('/:cid', async (req, res) => {
  try {
    const id = req.params.cid;
    const cart = await cartManager.getCartById(id);

    //const products = cart.products;
    res.send({ status: 'success', items: cart.items });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

// Deberá agregar el producto al arreglo “products” del carrito seleccionado
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const cart = await cartManager.getCartById(cid);
    const product = await productManager.getProductById(pid);
    if (!cart) {
      res.status(400).send('Cart does not exist')
    }
    if (!product) {
      res.status(400).send('Product does not exist')

    } else {
      cartManager.addProductToCart(cid, pid);
      res.send({ status: 'success' });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

module.exports = router;