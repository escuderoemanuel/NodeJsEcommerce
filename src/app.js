// Atlas DB Connection
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

// Mongoose Init & Connect
const mongoose = require('mongoose');
mongoose.connect(`${MONGO_URL}`)
  .then(() => {
    console.log('DB Connected Succesfully')
  })
const MongoStore = require('connect-mongo');

// Solamente traemos Server de io
const { Server } = require('socket.io');

// Handlebars
const handlebars = require('express-handlebars');

//
const cookieParser = require('cookie-parser');

// Express
const express = require('express');
const PORT = 8080;
const serverMessage = `Server is running on port ${PORT}`;
const app = express();


// Session Settings
const session = require('express-session');

// Imports
const passport = require('passport');
const initializePassport = require('./config/passport.config.js');

// Passport
initializePassport();
app.use(passport.initialize());

// Router
const MessagesModel = require('./dao/models/messages.model.js');
const cartsRouter = require('./routes/carts.router.js');
const productsRouter = require('./routes/products.router.js');
const realtimeproducts = require('./routes/realtimeproducts.router.js');
const chatRouter = require('./routes/chat.router.js');
const sessionRouter = require('./routes/sessions.router.js');
const viewsRouter = require('./routes/views.router.js');

// Public Folder
app.use(express.static(`${__dirname}/public`))

// Json & Body Params
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Handlebars
app.use(cookieParser());
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Routes
app.use('/api/sessions', sessionRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/realtimeproducts', realtimeproducts)
app.use('/', viewsRouter)

// Server
const server = app.listen(PORT, () => {
  console.log(serverMessage)
})

// Socket Setting
const io = new Server(server);

io.on('connection', async (socket) => {

  console.log('Connected User Socket...')

  //! Products Events
  socket.on('delete-product', (data) => {
    const products = data.products.paginateData.payload;
    io.emit('update-products', products)
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
    console.log('messages', messages)
    console.log('messages', { messages })

    io.emit('messages', { messages });
  })

  //! Connection Finished
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected...`)
  })
})


