const UserDTO = require('../dao/DTOs/UserDTO');
const { productsService, usersService } = require('../repositories');

class ViewsController {

  static async getHome(req, res) {
    res.redirect('/products');
  }

  static async getProducts(req, res) {
    try {
      const user = await usersService.getById(req.user.id);
      const userDTO = new UserDTO(user);
      const products = await productsService.getAll();
      res.render('products', { user: userDTO, products });
    } catch (error) {
      res.status(error.status || 500).send({ status: 'error', message: error.message });
    }
  }

  static async getUsers(req, res) {
    try {
      const user = await usersService.getById(req.user.id);
      const userDTO = new UserDTO(user);
      const users = await usersService.getAll();
      res.render('users', { user: userDTO, users });
    } catch (error) {
      res.status(error.status || 500).send({ status: 'error', message: error.message });
    }
  }

  static async getRealTimeProducts(req, res) {
    try {
      const user = await usersService.getById(req.user.id);
      const userDTO = new UserDTO(user);
      const products = await productsService.getAll();
      res.render('realTimeProducts', { user: userDTO, products });
    } catch (error) {
      res.status(error.status || 500).send({ status: 'error', message: error.message });
    }
  }

  static async getLogin(req, res) {
    res.render('login', {});
  }

  static async getRegister(req, res) {
    res.render('register', {});
  }

  static async getResetPassword(req, res) {
    try {
      res.render('resetPassword', { user: {} });
    } catch (error) {
      res.status(error.status || 500).send({ status: 'error', error: error.message });
    }
  }

  static async getChangePassword(req, res) {
    try {
      res.render('changePassword', { user: {} });
    } catch (error) {
      res.status(error.status || 500).send({ status: 'error', error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await usersService.getById(req.user.id);
      const userDTO = new UserDTO(user);
      res.render('profile', { user: userDTO, currentPath: req.path });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  static async getPublicRoute(req, res) {
    res.redirect('/login');
  }

  static async getChat(req, res) {
    try {
      res.render('chat', { user: req.user });
    } catch (error) {
      res.status(error.status || 500).send({ status: 'error', error: error.message });
    }
  }

  static async getCurrent(req, res) {
    try {
      const user = req.user;
      const userDTO = new UserDTO(user);
      const acceptHeader = req.headers['accept'] || '';
      if (acceptHeader.includes('text/html')) {
        res.render('profile', { user: userDTO });
      } else {
        res.send({ payload: userDTO });
      }
    } catch (error) {
      res.status(error.status || 500).send({ status: 'error', message: error.message });
    }
  }
}

module.exports = ViewsController;
