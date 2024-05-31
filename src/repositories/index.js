const daoFactory = require('../dao/factory');

const { CartsDao, ProductsDao, UsersDao, TicketsDao } = require('../dao/factory');

const CartsService = require('../services/carts.service');
const ProductsService = require('../services/products.service');
const TicketsService = require('../services/tickets.service');
const UsersService = require('../services/users.service');

const productsService = new ProductsService(new ProductsDao());
const usersService = new UsersService(new UsersDao());
const ticketsService = new TicketsService(new TicketsDao());
const cartsService = new CartsService(new CartsDao(), productsService, ticketsService);

module.exports = {
  productsService,
  usersService,
  ticketsService,
  cartsService
};