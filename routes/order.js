const express = require('express');
const {
  addOrder,
  getOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  getAllOrdersForAdmin,
  getTotalSales,
  getAllOrdersCount,
} = require('../controllers/order');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/add-order', protect, addOrder);
router.get('/orders', protect, getOrders);
router.get('/orders-admin', protect, authorize('admin'), getAllOrdersForAdmin);
router.get('/orders/:OrderId', protect, getSingleOrder);
router.get('/total-sales', protect, authorize('admin'), getTotalSales);
router.get('/orders-count', protect, authorize('admin'), getAllOrdersCount);
router.put('/update-Order/:OrderId', protect, authorize('admin'), updateOrder);
router.delete('/delete-Order/:OrderId', protect, deleteOrder);

module.exports = router;
