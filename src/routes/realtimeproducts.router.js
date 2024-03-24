const express = require('express');
const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');
const { publicAuthentication, privateAuthentication } = require('../middlewares/middlewares');


// Manager
const manager = new ProductsDbManager();
const router = express.Router();

router.get('/', privateAuthentication, async (req, res) => {
  try {
    let paginateData = await manager.getProducts(req, res);
    res.render('realtimeproducts',
      paginateData
    );
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})
module.exports = router;