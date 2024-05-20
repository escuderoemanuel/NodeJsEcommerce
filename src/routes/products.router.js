const { Router } = require('express');
const { verifyToken } = require('../middlewares/verifyToken.middleware');
const ProductsController = require('../controllers/products.controller');
const getRole = require('../middlewares/getRole.middleware');

const router = Router();

// Deberá traer todos los productos de la base de datos, incluyendo opcionalmente limit, page, sort, filter (Example: http://localhost:8080/api/products?limit=2&page=1&sort=desc&filter=iphone)
router.get('/', verifyToken, ProductsController.getAll)

// Deberá traer sólo el producto con el id proporcionado
router.get('/:pid', verifyToken, ProductsController.getById)

// Deberá agregar un nuevo producto
router.post('/', verifyToken, getRole(['admin', 'premium']), ProductsController.create);

// Deberá actualizar un producto existente con el id proporcionado.
router.put('/:pid', verifyToken, getRole(['admin', 'premium']), ProductsController.update)

// Deberá eliminar un producto existente con el id proporcionado.
router.delete('/:pid', verifyToken, getRole(['admin', 'premium']), ProductsController.delete)

module.exports = router;