const express = require('express');
const { privateAuthentication } = require('../middlewares/middlewares');
const RealTimeProductsController = require('../controllers/realTimeProducts.controller');
const router = express.Router();

router.get('/', privateAuthentication, RealTimeProductsController.getAll)

module.exports = router;