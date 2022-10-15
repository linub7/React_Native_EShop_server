const express = require('express');
const {
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/add-product', protect, authorize('admin'), addProduct);
router.get('/products', protect, getProducts);
router.get('/products/:productId', protect, getSingleProduct);
router.put(
  '/update-product/:productId',
  protect,
  authorize('admin'),
  updateProduct
);
router.delete(
  '/delete-product/:productId',
  protect,
  authorize('admin'),
  deleteProduct
);

module.exports = router;
