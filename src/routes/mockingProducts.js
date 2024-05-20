const { Router } = require('express');
const generateFakerProducts = require('../utils/generateFakerProducts.utils');

const router = Router();

router.get('/', (req, res) => {
  // localhost:8080/api/mockingProducts?quantity=10
  const quantity = req.query.quantity || 100;
  const products = []
  for (let i = 0; i < quantity; i++) {
    products.push(generateFakerProducts())
  }
  res.send({ status: 'success', payload: products })
})

module.exports = router;