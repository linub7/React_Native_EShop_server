const express = require('express');
const {
  addCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/add-category', protect, authorize('admin'), addCategory);
router.get('/categories', getCategories);
router.get('/categories/:categoryId', getSingleCategory);
router.put(
  '/update-category/:categoryId',
  protect,
  authorize('admin'),
  updateCategory
);
router.delete(
  '/delete-category/:categoryId',
  protect,
  authorize('admin'),
  deleteCategory
);

module.exports = router;
