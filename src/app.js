// Atlas DB Connection
require('dotenv').config();
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;

// Mongoose Init & Connect
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@mongodbcluster.piysuzj.mongodb.net/ecommerce`)
  .then(() => {
    console.log('DB Connected Succesfully')
  })

// Solamente traemos Server de io
const { Server } = require('socket.io');

// Handlebars
const handlebars = require('express-handlebars');

// Express
const express = require('express');
const port = 8080;
const serverMessage = `Server is running on port ${port}`;
const app = express();

// Import Routes
const cartsRouter = require('./routes/carts.router.js');
const productsRouter = require('./routes/products.router.js');
const realtimeproducts = require('./routes/realtimeproducts.router.js');
const homeRouter = require('./routes/home.router.js');
const chatRouter = require('./routes/chat.router.js');
const MessagesModel = require('./dao/models/messages.model.js');

// Public Folder
app.use(express.static(`${__dirname}/public`))

// Json & Body Params
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Routes
app.use('/api/carts', cartsRouter) // Ok!
app.use('/api/products', productsRouter) // Ok!
app.use('/api/chat', chatRouter) // Ok!
app.use('/api/realtimeproducts', realtimeproducts) // Ok!
app.use('/', homeRouter) // Ok!

// Server
const server = app.listen(port, () => {
  console.log(serverMessage)
})

// Socket Setting
const io = new Server(server);

io.on('connection', async (socket) => {

  console.log('Connected User Socket...')

  //! Products Events
  socket.on('delete-product', (data) => {
    const products = data.products.paginateData.payload;
    io.emit('update-products', products, data)
  })

  socket.on('add-product', (data) => {
    const products = data.products.paginateData.payload;
    io.emit('update-products', products)
  })

  //! Messages Events
  // Recive Event: user authenticated
  socket.on('authenticated', ({ user }) => {
    // Send Event with the messages in the array: for this client-socket!
    socket.emit('messages', { messages });
    // Send Event: for all users except the one connecting!
    socket.broadcast.emit('newUserConnected', { user });
  })

  //!Esto Funciona pero no guarda en Atlas
  const messages = await MessagesModel.find().lean();
  socket.emit('messages', { messages });

  socket.on('userMessage', async (messageData) => {
    const data = messageData;

    await MessagesModel.create(messageData);
    const messages = await MessagesModel.find().lean();

    io.emit('messages', { messages });
  })

  //! Connection Finished
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected...`)
  })
})