const { Router } = require('express');

const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');
const { publicAuthentication, privateAuthentication } = require('../middlewares/middlewares');


// Manager
const manager = new ProductsDbManager();
const router = Router();

// Ruta para la página de inicio
router.get('/', privateAuthentication, async (req, res) => {
  try {
    let result = await manager.getProducts(req, res);
    let paginateData = result.paginateData
    // Esto es para darle mejor formato al json en el navegador (personalmente prefiero la extensión de navegador 'JSON Viewer Pro')
    res.setHeader('Content-Type', 'application/json');
    // Devuelve el objeto paginateData
    res.send(JSON.stringify(paginateData, null, 2));
  } catch (error) {
    console.log('Error', error.message)
  }
});

// Ruta para el chat
router.get('/chat', (req, res) => {
  res.render('chat', {});
})

module.exports = router;
