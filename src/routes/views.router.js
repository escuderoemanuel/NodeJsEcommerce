const { Router } = require('express');
const { publicAuthentication, privateAuthentication } = require('../middlewares/middlewares');
const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');
const ViewsController = require('../controllers/views.controller');

const productsManager = new ProductsDbManager();

const viewsRouter = Router();

// Routes
viewsRouter.get('/home', ViewsController.getHome)

viewsRouter.get('/realtimeproducts', privateAuthentication, ViewsController.getRealTimeProducts)

viewsRouter.get('/register', publicAuthentication, ViewsController.getRegister)

viewsRouter.get('/login', publicAuthentication, ViewsController.getLogin)

viewsRouter.get('/resetPassword', publicAuthentication, ViewsController.getResetPassword);

viewsRouter.get('/profile', privateAuthentication, ViewsController.getProfile)

viewsRouter.get('/*', publicAuthentication, ViewsController.getPublicRoute)

module.exports = viewsRouter;