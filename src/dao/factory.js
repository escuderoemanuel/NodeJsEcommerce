const mongoose = require('mongoose');
const { MONGO_URL, PERSISTENCE } = require('../config/environment.config');

let ProductsDao;
let UsersDao;
let TicketsDao;
let CartsDao;

switch (PERSISTENCE) {
  case 'MONGO':
    mongoose.connect(MONGO_URL).then(() => {
      console.log(`Connected to ${PERSISTENCE}`)
    })
    ProductsDao = require('./daoManagers/products.dao')
    UsersDao = require('./daoManagers/users.dao')
    TicketsDao = require('./daoManagers/tickets.dao')
    CartsDao = require('./daoManagers/carts.dao')
    break;

  case 'MEMORY':
    console.log(`Connected to ${PERSISTENCE}`)
    ProductsDao = require('../dao/memory/products.memory')
    UsersDao = require('../dao/memory/users.memory')
    TicketsDao = require('../dao/memory/tickets.memory')
    CartsDao = require('../dao/memory/carts.memory')
    break;

  default:
    throw new Error('Invalid persistence type');
};

module.exports = {
  CartsDao,
  ProductsDao,
  UsersDao,
  TicketsDao
};