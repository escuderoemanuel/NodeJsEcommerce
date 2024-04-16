const { Router } = require('express');
const { privateAuthentication } = require('../middlewares/middlewares');
const CartsController = require('../controllers/carts.controller');

const router = Router();

// Deberá crear un nuevo carrito con id y products[].
router.post('/', privateAuthentication, CartsController.create)

// Deberá listar todos los carritos (No lo pide el desafío).
router.get('/', privateAuthentication, CartsController.getAll)

// Deberá listar los productos que pertenezcan al carrito con el cid proporcionado, dando acceso a los datos del cart y de las propiedades de los productos que contenga.
router.get('/:cid', privateAuthentication, CartsController.getById)

// Deberá agregar el producto al arreglo “products” del carrito seleccionado
router.post('/:cid/product/:pid', privateAuthentication, CartsController.addProductToCart)

// Deberá eliminar del carrito el producto seleccionado
router.delete('/:cid/product/:pid', privateAuthentication, CartsController.deleteProductById)

// Deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put('/:cid/products/:pid', privateAuthentication, CartsController.updateProductQuantityById)

// DELETE: api/carts/:cid deberá eliminar todos los productos del carrito
router.delete('/:cid', privateAuthentication, CartsController.emptyCartById)

module.exports = router;