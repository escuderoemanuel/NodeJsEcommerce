const { Router } = require('express');
const UserModel = require('../dao/models/user.model');
const { createHash, isValidPassword } = require('../utils');
const passport = require('passport');
const { generateToken, verifyToken } = require('../utils');
const sessionRouter = Router();
const SessionsController = require('../controllers/sessions.controller')

//? Register
sessionRouter.post('/register',
  passport.authenticate('register', {
    failureRedirect: '/api/sessions/registrationFailed',
    session: false
  }), SessionsController.registerUser);

sessionRouter.get('/registrationFailed', SessionsController.getRegisterError);

//? Login
sessionRouter.post('/login',
  passport.authenticate('login', {
    failureRedirect: '/api/sessions/loginFailed',
    session: false
  }), SessionsController.loginUser)

sessionRouter.get('/loginFailed', SessionsController.getLoginError);

//? Logout
sessionRouter.get('/logout', SessionsController.logout);

//? Reset Password
sessionRouter.post('/resetPassword', SessionsController.resetPassword);

//? GITHUB
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }), SessionsController.githubLogin)

sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login', session: false }), SessionsController.githubCallback);

//? CURRENT
sessionRouter.get('/current', verifyToken, SessionsController.currentSession)

module.exports = sessionRouter;
