const { Router } = require('express');
const { verifyToken } = require('../utils');
const ProductsController = require('../controllers/products.controller');
const { publicAuthentication, privateAuthentication } = require('../middlewares/middlewares');

// Manager
const router = Router();
//const productsController = new ProductsController();

// Deberá traer todos los productos de la base de datos, incluyendo opcionalmente limit, page, sort, filter (Example: http://localhost:8080/api/products?limit=2&page=1&sort=desc&filter=iphone)

router.get('/', verifyToken, ProductsController.getAll)
//router.get('/', ProductsController.getAll)

// Deberá traer sólo el producto con el id proporcionado
router.get('/:pid', ProductsController.getById)

// Deberá agregar un nuevo producto
router.post('/', ProductsController.create);

// Deberá actualizar un producto existente con el id proporcionado.
router.put('/:pid', ProductsController.update)

// Deberá eliminar un producto existente con el id proporcionado.
router.delete('/:pid', ProductsController.delete)

module.exports = router;