const express = require('express');
const {
  getUsers,
  getSingleUser,
  getUsersCount,
} = require('../controllers/user');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/users', protect, authorize('admin'), getUsers);
router.get('/users/:userId', protect, authorize('admin'), getSingleUser);
router.get('/users-count', protect, authorize('admin'), getUsersCount);

module.exports = router;
