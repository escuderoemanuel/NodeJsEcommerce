const express = require('express');
const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');

// Manager
const manager = new ProductsDbManager();

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await manager.getProducts()
    res.render('realTimeProducts', {
      products,
      layout: 'main'
    })
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

