const UserModel = require('../dao/models/user.model');
const { createHash, isValidPassword } = require('../utils');
const jwt = require('jsonwebtoken');
const { JWT_PRIVATE_KEY } = require('../config/environment.config');

const MailingsService = require('../services/mailings.service');
const mailingsService = new MailingsService();

class SessionsController {
  //? REGISTER
  static async registerUser(req, res) {

    await mailingsService.sendRegisterEmail(req.user.email);
    res.send({ status: 'success', message: 'Successfully registered user.' });
  }

  static async getRegisterError(req, res) {
    res.status(401).send({ status: 'error', error: 'Registration failed.' });
  }

  //? LOGIN
  static async loginUser(req, res) {
    try {
      const { _id, firstName, lastName, email, age, role, password, cart } = req.user;

      const serializableUser = {
        id: _id,
        firstName,
        lastName,
        email,
        age,
        role,
        password,
        cart
      }

      const accessToken = jwt.sign(serializableUser, JWT_PRIVATE_KEY, { expiresIn: '1d' });
      res.cookie('accessToken', accessToken, serializableUser);
      res.send({ status: 'success', message: 'User logged successfuly' })
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  }
  static async getLoginError(req, res) {
    res.status(401).send({ status: 'error', error: 'Login failed' });
  }

  //? LOGOUT
  static async logout(req, res) {
    // Remove storageUserEmail from localStorage
    //localStorage.removeItem('storageUserEmail');
    res.clearCookie('accessToken');
    res.redirect('/login');
  }

  //? RESET PASSWORD
  static async resetPassword(req, res) {
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
  }

  //? GITHUB ACCOUNT
  static async githubLogin(req, res) {
  }

  static async githubCallback(req, res) {
    try {
      const { _id, firstName, lastName, email, age, role, password, cart } = req.user;

      const serializableUser = {
        id: _id,
        firstName,
        lastName,
        email,
        age,
        role,
        password,
        cart
      }
      const accessToken = jwt.sign(serializableUser, JWT_PRIVATE_KEY, { expiresIn: '1d' });
      res.cookie('accessToken', accessToken, serializableUser);
      res.redirect('/api/products')
    } catch (error) {
      res.status(error.status || 500).send({ status: 'error', message: error.message })
    }
  }
}

module.exports = SessionsController;