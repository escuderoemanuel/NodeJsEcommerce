const { Router } = require('express');
const { publicAuthentication, privateAuthentication } = require('../middlewares/middlewares');



const viewsRouter = Router();


// Routes
viewsRouter.get('/register', publicAuthentication, (req, res) => {
  res.render('register', {});
})

viewsRouter.get('/login', publicAuthentication, (req, res) => {
  res.render('login', {});
})

viewsRouter.get('/resetPassword', publicAuthentication, (req, res) => {
  res.render('resetPassword', {});
})

viewsRouter.get('/home', (req, res) => {
  res.render('home', {});
})

viewsRouter.get('/*', publicAuthentication, (req, res) => {
  res.redirect('/login');
})



module.exports = viewsRouter;