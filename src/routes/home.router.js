const { Router } = require('express');

const router = Router();

// Home Route
router.get('/', (req, res) => {
  const products = require('../files/products.json');
  res.render('home', { products });
})

module.exports = router;