const { Router } = require('express');
const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');

// Manager
const manager = new ProductsDbManager();

const router = Router();

// Deberá traer todos los productos de la base de datos, incluyendo la limitación ?limit
router.get('/', async (req, res) => {
  try {
    let products = await manager.getProducts();
    // Límite string parseado a number
    const limit = parseInt(req.query.limit);
    if (limit) {
      products = products.slice(0, limit);
    }
    res.send({ status: 'success', payload: products });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

// Deberá traer sólo el producto con el id proporcionado
router.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await manager.getProductById(pid);
    res.send({ status: 'success', payload: product });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

// Deberá agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    await manager.addProduct(req.body);

    const products = await manager.getProducts();
    res.send({ status: 'success', products });

  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Deberá actualizar un producto existente con el id proporcionado.
router.put('/:pid', async (req, res) => {
  try {
    const id = req.params.pid;
    console.log('PUT ID', id)
    const updatedFields = req.body;

    const updatedProduct = await manager.updateProduct(id, updatedFields);

    res.send({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

// Deberá eliminar un producto existente con el id proporcionado.
router.delete('/:pid', async (req, res) => {
  try {
    const id = req.params.pid;
    const productToDelete = await manager.getProductById(id);
    await manager.deleteProduct(id);
    const products = await manager.getProducts();
    res.send({ status: 'success', payload: { productToDelete, products } });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
})

module.exports = router;