const { Router } = require('express');
const CartManager = require('../CartManager');

// Manager
const manager = new CartManager(`${__dirname}/../files/carts.json`);

const router = Router();

// Deberá crear un nuevo carrito con id y products[].
router.post('/', async (req, res) => {
  try {
    const cart = await manager.addCart();

    res.send({ status: 'success', payload: cart });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})


// Deberá listar todos los carritos (No lo pide el desafío).
router.get('/', async (req, res) => {
  try {
    const carts = await manager.getCarts();
    res.send({ status: 'success', carts: carts });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
})


// Deberá listar los productos que pertenezcan al carrito con el cid proporcionado
router.get('/:cid', async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    const cart = await manager.getCartById(id);

    // Reemplazar el nombre de la propiedad id de product por el nombre product
    const products = cart.products.map(product => {
      return { product: product.id, quantity: product.quantity };
    })


    //const products = cart.products;
    res.send({ id, products: products });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

// Deberá agregar el producto al arreglo “products” del carrito seleccionado
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const cart = await manager.addProductToCart(cid, pid);
    res.send({ status: 'success' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})


module.exports = router;