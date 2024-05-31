const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts' //Id con referencia a Carts
  },
  role: {
    type: String,
    default: 'user'
  },
})

const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;

