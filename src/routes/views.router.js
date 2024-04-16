const { Router } = require('express');
const { publicAuthentication, privateAuthentication } = require('../middlewares/middlewares');
const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');

const productsManager = new ProductsDbManager();

const viewsRouter = Router();

// Routes
viewsRouter.get('/home', async (req, res) => {
  const products = await productsManager.getProducts();
  res.render('home', { products: products });
})

viewsRouter.get('/realtimeproducts', privateAuthentication, async (req, res) => {
  const products = await productsManager.getProducts();
  res.render('realTimeProducts', { products });
})

viewsRouter.get('/register', publicAuthentication, (req, res) => {
  res.render('register', {});
})

viewsRouter.get('/login', publicAuthentication, (req, res) => {
  res.render('login', {});
})

viewsRouter.get('/resetPassword', publicAuthentication, (req, res) => {
  res.render('resetPassword', {});
})

viewsRouter.get('/profile', privateAuthentication, (req, res) => {
  res.render('profile', { user: req.user });
})

viewsRouter.get('/*', publicAuthentication, (req, res) => {
  res.redirect('/login');
})

module.exports = viewsRouter;