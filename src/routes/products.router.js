const { Router } = require('express');
const ProductManager = require('../ProductManager');

// Manager
const manager = new ProductManager(`${__dirname}/../files/products.json`);

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
    res.status(500).send({ error: error.message });
  }
})

// Deberá traer sólo el producto con el id proporcionado
router.get('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const product = await manager.getProductById(pid);

    res.send({ status: 'success', payload: product });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

// Deberá agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { title, description, price, thumbnails, code, stock, status, category } = req.body;

    const newProduct = await manager.addProduct(title, description, price, thumbnails, code, stock, status, category);

    res.send({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Deberá actualizar un producto existente con el id proporcionado.
router.put('/:pid', async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
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
    const id = parseInt(req.params.pid);
    const productToDelete = await manager.getProductById(id);
    await manager.deleteProduct(id);

    res.send({ status: 'success', payload: productToDelete });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

module.exports = router;