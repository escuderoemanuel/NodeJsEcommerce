// Import just server from io
const { Server } = require('socket.io');

// Express Params
const express = require('express');
const port = 8080;
const serverMessage = `Server is running on port ${port}`;
const app = express();


// Import Routes
const cartsRouter = require('./routes/carts.router.js');
const productsRouter = require('./routes/products.router.js');
const realTimeProducts = require('./routes/realtimeproducts.router.js');
const homeRouter = require('./routes/home.router.js');

// Public Folder
app.use(express.static(`${__dirname}/public`));

// Json & Body Params
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Json & Body Params
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Handlebars
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Routes
app.use('/', homeRouter)
app.use('/api/realtimeproducts', realTimeProducts)
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

// Server
const server = app.listen(port, () => {
  console.log(serverMessage)
})

// Socket Setting
const io = new Server(server);

io.on('connection', (socket) => {

  // Initial log
  console.log('User connected...');

  // Listen for the 'delete-product' event
  socket.on('delete-product', (data) => {
    const product = data.products;
    // Send the products to update
    io.emit('update-products', product);
  })

  // Listen for the 'add-product' event
  socket.on('add-product', (data) => {
    const products = data.products;
    // Send the products to update
    io.emit('update-products', products);
  })

  // Listen for the desconection event
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected...`);
  })

})