const mongoose = require('mongoose')

const TicketsSchema = new mongoose.Schema({
  code: { type: String, required: true },
  purchase_datetime: {
    type: String,
    required: true,
    default: new Date().toLocaleString()
  },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true }
});

const TicketsModel = mongoose.model('tickets', TicketsSchema);

module.exports = TicketsModel;