const { Router } = require('express');
const CartsController = require('../controllers/carts.controller');
const { verifyToken } = require('../middlewares/verifyToken.middleware');
const getRole = require('../middlewares/getRole.middleware');

const router = Router();

router.get('/', verifyToken, CartsController.getAll)
router.post('/', verifyToken, CartsController.create)
router.get('/:cid', verifyToken, CartsController.getById)
router.delete('/:cid', verifyToken, CartsController.emptyCartById)
router.get('/:cid/purchase', verifyToken, CartsController.purchase)
router.post('/:cid/product/:pid', verifyToken, getRole(['user', 'premium']), CartsController.addProductToCart)
router.delete('/:cid/product/:pid', CartsController.deleteProductById)
// Update the product quantity by the quantity passed from req.body
router.put('/:cid/product/:pid', verifyToken, CartsController.updateProductQuantityById)

module.exports = router;