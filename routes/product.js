const express = require('express');
const {
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductsCount,
  getProductsFeatured,
  getSpecificCategoriesProducts,
  updateProductImages,
} = require('../controllers/product');
const { uploadImage } = require('../middleware/multer');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post(
  '/add-product',
  protect,
  authorize('admin'),
  uploadImage.single('image'),
  addProduct
);
router.get('/products', protect, getProducts);
router.get('/products/:productId', protect, getSingleProduct);
router.get(
  '/products-category?categories',
  protect,
  getSpecificCategoriesProducts
);
router.get('/products-count', protect, getProductsCount);
router.get('/products-featured', protect, getProductsFeatured);
router.put(
  '/update-product/:productId',
  protect,
  authorize('admin'),
  updateProduct
);
router.put(
  '/update-product-gallery-images/:productId',
  protect,
  authorize('admin'),
  uploadImage.array('images', 10),
  updateProductImages
);
router.delete(
  '/delete-product/:productId',
  protect,
  authorize('admin'),
  deleteProduct
);

module.exports = router;
