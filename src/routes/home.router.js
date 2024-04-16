const { Router } = require('express');

const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');
const { privateAuthentication } = require('../middlewares/middlewares');
const HomeViewController = require('../controllers/home.controller');


// Manager
const manager = new ProductsDbManager();
const router = Router();

// Ruta para la página de inicio
router.get('/', privateAuthentication, HomeViewController.getHome);

// Ruta para el chat
router.get('/chat', privateAuthentication, HomeViewController.getChat)

module.exports = router;
