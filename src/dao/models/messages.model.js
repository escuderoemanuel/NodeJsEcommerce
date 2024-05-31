const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  message: {
    type: String,
  },
  date: {
    type: String,
  }
})

// collection 'messages' + schema
const MessagesModel = mongoose.model('messages', messagesSchema);
module.exports = MessagesModel;