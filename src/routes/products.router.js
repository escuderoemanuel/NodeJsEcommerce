const { Router } = require('express');
const { verifyToken } = require('../utils');
const ProductsController = require('../controllers/products.controller');

const router = Router();

// Deberá traer todos los productos de la base de datos, incluyendo opcionalmente limit, page, sort, filter (Example: http://localhost:8080/api/products?limit=2&page=1&sort=desc&filter=iphone)

//! Debo mover lógica de aquí hacia el controller
router.get('/', verifyToken, async (req, res) => {
  try {
    let paginateData = await ProductsController.getAll(req, res);

    const userData = req.tokenUser.serializableUser;

    // Combinar los datos del usuario y los datos de paginación en un solo objeto porque handlebars no deja pasar más de 1
    const renderData = { ...paginateData, user: userData };

    res.render('products', renderData);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

// Deberá traer sólo el producto con el id proporcionado
router.get('/:pid', ProductsController.getById)

// Deberá agregar un nuevo producto
router.post('/', ProductsController.create);

// Deberá actualizar un producto existente con el id proporcionado.
router.put('/:pid', ProductsController.update)

// Deberá eliminar un producto existente con el id proporcionado.
router.delete('/:pid', ProductsController.delete)

module.exports = router;