const { Router } = require('express');
const UserModel = require('../dao/models/user.model');
const { createHash, isValidPassword } = require('../utils');
const passport = require('passport');


const sessionRouter = Router();

//? LOCAL

sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/registrationFailed' }), async (req, res) => {
  res.send({ status: 'success', message: 'Successfully registered user.' });
});

sessionRouter.get('/registrationFailed', (req, res) => {
  res.status(401).send({ status: 'error', error: 'Registration failed.' });
})

sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/loginFailed' }), async (req, res) => {

  const user = req.user;
  req.session.user = {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    age: user.age,
    role: user.role
  }

  res.send({ status: 'success', payload: req.session.user, message: 'Successfully logged in' })
})

sessionRouter.get('/loginFailed', (req, res) => {

  res.status(401).send({ status: 'error', error: 'Login failed' });
})


sessionRouter.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send({ error: 'Error logging out' });
    } else {
      res.redirect('/login'); // Redirige a la página de login después de cerrar sesión.
    }
  })
})

sessionRouter.post('/resetPassword', async (req, res) => {
  const { email, password, passwordConfirm } = req.body;

  try {

    if (!email || !password || !passwordConfirm) {
      return res.status(400).send({ error: 'Missing data' });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Aquí podría enviar un correo electrónico para resetear la contraseña

    const hashedPassword = createHash(password);

    const result = await UserModel.updateOne(
      { _id: user._id }, {
      $set: { password: hashedPassword }
    });

    res.send({ status: 'success', message: 'Password reset', details: result });

  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
})

//? GITHUB
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {

  req.session.user = {
    name: `${req.user.firstName} ${req.user.lastName}`,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role
  };
  res.redirect('/products')
});


module.exports = sessionRouter;
