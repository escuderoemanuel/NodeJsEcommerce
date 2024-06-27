const { createHash, isValidPassword } = require('../utils/utils');
const jwt = require('jsonwebtoken');
const { JWT_PRIVATE_KEY } = require('../config/environment.config');
const CustomErrors = require('../utils/errors/CustomErrors');

const { getUserRegisterErrorInfo } = require('../utils/errors/ErrorInfo');
const TypesOfErrors = require('../utils/errors/TypesOfErrors');
const { usersService } = require('../repositories');
const MailingsService = require('../services/mailings.service');
const mailingsService = new MailingsService();

class SessionsController {
  //? REGISTER
  static async registerUser(req, res) {
    try {
      const { firstName, lastName, age, email, password } = req.body;
      if (!firstName || !lastName || !age || !email || !password) {
        throw new CustomErrors({
          name: 'User creation error',
          cause: getUserRegisterErrorInfo({ firstName, lastName, age, email, password }),
          message: 'Error creating user',
          code: TypesOfErrors.AUTHENTICATION_ERROR
        });
      }


      await mailingsService.sendRegisterEmail(req.user.email);
      res.send({ status: 'success', message: 'Successfully registered user.', payload: req.user });
    } catch (error) {
      res.status(500).send({ error: 'Internal server error in register', details: error.message });
    }
  }

  static async getRegisterError(req, res) {
    res.status(401).send({ status: 'error', error: 'Register failed' });
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
      };

      const accessToken = jwt.sign(serializableUser, JWT_PRIVATE_KEY, { expiresIn: '1d' });
      res.cookie('accessToken', accessToken, { httpOnly: true });

      await usersService.setLastConnection(_id);

      res.send({ status: 'success', message: 'User logged successfully' });
    } catch (error) {
      console.error('Error in loginUser:', error);
      res.status(500).send({ error: 'Internal server error in login', details: error.message });
    }
  }

  static async getLoginError(req, res) {
    res.status(401).send({ status: 'error', error: 'Login failed' });
  }

  //? LOGOUT
  static async logout(req, res) {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        return res.status(401).send({ status: 'error', message: 'No token provided' });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, JWT_PRIVATE_KEY);
      } catch (err) {
        return res.status(401).send({ status: 'error', message: 'Failed to authenticate token' });
      }

      const uid = decoded.id;

      if (!uid) {
        return res.status(400).send({ status: 'error', message: 'User ID not found in token' });
      }

      res.clearCookie('accessToken');

      //! await usersService.setLastConnection(uid);

      const acceptHeader = req.headers['accept'] || '';
      if (acceptHeader.includes('text/html')) {
        res.render('login');
      } else {
        res.status(200).send({ status: 'success', message: 'Logout successful' });
      }
    } catch (error) {
      res.status(500).send({ error: 'Internal server error in logout', details: error.message });
    }
  }

  //? RESET PASSWORD
  static async resetPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await usersService.getByEmail(email);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      const passwordResetToken = jwt.sign({ email: user.email }, JWT_PRIVATE_KEY, { expiresIn: '1h' });
      await mailingsService.sendPasswordResetEmail(user, email, passwordResetToken);
      res.send({ status: 'success', message: 'Password reset email sent', closeWindow: true });
    } catch (error) {
      res.status(500).send({ error: 'Internal server error on reset password', details: error.message });
    }
  }

  //? VERIFY PASSWORD RESET TOKEN
  static async verifyPasswordResetToken(req, res) {
    const { passwordResetToken } = req.params;
    try {
      jwt.verify(passwordResetToken, JWT_PRIVATE_KEY);
      res.redirect(`/changePassword?token=${passwordResetToken}`);
    } catch (error) {
      res.redirect('/resetPassword');
    }
  }

  //? CHANGE PASSWORD
  static async changePassword(req, res) {
    try {
      const { email, password } = req.body;
      let user = await usersService.getByEmail(email);
      if (isValidPassword(user, password)) {
        return res.status(400).send({ status: 'error', error: 'The new password cannot be the same as the previous one' });
      }
      user.password = createHash(password);
      await usersService.update(user._id.toString(), { password: user.password });
      res.send({ status: 'success', message: 'Password changed' });
    } catch (error) {
      res.status(500).send({ error: 'Internal server error on change password', details: error.message });
    }
  }

  //? GITHUB ACCOUNT
  static async githubLogin(req, res) { }

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
      };
      const accessToken = jwt.sign(serializableUser, JWT_PRIVATE_KEY, { expiresIn: '1d' });
      res.cookie('accessToken', accessToken, { httpOnly: true });

      await usersService.setLastConnection(_id);

      res.redirect('/products');
    } catch (error) {
      res.status(error.status || 500).send({ status: 'error', message: error.message });
    }
  }
}

module.exports = SessionsController;
