const { Router } = require('express');

const Products = require('../dao/dbManager/ProductsDbManager')
const manager = new Products();
const router = Router();


// Ruta para la página de inicio
router.get('/', async (req, res) => {
  const products = await manager.getProducts();
  // Renderiza la vista home.handlebars y pasa los datos de los productos
  res.render('home', { products });
});

// Ruta para el chat
router.get('/chat', (req, res) => {
  res.render('chat', {});
})

module.exports = router;
