const { PORT } = require('./config/environment.config');
const cors = require('cors');

const swaggerUiExpress = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const handlebars = require('express-handlebars');

// Solamente traemos Server de io
const { Server } = require('socket.io');

// Cookie Parser
const cookieParser = require('cookie-parser');

// Router
const MessagesModel = require('./dao/models/messages.model.js');
const cartsRouter = require('./routes/carts.router.js');
const productsRouter = require('./routes/products.router.js');
const chatRouter = require('./routes/chat.router.js');
const sessionRouter = require('./routes/sessions.router.js');
const viewsRouter = require('./routes/views.router.js');
const { productsService } = require('./repositories/index.js');
const mockingProducts = require('./routes/mockingProducts.js');
const { loggerTestRouter } = require('./routes/logger.router');
const errorHandler = require('./middlewares/errorHandler.middleware.js');
const { getTestToken } = require('./controllers/testToken.controller.js');
const getLogger = require('./middlewares/getLogger.middleware');

// Express
const express = require('express');
const serverMessage = `Server is running on port ${PORT}`;
const app = express();
app.use(getLogger)

// Imports
const passport = require('passport');
const initializePassport = require('./config/passport.config.js');
const usersRouter = require('./routes/users.router');

// Passport
initializePassport();
app.use(passport.initialize());

// Public Folder
app.use(express.static(`${__dirname}/public`))

// SWAGGER
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'NodeJsEcommerce',
      version: '1.1.2',
      description: 'NodeJsEcommerce API',
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJsDoc(swaggerOptions);


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
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use('/api/sessions', sessionRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/mockingProducts', mockingProducts)
app.use('/api/users', usersRouter)
app.get('/api/testToken', getTestToken);
app.use('/api/loggerTest', loggerTestRouter)
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

  //? Products Events
  socket.on('delete-product', async (data) => {
    await productsService.delete(data.productId);
    const products = await productsService.getAll();
    io.emit('update-products', products)
  })

  socket.on('add-product', async (data) => {
    const products = await productsService.getAll();
    io.emit('update-products', products)
  })

  //? Messages Events
  // Recive Event: user authenticated
  socket.on('authenticated', ({ userName }) => {
    // Send Event with the messages in the array: for this client-socket!
    socket.emit('messages', { messages });
    // Send Event: for all users except the one connecting!
    socket.broadcast.emit('newUserConnected', { userName });
  })

  //? Guarda en ATLAS
  const messages = await MessagesModel.find().lean();
  socket.emit('messages', { messages });

  socket.on('userMessage', async (messageData) => {
    const data = messageData;

    await MessagesModel.create(messageData);
    const messages = await MessagesModel.find().lean();

    io.emit('messages', { messages });
  })

  //? Connection Finished
  socket.on('disconnect', () => {
    console.log(`Socket Disconnected...`)
  })
})


app.use(errorHandler)