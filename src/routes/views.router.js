const { Router } = require('express');
const ViewsController = require('../controllers/views.controller');
const { verifyToken } = require('../middlewares/verifyToken.middleware');
const getRole = require('../middlewares/getRole.middleware');
const viewsRouter = Router();

// Routes
viewsRouter.get('/home', verifyToken, ViewsController.getHome)
viewsRouter.get('/realtimeproducts', verifyToken, getRole(['admin', 'premium']), ViewsController.getRealTimeProducts)
viewsRouter.get('/register', ViewsController.getRegister)
viewsRouter.get('/login', ViewsController.getLogin)
viewsRouter.get('/resetPassword', ViewsController.getResetPassword);
viewsRouter.get('/changePassword', ViewsController.getChangePassword);
viewsRouter.get('/profile', verifyToken, ViewsController.getProfile)
viewsRouter.get('/current', verifyToken, ViewsController.getCurrent);
viewsRouter.get('/chat', verifyToken, getRole(['user', 'premium']), ViewsController.getChat);
viewsRouter.get('/*', ViewsController.getPublicRoute)

module.exports = viewsRouter;