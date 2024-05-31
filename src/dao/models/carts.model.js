const mongoose = require('mongoose');

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        quantity: Number
      }
    ],
    default: []
  }
})

// Populate
cartsSchema.pre('findOne', function (next) {
  this.populate('products.product');
  next();
})
cartsSchema.pre('find', function (next) {
  this.populate('products.product');
  next();
})

// collection 'carts' + schema
const CartsModel = mongoose.model('carts', cartsSchema);
module.exports = CartsModel;