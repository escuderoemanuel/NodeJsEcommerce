const { Router } = require('express');
const { verifyToken } = require('../middlewares/verifyToken.middleware');
const ProductsController = require('../controllers/products.controller');
const getRole = require('../middlewares/getRole.middleware');


const router = Router();

router.get('/mockingProducts', verifyToken, getRole(['admin']), ProductsController.mockingProducts)
router.get('/', verifyToken, ProductsController.getAll)
router.post('/', verifyToken, getRole(['admin', 'premium']), ProductsController.create);
router.get('/:pid', verifyToken, ProductsController.getById)
router.put('/:pid', verifyToken, getRole(['admin', 'premium']), ProductsController.update)
router.delete('/:pid', verifyToken, getRole(['admin', 'premium']), ProductsController.delete)


module.exports = router;