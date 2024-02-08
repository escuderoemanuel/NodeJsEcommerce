const { Router } = require('express');
const ProductManager = require('../ProductManager');

const router = Router();
const manager = new ProductManager(`${__dirname}/../files/products.json`);

// Home Route
router.get('/', async (req, res) => {
  const products = await manager.getProducts()
  res.render('home', { products });
})

module.exports = router;