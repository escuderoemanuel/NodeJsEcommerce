const mongoose = require('mongoose')
const { PORT } = require('./config/environment.config');
const cors = require('cors');

const handlebars = require('express-handlebars');

// Solamente traemos Server de io
const { Server } = require('socket.io');

// Cookie Parser
const cookieParser = require('cookie-parser');

// Express
const express = require('express');
const serverMessage = `Server is running on port ${PORT}`;
const app = express();


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
const chatRouter = require('./routes/chat.router.js');
const sessionRouter = require('./routes/sessions.router.js');
const viewsRouter = require('./routes/views.router.js');
const { productsService } = require('./repositories/index.js');
const mockingProducts = require('./routes/mockingProducts.js');
const errorHandler = require('./middlewares/errorHandler.middleware.js');
const { getTestToken } = require('./controllers/testToken.controller.js');


// Public Folder
app.use(express.static(`${__dirname}/public`))

// Json & Body Params
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());



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
app.use('/api/mockingProducts', mockingProducts)
app.get('/api/testToken', getTestToken);
app.use('/', viewsRouter)

// Server
const server = app.listen(PORT, () => {
  console.log(serverMessage)
})

// Socket Setting
const io = new Server(server);

io.on('connection', async (socket) => {
  const sockerId = socket.id;
  console.log(`Socket Connected..`)

  //! Products Events
  socket.on('delete-product', async (data) => {
    await productsService.delete(data.productId);
    const products = await productsService.getAll();
    io.emit('update-products', products)
  })

  socket.on('add-product', async (data) => {
    const products = await productsService.getAll();
    io.emit('update-products', products)
  })

  //! Messages Events
  // Recive Event: user authenticated
  socket.on('authenticated', ({ userName }) => {
    // Send Event with the messages in the array: for this client-socket!
    socket.emit('messages', { messages });
    // Send Event: for all users except the one connecting!
    socket.broadcast.emit('newUserConnected', { userName });
  })

  //! Guarda en ATLAS
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
    console.log(`Socket Disconnected...`)
  })
})


app.use(errorHandler)