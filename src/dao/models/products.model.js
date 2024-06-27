const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const productsSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnails: {
    type: [String],
    default: [],
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true
  },
  owner: {
    type: String,
  }
})

productsSchema.plugin(mongoosePaginate)
// collection 'products' + schema
const ProductsModel = mongoose.model('products', productsSchema);
module.exports = ProductsModel;