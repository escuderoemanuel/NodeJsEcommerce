const { PORT } = require('./config/environment.config');
const cors = require('cors');
const swaggerUiExpress = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const MessagesModel = require('./dao/models/messages.model.js');
const cartsRouter = require('./routes/carts.router.js');
const productsRouter = require('./routes/products.router.js');
const chatRouter = require('./routes/chat.router.js');
const sessionRouter = require('./routes/sessions.router.js');
const viewsRouter = require('./routes/views.router.js');
const { productsService } = require('./repositories/index.js');
const { loggerTestRouter } = require('./routes/logger.router');
const errorHandler = require('./middlewares/errorHandler.middleware.js');
const { getTestToken } = require('./controllers/testToken.controller.js');
const getLogger = require('./middlewares/getLogger.middleware');
const express = require('express');
const passport = require('passport');
const initializePassport = require('./config/passport.config.js');
const usersRouter = require('./routes/users.router');
const path = require('path');

const serverMessage = `Server is running on port ${PORT}`;
const app = express();
app.use(getLogger);

// Passport
initializePassport();
app.use(passport.initialize());

// Public Folder
app.use(express.static(path.join(__dirname, 'public')));


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
  apis: [path.join(__dirname, 'docs/**/*.yaml')],
};
const specs = swaggerJsDoc(swaggerOptions);

// Json & Body Params
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Handlebars
app.use(cookieParser());
const hbs = handlebars.create({
  defaultLayout: 'main',
  extname: '.handlebars',
  helpers: {
    ifEq: function (arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    ifContains: function (str, substr, options) {
      return (str.indexOf(substr) !== -1) ? options.fn(this) : options.inverse(this);
    },
    unlessEq: function (arg1, arg2, options) {
      return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
    }
  }
});


app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middleware to set currentPath
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});


// Routes

app.use('/users', usersRouter);
app.use('/carts', cartsRouter);
app.use('/products', productsRouter);
app.use('/chat', chatRouter);

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use('/api/sessions', sessionRouter);
app.get('/api/testToken', getTestToken);
app.use('/api/loggerTest', loggerTestRouter);

app.use('/', viewsRouter);

// Socket Setting
const server = app.listen(PORT, () => {
  console.log(serverMessage);
});

const io = new Server(server);

io.on('connection', async (socket) => {
  const socketId = socket.id;
  console.log(`Socket Connected..`);

  // Products Events
  socket.on('delete-product', async (data) => {
    try {
      await productsService.delete(data.productId);
      const products = await productsService.getAll();
      io.emit('update-products', products);
    } catch (error) {
      console.error('Error deleting product:', error);
      socket.emit('error', { message: 'Error deleting product' });
    }
  });

  socket.on('add-product', async (data) => {
    try {
      const products = await productsService.getAll();
      io.emit('update-products', products);
    } catch (error) {
      console.error('Error adding product:', error);
      socket.emit('error', { message: 'Error adding product' });
    }
  });

  // Messages Events
  socket.on('authenticated', ({ userName }) => {
    socket.emit('messages', { messages });
    socket.broadcast.emit('newUserConnected', { userName });
  });

  const messages = await MessagesModel.find().lean();
  socket.emit('messages', { messages });

  socket.on('userMessage', async (messageData) => {
    await MessagesModel.create(messageData);
    const messages = await MessagesModel.find().lean();
    io.emit('messages', { messages });
  });

  socket.on('disconnect', () => {
    console.log(`Socket Disconnected...`);
  });
});

app.use(errorHandler);
