// Import Routes
const cartsRouter = require('./routes/carts.router.js');
const productsRouter = require('./routes/products.router.js');

// Express Params
const express = require('express');
const port = 8080;
const serverMessage = `Server is running on port ${port}`;
const app = express();


// Json & Body Params
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

// Server
app.listen(port, () => {
  console.log(serverMessage)
})