const { Router } = require('express');
const userModel = require('../dao/models/user.model');


const sessionRouter = Router();

// Endpoints
sessionRouter.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, repeatPassword, age, role } = req.body;

    if (!firstName || !lastName || !email || !password || !repeatPassword || !age) {
      return res.status(400).send({ status: 'error', error: 'Incomplete data' });
    }

    if (password.length < 8) {
      return res.status(400).send({ status: 'error', error: 'Password must be at least 8 characters' });
    }

    if (password !== repeatPassword) {
      return res.status(400).send({ status: 'error', error: 'Passwords do not match' });
    }

    const result = await userModel.create({ firstName, lastName, email, password, age, role });

    res.send({ status: 'success', message: 'User registered' });
  } catch (error) {
    res.status(400).send({ error: error.message });

  }
})

sessionRouter.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;

    // Si el correo electrónico y la contraseña coinciden con los valores especificados
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      const user = {
        email: 'adminCoder@coder.com',
        role: 'admin', // Asigna el rol de 'admin' si coincide
      }
      req.session.user = user; // Guarda los datos del usuario en la sesión.

    } else {

      if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'Incomplete data' });
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(401).send({ status: 'error', error: 'User not found' });
      }

      if (user.password !== password) {
        return res.status(401).send({ status: 'error', error: 'Invalid password' });
      }

      req.session.user = {
        name: `${user.firstName} ${user.lastName}`,
        age: user.age,
        email: user.email,
        role: user.role,
      };
    }

    // Regreso req.session.user porque no contiene datos sensibles
    res.send({ status: 'success', payload: req.session.user, message: 'Successfully logged in' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
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

module.exports = sessionRouter;